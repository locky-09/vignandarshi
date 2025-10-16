# LearnSpace Setup Instructions

## Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or cloud instance) - **✅ Configured as Windows Service**
- pnpm (recommended) or npm

## MongoDB Configuration (Your Setup)
- **Service Account**: learnspace\locky_09 ✅
- **Port**: 27017 (default) ✅
- **Data Directory**: C:\Program Files\MongoDB\Server\8.2\data\ ✅
- **Log Directory**: C:\Program Files\MongoDB\Server\8.2\log\ ✅
- **Service**: MongoDB runs as Windows Service ✅

## Environment Setup

1. Create a `.env` file in the root directory with the following variables:

```env
# Database
DATABASE_URL="mongodb://localhost:27017/learnspace"

# JWT Secret (change this in production)
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# Next.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret-key"
```

## ⚠️ Important: MongoDB Replica Set Required

Prisma requires MongoDB to be configured as a replica set. Choose one option:

### Option A: Configure Local MongoDB (Recommended)
```bash
# Install mongodb driver
pnpm add mongodb

# Configure replica set
pnpm configure-replica

# Verify setup
pnpm verify-db
```

### Option B: Use MongoDB Atlas (Cloud)
1. Create free account at [MongoDB Atlas](https://cloud.mongodb.com)
2. Create cluster and get connection string
3. Update `.env` with Atlas connection string

## Quick Verification

Before proceeding, verify your MongoDB setup:
```bash
pnpm verify-db
```

## Installation & Setup

1. Install dependencies:
```bash
pnpm install
# or
npm install
```

2. Generate Prisma client:
```bash
pnpm db:generate
# or
npm run db:generate
```

3. Push database schema:
```bash
pnpm db:push
# or
npm run db:push
```

4. Set up initial data (admin user and sample data):
```bash
pnpm simple-setup
# or
npm run simple-setup
```

**Alternative (if you get replica set errors):**
```bash
pnpm setup-db
# or
npm run setup-db
```

5. Start the development server:
```bash
pnpm dev
# or
npm run dev
```

## Default Admin Credentials

After running the setup, you can login with:
- **Email**: admin@learnspace.com
- **Password**: admin123
- **Role**: Admin

## Features Now Working

✅ **Admin Login**: Connect to backend authentication
✅ **User Creation**: Admin can create users through the frontend
✅ **Database Integration**: All data persists to MongoDB
✅ **User Management**: View, create, and delete users
✅ **Authentication**: JWT-based authentication with cookies

## API Endpoints

- `POST /api/auth/login` - User authentication
- `GET /api/auth/me` - Get current user
- `GET /api/users` - Get all users
- `POST /api/users` - Create new user
- `DELETE /api/users?id=userId` - Delete user

## Database Schema

The system uses MongoDB with the following main models:
- **User**: Users with roles (Student, Faculty, Organizer, Admin)
- **Room**: Available rooms with capacity and facilities
- **Request**: Booking requests with status tracking

## Troubleshooting

1. **Database Connection Issues**: Ensure MongoDB is running and DATABASE_URL is correct
2. **Authentication Issues**: Check JWT_SECRET is set in environment variables
3. **User Creation Issues**: Verify the user doesn't already exist (unique email constraint)
