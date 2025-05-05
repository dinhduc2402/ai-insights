# Use an official Python runtime as a parent image
FROM python:3.11-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1 # Prevents python from writing pyc files
ENV PYTHONUNBUFFERED 1      # Prevents python from buffering stdout/stderr

# Set the working directory in the container
WORKDIR /code

# Install system dependencies if needed (e.g., for psycopg2)
# RUN apt-get update && apt-get install -y --no-install-recommends some-package && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt /code/
RUN pip install --no-cache-dir --upgrade pip && \
     pip install --no-cache-dir -r requirements.txt

# Copy the application code into the container
# We copy the 'app' directory specifically
COPY ./app /code/app

# Expose the port the app runs on
EXPOSE 8000

# Command to run the application using uvicorn
# Use --reload for development to automatically reload on code changes
# Use 0.0.0.0 as host to be accessible from outside the container
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload", "--reload-dir", "/code/app"]