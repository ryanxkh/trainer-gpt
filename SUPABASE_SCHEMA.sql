-- =====================================================
-- INTELLIGENT LOGGER - SUPABASE DATABASE SCHEMA
-- =====================================================
-- Run this SQL in your Supabase SQL Editor to set up the database

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABLES
-- =====================================================

-- User Profiles (extends Supabase Auth users)
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  sex TEXT CHECK (sex IN ('male', 'female')),
  training_level TEXT CHECK (training_level IN ('beginner', 'intermediate', 'advanced')),
  training_frequency INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Exercises
CREATE TABLE exercises (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  muscle_group TEXT NOT NULL,
  equipment TEXT,
  difficulty_level TEXT,
  substitutes TEXT[], -- Array of substitute exercise names
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Workouts
CREATE TABLE workouts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed')),
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  notes TEXT
);

-- Workout Sets
CREATE TABLE workout_sets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workout_id UUID NOT NULL REFERENCES workouts(id) ON DELETE CASCADE,
  exercise_id UUID NOT NULL REFERENCES exercises(id),
  set_number INTEGER NOT NULL,
  weight DECIMAL(6,2),
  reps INTEGER NOT NULL,
  rir INTEGER CHECK (rir >= 0 AND rir <= 4), -- Reps in Reserve (0-4 scale)
  notes TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Exercise Feedback (per-exercise subjective ratings)
CREATE TABLE exercise_feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workout_id UUID NOT NULL REFERENCES workouts(id) ON DELETE CASCADE,
  exercise_id UUID NOT NULL REFERENCES exercises(id),
  difficulty INTEGER CHECK (difficulty >= 1 AND difficulty <= 10),
  pump_quality INTEGER CHECK (pump_quality >= 1 AND pump_quality <= 10),
  soreness INTEGER CHECK (soreness >= 1 AND soreness <= 10),
  pain BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

CREATE INDEX idx_workouts_user_status ON workouts(user_id, status);
CREATE INDEX idx_workout_sets_workout ON workout_sets(workout_id);
CREATE INDEX idx_workout_sets_exercise_timestamp ON workout_sets(exercise_id, timestamp DESC);
CREATE INDEX idx_exercises_muscle_group ON exercises(muscle_group);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercise_feedback ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- User Profiles
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Workouts
CREATE POLICY "Users can view own workouts" ON workouts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own workouts" ON workouts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own workouts" ON workouts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own workouts" ON workouts
  FOR DELETE USING (auth.uid() = user_id);

-- Workout Sets
CREATE POLICY "Users can view own sets" ON workout_sets
  FOR SELECT USING (
    workout_id IN (SELECT id FROM workouts WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can create sets for own workouts" ON workout_sets
  FOR INSERT WITH CHECK (
    workout_id IN (SELECT id FROM workouts WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can update own sets" ON workout_sets
  FOR UPDATE USING (
    workout_id IN (SELECT id FROM workouts WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can delete own sets" ON workout_sets
  FOR DELETE USING (
    workout_id IN (SELECT id FROM workouts WHERE user_id = auth.uid())
  );

-- Exercise Feedback
CREATE POLICY "Users can view own feedback" ON exercise_feedback
  FOR SELECT USING (
    workout_id IN (SELECT id FROM workouts WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can create feedback for own workouts" ON exercise_feedback
  FOR INSERT WITH CHECK (
    workout_id IN (SELECT id FROM workouts WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can update own feedback" ON exercise_feedback
  FOR UPDATE USING (
    workout_id IN (SELECT id FROM workouts WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can delete own feedback" ON exercise_feedback
  FOR DELETE USING (
    workout_id IN (SELECT id FROM workouts WHERE user_id = auth.uid())
  );

-- Exercises (public read-only)
CREATE POLICY "Anyone can view exercises" ON exercises
  FOR SELECT USING (true);

-- =====================================================
-- SEED DATA (Optional - can be loaded from app)
-- =====================================================

-- Note: Exercise data is stored in /data/exercises.json
-- You can seed exercises by running the seed script or through the app

-- =====================================================
-- USEFUL QUERIES
-- =====================================================

-- Get user's recent workouts with set count
-- SELECT
--   w.*,
--   COUNT(ws.id) as total_sets
-- FROM workouts w
-- LEFT JOIN workout_sets ws ON ws.workout_id = w.id
-- WHERE w.user_id = 'USER_ID'
-- GROUP BY w.id
-- ORDER BY w.completed_at DESC;

-- Get weekly volume by muscle group
-- SELECT
--   e.muscle_group,
--   COUNT(ws.id) as sets_per_week
-- FROM workout_sets ws
-- JOIN exercises e ON e.id = ws.exercise_id
-- JOIN workouts w ON w.id = ws.workout_id
-- WHERE w.user_id = 'USER_ID'
--   AND w.completed_at >= NOW() - INTERVAL '7 days'
-- GROUP BY e.muscle_group;
