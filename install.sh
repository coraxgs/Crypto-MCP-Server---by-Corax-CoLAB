#!/bin/bash

# Setup script for Crypto MCP GUI (Docker based)

echo "==> Setting up Crypto MCP Server with Docker"

# Check if docker is installed
if ! command -v docker >/dev/null 2>&1; then
  echo "==> Docker not found. Please install Docker and Docker Compose."
  echo "Instructions: https://docs.docker.com/engine/install/"
else
  echo "==> Building and starting containers..."
  if docker compose version >/dev/null 2>&1; then
    docker compose up -d --build
  else
    docker-compose up -d --build
  if

  echo "==> Setup finished!"
  echo "Dashboard is available at http://localhost (or your server IP)"
  echo "Backend API is available at http://localhost:4000"
  echo "MCP Endpoints are exposed on ports 7001, 7004, 7010, etc."
if
