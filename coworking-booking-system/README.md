# Coworking Space Booking System

A full-stack application for managing coworking locations and booking workspaces, built with React, Ant Design, Node.js, and PostgreSQL.

## 🚀 Features
- **Modern UI**: Built with Ant Design and Tailwind CSS.
- **Authentication**: Secure JWT-based registration and login.
- **Space Browsing**: Explore different coworking locations.
- **Workspace Booking**: Real-time booking for hot desks, dedicated desks, and meeting rooms.
- **Admin Panel**: Control center for managing locations and workspaces.
- **Cloud Database**: Integrated with Neon PostgreSQL.

## 🛠️ Tech Stack
- **Frontend**: React, Vite, Ant Design, Tailwind CSS, Axios.
- **Backend**: Node.js, Express, PostgreSQL (pg), JWT, Bcrypt.
- **Database**: PostgreSQL.

## 📦 Project Structure
```text
coworking-booking-system/
├── backend/          # Node.js API
│   ├── src/
│   │   ├── controllers/
│   │   ├── db/       # Migrations and SQL
│   │   ├── routes/
│   │   └── server.ts
│   └── .env.example
└── frontend/         # React Application
    ├── src/
    │   ├── components/
    │   ├── context/
    │   ├── pages/
    │   └── services/
    └── vite.config.ts
```

## ⚙️ Setup & Installation

### 1. Database Setup
1. Create a PostgreSQL database (e.g., on [Neon.tech](https://neon.tech)).
2. Copy the connection string.

### 2. Backend Configuration
1. Navigate to the backend: `cd backend`
2. Install dependencies: `npm install`
3. Create `.env` from `.env.example`: `cp .env.example .env` (or manual copy)
4. Update `.env` with your `DATABASE_URL` and `JWT_SECRET`.
5. Run migrations: `npm run migrate`
6. (Optional) Run seed data: `npm run seed`

### 3. Frontend Configuration
1. Navigate to the frontend: `cd frontend`
2. Install dependencies: `npm install`

### 4. Running the App
- **Backend**: `npm run dev` (runs on port 5000)
- **Frontend**: `npm run dev` (runs on port 5173 by default)

## 📄 License
MIT
