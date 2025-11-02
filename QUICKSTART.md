# Quick Start Guide - Intelligent Logger

Get your Intelligent Logger app running in 15 minutes!

## Step 1: Set Up Supabase (5 minutes)

1. **Create a Supabase project**
   - Go to [supabase.com](https://supabase.com)
   - Click "New Project"
   - Choose a name, database password, and region

2. **Run the database schema**
   - Go to SQL Editor in Supabase dashboard
   - Copy all contents from `SUPABASE_SCHEMA.sql`
   - Paste and click "Run"
   - Verify tables appear in Table Editor

3. **Get your credentials**
   - Go to Settings → API
   - Copy:
     - Project URL
     - `anon` public key
     - `service_role` secret key (click "Reveal")

## Step 2: Configure Environment (2 minutes)

1. **Update `.env.local`** (already exists in project)

   Replace the placeholder values with your actual credentials:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-actual-anon-key-here
   SUPABASE_SERVICE_ROLE_KEY=your-actual-service-role-key
   ANTHROPIC_API_KEY=your-anthropic-api-key (optional for now)
   BASE_URL=/app
   ASSETS_PREFIX=/app
   ```

2. **Get Anthropic API key** (Optional - for AI program generation)
   - Visit [console.anthropic.com](https://console.anthropic.com)
   - Create API key
   - Add to `.env.local`

## Step 3: Seed Exercise Database (2 minutes)

```bash
# Install the TypeScript executor
npm install -D tsx

# Run the seed script
npx tsx scripts/seed-supabase.ts
```

You should see: `✅ Successfully seeded 45 exercises!`

## Step 4: Run the App (1 minute)

```bash
# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser!

## Step 5: Test Core Features (5 minutes)

### Create Account
1. Click "Sign Up"
2. Enter name, email, password
3. Click "Sign Up"
4. You'll be redirected to the dashboard

### Log Your First Workout
1. Click "Start Workout"
2. Search for "Barbell Bench Press"
3. Click on the exercise
4. Log a set:
   - Weight: 135 lbs
   - Reps: 10
   - RIR: 2 (click the "2" button)
5. Click "Log Set"
6. Log 2-3 more sets
7. Click "← Change Exercise" to add another exercise
8. When done, click "Complete"

### View Your Progress
1. Go back to Dashboard
2. Click "Analytics"
3. See your volume by muscle group
4. Select an exercise to view progression chart

## What You Built

### ✅ Features Included

**Core Functionality**
- User authentication (sign up, login, logout)
- Active workout logging with mobile-optimized interface
- Exercise library with 45+ exercises
- Previous set reference while logging
- Workout history tracking
- Analytics dashboard with charts
- Volume analysis based on research
- Progression suggestions

**Technical Features**
- Next.js 14+ (App Router)
- TypeScript (strict mode)
- Supabase (PostgreSQL + Auth)
- Tailwind CSS (mobile-first)
- PWA ready
- Edge-ready (Cloudflare Workers)
- AI program generation (Claude API)

### 📁 Project Structure

```
intelligent-logger/
├── app/                    # Next.js app router pages
│   ├── (auth)/            # Login & Register
│   ├── dashboard/         # Main dashboard
│   ├── workout/           # Active workout & history
│   ├── exercises/         # Exercise library
│   ├── analytics/         # Progress charts
│   └── api/               # API routes
├── components/            # Reusable React components
├── lib/                   # Core logic & utilities
├── types/                 # TypeScript definitions
├── data/                  # Exercise library JSON
└── public/                # Static assets & PWA

📊 45 exercises across 10 muscle groups
🎨 Mobile-first responsive design
🔒 Row-level security enabled
📈 Volume landmarks from RP research
```

## Next Steps

### Deploy to Production

Follow `DEPLOYMENT_CHECKLIST.md` to deploy to Webflow Cloud

### Customize

- Add more exercises to `data/exercises.json`
- Adjust volume landmarks in `lib/volume-landmarks.ts`
- Customize progression rules in `lib/progression.ts`
- Add your own branding/colors in `tailwind.config.ts`

### Optional Enhancements

- Add exercise videos/images
- Implement workout templates
- Add body measurements tracking
- Create social sharing features
- Add exercise substitution AI
- Implement progressive overload calculator

## Troubleshooting

**Can't log in?**
- Check Supabase URL and keys in `.env.local`
- Verify Supabase Auth is enabled

**No exercises showing?**
- Run seed script: `npx tsx scripts/seed-supabase.ts`
- Check Supabase Table Editor for exercises

**Build fails?**
- Run `npm install`
- Delete `.next` folder: `rm -rf .next`
- Try build again: `npm run build`

**Need help?**
- Check `README.md` for detailed documentation
- Review `DEPLOYMENT_CHECKLIST.md` for deployment
- Check browser console for errors

## Success! 🎉

You now have a fully functional workout tracking app with:
- Smart progression suggestions
- Volume tracking
- Analytics dashboard
- Mobile-optimized interface
- AI program generation

**Ready to track your gains!** 💪
