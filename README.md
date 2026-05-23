# MERN Auth

A full-stack authentication app built with MongoDB, Express, React, and Node.js.
It includes registration, login, JWT-protected user sessions, profile editing,
avatar upload preview, and a responsive React dashboard.

## Features

- User registration and login
- Password hashing with bcrypt
- JWT authentication
- Protected profile endpoint
- Editable profile with name, email, and avatar
- Responsive React UI
- Production backend serving the built React app
- MongoDB persistence with Mongoose

## Tech Stack

- Frontend: React, Vite, React Router
- Backend: Node.js, Express
- Database: MongoDB with Mongoose
- Auth: JWT and bcryptjs

## Project Structure

```txt
mern-auth/
  backend/
    middleware/
    models/
    routes/
    .env.example
    server.js
  frontend/
    public/
    src/
    .env.example
    vite.config.js
  README.md
```

## Requirements

- Node.js 18+
- npm
- MongoDB Atlas or a local MongoDB database

## Environment Variables

Create a backend environment file:

```bash
cp backend/.env.example backend/.env
```

Then update `backend/.env`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_jwt_secret
FRONTEND_URL=http://127.0.0.1:5173,http://localhost:5173
```

Create a frontend environment file if you run the frontend separately:

```bash
cp frontend/.env.example frontend/.env
```

Default frontend API URL:

```env
VITE_API_URL=http://127.0.0.1:5000/api
```

Never commit real `.env` files.

## Install

Install backend dependencies:

```bash
cd backend
npm install
```

Install frontend dependencies:

```bash
cd ../frontend
npm install
```

## Development

Run the backend:

```bash
cd backend
npm run dev
```

Run the frontend in another terminal:

```bash
cd frontend
npm run dev
```

Open:

```txt
http://localhost:5173
```

## Production Build

Build the React frontend:

```bash
cd frontend
npm run build
```

Start the backend:

```bash
cd ../backend
npm start
```

The backend serves the production frontend at:

```txt
http://127.0.0.1:5000
```

## API Routes

Base URL:

```txt
http://127.0.0.1:5000
```

Health check:

```txt
GET /api/health
```

Register:

```txt
POST /api/auth/register
```

```json
{
  "name": "Amine Oubouisk",
  "email": "amine@example.com",
  "password": "123456"
}
```

Login:

```txt
POST /api/auth/login
```

```json
{
  "email": "amine@example.com",
  "password": "123456"
}
```

Get current user:

```txt
GET /api/auth/me
Authorization: Bearer YOUR_TOKEN
```

Update profile:

```txt
PUT /api/auth/me
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json
```

```json
{
  "name": "Amine Updated",
  "email": "amine.updated@example.com",
  "avatarUrl": "https://example.com/avatar.jpg"
}
```

## Frontend Routes

```txt
/register
/login
/dashboard
/profile
```

`/dashboard` and `/profile` are protected in the React app. They use
`GET /api/auth/me` and the saved JWT session.

## Test Commands

Backend syntax check:

```bash
cd backend
npm test
```

Frontend lint and build:

```bash
cd frontend
npm run lint
npm run build
```

## License

ISC
