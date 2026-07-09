# CodeWithEugene Backend

A Node.js/Express backend API using MySQL for the CodeWithEugene platform.

## Features

- User authentication with JWT
- Blog post management
- Course management
- MySQL database integration
- TypeScript support

## Prerequisites

- Node.js (v18 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

## Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
Copy the `.env` file and update the values:
```bash
cp .env.example .env
```

Update the following variables in `.env`:
```env
DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=codewitheugene
JWT_SECRET=your-super-secret-jwt-key
PORT=3001
FRONTEND_URL=http://localhost:8080
```

3. Set up MySQL database:

**Option A: Using MySQL CLI**
```bash
mysql -u root -p
CREATE DATABASE codewitheugene;
exit;
```

**Option B: Using the provided script**
```bash
npm run db:create
```

4. Run database migrations:
```bash
npm run db:migrate
```

This will create all necessary tables and an admin user (email: admin@codewitheugene.com, password: admin123).

## Running the Application

### Development
```bash
npm run dev
```

### Production
```bash
npm run build
npm start
```

The server will start on `http://localhost:3001`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (requires auth)

### Blog
- `GET /api/blog` - Get all published blog posts
- `GET /api/blog/:id` - Get specific blog post
- `POST /api/blog` - Create blog post (admin only)
- `PUT /api/blog/:id` - Update blog post (admin only)
- `DELETE /api/blog/:id` - Delete blog post (admin only)

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id VARCHAR(36) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  role ENUM('user', 'admin') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Blog Posts Table
```sql
CREATE TABLE blog_posts (
  id VARCHAR(36) PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  cover_image LONGTEXT,
  is_published BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMP NULL,
  author_id VARCHAR(36) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### Courses Table
```sql
CREATE TABLE courses (
  id VARCHAR(36) PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  subtitle VARCHAR(500),
  description TEXT,
  category VARCHAR(100),
  language VARCHAR(50) DEFAULT 'English',
  level ENUM('Beginner', 'Intermediate', 'Advanced') DEFAULT 'Beginner',
  price DECIMAL(10,2) DEFAULT 0.00,
  thumbnail VARCHAR(500),
  duration VARCHAR(50),
  lessons INT DEFAULT 0,
  learning_objectives TEXT,
  requirements TEXT,
  total_duration VARCHAR(50),
  is_published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Course Purchases Table
```sql
CREATE TABLE course_purchases (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  course_id VARCHAR(36) NOT NULL,
  purchase_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  amount DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
  UNIQUE KEY unique_purchase (user_id, course_id)
);
```

## Development

### Project Structure
```
backend/
├── src/
│   ├── config/
│   │   └── database.ts          # Database connection
│   ├── controllers/
│   │   ├── authController.ts    # Authentication logic
│   │   └── blogController.ts    # Blog management logic
│   ├── middleware/
│   │   └── auth.ts              # JWT authentication middleware
│   ├── models/
│   │   └── types.ts             # TypeScript interfaces
│   ├── routes/
│   │   ├── auth.ts              # Auth routes
│   │   └── blog.ts              # Blog routes
│   ├── scripts/
│   │   ├── createDatabase.ts    # Database creation script
│   │   └── migrate.ts           # Migration script
│   └── server.ts                # Main server file
├── .env                         # Environment variables
├── package.json
├── tsconfig.json
└── README.md
```

## Security

- Passwords are hashed using bcrypt
- JWT tokens for authentication
- Rate limiting on API endpoints
- CORS configured for frontend origin
- Input validation and sanitization

## License

This project is part of the CodeWithEugene platform.
