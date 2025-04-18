FROM python:3.13.3-alpine

WORKDIR /app

RUN python -m pip install --upgrade pip

COPY . .