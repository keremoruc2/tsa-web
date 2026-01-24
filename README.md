# TAUT - Turkish Association at University of Twente

🇹🇷 Official website for the Turkish Association at University of Twente (TAUT).

## Features

- **Home Page**: Welcoming hero section with information about the association
- **About Page**: Mission, values, and activities of TAUT
- **Events Page**: Upcoming events with scrollable grid and past events gallery
- **Join Us Page**: Membership application form with email notifications
- **Contact Page**: Contact information, social media links, and FAQ
- **Responsive Design**: Mobile-first approach with Turkish Red/White theme
- **Database Integration**: PostgreSQL with Prisma ORM for events and membership requests

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Database**: PostgreSQL with [Prisma](https://www.prisma.io/)
- **Email**: Nodemailer for form notifications

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database (or use a cloud service like [Neon](https://neon.tech/), [Supabase](https://supabase.com/), or [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres))

### Installation

1. **Clone the repository**
   ```bash
   cd tsa-web
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your database connection string and SMTP settings:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/taut_db?schema=public"
   
   # Optional - for email notifications
   SMTP_HOST="smtp.gmail.com"
   SMTP_PORT="587"
   SMTP_USER="your-email@gmail.com"
   SMTP_PASS="your-app-password"
   ADMIN_EMAIL="info@taut.nl"
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Run migrations
   npx prisma migrate dev --name init
   
   # (Optional) Seed with sample data
   npm run db:seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run db:studio` | Open Prisma Studio (database GUI) |
| `npm run db:seed` | Seed database with sample data |
| `npx prisma migrate dev` | Create and run migrations |

## Project Structure

```
tsa-web/
├── prisma/
│   └── schema.prisma      # Database schema
├── public/
│   └── manifest.json      # PWA manifest
├── scripts/
│   └── seed.ts            # Database seeding script
├── src/
│   ├── app/
│   │   ├── api/           # API routes
│   │   │   ├── events/    # Events API
│   │   │   └── join/      # Membership form API
│   │   ├── about/         # About page
│   │   ├── contact/       # Contact page
│   │   ├── events/        # Events page
│   │   ├── join/          # Join Us page
│   │   ├── globals.css    # Global styles
│   │   ├── layout.tsx     # Root layout
│   │   └── page.tsx       # Home page
│   ├── components/
│   │   ├── AboutPage.tsx
│   │   ├── ContactPage.tsx
│   │   ├── EventsPage.tsx
│   │   ├── HomePage.tsx
│   │   ├── JoinPage.tsx
│   │   ├── Layout.tsx     # Navbar & Footer
│   │   └── ScrollableEventGrid.tsx
│   ├── lib/
│   │   ├── email.ts       # Email utilities
│   │   ├── events.ts      # Event queries
│   │   └── prisma.ts      # Prisma client
│   ├── types/
│   │   └── events.ts      # TypeScript types
│   └── utils/
│       └── date.ts        # Date formatting
├── .env.example
├── package.json
├── tailwind.config.js
└── tsconfig.json
```

## Database Schema

### Event
- `id`: Auto-incrementing primary key
- `title`: Event name
- `date`: Event date/time
- `time`: Display time string
- `dateTBA`: Whether date is TBA
- `venue`: Venue name
- `location`: Location address
- `description`: Event description
- `image`: Image URL
- `gallery`: Gallery links (comma-separated)
- `hidden`: Whether event is hidden

### MembershipRequest
- `id`: CUID primary key
- `name`: Full name
- `email`: Email address
- `phone`: Phone number
- `university`: University/school
- `studyProgram`: Study program
- `interests`: Why they want to join
- `emailSent`: Whether notification was sent

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the repository in [Vercel](https://vercel.com/)
3. Add environment variables in Project Settings
4. Deploy!

Vercel will automatically:
- Build the Next.js application
- Run Prisma migrations (via `postinstall` script)
- Set up serverless functions for API routes

### Environment Variables for Production

Set these in your Vercel project settings:

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `SMTP_HOST` | SMTP server hostname |
| `SMTP_PORT` | SMTP port (usually 587) |
| `SMTP_USER` | SMTP username/email |
| `SMTP_PASS` | SMTP password/app password |
| `ADMIN_EMAIL` | Email to receive membership notifications |

## Color Theme

The website uses the Turkish flag colors:

- **Turkish Red**: `#E30A17`
- **White**: `#FFFFFF`

These are defined in `tailwind.config.js` and `globals.css`.

## Email Configuration

### Gmail Setup

1. Enable 2-Factor Authentication on your Google account
2. Generate an App Password: Google Account → Security → App passwords
3. Use the app password as `SMTP_PASS`

### Development Mode

Without SMTP configuration, emails are logged to the console instead of being sent.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is private and intended for TAUT use only.

---

Built with ❤️ for the Turkish community at University of Twente

🇹🇷 Hoşgeldiniz - Welcome! 🇳🇱
