# SmartBuild AI — integration notes

## What was integrated

The existing authentication, projects/houses, room confirmation and floor management features were retained. The React application now exposes the existing backend APIs through workspace pages for:

- Construction Planning (task CRUD)
- Materials & Inventory (material CRUD)
- Contractors & Labour (contractor CRUD)
- Budget Setup and Expense Register
- Construction Progress (stage CRUD)
- Dashboard & Reports (workspace summary and CSV export)
- Construction Assistant (built-in rule-based planning tips)

Floor summary cards now refresh after floor create, update and delete actions.

## Configuration and security

- Database credentials are read from `DB_URL`, `DB_USERNAME` and `DB_PASSWORD`.
- JWT signing key is read from `JWT_SECRET`; configure a random secret of at least 32 characters before starting the backend.
- No database password or JWT signing key is included in this archive.
- `spring.jpa.hibernate.ddl-auto=update` is retained. Back up the MySQL database before running schema updates.
- `.env.example` is a reference template; Spring Boot does not automatically load it. Set the variables in your shell or IDE run configuration.

## AI assistant scope

The Construction Assistant is intentionally labelled as rule-based planning guidance. It is not a connected LLM and does not claim to generate answers using a remote AI service. A live AI provider still requires a server-side API key, privacy notice, rate limits and provider error handling.

## Verification performed in this workspace

- Parsed the changed React JSX files successfully with the bundled Hermes parser.
- A production Vite build could not be completed in this Linux workspace because the uploaded dependency snapshot does not contain the Linux Rolldown native binding (it appears to have been installed for Windows). Run `npm ci` and `npm run build` on the Windows development machine to install the correct platform package.
- Backend compilation could not be run here: the project targets Java 25, while this workspace has Java 21, and the Maven wrapper distribution was not present locally. The wrapper configuration is now included; run `.\mvnw.cmd clean test` on the configured JDK 25 machine.
- Live database/API/browser integration tests still need to be run against your local MySQL database.

## Run on Windows

1. Set the four environment variables shown in `.env.example` in PowerShell or IntelliJ run configuration.
2. From the project root run `.\mvnw.cmd spring-boot:run`.
3. In a second terminal run `cd frontend`, `npm ci`, then `npm run dev`.
4. Open the Vite URL shown in the terminal.
