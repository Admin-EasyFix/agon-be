# 🕊️ agon
AI-powered training insights for athletes. Connect your Strava account to get smart workout plans, performance analytics, and personalized recommendations.

## 🛠️ Tech Stack
* Frontend: React (Vite), TypeScript
* Backend: Node.js, Express
* Database: PostgreSQL (Dockerized)
* Auth: Strava OAuth 2.0 + JWT sessions
* Containerization: Docker & Docker Compose

## ⚙️ Setup & Installation
### Prerequisites
* Node.js >= 18
* Docker & Docker Compose
* Strava API Client ID + Client Secret ([create app here](https://www.strava.com/settings/api))
### 1️⃣ Clone Repo
```
git clone https://github.com/your-username/agon.git
cd agon
```
### 2️⃣ Frontend
```
cd frontend
npm install
npm run dev
Runs at http://localhost:5173.
```
### 3️⃣ Backend
```
cd backend
npm install
npm run dev:setup 
```
This command will:
1. Start a PostgreSQL database in a Docker container.
2. Wait for the database to be ready.
3. Apply the database schema using Prisma.
4. Start the backend server on `http://localhost:4000`

### 4️⃣ Environment Variables
Create .env inside /backend:
```
STRAVA_CLIENT_ID=your_client_id
STRAVA_CLIENT_SECRET=your_client_secret
STRAVA_REDIRECT_URI=http://localhost:4000/auth/strava/callback
JWT_SECRET=supersecret
DATABASE_URL=postgres://postgres:password@db:5432/agon
```

## 🧪 Testing
The backend includes both unit and integration tests.
*   **Unit Tests:** `npm run test` - Runs fast, isolated tests that mock the database.
*   **Integration Tests:** `npm run test:integration` - Runs tests against a real, containerized test database to ensure the service and database schema work together correctly.


## 📜 License
Apache-2.0 License © 2025
