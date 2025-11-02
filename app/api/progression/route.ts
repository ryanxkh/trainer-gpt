import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { calculateProgression } from '@/lib/progression';
import exercisesData from '@/data/exercises.json';
import { Exercise } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const exerciseId = searchParams.get('exerciseId');
    const userId = searchParams.get('userId');

    if (!exerciseId || !userId) {
      return NextResponse.json(
        { error: 'Missing exerciseId or userId' },
        { status: 400 }
      );
    }

    // Get recent sets for this exercise
    const { data: sets, error } = await supabase
      .from('workout_sets')
      .select('*, workouts!inner(*)')
      .eq('exercise_id', exerciseId)
      .eq('workouts.user_id', userId)
      .order('timestamp', { ascending: false })
      .limit(20);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Get exercise details
    const exercises = exercisesData.exercises as Exercise[];
    const exercise = exercises.find((e) => e.id === exerciseId);

    if (!exercise) {
      return NextResponse.json({ error: 'Exercise not found' }, { status: 404 });
    }

    const suggestion = calculateProgression(sets || [], exercise);

    return NextResponse.json(suggestion);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
