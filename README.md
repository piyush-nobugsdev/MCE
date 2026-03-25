# Farm Work Marketplace

A responsive web application that connects farmers with agricultural workers. Built with Next.js, Supabase, and Tailwind CSS.

## Features

### For Farmers
- Post job opportunities with detailed descriptions
- Set wages and worker requirements
- Review worker applications
- Track worker attendance
- Manage payments
- View ratings and analytics

### For Workers
- Browse available farm jobs
- Filter by location, category, and wage
- Apply to jobs with custom messages
- Track application status
- View earnings and payments
- Build reputation through ratings

## Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth (Phone OTP)
- **Server Functions**: Next.js Server Actions

## Project Structure

```
app/
├── page.tsx                 # Landing page
├── auth/                    # Authentication flows
│   ├── phone/              # Phone number entry
│   ├── role-selection/     # Choose farmer or worker
│   ├── farmer-signup/      # Farmer profile creation
│   └── worker-signup/      # Worker profile creation
├── farmer/                 # Farmer dashboard
│   ├── dashboard/          # Main dashboard
│   ├── jobs/               # Manage jobs
│   ├── applications/       # Review applications
│   ├── payments/           # Payment history
│   └── components/         # Shared components
└── worker/                 # Worker dashboard
    ├── dashboard/          # Main dashboard
    ├── jobs/               # Browse jobs
    ├── applications/       # Manage applications
    ├── earnings/           # View earnings
    └── components/         # Shared components

lib/
├── supabase/
│   ├── client.ts          # Client-side Supabase
│   └── server.ts          # Server-side Supabase
├── types.ts               # TypeScript types
└── utils.ts               # Utility functions

app/actions/
├── auth.ts                # Authentication actions
├── jobs.ts                # Job management actions
└── attendance.ts          # Attendance tracking actions
```

## Database Schema

### Core Tables
- **users**: Authentication records
- **farmers**: Farmer profiles
- **workers**: Worker profiles
- **jobs**: Job postings
- **job_applications**: Worker applications
- **attendance**: Work attendance records
- **payments**: Payment records
- **ratings**: User ratings
- **reports**: User reports
- **notifications**: User notifications

## Getting Started

### Prerequisites
- Node.js 18+
- Supabase account
- PostgreSQL database (provided by Supabase)

### Setup

1. **Install dependencies**
   ```bash
   pnpm install
   ```

2. **Environment Variables**
   Create a `.env.local` file:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. **Database Setup**
   The database schema is created using the migration script at `scripts/setup-database.sql`. This is executed during project setup.

4. **Run Development Server**
   ```bash
   pnpm dev
   ```
   Open [http://localhost:3000](http://localhost:3000)

## Key Features

### Authentication Flow
- Phone-based authentication using Supabase Auth OTP
- Role selection (Farmer/Worker)
- Profile creation with location data
- Geolocation support for automatic location capture

### Job Management
- Post jobs with detailed descriptions
- Set wages, duration, and worker requirements
- Filter jobs by category, location, and wage
- Real-time job status tracking

### Worker Management
- Review worker applications
- Track attendance with date and hours
- Confirm attendance records
- Build farmer ratings

### Payment System
- Track payments per worker per job
- View payment history
- Payment status management (pending/completed/failed)
- Earnings dashboard for workers

### Mobile Responsive
- Mobile-first design
- Responsive navigation (hamburger menu on mobile)
- Touch-friendly interfaces
- Optimized for all screen sizes

## Security

- Row Level Security (RLS) policies on all tables
- Server-side validation
- Secure authentication via Supabase
- Environment variables for sensitive data
- Parameterized queries to prevent SQL injection

## Future Enhancements

- Real-time notifications with Supabase subscriptions
- SMS notifications for farmers and workers
- Image uploads for job listings
- Dispute resolution system
- Advanced analytics and reporting
- Payment gateway integration
- Review and rating system
- Job recommendation engine

## Support

For issues or questions, please open an issue in the project repository.

## License

MIT License
