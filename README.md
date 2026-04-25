# Content Broadcasting System (Backend)

A robust, subject-based content distribution system for modern educational environments. Teachers upload content, Principals approve/reject it, and students access a live, rotating broadcast via a public API.

## 🚀 Tech Stack
- **Runtime**: Node.js (v22+)
- **Framework**: Express.js (ES Modules)
- **Database**: PostgreSQL (Supabase)
- **ORM**: Prisma 7
- **Authentication**: JWT & Bcrypt
- **File Handling**: Multer
- **Validation**: Zod

## 🛠️ Features
- **RBAC (Role-Based Access Control)**: Strictly separated Principal and Teacher workflows.
- **Dynamic Scheduling**: Content only goes live during the teacher-defined `startTime` and `endTime`.
- **Subject-Based Rotation**: Each subject (Maths, Science, etc.) has an independent, continuous rotation loop.
- **Approval Workflow**: Complete lifecycle management from `pending` to `approved` or `rejected` with reasons.
- **Public API**: Student-facing endpoint for live content without authentication requirements.

## 📁 Project Structure
```text
src/
├── auth/           # Authentication logic (Signup/Signin)
├── principal/      # Approval and content management logic
├── upload/         # Teacher content upload logic
├── live/           # Public broadcasting & rotation engine
├── utils/          # Prisma singleton & shared helpers
├── config.js       # Environment configuration
└── server.js       # App entry point
```

## ⚙️ Setup Instructions

### 1. Prerequisites
- Node.js installed
- A PostgreSQL database (Supabase recommended)

### 2. Environment Variables
Create a `.env` file in the root directory:
```env
PORT=3000
DATABASE_URL="your-connection-string"
DIRECT_URL="your-direct-connection-string"
JWT_SECRET="your-secret-key"
```

### 3. Installation
```bash
npm install
```

### 4. Database Setup
```bash
npx prisma generate
npx prisma db push
```

### 5. Running the App
```bash
npm run dev
```

## 📡 API Usage (Quick Summary)

### Auth
- `POST /auth/signup` - Register a new user
- `POST /auth/signin` - Login and get JWT

### Teacher (Requires Auth)
- `POST /upload/upload` - Upload content (multipart/form-data)

### Principal (Requires Auth)
- `GET /principal/content` - View pending/approved content
- `PATCH /principal/approve/:id` - Approve content
- `PATCH /principal/reject/:id` - Reject content with a reason

### Public (No Auth)
- `GET /content/live/:teacherId` - Get the currently active rotating content

---
**Assignment Submission for Backend Developer Role.**
Created with focus on architectural integrity and real-world edge case handling.
