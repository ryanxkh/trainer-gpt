/**
 * Seed Script - Populate Supabase with Exercise Data
 *
 * Run with: npx tsx scripts/seed-supabase.ts
 * Requires: npm install -D tsx
 */

import { createClient } from '@supabase/supabase-js';
import exercisesData from '../data/exercises.json';

// Load from environment or prompt
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Error: Missing Supabase credentials');
  console.error('Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function seedExercises() {
  console.log('🌱 Seeding exercises to Supabase...\n');

  try {
    // Check if exercises already exist
    const { count, error: countError } = await supabase
      .from('exercises')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      throw countError;
    }

    if (count && count > 0) {
      console.log(`⚠️  Database already has ${count} exercises.`);
      const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout,
      });

      const answer = await new Promise<string>((resolve) => {
        readline.question('Do you want to delete and re-seed? (yes/no): ', resolve);
      });
      readline.close();

      if (answer.toLowerCase() !== 'yes') {
        console.log('Seeding cancelled.');
        return;
      }

      // Delete existing exercises
      console.log('Deleting existing exercises...');
      const { error: deleteError } = await supabase.from('exercises').delete().neq('id', '00000000-0000-0000-0000-000000000000');

      if (deleteError) {
        throw deleteError;
      }
    }

    // Insert exercises (let Supabase generate UUIDs)
    const exercisesToInsert = exercisesData.exercises.map((ex) => ({
      name: ex.name,
      muscle_group: ex.muscle_group,
      equipment: ex.equipment,
      difficulty_level: ex.difficulty_level || 'intermediate',
      substitutes: ex.substitutes || [],
    }));

    console.log(`Inserting ${exercisesToInsert.length} exercises...`);

    const { data, error } = await supabase.from('exercises').insert(exercisesToInsert);

    if (error) {
      throw error;
    }

    console.log(`✅ Successfully seeded ${exercisesToInsert.length} exercises!\n`);

    // Show summary by muscle group
    const byMuscleGroup = exercisesToInsert.reduce((acc, ex) => {
      acc[ex.muscle_group] = (acc[ex.muscle_group] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    console.log('📊 Exercises by muscle group:');
    Object.entries(byMuscleGroup)
      .sort((a, b) => b[1] - a[1])
      .forEach(([muscle, count]) => {
        console.log(`   ${muscle.padEnd(15)} ${count} exercises`);
      });

  } catch (error: any) {
    console.error('❌ Error seeding database:', error.message);
    process.exit(1);
  }
}

// Run the seed function
seedExercises()
  .then(() => {
    console.log('\n✨ Seeding complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
