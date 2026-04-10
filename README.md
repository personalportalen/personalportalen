![.NET](https://img.shields.io/badge/.NET-8-blue)
![React](https://img.shields.io/badge/React-TypeScript-blue)
![CI](https://img.shields.io/badge/CI-GitHub_Actions-green)
![Docker](https://img.shields.io/badge/Docker-ready-blue)
![License](https://img.shields.io/badge/license-MIT-lightgrey)
![Tests](https://img.shields.io/badge/tests-passing-brightgreen)

# WorkShift

A production-style **fullstack shift booking system** built with **.NET, React and modern DevSecOps practices**.

This project was built as my **final portfolio project during my .NET Fullstack YH education**.
Instead of building multiple small demos, I focused on creating **one realistic system that demonstrates how modern software is built, tested, secured and deployed.**

The project includes and implements:

- Clean architecture
- Observability
- Scalable system design

The application is **publicly deployed** and can also be **run locally using Docker**.

---

## Screenshots

<p align="center">
  <img src="images/screenshot_login.png" width="45%" />
  <img src="images/screenshot_signup.png" width="45%" />
</p>

## Quick Overview (for recruiters)

### Problem solved

Managing employee work shifts where:

- Admins create and manage shifts
- Employees can book available shifts
- The system handles authentication and authorization

### Tech Stack

**Backend**

- ASP.NET Web API
- Clean Architecture
- FluentValidation

**Frontend**

- React

**Infrastructure**

- YARP API Gateway
- Docker

**Observability**

- OpenTelemetry distributed tracing
- Health checks

## DevOps Capabilities Demonstrated

This project demonstrates several DevOps and DevSecOps practices:

• Containerized services using Docker  
• Distributed tracing using OpenTelemetry  
• Health monitoring endpoints  
• API Gateway architecture using YARP

---

## Live Demo

Frontend
`https://your-demo-url`

API Gateway
`https://your-api-url`

---

## Deployment

The application is deployed using containerized services.

Deployment setup:

- Docker containers
- YARP API Gateway for routing
- ASP.NET APIs running behind the gateway
- Environment configuration via environment variables

Deployment flow:

Developer Push
│
▼
Docker image build
│
▼
Container deployment

---

## About Me

I am a soon-to-graduate **.NET Fullstack developer from a Swedish YH program at EC Utbildning**, currently looking for my **first junior developer role**.

My main interests are:

- **Cybersecurity** and building systems resilient against modern threat actors
- **Security implications of AI systems** and how AI will affect future software security
- **DevSecOps** and integrating security practices into the development lifecycle
- **Complex distributed systems** and the challenges that arise when systems scale

This project represents the **engineering practices I want to bring into my first development role**.

---

### Design goals

- Maintainable architecture
- Strong separation of concerns
- Testability
- Cloud-ready infrastructure
- Observable systems

### Architectural principles

- SOLID
- Clean Architecture
- API-first design

---

## Get Started

### Clone the repository

```bash
git clone https://github.com/StaffSystemW/staffsystem.git
```

### Run locally with Docker

```bash
docker compose up --build
```

Services will start automatically.

```
Frontend: http://localhost:3000
API Gateway: http://localhost:8080
```

---

## Frontend

The frontend is built using **React** with a focus on maintainability and good UX patterns.

### Key Features

- Component-driven architecture
- Dedicated API service layer
- Protected routes
- Form validation
- Error handling
- Loading states

### Example structure

```
frontend
│
├── components
├── pages
├── hooks
├── services
├── types
└── utils
```

---

## Backend

The backend consists of **ASP.NET Web APIs** designed around **Clean Architecture**.

### Features

- RESTful CRUD endpoints
- FluentValidation request validation
- Global exception handling middleware
- Dependency injection
- Health checks

### Development principles

- SOLID
- Separation of concerns
- Testability
- Maintainability

---

## API Gateway

The system uses **YARP (Yet Another Reverse Proxy)** as an API Gateway.

### Responsibilities

- Central entry point for APIs
- Request routing
- Service abstraction
- Future microservice expansion

This architecture allows easy evolution into a **microservice-based system**.

---

### Technologies

- Entity Framework Core
- Code-first migrations

### Core entities

- Users
- Profiles
- Shifts
- Bookings

## Observability

Modern production systems require strong observability.

### Logging

- Serilog
- Structured logging

### Distributed Tracing

- Correlation IDs

### Health Checks

Health endpoints are implemented for:

- Application services
- Containers
- Infrastructure

---

## Security Practices

Security considerations include:

- Authentication
- Protected routes
- Dependency vulnerability scanning

---

## Use of AI

AI tools were used as **engineering assistance during development**, similar to modern development workflows.

Examples include:

- Debugging assistance
- Architecture brainstorming
- Documentation support

All generated suggestions were **reviewed and implemented manually**.

---

## Why This Project Exists

This project was created to demonstrate the ability to build software with:

- Real-world architecture
- DevSecOps workflows
- Modern frontend practices
- Observability

It reflects the **kind of engineering environment I want to work in as a developer**.

---

## Contact

If you have feedback, questions, or opportunities to collaborate:

LinkedIn: www.linkedin.com/in/rasmus-waleij-4791a7128  
Email: rasmus [dot] waleij [at] gmail [dot] com
