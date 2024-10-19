# **Backend Service of TK CHAT for Portfolio Website**

**Check out the [TK CHAT repository](https://github.com/SM1LE21/TK_CHAT/tree/main). The version in this project has been customized specifically for my portfolio website.**

This backend service provides API endpoints for the AI chat application using FastAPI and OpenAI's GPT-3.5-turbo model. It includes session management, rate limiting, logging, and a feedback mechanism.

## **Table of Contents**

- [Prerequisites](#prerequisites)
- [Setup Instructions](#setup-instructions)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Testing the Application](#testing-the-application)
- [Logging](#logging)
- [Notes](#notes)

### **Prerequisites**

- Python 3.8 or higher
- OpenAI API Key

### **Setup Instructions**

1. **Clone the Repository**

   ```bash
   git clone https://your-repository-url.git
    ```
2. **Navigate to the Backend Directory**

   ```bash
    cd backend
    ```
3. **Create a Virtual Environment**

   ```bash
   python3 -m venv venv
    ```

4. **Activate the Virtual Environment**
    ```bash
   source venv/bin/activate
    ```

5. **Upgrade pipe**
    ```bash
   pip install --upgrade pip
    ```

6. **Install Requirements**
    ```bash
   pip install -r requirements.txt
    ```

### **Environment Variables**
Create a .env file in the backend/ directory with the following content:
  ```bash
  OPENAI_API_KEY=your-openai-api-key
  SECRET_KEY=your-secret-key
  ```

### **Running the Application**
To run the FastAPI application locally:

  ```bash
  uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
  ```

- The application will be accessible at http://localhost:8000.
- The --reload flag enables hot-reloading during development.

### **Project Structure**
    
        backend/
        ├── app/
        │   ├── main.py
        │   ├── models.py
        │   ├── schemas.py
        │   ├── database.py
        │   ├── config.py
        │   ├── routers/
        │   │   ├── __init__.py
        │   │   ├── chat.py
        │   │   ├── session.py
        │   │   └── feedback.py
        │   └── utils/
        │       ├── __init__.py
        │       ├── auth.py
        │       ├── rate_limit.py
        │       └── logger.py
        ├── requirements.txt
        ├── Dockerfile
        ├── .env
        └── README.md

### **Project Structure**
- Session Management

    - POST /session/initialize_session: Initializes a new session and returns a session ID.
- Chat

    - POST /chat/: Sends a user message and receives an AI response.
- Feedback

    - POST /feedback/: Submits user feedback for a session.

### **Testing the Application**

You can test the API endpoints using tools like Postman, cURL, or the interactive API documentation provided by FastAPI at http://localhost:8000/docs.

Initialize a Session
- Endpoint: POST /session/initialize_session

- Response:
```json
{
  "session_id": "your-generated-session-id",
  "created_at": "2023-10-10T12:00:00",
  "last_active": "2023-10-10T12:00:00",
  "is_active": 1
}
```

Send a Chat Message
- Endpoint: POST /chat/

- Request Body:
```json
{
  "session_id": "your-session-id",
  "role": "user",
  "content": "Hello, how are you?"
}
```

- Response:
```json
{
  "session_id": "your-session-id",
  "role": "assistant",
  "content": "I'm doing well, thank you! How can I assist you today?"
}
```

Submit Feedback
- Endpoint: POST /feedback/

- Request Body:

```json
{
  "session_id": "your-session-id",
  "feedback": "The chat was very helpful."
}
```

- Response:
```json
{
  "detail": "Feedback received"
}

```


### **Logging**
- Logs are saved to app.log in the backend/ directory.
- Logging includes:
    - User messages and AI responses.
    - SQL statements when saving data to the database.
    - Errors and exceptions.

To monitor logs in real-time:

```bash
tail -f app.log

```

### **Notes**
- Session Expiration: Sessions expire after 30 minutes of inactivity.
- Data Retention: Session data is retained for 6 months.
- Rate Limiting: Users are limited to 5 messages per minute per session.
- Feedback Feature: Users can submit feedback, which is stored for review
