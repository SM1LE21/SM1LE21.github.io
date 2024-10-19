# This file contains the main logic for the chat endpoint. 
# It handles the user's messages, calls the OpenAI API, and saves the conversation history in the database.
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app import models, schemas, utils
from app.utils import rate_limit
from app.utils.logger import logger
from app.services.chat_service import create_system_prompt, get_ai_response
from app.config import MODEL
import json

router = APIRouter(
    prefix="/chat",
    tags=["chat"]
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=schemas.ChatResponse)
def chat(message: schemas.Message, db: Session = Depends(get_db)):
    logger.debug(f"Using OpenAI model: {MODEL}")

    # Check if session is active
    if not utils.auth.is_session_active(message.session_id, db):
        logger.warning(f"Session {message.session_id}: Invalid or expired session.")
        raise HTTPException(status_code=401, detail="Session expired or invalid")

    # Rate limiting
    if rate_limit.is_rate_limited(message.session_id, db):
        logger.warning(f"Session {message.session_id}: Rate limit exceeded.")
        raise HTTPException(status_code=429, detail="Too many requests. Please try again in a minute.")

    # Save user message
    user_message = models.Message(
        session_id=message.session_id,
        role="user",
        content=message.content
    )
    db.add(user_message)
    db.commit()

    logger.info(f"Session {message.session_id}: User message received - '{message.content}'")

    # Retrieve conversation history
    messages = db.query(models.Message).filter(models.Message.session_id == message.session_id).order_by(models.Message.timestamp).all()
    logger.debug(f"Session {message.session_id}: Conversation history retrieved from database.")
    conversation = []
    for msg in messages:
        if msg.role == "assistant" and msg.function_call:
            # If the assistant's message is a function call, include it appropriately
            function_call = json.loads(msg.function_call)
            conversation.append({
                "role": "assistant",
                "content": None,
                "function_call": function_call
            })
        else:
            conversation.append({
                "role": msg.role,
                "content": msg.content
            })

    # Prepend system prompt for AI customization
    system_prompt = {"role": "system", "content": create_system_prompt()}
    conversation = [system_prompt] + conversation

    logger.debug(f"Session {message.session_id}: Conversation history prepared for OpenAI API.")

    # Call OpenAI API via service layer
    try:
        ai_response = get_ai_response(conversation)

        # Save assistant's message
        ai_message = models.Message(
            session_id=message.session_id,
            role="assistant",
            content=ai_response.get('content', None),
            function_call=json.dumps(ai_response.get('function_call')) if ai_response.get('function_call') else None
        )
        db.add(ai_message)
        db.commit()

        if ai_response.get('function_call'):
            # The assistant is requesting a function call
            function_call = ai_response['function_call']
            function_name = function_call['name']
            function_args_str = function_call.get('arguments', '{}')
            try:
                function_args = json.loads(function_args_str)
            except json.JSONDecodeError as e:
                logger.error(f"JSON decode error in function arguments: {e}")
                raise HTTPException(status_code=400, detail="Invalid function arguments.")

            logger.info(f"Session {message.session_id}: AI requested function '{function_name}' with arguments {function_args}")

            # Return the function call information to the frontend
            return schemas.ChatResponse(
                session_id=message.session_id,
                role="assistant",
                content=None,
                function_call=schemas.FunctionCall(
                    name=function_name,
                    arguments=function_args
                )
            )
        else:
            # Regular assistant message
            ai_content = ai_response.get("content", "").strip()

            logger.info(f"Session {message.session_id}: AI response - '{ai_content}'")

            return schemas.ChatResponse(
                session_id=message.session_id,
                role="assistant",
                content=ai_content,
                function_call=None
            )
    except Exception as e:
        logger.error(f"Session {message.session_id}: Error processing chat - {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
