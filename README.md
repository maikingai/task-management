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

>>>> Test Cases Document

Project: Task Management App

Test Suite: End-to-End (E2E) Testing for Main Scenarios

>> TC01: Authentication (Login)

Scenario: User enters a valid email and password to log in.

Pre-condition: User is on the Login page (/login).

Test Steps: 1.Enter a valid email (e.g., admin@test.com).

2.Enter a valid password.

3.Click the "Login" button.

Expected Result: The system navigates the user to the Task list page (/tasks).

>> TC02: Create a New Task

Scenario: User can successfully create a new task.

Pre-condition: User is logged in and is on the Task list page (/tasks).

Test Steps:1.Click the "Create New Task" button.

2.The system navigates to the Create Task form page (/tasks/new).

3.Fill in the Task title and description completely.

4.Click the "Save" button.

Expected Result: The system redirects back to the /tasks page and displays the newly created Task in the list.

>> TC03: Update Task

Scenario: User can successfully edit an existing task's information.

Pre-condition: There is at least 1 Task available in the system.

Test Steps:1.Find the Task to be edited and click the "Edit" button.

2.The system navigates to the Edit Task form page (/tasks/edit/:id).

3.Modify the Task title and/or description.

4.Click the "Save" button.

Expected Result: The system redirects back to the /tasks page, and the Task information is successfully updated.

>> TC04: Delete Task

Scenario: User can successfully delete a task from the system.

Pre-condition: There is at least 1 Task available in the system.

Test Steps:1.Find the Task to be deleted and click the "Delete" button.

2.Click "Confirm" on the confirmation pop-up dialog.

Expected Result: The specified Task is successfully deleted and disappears from the Task list page.

>> TC05: Logout

Scenario: User can successfully log out of the system.

Pre-condition: User is logged in and is on the Task list page (/tasks).

Test Steps: 1.Click the "Logout" button.

Expected Result: The system navigates the user back to the Login page (/login), and the Task list page cannot be accessed directly without logging in again.

## 🚀 Key Architectural 

Vite + React + TypeScript: - Chosen for its blazing-fast Hot Module Replacement (HMR) and optimized build process. TypeScript is integrated to ensure type safety and reduce runtime errors.

Feature-Based Folder Structure: - Organized the codebase by features (e.g., src/features/auth, src/features/tasks) rather than file types. This improves scalability, maintainability, and makes the code easier to navigate.

Form Validation (Formik & Yup): - Integrated Formik to handle form state efficiently and Yup for schema-based validation. This ensures all required fields are properly validated (beyond simple empty checking) before submitting data to the API.

Testing Strategy (Vitest + Cypress): - Vitest: Selected for unit testing because it shares the same configuration as Vite, making it extremely fast. Tests are written using the Arrange-Act-Assert (AAA) pattern.

Cypress: Used for End-to-End (E2E) testing to simulate real user behaviors covering main scenarios (Login, Create, Update, Delete) seamlessly.