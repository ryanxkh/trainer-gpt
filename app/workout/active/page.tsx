'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase, getCurrentUser } from '@/lib/supabase';
import { Exercise, WorkoutSet, Workout } from '@/types';
import { SetLogger } from '@/components/workout/SetLogger';
import { ExerciseCard } from '@/components/workout/ExerciseCard';
import { WorkoutTimer } from '@/components/workout/WorkoutTimer';
import { Button } from '@/components/ui/Button';
import exercisesData from '@/data/exercises.json';

export default function ActiveWorkoutPage() {
  const router = useRouter();
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [loggedSets, setLoggedSets] = useState<WorkoutSet[]>([]);
  const [previousSets, setPreviousSets] = useState<WorkoutSet[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initWorkout();
    loadExercises();
  }, []);

  const initWorkout = async () => {
    try {
      const user = await getCurrentUser();
      if (!user) {
        router.push('/login');
        return;
      }

      // Check for active workout
      const { data: activeWorkout } = await supabase
        .from('workouts')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'in_progress')
        .maybeSingle();

      if (activeWorkout) {
        setWorkout(activeWorkout);
        // Load existing sets
        const { data: sets } = await supabase
          .from('workout_sets')
          .select('*')
          .eq('workout_id', activeWorkout.id)
          .order('timestamp', { ascending: true });
        setLoggedSets(sets || []);
      } else {
        // Create new workout
        const { data: newWorkout } = await supabase
          .from('workouts')
          .insert({ user_id: user.id })
          .select()
          .single();
        setWorkout(newWorkout);
      }
    } catch (error) {
      console.error('Error initializing workout:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadExercises = () => {
    setExercises(exercisesData.exercises as Exercise[]);
  };

  const loadPreviousSets = async (exerciseId: string) => {
    const user = await getCurrentUser();
    if (!user) return;

    // Get previous sets for this exercise (excluding current workout)
    const { data } = await supabase
      .from('workout_sets')
      .select('*, workouts!inner(*)')
      .eq('exercise_id', exerciseId)
      .eq('workouts.user_id', user.id)
      .neq('workout_id', workout?.id || '')
      .order('timestamp', { ascending: false })
      .limit(10);

    setPreviousSets(data || []);
  };

  const handleExerciseSelect = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    loadPreviousSets(exercise.id);
  };

  const handleLogSet = async (setData: Omit<WorkoutSet, 'id' | 'timestamp'>) => {
    if (!workout) return;

    const { data, error } = await supabase
      .from('workout_sets')
      .insert({
        ...setData,
        workout_id: workout.id,
      })
      .select()
      .single();

    if (error) {
      console.error('Error logging set:', error);
      throw error;
    }

    if (data) {
      setLoggedSets((prev) => [...prev, data]);
    }
  };

  const handleCompleteWorkout = async () => {
    if (!workout) return;

    const confirmed = window.confirm('Are you sure you want to complete this workout?');
    if (!confirmed) return;

    await supabase
      .from('workouts')
      .update({ status: 'completed', completed_at: new Date().toISOString() })
      .eq('id', workout.id);

    router.push('/dashboard');
  };

  const filteredExercises = exercises.filter((ex) =>
    ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ex.muscle_group.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading || !workout) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading workout...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center mb-3">
            <h1 className="text-xl font-bold text-gray-900">Active Workout</h1>
            <Button onClick={handleCompleteWorkout} size="sm">
              Complete
            </Button>
          </div>
          <div className="flex justify-between items-center text-sm">
            <p className="text-gray-600">{loggedSets.length} sets logged</p>
            <WorkoutTimer startTime={new Date(workout.started_at)} />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Exercise Selection */}
        {!selectedExercise ? (
          <div className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Search exercises..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>

            <h2 className="font-bold text-lg">Select Exercise</h2>
            <div className="space-y-2">
              {filteredExercises.map((exercise) => (
                <ExerciseCard
                  key={exercise.id}
                  exercise={exercise}
                  onClick={() => handleExerciseSelect(exercise)}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <button
              onClick={() => setSelectedExercise(null)}
              className="text-blue-500 hover:underline"
            >
              ← Change Exercise
            </button>

            <SetLogger
              exercise={selectedExercise}
              previousSets={previousSets}
              onLogSet={handleLogSet}
              currentSetNumber={
                loggedSets.filter((s) => s.exercise_id === selectedExercise.id).length + 1
              }
            />

            {/* Logged Sets for Current Exercise */}
            <div>
              <h3 className="font-bold text-lg mb-3">Today's Sets</h3>
              {loggedSets.filter((s) => s.exercise_id === selectedExercise.id).length === 0 ? (
                <p className="text-gray-600 text-center py-4">
                  No sets logged yet for this exercise
                </p>
              ) : (
                <div className="space-y-2">
                  {loggedSets
                    .filter((s) => s.exercise_id === selectedExercise.id)
                    .map((set) => (
                      <div key={set.id} className="bg-white p-4 rounded-lg shadow">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold">Set {set.set_number}</span>
                          <span className="text-gray-600">
                            {set.weight} lbs × {set.reps} reps (RIR {set.rir})
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
