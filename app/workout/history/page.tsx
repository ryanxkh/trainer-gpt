'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase, getCurrentUser } from '@/lib/supabase';
import { Workout, WorkoutSet, Exercise } from '@/types';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import exercisesData from '@/data/exercises.json';

function WorkoutHistoryContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const workoutId = searchParams.get('id');

  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
  const [workoutSets, setWorkoutSets] = useState<WorkoutSet[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadWorkouts();
  }, []);

  useEffect(() => {
    if (workoutId) {
      loadWorkoutDetails(workoutId);
    }
  }, [workoutId]);

  const loadWorkouts = async () => {
    try {
      const user = await getCurrentUser();
      if (!user) {
        router.push('/login');
        return;
      }

      const { data } = await supabase
        .from('workouts')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'completed')
        .order('completed_at', { ascending: false })
        .limit(30);

      setWorkouts(data || []);
    } catch (error) {
      console.error('Error loading workouts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadWorkoutDetails = async (id: string) => {
    const workout = workouts.find((w) => w.id === id);
    if (workout) {
      setSelectedWorkout(workout);
    }

    const { data } = await supabase
      .from('workout_sets')
      .select('*')
      .eq('workout_id', id)
      .order('timestamp', { ascending: true });

    setWorkoutSets(data || []);
  };

  const getExerciseName = (exerciseId: string) => {
    const exercise = (exercisesData.exercises as Exercise[]).find((e) => e.id === exerciseId);
    return exercise?.name || 'Unknown Exercise';
  };

  // Group sets by exercise
  const groupedSets = workoutSets.reduce((acc, set) => {
    const exerciseId = set.exercise_id;
    if (!acc[exerciseId]) {
      acc[exerciseId] = [];
    }
    acc[exerciseId].push(set);
    return acc;
  }, {} as Record<string, WorkoutSet[]>);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Workout History</h1>
            <button
              onClick={() => router.push('/dashboard')}
              className="text-blue-500 hover:underline"
            >
              Dashboard
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {!selectedWorkout ? (
          // List of workouts
          <div className="space-y-3">
            <h2 className="font-bold text-lg mb-4">Past Workouts</h2>
            {workouts.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8 text-gray-600">
                  No completed workouts yet.
                </CardContent>
              </Card>
            ) : (
              workouts.map((workout) => (
                <Card
                  key={workout.id}
                  onClick={() => {
                    router.push(`/workout/history?id=${workout.id}`);
                    loadWorkoutDetails(workout.id);
                  }}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-gray-900">
                        {new Date(workout.completed_at!).toLocaleDateString('en-US', {
                          weekday: 'long',
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                      <p className="text-sm text-gray-600">
                        {new Date(workout.completed_at!).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                    <span className="text-sm text-gray-500">View Details →</span>
                  </div>
                </Card>
              ))
            )}
          </div>
        ) : (
          // Workout details
          <div className="space-y-6">
            <button
              onClick={() => {
                setSelectedWorkout(null);
                router.push('/workout/history');
              }}
              className="text-blue-500 hover:underline"
            >
              ← Back to History
            </button>

            <Card>
              <CardHeader>Workout Summary</CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-semibold">
                    {new Date(selectedWorkout.completed_at!).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Time:</span>
                  <span className="font-semibold">
                    {new Date(selectedWorkout.completed_at!).toLocaleTimeString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Sets:</span>
                  <span className="font-semibold">{workoutSets.length}</span>
                </div>
              </CardContent>
            </Card>

            <div>
              <h3 className="font-bold text-lg mb-4">Exercises</h3>
              {Object.entries(groupedSets).map(([exerciseId, sets]) => (
                <Card key={exerciseId} className="mb-4">
                  <CardHeader>{getExerciseName(exerciseId)}</CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {sets.map((set) => (
                        <div
                          key={set.id}
                          className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0"
                        >
                          <span className="text-sm text-gray-600">Set {set.set_number}</span>
                          <span className="font-medium">
                            {set.weight} lbs × {set.reps} reps (RIR {set.rir})
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function WorkoutHistoryPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    }>
      <WorkoutHistoryContent />
    </Suspense>
  );
}
