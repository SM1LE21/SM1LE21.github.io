# Optionally use docker to build and run the backend
# navigate to the backend directory
# run `docker build -t ai-chat-backend .` to build the image
# run `docker run -d -p 8000:8000 --name ai-chat-backend-container ai-chat-backend` to run the container

# visit http://localhost:8000/docs to view the API documentation and to test the API with FastAPI's Swagger UI

# To stop the container run `docker stop ai-chat-backend-container`
# To remove the container run `docker rm ai-chat-backend-container`



# Use an official Python runtime as a parent image
FROM python:3.9-slim

# Set the working directory in the container
WORKDIR /app

# Copy the requirements file into the container
COPY requirements.txt .

# Install the dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code
COPY . .

# Expose the port
EXPOSE 8000

# Set environment variables
ENV PYTHONUNBUFFERED=1

# Command to run the application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
