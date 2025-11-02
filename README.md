# Intelligent Logger - Smart Workout Tracking App

A mobile-first workout tracking application with evidence-based progression suggestions, built for deployment on Webflow Cloud (Cloudflare Workers edge).

## Features

### Core Functionality
- **Smart Set Logging** - Mobile-optimized interface for logging weight, reps, and RIR (Reps in Reserve)
- **Previous Set Reference** - See your last performance while logging
- **Progression Suggestions** - Automatic recommendations based on RIR and performance
- **Volume Analysis** - Track weekly volume against research-backed landmarks
- **Analytics Dashboard** - Visualize progress with charts and volume tracking
- **Exercise Library** - 45+ exercises across all major muscle groups
- **LLM Program Generation** - AI-powered personalized training programs using Claude

### Technical Features
- Next.js 14+ (App Router)
- TypeScript (strict mode)
- Supabase (PostgreSQL + Auth)
- Tailwind CSS (mobile-first)
- PWA support
- Edge-ready (Cloudflare Workers)

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Deployment**: Webflow Cloud (Cloudflare Workers edge)
- **Database**: Supabase (PostgreSQL with REST API)
- **Authentication**: Supabase Auth
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **LLM**: Anthropic Claude API
- **Type Safety**: TypeScript (strict mode)

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account
- Anthropic API key (for program generation)

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd intelligent-logger
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run the schema from `SUPABASE_SCHEMA.sql`
3. Get your project URL and keys from Settings → API

### 3. Configure Environment Variables

Copy `.env.local.example` to `.env.local`:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
ANTHROPIC_API_KEY=your-anthropic-api-key
BASE_URL=/app
ASSETS_PREFIX=/app
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
intelligent-logger/
├── app/
│   ├── (auth)/           # Authentication pages
│   ├── dashboard/        # Main dashboard
│   ├── workout/          # Workout logging & history
│   ├── exercises/        # Exercise library
│   ├── analytics/        # Progress charts
│   └── api/              # API routes
├── components/
│   ├── workout/          # Workout-specific components
│   ├── analytics/        # Chart components
│   └── ui/               # Reusable UI components
├── lib/
│   ├── supabase.ts       # Supabase client
│   ├── auth.ts           # Auth helpers
│   ├── progression.ts    # Progression algorithm
│   └── volume-landmarks.ts # Volume guidelines
├── types/
│   └── index.ts          # TypeScript definitions
├── data/
│   └── exercises.json    # Exercise library
└── public/               # Static assets & PWA files
```

## Usage Guide

### Starting a Workout

1. Log in to your account
2. Click "Start Workout" on the dashboard
3. Select an exercise from the library
4. Log sets with weight, reps, and RIR (0-4 scale)
   - 0 = Failure
   - 1 = 1 rep left
   - 2 = 2 reps left (sweet spot)
   - 3 = 3 reps left
   - 4 = Very easy
5. Continue adding exercises and sets
6. Click "Complete" when finished

### Understanding RIR (Reps in Reserve)

RIR tells the app how close you were to failure:
- **RIR 0-1**: Too easy → App suggests increasing weight
- **RIR 2-3**: Perfect → Optimal for growth
- **RIR 4+**: Too hard → App suggests decreasing weight

### Volume Landmarks

The app uses research-backed volume guidelines:
- **MV** (Maintenance Volume): Minimum to maintain muscle
- **MEV** (Minimum Effective Volume): Minimum to grow
- **MAV** (Maximum Adaptive Volume): Optimal growth zone
- **MRV** (Maximum Recoverable Volume): Upper limit

Analytics shows your current volume vs. these landmarks.

### Progression Suggestions

The app automatically suggests:
- Weight increases (when RIR ≤ 1)
- Weight decreases (when RIR > 3)
- Rep increases (when in optimal RIR 2-3 range)

## Deployment to Webflow Cloud

### Prerequisites

- GitHub account
- Webflow account with Cloud hosting

### Steps

1. **Initialize Git and Push to GitHub**

```bash
git init
git add .
git commit -m "Initial commit - Intelligent Logger MVP"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

2. **Connect to Webflow**

- Go to Webflow Dashboard → Your Site → Hosting → Webflow Cloud
- Click "Connect GitHub Repository"
- Select your repository and branch (main)
- Set build command: `npm run build`
- Set output directory: `.next`

3. **Configure Environment Variables**

In Webflow Dashboard → Environment Variables, add:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ANTHROPIC_API_KEY`
- `BASE_URL=/app`
- `ASSETS_PREFIX=/app`

4. **Deploy**

- Push to main branch
- Webflow will automatically build and deploy
- Access your app at: `yoursite.com/app`

## Database Schema

See `SUPABASE_SCHEMA.sql` for the complete database schema.

### Main Tables

- **user_profiles** - User information and training preferences
- **exercises** - Exercise library with muscle groups
- **workouts** - Workout sessions
- **workout_sets** - Individual sets with weight/reps/RIR
- **exercise_feedback** - Optional per-exercise ratings

## API Routes

### GET `/api/progression`

Get progression suggestion for an exercise.

**Query Params:**
- `exerciseId` - Exercise UUID
- `userId` - User UUID

**Response:**
```json
{
  "exercise_id": "uuid",
  "exercise_name": "Barbell Bench Press",
  "suggestion": "Increase weight",
  "reason": "Last workout averaged 0.8 RIR (too easy)",
  "recommended_weight": 185,
  "recommended_reps": 10
}
```

### POST `/api/generate-program`

Generate a personalized training program using Claude AI.

**Body:**
```json
{
  "frequency": 4,
  "sex": "male",
  "goals": "Build muscle and strength",
  "weakPoints": "Chest and arms",
  "training_level": "intermediate"
}
```

**Response:**
```json
{
  "program_name": "4-Day Upper/Lower Split",
  "split_type": "Upper-Lower",
  "days": [...],
  "rationale": "..."
}
```

## Development

### Key Components

- **SetLogger** - Mobile-optimized set input interface
- **ExerciseCard** - Display exercise information
- **VolumeChart** - Weekly volume visualization
- **ProgressionChart** - Exercise progress over time

### Adding New Exercises

Edit `data/exercises.json`:

```json
{
  "id": "unique-id",
  "name": "Exercise Name",
  "muscle_group": "chest|back|shoulders|...",
  "equipment": "barbell|dumbbell|cable|...",
  "difficulty_level": "beginner|intermediate|advanced",
  "substitutes": ["Alternative 1", "Alternative 2"]
}
```

### Customizing Volume Landmarks

Edit `lib/volume-landmarks.ts` to adjust volume ranges for muscle groups.

## Troubleshooting

### Build Errors

**Issue**: Module not found errors
```bash
npm install
rm -rf .next
npm run build
```

**Issue**: TypeScript errors
- Check `tsconfig.json` is properly configured
- Run `npm run lint` to identify issues

### Supabase Connection Issues

- Verify environment variables are set correctly
- Check Supabase project is active
- Ensure RLS policies are enabled

### Authentication Not Working

- Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Check Supabase Auth is enabled in project settings
- Ensure user_profiles table policies allow INSERT

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Acknowledgments

- Volume landmarks based on Renaissance Periodization research
- Built with Next.js, Supabase, and Anthropic Claude
- Designed for mobile-first workout tracking

## Support

For issues and questions:
- Check the troubleshooting section
- Review Supabase logs
- Check browser console for errors
- Open an issue on GitHub

---

**Built with focus on: Speed, Mobile UX, Evidence-Based Training**
