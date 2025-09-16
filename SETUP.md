# Sports Training Platform Setup Guide

## Overview
This is a comprehensive sports training platform built with Next.js, TypeScript, Tailwind CSS, and Supabase. It allows coaches to create drills, assign them to athletes, and track progress.

## Features Implemented

### Authentication System
- ✅ Coach and Athlete login pages
- ✅ Session management with localStorage
- ✅ Protected routes with authentication checks
- ✅ Context-based state management

### Database Schema
- ✅ Coaches table with credentials
- ✅ Athletes table with credentials
- ✅ Drills table with coach foreign key
- ✅ Coach-Athletes relationship table
- ✅ Drill assignments table with status tracking

### Coach Features
- ✅ Dashboard with real-time statistics
- ✅ Drill creation with video upload support
- ✅ Athlete management and drill assignment
- ✅ Progress tracking and review system

### Athlete Features
- ✅ Dashboard with personal statistics
- ✅ View assigned drills
- ✅ Submit drill completions
- ✅ Progress reports and feedback

## Setup Instructions

### 1. Environment Setup
Create a `.env.local` file with your Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 2. Database Setup
1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Run the contents of `database_schema.sql` to create all tables and sample data

### 3. Storage Setup (Optional)
1. In Supabase dashboard, go to Storage
2. Create a bucket named `drill-videos`
3. Set appropriate policies for authenticated uploads

### 4. Install Dependencies
```bash
npm install
```

### 5. Run Development Server
```bash
npm run dev
```

## Sample Credentials

### Coaches
- **Coach 1**: username: `coach1`, password: `password123` (Cricket specialist)
- **Coach 2**: username: `coach2`, password: `password123` (Badminton specialist)
- **Coach 3**: username: `coach3`, password: `password123` (Football specialist)

### Athletes
- **Athlete 1**: username: `athlete1`, password: `password123` (Arjun Sharma - Cricket)
- **Athlete 2**: username: `athlete2`, password: `password123` (Priya Patel - Badminton)
- **Athlete 3**: username: `athlete3`, password: `password123` (Rahul Kumar - Football)
- And 5 more athletes (athlete4-athlete8)

## Key Components

### Authentication
- `src/lib/auth.ts` - Authentication utilities
- `src/contexts/AuthContext.tsx` - React context for auth state
- `src/components/LoginForm.tsx` - Reusable login component

### Database
- `src/lib/supabase.ts` - Supabase client and type definitions
- `database_schema.sql` - Complete database schema

### Pages
- `/coach/login` - Coach authentication
- `/coach/dashboard` - Coach main dashboard
- `/coach/upload` - Create new drills
- `/coach/assign` - Assign drills to athletes
- `/athlete/login` - Athlete authentication
- `/athlete/dashboard` - Athlete main dashboard

## Database Relationships

```
coaches (1) → (many) drills
coaches (1) → (many) coach_athletes → (1) athletes
coaches (1) → (many) drill_assignments
athletes (1) → (many) drill_assignments
drills (1) → (many) drill_assignments
```

## Next Steps for Full Implementation

1. **Athlete Drill View**: Complete `/athlete/drills` page to show assigned drills
2. **Drill Submission**: Complete `/athlete/submit` page for video submissions
3. **Coach Review**: Complete `/coach/review` page for reviewing submissions
4. **Progress Reports**: Complete `/athlete/report` page
5. **Video Player**: Add video playback functionality
6. **Search & Filter**: Add search/filter capabilities
7. **Notifications**: Real-time notifications for assignments
8. **Analytics**: Advanced progress analytics and charts

## Technologies Used
- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage (for videos)
- **Authentication**: Custom authentication with Supabase

## Project Structure
```
src/
├── app/                    # Next.js app router
│   ├── coach/             # Coach-specific pages
│   ├── athlete/           # Athlete-specific pages
│   └── layout.tsx         # Root layout with auth provider
├── components/            # Reusable components
├── contexts/              # React contexts
├── lib/                   # Utilities and configurations
database_schema.sql        # Database setup script
```
