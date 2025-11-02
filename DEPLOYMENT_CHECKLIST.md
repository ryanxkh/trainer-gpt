# Deployment Checklist - Intelligent Logger

Use this checklist to ensure a smooth deployment to Webflow Cloud.

## Pre-Deployment Setup

### 1. Supabase Configuration

- [ ] Create Supabase project at [supabase.com](https://supabase.com)
- [ ] Run `SUPABASE_SCHEMA.sql` in SQL Editor
- [ ] Verify all tables created successfully
- [ ] Check RLS policies are enabled
- [ ] Get Project URL from Settings → API
- [ ] Get `anon` key from Settings → API
- [ ] Get `service_role` key from Settings → API
- [ ] Test authentication works (create test user)

### 2. Anthropic API

- [ ] Sign up at [console.anthropic.com](https://console.anthropic.com)
- [ ] Create API key
- [ ] Test API key with a simple request
- [ ] Note: Program generation feature requires this

### 3. Database Seeding

- [ ] Install tsx: `npm install -D tsx`
- [ ] Set environment variables in `.env.local`
- [ ] Run seed script: `npx tsx scripts/seed-supabase.ts`
- [ ] Verify exercises appear in Supabase dashboard
- [ ] Test exercise search in app

### 4. Local Testing

- [ ] Run `npm install` (ensure all dependencies installed)
- [ ] Run `npm run dev`
- [ ] Test user registration
- [ ] Test user login
- [ ] Start a workout
- [ ] Log at least 3 sets
- [ ] Complete workout
- [ ] View workout history
- [ ] Check analytics page
- [ ] Test exercise library search
- [ ] Test on mobile viewport (Chrome DevTools)
- [ ] Test all major flows work

### 5. Build Testing

- [ ] Run `npm run build` locally
- [ ] Fix any TypeScript errors
- [ ] Fix any build warnings
- [ ] Ensure build completes successfully
- [ ] Test production build: `npm start`

## GitHub Setup

- [ ] Create new GitHub repository
- [ ] Initialize git: `git init`
- [ ] Add all files: `git add .`
- [ ] Commit: `git commit -m "Initial commit - Intelligent Logger MVP"`
- [ ] Set main branch: `git branch -M main`
- [ ] Add remote: `git remote add origin <your-repo-url>`
- [ ] Push: `git push -u origin main`
- [ ] Verify all files pushed to GitHub

## Webflow Cloud Deployment

### 1. Connect Repository

- [ ] Log in to Webflow
- [ ] Navigate to your site
- [ ] Go to Hosting → Webflow Cloud
- [ ] Click "Connect GitHub Repository"
- [ ] Authorize GitHub access
- [ ] Select repository
- [ ] Select branch (main)

### 2. Configure Build Settings

- [ ] Set build command: `npm run build`
- [ ] Set output directory: `.next`
- [ ] Set install command: `npm install`
- [ ] Set Node version: 18.x or higher

### 3. Environment Variables

Add these in Webflow Dashboard → Environment Variables:

- [ ] `NEXT_PUBLIC_SUPABASE_URL` = Your Supabase project URL
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` = Your Supabase anon key
- [ ] `SUPABASE_SERVICE_ROLE_KEY` = Your Supabase service role key
- [ ] `ANTHROPIC_API_KEY` = Your Anthropic API key
- [ ] `BASE_URL` = `/app`
- [ ] `ASSETS_PREFIX` = `/app`

### 4. Deploy

- [ ] Click "Deploy" or push to main branch
- [ ] Monitor build logs for errors
- [ ] Wait for deployment to complete
- [ ] Check deployment status shows "Live"

## Post-Deployment Testing

### 1. Basic Functionality

- [ ] Visit deployed URL: `yoursite.com/app`
- [ ] Homepage loads correctly
- [ ] Click "Sign Up" - registration page loads
- [ ] Create new account
- [ ] Email confirmation (if enabled)
- [ ] Login with new account
- [ ] Dashboard loads correctly

### 2. Core Features

- [ ] Start workout button works
- [ ] Exercise library loads
- [ ] Select an exercise
- [ ] Set logger interface displays
- [ ] Previous sets show (if available)
- [ ] Log multiple sets
- [ ] Values save correctly
- [ ] Complete workout
- [ ] Workout appears in history

### 3. Analytics

- [ ] Navigate to analytics page
- [ ] Volume charts display (after logging workouts)
- [ ] Progression charts work
- [ ] Data is accurate

### 4. Mobile Testing

- [ ] Test on actual mobile device
- [ ] Touch targets are large enough
- [ ] Keyboard doesn't break layout
- [ ] Scrolling works smoothly
- [ ] Set logging is easy to use
- [ ] PWA install prompt appears (optional)

### 5. Performance

- [ ] Page load time < 3 seconds
- [ ] Set logging response time < 1 second
- [ ] No console errors
- [ ] No broken images
- [ ] Navigation is smooth

## Troubleshooting

### Build Fails

- Check build logs in Webflow dashboard
- Verify all environment variables are set
- Ensure package.json dependencies are correct
- Test build locally first

### Database Connection Issues

- Verify Supabase URL is correct
- Check API keys are valid
- Ensure RLS policies allow operations
- Test Supabase connection locally

### Authentication Not Working

- Verify Supabase Auth is enabled
- Check email confirmation settings
- Ensure user_profiles table policies correct
- Test signup/login locally

### Features Not Working

- Check browser console for errors
- Verify API routes are accessible
- Ensure all environment variables set
- Check Supabase table permissions

## Optional Enhancements

- [ ] Add custom domain
- [ ] Set up SSL certificate
- [ ] Configure CDN settings
- [ ] Add monitoring/analytics
- [ ] Set up error tracking (Sentry)
- [ ] Configure backup schedule
- [ ] Add rate limiting
- [ ] Implement caching strategy

## Maintenance

- [ ] Document admin credentials
- [ ] Set up monitoring alerts
- [ ] Plan for database backups
- [ ] Schedule dependency updates
- [ ] Monitor Supabase usage
- [ ] Monitor API usage (Anthropic)

## Success Criteria

Your deployment is successful when:

- ✅ Users can register and login
- ✅ Users can log workouts with sets
- ✅ Previous set data displays correctly
- ✅ Analytics show volume and progression
- ✅ Mobile UX is smooth and responsive
- ✅ All core features work on production
- ✅ No critical errors in console
- ✅ Performance meets targets (< 3s load time)

---

**Deployment Complete!** 🚀

Share your app at: `yoursite.com/app`
