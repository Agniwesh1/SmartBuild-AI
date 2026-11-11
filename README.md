# SmartBuild AI

SmartBuild AI is a construction-project planning workspace built with React, Vite, Java, Spring Boot, Spring Data JPA, Spring Security/JWT and MySQL.

## Included modules

### Backend APIs
- Authentication and user management
- Projects and houses
- Rooms with staged confirmation (`POST /api/rooms/confirm`); confirmed room types recalculate bedroom/bathroom counts only
- Floors (`GET /api/floors/house/{houseId}`, `POST /api/floors`, `PUT /api/floors/{id}`, `DELETE /api/floors/{id}`)
- Materials and inventory
- Contractors
- Budgets and expenses
- Tasks and construction progress
- Dashboard summary

### Frontend
- Login and account settings
- Dashboard
- Project and house management
- Staged room management
- Floor CRUD panel within the selected house
- Construction task planning, materials inventory, contractor records, budgets and expenses
- Construction stage progress tracking
- Built-in rule-based construction planning assistant (not a live LLM connection)
- Workspace reports with CSV export

House total area and the manually entered house floor count are not recalculated by room or floor record changes. Bedroom/bathroom counts start at zero for newly created houses and are recalculated when room changes are confirmed.

## Requirements
- JDK matching the Maven compiler setting in `pom.xml` (currently Java 25)
- Node.js 22 or newer and npm
- MySQL 8+
- IntelliJ IDEA Community Edition

## Database setup
Create the database in MySQL:

```sql
CREATE DATABASE smartbuild_ai;
```

Set environment variables before starting the backend. Do not commit database credentials:

Windows PowerShell:

```powershell
$env:DB_URL="jdbc:mysql://localhost:3306/smartbuild_ai"
$env:DB_USERNAME="root"
$env:DB_PASSWORD="YOUR_MYSQL_PASSWORD"
$env:JWT_SECRET="GENERATE_A_RANDOM_SECRET_AT_LEAST_32_CHARACTERS_LONG"
```

The backend uses `spring.jpa.hibernate.ddl-auto=update` to create/update tables. Back up your database before schema changes.

## Run backend (from project root)

```powershell
.\mvnw.cmd spring-boot:run
```

Backend default URL: `http://localhost:8080`

## Run frontend (second terminal)

```powershell
cd frontend
npm ci
npm run dev
```

Open the Vite URL shown in the terminal (normally `http://localhost:5173`). The Vite development proxy forwards `/api` requests to the Spring Boot server; see `frontend/vite.config.js`.

## Build checks

Backend:

```powershell
.\mvnw.cmd clean test
```

Frontend:

```powershell
cd frontend
npm run build
npm run lint
```

See `IMPLEMENTATION_NOTES.md` for integration scope and verification limitations.

## Important configuration and integration notes
- JWT authentication is required for protected API routes. User registration (`POST /api/users`) and login (`POST /api/auth/login`) are public.
- Floor records are associated with a house. They are independent records; changing them does not automatically rewrite the house's manually maintained `numberOfFloors` value.
- Room confirmation is transactional. `totalArea` and `numberOfFloors` are deliberately left unchanged.
- The Construction Assistant currently provides rule-based planning guidance. It is not connected to an external LLM provider and does not send user data to an AI service.
- The source ZIP is a development codebase, not a claim of production certification. Run the build and API/browser tests in your local JDK/MySQL environment before deployment.
