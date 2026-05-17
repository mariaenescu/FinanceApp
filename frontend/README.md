Enescu Maria 341 C3

# FinanceApp Frontend 

## Tech Stack
- **Framework**: React & TypeScript
- **Build Tool**: Vite
- **Charts**: Chart.js

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
The application will start at `http://localhost:5173`.


## Backend Connection - In Milestone 1

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
