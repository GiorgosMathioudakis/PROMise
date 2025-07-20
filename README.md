# 🩺 Medical Questionnaire System

A full-stack web application designed for **healthcare professionals** to create, manage, and distribute dynamic **medical questionnaires**, and for **patients** to fill and submit them. Built using **React.js** for the frontend, **Java Spring Boot** for the backend, and **PostgreSQL** for persistent data storage.

---

## 📌 Features

- 👨‍⚕️ **Doctor Interface**  
  - Create, update, and manage structured questionnaires  
  - Define sections, questions, and custom response types (radio, checkbox, text, number)  
  - Add multiple formulas tied to questionnaires (e.g., scoring systems)

- 🧑‍⚕️ **Patient Interface**  
  - Fetch and fill assigned questionnaires  
  - Validation for different input types (text, numeric ranges, multiple choices)  
  - Submit responses linked to a questionnaire ID

- 🧠 **Custom Response Types**  
  - Flexible definition of response scales  
  - Reusable across multiple questions

- 🗃️ **Database Architecture**  
  - Designed with normalized entities (Questionnaire, Question, Section, ResponseType, Formula, etc.)  
  - Supports relational consistency and scalability

---

## 🛠️ Tech Stack

| Layer     | Technology            |
|-----------|------------------------|
| Frontend  | React.js, TailwindCSS  |
| Backend   | Spring Boot (Java 17+) |
| Database  | PostgreSQL             |
| Tools     | IntelliJ IDEA, Postman, GitHub |

---

## ⚙️ Requirements

- [Java 17+](https://adoptopenjdk.net/)
- [Node.js & npm](https://nodejs.org/)
- [PostgreSQL](https://www.postgresql.org/) (v13+ recommended)
- [IntelliJ IDEA](https://www.jetbrains.com/idea/) or another preferred IDE

---

## 🚀 Getting Started

### 1. Clone the Repository

git clone [https://github.com/your-username/medical-questionnaire-system.git](https://github.com/GiorgosMathioudakis/PROMise.git)
cd PROMise


### 2. Backend Setup (Spring Boot)

cd backend

Configure your PostgreSQL connection in src/main/resources/application.properties:

spring.datasource.url=jdbc:postgresql://localhost:5432/questionnaire_db
spring.datasource.username=postgres
spring.datasource.password=--------
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.properties.hibernate.format_sql=true

### Run the Spring Boot app:

./mvnw spring-boot:run


### 3. Frontend Setup (React)

cd frontend
npm install
npm run dev

