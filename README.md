# TSA TWENTE - Turkish Student Association

🇹🇷 Official website for TSA TWENTE - Turkish Student Association at University of Twente.

## Features

- **Home Page**: Welcoming hero section with upcoming events preview
- **About Page**: Mission, values, and activities of TSA TWENTE
- **Events Page**: Upcoming events with featured section, past events gallery
- **Join Us Page**: Membership sign-up form with email confirmations
- **Contact Page**: Contact information, social media links, and FAQ
- **Admin Panel**: Secure login, events management (CRUD), membership requests viewer
- **Responsive Design**: Mobile-first approach with Turkish Red/White theme

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Database**: PostgreSQL with [Prisma](https://www.prisma.io/)
- **Email**: [Resend](https://resend.com/) for transactional emails
- **Image Storage**: [Vercel Blob](https://vercel.com/docs/storage/vercel-blob)
- **Data Fetching**: SWR for client-side data

## Database Schema

| Table | Purpose |
|-------|---------|
| `User` | Admin users with roles (SUPERADMIN, ADMIN, EDITOR) |
| `Session` | Login sessions with expiry |
| `Event` | Upcoming events with date, time, venue, description, image |
| `PastEvent` | Past events with gallery support |
| `MembershipRequest` | Sign-up form submissions |

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database (or use [Supabase](https://supabase.com/), [Neon](https://neon.tech/), or [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres))

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your credentials:
   ```env
   DATABASE_URL="postgresql://..."
   RESEND_API_KEY="re_..."
   ADMIN_EMAIL="tsatwente@gmail.com"
   BLOB_READ_WRITE_TOKEN="vercel_blob_..."
   ```

3. **Push database schema**
   ```bash
   npx prisma db push
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **First-time admin setup**
   - Go to `/admin`
   - Login with `admin` / `admin`
   - This creates the initial SUPERADMIN user
   - **Important**: Change the password immediately!

## Setting Up Services

### Database (Supabase - Recommended)

1. Create account at [supabase.com](https://supabase.com/)
2. Create a new project
3. Go to Settings > Database
4. Copy the "Connection string (URI)" 
5. Replace `[YOUR-PASSWORD]` with your database password
6. Add to `.env` as `DATABASE_URL`

### Email (Resend)

1. Create account at [resend.com](https://resend.com/)
2. Go to API Keys > Create API Key
3. Copy the key and add to `.env` as `RESEND_API_KEY`
4. For production: verify your domain in Resend dashboard

### Image Storage (Vercel Blob)

1. Deploy to Vercel
2. Go to Storage > Create Database > Blob
3. Blob storage is automatically connected when deployed to Vercel
4. For local development: copy the token from Storage > Settings

## Admin Panel

Access at `/admin`:

- **Events**: Add, edit, delete upcoming and past events
- **Members**: View membership requests and email status
- **Users**: (Superadmin only) Manage admin users

### User Roles

| Role | Permissions |
|------|-------------|
| SUPERADMIN | Full access, manage users |
| ADMIN | Manage events and members |
| EDITOR | Edit events only |

## Deployment to Vercel

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard:
   - `DATABASE_URL`
   - `RESEND_API_KEY`
   - `RESEND_FROM_EMAIL`
   - `ADMIN_EMAIL`
4. Create Blob storage in Vercel (Storage > Blob)
5. Deploy!

## Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run db:push      # Push schema changes to database
npm run db:studio    # Open Prisma Studio (database GUI)
```

## Project Structure

```
tsa-web/
├── prisma/
│   └── schema.prisma      # Database schema
├── public/
│   └── images/            # Static images (logo)
├── src/
│   ├── app/
│   │   ├── admin/         # Admin pages
│   │   ├── api/           # API routes
│   │   └── ...            # Public pages
│   ├── components/        # React components
│   ├── lib/               # Utilities (auth, email, prisma)
│   └── types/             # TypeScript types
└── .env                   # Environment variables
```

## License

Private - TSA TWENTE © 2026
