# SmartBuild AI 🏗️

SmartBuild AI is a web application for managing and organizing house construction projects.

The project is being developed using Java, Spring Boot, Spring Data JPA, Hibernate, and MySQL. The goal is to build a practical platform for managing construction projects and adding AI-assisted features in the future.

## 🚧 Project Status

Currently in development.

## ✨ Current Features

- Project creation
- View all projects
- View project by ID
- Update project details
- Delete project
- Project not found exception handling
- REST APIs
- MySQL database integration

## 🛠️ Technology Stack

- Java
- Spring Boot
- Spring Data JPA
- Hibernate
- MySQL
- REST API
- Postman
- Git
- GitHub
- IntelliJ IDEA

## 🏗️ Project Structure

src/main/java/com/smartbuildai

├── controller
│   └── ProjectController.java
│
├── entity
│   └── Project.java
│
├── exception
│   ├── GlobalExceptionHandler.java
│   └── ProjectNotFoundException.java
│
├── repository
│   └── ProjectRepository.java
│
└── service
    └── ProjectService.java

## 🔌 REST API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/projects | Create a project |
| GET | /api/projects | Get all projects |
| GET | /api/projects/{id} | Get project by ID |
| PUT | /api/projects/{id} | Update project |
| DELETE | /api/projects/{id} | Delete project |

## 🗄️ Database

MySQL database:

smartbuild_ai

Database configuration is stored in:

src/main/resources/application.properties

Example:

spring.application.name=smartbuild-ai
spring.datasource.url=jdbc:mysql://localhost:3306/smartbuild_ai
spring.datasource.username=root
spring.datasource.password=
spring.jpa.hibernate.ddl-auto=update

## 🚀 How to Run

1. Clone the repository:

git clone https://github.com/Agniwesh1/SmartBuild-AI.git

2. Create the MySQL database:

CREATE DATABASE smartbuild_ai;

3. Configure your MySQL username and password in application.properties.

4. Open the project in IntelliJ IDEA.

5. Run:

SmartbuildAiApplication.java

6. The application will run on:

http://localhost:8080

## 🧪 API Testing

The REST APIs are tested using Postman.

Current tests:

- Create Project
- Get All Projects
- Get Project by ID
- Update Project
- Delete Project
- 404 handling for a project that does not exist

## 🔮 Future Features

- User authentication
- User and project management
- House planning
- Construction expense tracking
- Material management
- Construction progress tracking
- Dashboard
- Reports and analytics
- Frontend
- AI-assisted house planning
- AI-based construction recommendations

## 👨‍💻 Author

Agniwesh

---

⭐ SmartBuild AI is actively under development.
