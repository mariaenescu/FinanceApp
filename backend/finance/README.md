# Finance Management System

A Spring Boot application for managing personal finances, built with Kotlin and PostgreSQL.

## Prerequisites
- Java 17
- Docker & Docker Compose

## Quick Start Guide

### 1. Start the Database
The application requires a PostgreSQL database. You can start it using Docker Compose:
```bash
docker-compose up -d
```

### 2. Run the Application
Once the database is running, you can start the application

### 3. API Documentation
After the application starts, you can access the Swagger UI to explore and test the API at:
[http://localhost:8080/swagger-ui/index.html](http://localhost:8080/swagger-ui/index.html)

## Configuration
- **Server Port**: 8080
- **Database**: PostgreSQL (localhost:5432)
- **Security**: JWT-based authentication