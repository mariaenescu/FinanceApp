# FinanceApp Backend

This is the backend service for the FinanceApp, built with Spring Boot, Kotlin, and PostgreSQL. It handles authentication, transaction processing, and user management.

## Start Guide

### 1. Start the Database
The application requires a PostgreSQL database. You can start it using Docker Compose:
```bash
docker-compose up -d
```
This will start a PostgreSQL instance on `localhost:5432` with the default username/password (`postgres`/`postgres`).

### 2. Run the Application
Once the database is running, you can start the application (run in IntelliJ)

### 3. API Documentation
Once the server is running, you can explore the API using the Interactive Swagger UI:
 
[http://localhost:8080/swagger-ui/index.html](http://localhost:8080/swagger-ui/index.html)

## Authentication
The API uses **JWT (JSON Web Token)** for authentication.
1.  Use the `/auth/login` endpoint to obtain a token.
2.  Include the token in the `Authorization: Bearer <token>` header for protected endpoints.

## Configuration
- **Server Port**: 8080
- **Database**: PostgreSQL (localhost:5432)
- **Security**: JWT-based authentication

## Project Structure
- `src/main/kotlin/...`:
  - `controllers`: REST Controllers (API Endpoints)
  - `services`: Business Logic
  - `models`: JPA Entities and DTOs
  - `repositories`: Spring Data JPA Repositories
  - `security`: Security configuration and JWT handling
- `src/main/resources`:
  - `application.properties`: Configuration (DB, JWT, etc.)
  - `db/migration`: Flyway database migrations
