# JWT Demo Platform

This repository contains a full-stack platform for job, internship, project, and hackathon management, built with Spring Boot (Java) for the backend and React (TypeScript) for the frontend.

## Features

- **Job & Internship Listings:** Browse, filter, and search jobs and internships from Adzuna API.
- **Project Management:** Developers can create, edit, and manage projects, upload/download files, and edit markdown documentation.
- **Hackathons:** Buyers can create hackathons; developers can register as participants.
- **Admin Dashboard:** View system statistics, manage users, projects, and hackathons.
- **Authentication & Authorization:** Role-based access for Developers, Buyers, and Admins.
- **Modern UI:** Built with React, Tailwind CSS, and Framer Motion for smooth UX.

## Getting Started

### Backend

1. **Requirements:** Java 17+, Maven, MongoDB
2. **Setup:**
   - Configure `application.properties` with your Adzuna API keys and MongoDB URI.
   - Run:
     ```bash
     mvn spring-boot:run
     ```
   - Backend runs on `http://localhost:8081`

### Frontend

1. **Requirements:** Node.js 16+
2. **Setup:**
   - Navigate to `msmewebpage-main`
   - Install dependencies:
     ```bash
     npm install
     ```
   - Start the app:
     ```bash
     npm start
     ```
   - Frontend runs on `http://localhost:3000`

## Project Structure

- `jwtdemo/` - Spring Boot backend (Java)
- `msmewebpage-main/` - React frontend (TypeScript)

## Key Technologies

- **Backend:** Spring Boot, WebFlux, MongoDB, JWT, Spring Security
- **Frontend:** React, TypeScript, Tailwind CSS, Framer Motion, Axios

## API Endpoints

- `/api/jobs` - Job and internship search
- `/api/projects` - Project CRUD and file management
- `/api/hackathons` - Hackathon management
- `/api/admin` - Admin statistics and user management

## Contributing

Pull requests are welcome! Please open an issue first to discuss changes.

## License

This project is licensed under the MIT License.

---

*For more details, see the code and comments in each module.*
