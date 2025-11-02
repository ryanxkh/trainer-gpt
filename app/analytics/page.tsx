'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase, getCurrentUser } from '@/lib/supabase';
import { WorkoutSet, Exercise, VolumeAnalysis, ProgressData } from '@/types';
import { analyzeWeeklyVolume } from '@/lib/volume-landmarks';
import { VolumeChart } from '@/components/analytics/VolumeChart';
import { ProgressionChart } from '@/components/analytics/ProgressionChart';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import exercisesData from '@/data/exercises.json';

export default function AnalyticsPage() {
  const router = useRouter();
  const [volumeAnalysis, setVolumeAnalysis] = useState<VolumeAnalysis[]>([]);
  const [progressionData, setProgressionData] = useState<Map<string, ProgressData[]>>(new Map());
  const [selectedExercise, setSelectedExercise] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const user = await getCurrentUser();
      if (!user) {
        router.push('/login');
        return;
      }

      // Get last 4 weeks of data
      const fourWeeksAgo = new Date();
      fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);

      // Get all sets from last 4 weeks
      const { data: sets } = await supabase
        .from('workout_sets')
        .select('*, workouts!inner(*)')
        .eq('workouts.user_id', user.id)
        .gte('timestamp', fourWeeksAgo.toISOString())
        .order('timestamp', { ascending: true });

      if (!sets) return;

      // Get last 7 days for volume analysis
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const weeklySets = sets.filter(
        (s) => new Date(s.timestamp) >= sevenDaysAgo
      );

      // Analyze volume
      const exercises = exercisesData.exercises as Exercise[];
      const analysis = analyzeWeeklyVolume(weeklySets, exercises);
      setVolumeAnalysis(analysis);

      // Calculate progression data for each exercise
      const progressionMap = new Map<string, ProgressData[]>();
      const exerciseGroups = sets.reduce((acc, set) => {
        if (!acc[set.exercise_id]) {
          acc[set.exercise_id] = [];
        }
        acc[set.exercise_id].push(set);
        return acc;
      }, {} as Record<string, WorkoutSet[]>);

      Object.entries(exerciseGroups).forEach(([exerciseId, exerciseSetsRaw]) => {
        const exerciseSets = exerciseSetsRaw as WorkoutSet[];
        // Group by date and get max weight
        const byDate = exerciseSets.reduce((acc, set) => {
          const date = new Date(set.timestamp).toISOString().split('T')[0];
          if (!acc[date]) {
            acc[date] = [];
          }
          acc[date].push(set);
          return acc;
        }, {} as Record<string, WorkoutSet[]>);

        const progression = Object.entries(byDate).map(([date, dateSets]) => {
          const maxWeightSet = dateSets.reduce((max, set) =>
            (set.weight || 0) > (max.weight || 0) ? set : max
          );
          const totalVolume = dateSets.reduce(
            (sum, set) => sum + (set.weight || 0) * set.reps,
            0
          );

          const exercise = exercises.find((e) => e.id === exerciseId);

          return {
            date,
            exercise_name: exercise?.name || 'Unknown',
            weight: maxWeightSet.weight || 0,
            reps: maxWeightSet.reps,
            volume: totalVolume,
          };
        });

        progressionMap.set(exerciseId, progression);
      });

      setProgressionData(progressionMap);

      // Set first exercise as default
      if (progressionMap.size > 0) {
        setSelectedExercise(Array.from(progressionMap.keys())[0]);
      }
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading analytics...</p>
      </div>
    );
  }

  const selectedProgressionData = selectedExercise
    ? progressionData.get(selectedExercise) || []
    : [];

  const exercises = exercisesData.exercises as Exercise[];
  const exerciseName =
    exercises.find((e) => e.id === selectedExercise)?.name || '';

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
            <button
              onClick={() => router.push('/dashboard')}
              className="text-blue-500 hover:underline"
            >
              Dashboard
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardHeader className="text-sm text-gray-600">Total Muscle Groups</CardHeader>
            <CardContent className="text-3xl font-bold text-gray-900">
              {volumeAnalysis.length}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="text-sm text-gray-600">Tracked Exercises</CardHeader>
            <CardContent className="text-3xl font-bold text-gray-900">
              {progressionData.size}
            </CardContent>
          </Card>
        </div>

        {/* Volume Analysis */}
        <VolumeChart volumeData={volumeAnalysis} />

        {/* Exercise Progression */}
        {progressionData.size > 0 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Exercise for Progression
              </label>
              <select
                value={selectedExercise}
                onChange={(e) => setSelectedExercise(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              >
                {Array.from(progressionData.entries()).map(([exerciseId, data]) => (
                  <option key={exerciseId} value={exerciseId}>
                    {data[0]?.exercise_name || 'Unknown'}
                  </option>
                ))}
              </select>
            </div>

            <ProgressionChart data={selectedProgressionData} exerciseName={exerciseName} />
          </div>
        )}

        {volumeAnalysis.length === 0 && progressionData.size === 0 && (
          <Card>
            <CardContent className="text-center py-12 text-gray-600">
              <p className="text-lg mb-4">No analytics data yet</p>
              <p>Start logging workouts to see your progress and volume analysis!</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
