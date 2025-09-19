 # Medical Appointment System

A complete CRUD system for managing medical appointments, developed with NestJS (backend), Next.js (frontend), and PostgreSQL (database).

## Features

- Create appointments with full validation
- View appointments in an organized table
- Edit scheduled appointments
- Cancel appointments (up to 24h in advance)
- Delete appointments
- Business rule validations
- Error handling with clear messages
- Responsive UI with Tailwind CSS

## Business Rules

- There cannot be two appointments for the same doctor at the same time.
- Appointments can only be scheduled for future dates.
- An appointment can only be canceled up to 24 hours before its scheduled time.
- When creating an appointment, the initial status must always be "Scheduled".

## Tech Stack

### Server
- NestJS - Node.js Framework
- TypeORM - Database ORM
- PostgreSQL - Database
- Class Validator - Data Validation
- Docker - Database Containerization

### Client
- Next.js 15 - React Framework
- TypeScript - Static Typing
- Tailwind CSS - Styling
- React Hook Form - Form Management
- Zod - Schema Validation
- Axios - HTTP Client
- Lucide React - Icons

## Setup and Execution

### Prerequisites
- Node.js 18+
- Docker
- Git

### 1. Clone the repository
```bash
git clone https://github.com/filipeguimel/medical-appointments.git
cd medical-appointments
```

### 2. Set up the database
```bash
docker-compose up -d
```

### 3. Set up the Server
```bash
cd server
npm install
cp .env.example .env
npm run start:dev
```

The server will be running at: `http://localhost:3001`

### 4. Set up the Client

```bash
cd ../client
npm install
npm run dev
```

The client will be running at: `http://localhost:3000`

## Database Structure

### Table: appointments
| Field | Type | Description |
|-------|------|-----------|
| id | number | Unique identifier |
| patientName | string | Patient's name (min 3 chars) |
| doctorName | string | Doctor's name (min 3 chars) |
| specialty | string | Medical specialty |
| appointmentDate | timestamp | Date and time of the appointment |
| status | enum | Status: Agendado, Cancelado, Realizado |
| createdAt | timestamp | Creation date |
| updatedAt | timestamp | Last update date |

## API Endpoints

### Consultas
- `GET /appointments` - Lists all appointments
- `GET /appointments/:id` - Finds an appointment by ID
- `POST /appointments` - Creates a new appointment
- `PATCH /appointments/:id` - Updates an appointment
- `PATCH /appointments/:id/cancel` - Cancels an appointment
- `DELETE /appointments/:id` - Removes an appointment

## Implemented Validations

### Client (Zod + React Hook Form)
- Patient name: minimum 3 characters
- Doctor name: minimum 3 characters
- Specialty: required
- Appointment date: valid format and required

### Server (Class Validator)
- Data type validation
- Minimum length validation
- Date format validation
- Business rule validation

## Available Scripts

### Server
```bash
npm run start         # Production
npm run start:dev     # Development
npm run start:debug   # Debug
npm run build         # Build
```

### Client
```bash
npm run dev           # Development
npm run build         # Build
npm run start         # Production
npm run lint          # ESLint
```

## Docker

The project includes a Docker configuration for PostgreSQL:

```yaml
# docker-compose.yml
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: consultas_medicas
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD:
    ports:
      - "5432:5432"
```

## Error Handling

### Custom Messages
- `400 Bad Request` → "Já existe uma consulta para este médico neste horário."
- `400 Bad Request` → "Não é permitido agendar consultas no passado."
- `400 Bad Request` → "Uma consulta só pode ser cancelada até 24 horas antes do horário marcado."
- `404 Not Found` → "Consulta com ID X não encontrada."

## License

This project is licensed under the MIT License. See the LICENSE file for details.

---

**Desenvolvido por Guimel Cavalcante para o processo seletivo da Neri**