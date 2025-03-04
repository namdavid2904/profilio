# Portfolio Website

A 3D interactive portfolio website built with React, Three.js, and Node.js.

## Features

- Interactive 3D elements using Three.js
- Responsive design
- GitHub project showcase
- Contact form
- Admin dashboard for managing content
- PostgreSQL database with Prisma ORM
- Docker containerization for easy deployment

## Tech Stack

### Frontend
- React
- TypeScript
- Three.js / React Three Fiber
- Framer Motion
- Tailwind CSS
- GSAP for animations

### Backend
- Node.js
- Express
- PostgreSQL
- Prisma ORM

### Deployment
- Docker
- GitHub Actions

## Development

### Prerequisites
- Node.js (v20+)
- Docker and Docker Compose (for containerized development)
- PostgreSQL (if running locally without Docker)

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/namdavid2904/portfolio.git
   cd portfolio
2. Install dependencies

   a. Install root dependencies
   ```bash
   npm install
   ```
   b. Install client dependencies
   ```bash
   cd client && npm install
   ```
   c. Install server dependencies
   ```bash
   cd ../server && npm install
   ```
3. Set up environment variables

   a. Client
   ```bash
   cp client/.env.example client/.env
   ```
   b. Server
   ```bash
   cp server/.env.example server/.env
   ```

4. Set up PostgreSQL
   a. Using Docker
   ```bash
   docker run --name portfolio-postgres -e POSTGRES_PASSWORD=password -e POSTGRES_USER=postgres -e POSTGRES_DB=portfolio -p 5432:5432 -d postgres:14
   ```
   b. Using local PostgreSQL
   This can be done by creating database named "portfolio"

5. Run database migrations
   ```bash
   cd server
   npm run migrate
   ```