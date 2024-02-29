FROM python:3.11-slim

WORKDIR /app
COPY . /app/
EXPOSE 8000

RUN pip install --no-cache-dir -r requirements.txt

CMD "uvicorn main:app --workers 2"