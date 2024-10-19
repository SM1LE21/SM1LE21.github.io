# Entry point for the TK Chat backend
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.routers import chat, session, feedback, config
import uvicorn
from app.database import engine, create_tables
from app import models
from fastapi.responses import JSONResponse

from app.utils.logger import logger


app = FastAPI()

@app.on_event("startup")
def on_startup():
    create_tables()

# Add CORS middleware
origins = [
    "http://localhost:3000",
    "https://sm1le21.github.io",
    "https://widgethoster.sytes.net",
    # Add other origins if needed
    # TODO change this to the frontend URL - probably sm1le.github.io at the beginning
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(chat.router)
app.include_router(session.router)
app.include_router(feedback.router)
app.include_router(config.router) 

@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail},
    )

@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    logger.error(f"Unexpected error: {exc}")
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal Server Error"},
    )

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
