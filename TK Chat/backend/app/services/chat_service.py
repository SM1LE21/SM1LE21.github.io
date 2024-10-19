# This file contains the main logic for interacting with the OpenAI API.
import json
from app.schemas.personal_data import PersonalData
from app.data.prompt import SYSTEM_PROMPT_TEMPLATE
from app.utils.logger import logger
from pydantic import ValidationError
from fastapi import HTTPException
import openai
from app.config import OPENAI_API_KEY, MODEL
from app.services.chat_function_definitions import function_definitions 

openai.api_key = OPENAI_API_KEY 

def load_personal_data() -> PersonalData:
    try:
        with open('app/data/personal_data.json') as f:
            data = json.load(f)
        logger.debug(f"Loaded personal_data.json content: {data}")
    except FileNotFoundError:
        logger.error("personal_data.json file not found at 'app/data/personal_data.json'")
        raise
    except json.JSONDecodeError as e:
        logger.error(f"JSON decode error: {e}")
        raise

    try:
        personal_data = PersonalData(**data)
        logger.debug("Personal data successfully validated and loaded.")
        return personal_data
    except ValidationError as e:
        logger.error(f"Pydantic Validation Error: {e}")
        raise e


def create_system_prompt() -> str:
    logger.debug("Creating system prompt.")
    try:
        personal_data: PersonalData = load_personal_data()
    except Exception as e:
        logger.error(f"Failed to load personal data: {e}")
        raise

    # Personal Information
    personal_info = (
        f"Name: {personal_data.name}\n"
        f"Title: {personal_data.title}\n"
        f"Description: {personal_data.description}\n"
    )

    # About Section
    about_section = "About:\n" + "\n".join([f"{i+1}. {para}" for i, para in enumerate(personal_data.about)]) + "\n"

    # Experience Section
    experience_section = "Experience:\n"
    for exp in personal_data.experience:
        experience_section += (
            f"- {exp.date}: **{exp.jobTitle}** at [{exp.company}]({exp.company_link})\n"
            f"  - {exp.description}\n"
            f"  - **Skills:** {', '.join(exp.skills)}\n"
        )
    experience_section += "\n"

    # Certificates Section
    certificates_section = "Certificates:\n"
    for cert in personal_data.certificates:
        certificates_section += (
            f"- {cert.date}: **{cert.jobTitle}** from [{cert.company}]({cert.title_link})\n"
            f"  - {cert.description}\n"
        )
    certificates_section += "\n"

    # Education Section
    education_section = "Education:\n"
    for edu in personal_data.education:
        education_section += (
            f"- **{edu.jobTitle}** from [{edu.company}]({edu.company_link})"
        )
        if edu.description:
            education_section += f" - {edu.description}"
        education_section += "\n"
    education_section += "\n"

    # Projects Section
    projects_section = "Projects:\n"
    for proj in personal_data.projects:
        projects_section += (
            f"- **{proj.title}**: {proj.description}\n"
            f"  - **Technologies:** {', '.join(proj.skills)}\n"
        )
        if proj.github_link:
            projects_section += f"  - **GitHub:** [{proj.github_link}]({proj.github_link})\n"
        if proj.link and proj.link_text:
            projects_section += f"  - **Live Link:** [{proj.link_text}]({proj.link})\n"
        projects_section += "\n"
    projects_section += "\n"

    # Compile all sections into the system prompt
    system_prompt = SYSTEM_PROMPT_TEMPLATE.format(
        name=personal_data.name,
        personal_info=personal_info,
        about=about_section,
        experience=experience_section,
        certificates=certificates_section,
        education=education_section,
        projects=projects_section
    )

    logger.debug("System prompt created.")

    return system_prompt



def get_ai_response(conversation: list) -> str:

    try:
        while True:
            logger.info(f"Sending request to OpenAI API using model '{MODEL}'.")
            response = openai.ChatCompletion.create(
                model=MODEL,
                messages=conversation,
                functions=function_definitions,
                function_call="auto"
            )
            message = response['choices'][0]['message']
            logger.info(f"OpenAI response received. Message: {message}")

            role = message.get('role')
            content = message.get('content', '')
            function_call = message.get('function_call')

            if function_call:
                # Handle the function call
                function_name = function_call['name']
                function_args_str = function_call.get('arguments', '{}')
                try:
                    function_args = json.loads(function_args_str)
                except json.JSONDecodeError as e:
                    logger.error(f"JSON decode error in function arguments: {e}")
                    raise HTTPException(status_code=400, detail="Invalid function arguments.")

                logger.info(f"Assistant is requesting function '{function_name}' with arguments {function_args}")

                # Save the assistant's function call message
                conversation.append({
                    "role": role,
                    "content": None,
                    "function_call": function_call
                })

                # Since we're handing over the function call to the frontend, we return here
                return message
            else:
                # Assistant has provided a content response
                logger.info(f"Assistant response: {content}")

                # Save the assistant's message
                conversation.append({
                    "role": role,
                    "content": content
                })

                # Optionally, check if the assistant wants to continue the conversation
                # For simplicity, we'll return the message here
                return message
    except openai.error.OpenAIError as e:
        logger.error(f"OpenAI API error: {e}")
        raise HTTPException(status_code=502, detail="Error communicating with AI service.")
    except Exception as e:
        logger.error(f"Unexpected error: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error.")