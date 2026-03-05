# 🕊️ Agon Backend

AI-powered training insights for athletes. This is the backend service for Agon, providing a RESTful API to connect with Strava, analyze workout data, and generate personalized recommendations using Google's Gemini AI.

## Features

- **Strava Integration:** Securely connect your Strava account using OAuth 2.0 to fetch activities.
- **AI-Powered Insights:** Utilizes Google Gemini to generate smart, personalized workout suggestions and analytical comments on past activities.
- **RESTful API:** A well-defined API documented with OpenAPI (Swagger) for easy consumption by a frontend client.
- **Persistent Storage:** User data, including secure Strava tokens, is stored in a PostgreSQL database managed by the Prisma ORM.
- **Containerized Environment:** Uses Docker and Docker Compose for a consistent and isolated development and testing environment.
- **Automated CI:** Includes GitHub Actions for continuous integration to validate the application on every push and pull request.

## Architecture Overview

The application follows a standard client-server architecture. The Node.js/Express server exposes a REST API that authenticates users via Strava's OAuth2 flow, stores user tokens and profile data in a PostgreSQL database, and interacts with two primary external services:

- **Strava API:** To fetch athlete profile and activity data.
- **Google Gemini API:** To analyze activity data and generate suggestions.

The authentication flow uses JWTs to maintain user sessions after the initial OAuth2 handshake with Strava.

## API Documentation

The API is documented using the OpenAPI 3.0 standard. When the server is running locally, you can access the interactive Swagger UI at:

**`http://localhost:4000/swagger`**

### Key Endpoints
- **Authentication:**
    - `GET /api/strava/auth/authorize`: Initiates the Strava OAuth2 authorization flow.
    - `GET /api/strava/auth/callback`: Handles the callback from Strava to exchange an authorization code for tokens.
- **User:**
    - `GET /api/users/profile`: Retrieves the authenticated user's profile information.
- **Activities & AI:**
    - `GET /api/strava/activities`: Fetches the user's recent activities from Strava.
    - `GET /api/suggest`: Generates an AI-powered workout suggestion based on recent activity.

## Getting Started

### Prerequisites
*   Node.js (v18 or higher)
*   Docker & Docker Compose
*   [Strava API Credentials](https://www.strava.com/settings/api) (`Client ID` & `Client Secret`)
*   [Google Gemini API Key](https://ai.google.dev/)

### 1. Clone the Repository
```bash
git clone https://github.com/admin-easyfix/agon-be.git
cd agon-be
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory and populate it with your credentials.

```dotenv
# Strava OAuth Credentials
STRAVA_CLIENT_ID=YOUR_STRAVA_CLIENT_ID
STRAVA_CLIENT_SECRET=YOUR_STRAVA_CLIENT_SECRET

# A secret key for signing JWTs
JWT_SECRET=a_very_secure_and_random_string

# Connection string for the local PostgreSQL database (managed by Docker Compose)
DATABASE_URL="postgresql://user:password@localhost:5432/agon_dev?schema=public"

# The base URL of your backend, used for the Strava callback
# Ensure this matches a registered callback URL in your Strava app settings
BACKEND_URL=http://localhost:4000

# Whitelisted frontend URLs to redirect to after successful login (comma-separated)
ALLOWED_REDIRECT_URIS=http://localhost:5173

# Google Gemini API Key
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
```

### 4. Run the Development Environment
```bash
npm run dev:setup
```
This single command handles the complete setup process:
1.  Starts a PostgreSQL database in a Docker container.
2.  Waits for the database to be fully available.
3.  Applies the database schema using Prisma migrations.
4.  Starts the backend server on `http://localhost:4000`.

## Testing

The project includes both unit and integration tests using Vitest.

### Unit Tests
Run fast, isolated tests that mock the database and external services.
```bash
npm test
```

### Integration Tests
Run tests against a real, containerized test database to ensure the services and database schema work together correctly. The command automatically manages the lifecycle of the test database.
```bash
npm run test:integration
```

## Deployment

This service is configured for deployment on [Render](https://render.com/). The `render.yaml` file in the root directory defines the necessary web service and PostgreSQL database, along with the build and start commands, for a seamless deployment process.

## License
This project is licensed under the **Apache-2.0 License**. See the [LICENSE](LICENSE) file for more details.