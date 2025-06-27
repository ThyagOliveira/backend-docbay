# Docbay Backend

This is the backend application for the **DocBay** coding challenge. Built using [NestJS](https://nestjs.com/) and [Prisma ORM](https://www.prisma.io/). It fetches user data from the GitHub API, stores it locally, and exposes endpoints for listing and filtering users.

For more details of the [Frontend docbay](https://github.com/ThyagOliveira/frontend-docbay) aplication

---

## Technologies

- **NestJS**
- **Prisma ORM**
- **PostgreSQL**
- **Swagger**
- **Jest**

---

## Getting Started

### Installation

```bash
npm install
```

### Configure environment

Create a .env file with example:

```env
POSTGRES_DB=docbay-db
POSTGRES_USER=admin
POSTGRES_PASSWORD=admin
POSTGRES_HOST=db
POSTGRES_PORT=5432

DATABASE_URL=postgresql://admin:admin@localhost:5432/docbay-db
```

### Start PostgreSQL with Docker

```bash
docker-compose up -d db
```

### Run migrations

Run the following steps after the DB is up:

```bash
npx prisma migrate dev --name init
npx prisma generate
```

### Run project

```bash
npm run start:dev
```

Server will run on:

```
http://localhost:3000
```

### Seed the database with real GitHub users

```bash
# Make sure the backend is running:
npx ts-node prisma/seed.ts
```

### Open prisma studio

```bash
npx prisma studio
```

### API Documentation Swagger

```
http://localhost:3000/api
```

### API Endpoints

`POST /github/:username`

Fetches a GitHub user by username and stores (or updates) it in the database.

`GET /github`

Returns a paginated and filtered list of users.
Query Parameters:

| Parameter  | Description                  | Type    | Example      |
| ---------- | ---------------------------- | ------- | ------------ |
| `location` | Filter by user location      | string  | `Porto`      |
| `language` | Filter by main repo language | string  | `TypeScript` |
| `page`     | Pagination page (default: 1) | integer | `1`          |
| `limit`    | Items per page (default: 10) | integer | `10`         |

### Running tests

```bash
npm run test
```
