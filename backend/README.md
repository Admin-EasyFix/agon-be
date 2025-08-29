# Backend Project with Express, Prisma, and TypeScript

This project is a backend application built using Express, Prisma, and TypeScript. It serves as the backend for the existing frontend application.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [Contributing](#contributing)
- [License](#license)

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd backend
   ```

2. Install the dependencies:
   ```
   npm install
   ```

3. Set up the database:
   - Update the `DATABASE_URL` in the `.env` file with your database connection string.
   - Run the Prisma migrations:
   ```
   npx prisma migrate dev
   ```

## Usage

To start the server, run:
```
npm run start
```

The server will be running on `http://localhost:4000`.

## API Endpoints

- `GET /`: Returns a welcome message.
- Additional endpoints will be documented here as they are implemented.

## Database Schema

The database schema is defined in `prisma/schema.prisma`. You can modify the schema and run migrations to update the database.

## License

This project is licensed under the Apache License. See the LICENSE file for more details.