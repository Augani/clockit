# Clockit - Time Tracking Application

Clockit is a modern web application built with Next.js that helps teams and organizations track work hours, manage projects, and maintain accountability in remote work environments.

## Features

- 🕒 **Time Tracking**: Easy clock in/out functionality with break management
- 📊 **Detailed Reports**: Generate comprehensive time and project reports
- 👥 **Team Management**: Monitor team members' activities and working hours
- 📱 **Responsive Design**: Works seamlessly across desktop and mobile devices
- 🌐 **Multilingual Support**: Available in multiple languages
- 🔒 **Secure Authentication**: Built-in authentication system

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS + Material-UI
- **Authentication**: NextAuth.js
- **Database**: PostgreSQL with Prisma ORM
- **Charts**: Recharts
- **Internationalization**: next-intl
- **Type Safety**: TypeScript

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/yourusername/clockit.git
cd clockit
```

2. Install dependencies:
```bash
npm install
```

3. Set up your environment variables:
```bash
cp .env.example .env.local
```

4. Set up the database:
```bash
npx prisma generate
npx prisma db push
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `/src/app` - Application pages and routing
- `/src/components` - Reusable UI components
- `/src/i18n` - Internationalization configuration
- `/prisma` - Database schema and migrations
- `/public` - Static assets
- `/theme` - Theme configuration

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Creator

Augustus Otu - Founder & Lead Developer

## Support

For support, please open an issue in the GitHub repository or contact the development team.

## Docker Setup

### Option 1: Pull from Docker Hub

```bash
# Pull the image
docker pull augustusotu/clockit:latest

# Create a .env file with your environment variables
cp .env.example .env

# Run the container
docker-compose up -d
```

### Option 2: Build Locally

```bash
# Clone the repository
git clone https://github.com/yourusername/clockit.git
cd clockit

# Build the image
docker build -t clockit .

# Run with docker-compose
docker-compose up -d
```

### Environment Variables

Make sure to set up these environment variables in your `.env` file:

```env
# Database
POSTGRES_USER=clockit_user
POSTGRES_PASSWORD=your_secure_password
POSTGRES_DB=clockit_db
DATABASE_URL=postgresql://clockit_user:your_secure_password@db:5432/clockit_db

# Next Auth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret

# OAuth (if using)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### Docker Commands

```bash
# Start the application
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the application
docker-compose down

# Rebuild the application
docker-compose up -d --build
```
