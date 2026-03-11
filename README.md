# Task Management App

This is a Task Management Application built with React, TypeScript, and Vite. It supports basic CRUD (Create, Read, Update, Delete) operations for tasks with user authentication.

### Tech Stack
Core : React 18, TypeScript, Vite
Styling : Tailwind CSS
Form Management & Validation : Formik, Yup
Backend : REST API with Docker
Unit Testing : Vitest, React Testing Library
E2E Testing : Cypress

### 1. Prerequisites
- Node.js
- npm
- Docker
- Git

### 2. Installation
Clone the repository and install dependencies:
npm install

### 3.Run app
To run the application, you need to start both the Backend API and the Vite development server.

Terminal 1: Start the Backend API (db server port 3000)
git clone : https://github.com/RealSoSity/nodesnow-test
cd nodesnow-test
docker-compose up -d

Terminal 2: Start the Vite Dev Server
npm run dev
The application will be available at http://localhost:5173

### 4.Running Tests
**Unit Testing (Vitest & React Testing Library)**
To run unit tests and check code coverage (>90% requirement):
npm run test
npm run coverage

**E2E Testing (Cypress)**
Make sure both the API and Dev Server are running, then open Cypress:
npx cypress open
Select "E2E Testing" -> Chrome -> and run tasks.cy.ts.

## 🚀 Key Architectural 

Vite + React + TypeScript: - Chosen for its blazing-fast Hot Module Replacement (HMR) and optimized build process. TypeScript is integrated to ensure type safety and reduce runtime errors.

Feature-Based Folder Structure: - Organized the codebase by features (e.g., src/features/auth, src/features/tasks) rather than file types. This improves scalability, maintainability, and makes the code easier to navigate.

Form Validation (Formik & Yup): - Integrated Formik to handle form state efficiently and Yup for schema-based validation. This ensures all required fields are properly validated (beyond simple empty checking) before submitting data to the API.

Testing Strategy (Vitest + Cypress): - Vitest: Selected for unit testing because it shares the same configuration as Vite, making it extremely fast. Tests are written using the Arrange-Act-Assert (AAA) pattern.

Cypress: Used for End-to-End (E2E) testing to simulate real user behaviors covering main scenarios (Login, Create, Update, Delete) seamlessly.
