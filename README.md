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
