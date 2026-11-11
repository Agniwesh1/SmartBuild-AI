# SmartBuild AI

SmartBuild AI is a construction project planning workspace built using React, Vite, Java, Spring Boot, Spring Data JPA, Spring Security/JWT, and MySQL.

## Included Modules

### Backend

- Authentication and user management
- Projects and houses
- Room management with staged confirmation
- Floor management
- Materials and inventory
- Contractors
- Budgets and expenses
- Construction tasks and progress
- Dashboard summary

### Frontend

- Login and account settings
- Dashboard
- Project and house management
- Room and floor management
- Construction task planning
- Materials inventory
- Contractor records
- Budgets and expenses
- Construction progress tracking
- Rule-based construction planning assistant
- Reports with CSV export

**Note:** The construction assistant currently uses rule-based logic and is not connected to a live AI service.

## Requirements

- JDK 25 or compatible newer JDK
- Node.js 22.12 or newer
- npm
- MySQL 8+
- IntelliJ IDEA Community Edition

## Database Setup

Create the database in MySQL:

```sql
CREATE DATABASE smartbuild_ai;
```

Configure the following environment variables in PowerShell before starting the backend. Run each command separately:

```powershell
$env:DB_URL="jdbc:mysql://localhost:3306/smartbuild_ai"
$env:DB_USERNAME="root"
$env:DB_PASSWORD="YOUR_MYSQL_PASSWORD"
$env:JWT_SECRET="YOUR_RANDOM_SECRET_AT_LEAST_32_CHARACTERS_LONG"
```

Replace the placeholder values with your own local credentials.

**Important:** Never commit actual database credentials or JWT secrets to GitHub.

The backend uses `spring.jpa.hibernate.ddl-auto=update` to create or update database tables. Back up your database before making schema changes.

## Run the Backend

Open a terminal in the project root directory:

```powershell
.\mvnw.cmd spring-boot:run
```

Backend URL:

[http://localhost:8080](http://localhost:8080)

## Run the Frontend

Open a second terminal:

```powershell
cd frontend
npm ci
npm run dev
```

Open the Vite URL displayed in the terminal, normally:

[http://localhost:5173](http://localhost:5173)

The Vite development proxy forwards `/api` requests to Spring Boot.

## Build and Test

### Backend

Run from the project root:

```powershell
.\mvnw.cmd clean test
```

### Frontend

Run from the frontend directory:

```powershell
npm run build
npm run lint
```

## Important Notes

- Protected API routes require JWT authentication.
- User registration (`POST /api/users`) and login (`POST /api/auth/login`) are public.
- Room confirmation uses `POST /api/rooms/confirm`.
- Confirmed room changes recalculate bedroom and bathroom counts.
- Room and floor changes do not automatically update the house's manually maintained total area or floor count.
- The AI assistant currently provides rule-based guidance, not live AI-generated responses.
- This project is a development codebase and is not certified for production deployment.

See `IMPLEMENTATION_NOTES.md` for implementation details and verification limitations.
