# Visa Card Validation & Issuance Microservice with Automated CI/CD

A production-ready Node.js & Express microservice designed to validate and issue Visa payment cards. The project features automated unit testing, containerization via Docker, and an end-to-end continuous integration and deployment (CI/CD) pipeline managed with Jenkins and Docker Hub.

## Key Features

* **Visa Card Validation**: Verifies card number structure via Regular Expressions and validates mathematical authenticity using the **Luhn Algorithm**.
* **Mock Card Issuance**: API endpoint generating compliant mock Visa card payloads for integration testing.
* **Automated Unit Testing**: Comprehensive HTTP endpoint testing suite powered by **Jest** and **Supertest**.
* **Docker Containerization**: Containerized environment using a multi-stage, non-root Alpine Node.js image optimized for security and minimal footprint.
* **Automated CI/CD Pipeline**: Configured via `Jenkinsfile` (Pipeline-as-Code) to run tests, build Docker images, publish artifacts to Docker Hub, and clean up workspace resources automatically.

## 🛠 Tech Stack

* **Backend**: Node.js, Express.js
* **Testing**: Jest, Supertest
* **Containerization**: Docker
* **CI/CD**: Jenkins, Docker Hub
* **Language**: JavaScript (ES6+)
