'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase, getCurrentUser } from '@/lib/supabase';
import { Workout } from '@/types';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';

export default function DashboardPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [recentWorkouts, setRecentWorkouts] = useState<Workout[]>([]);
  const [activeWorkout, setActiveWorkout] = useState<Workout | null>(null);

  useEffect(() => {
    checkAuth();
    loadData();
  }, []);

  const checkAuth = async () => {
    const user = await getCurrentUser();
    if (!user) {
      router.push('/login');
    }
  };

  const loadData = async () => {
    try {
      const user = await getCurrentUser();
      if (!user) return;

      // Check for active workout
      const { data: active } = await supabase
        .from('workouts')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'in_progress')
        .maybeSingle();

      setActiveWorkout(active);

      // Load recent completed workouts
      const { data: workouts } = await supabase
        .from('workouts')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'completed')
        .order('completed_at', { ascending: false })
        .limit(5);

      setRecentWorkouts(workouts || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const startWorkout = async () => {
    const user = await getCurrentUser();
    if (!user) return;

    const { data } = await supabase
      .from('workouts')
      .insert({ user_id: user.id })
      .select()
      .single();

    if (data) {
      router.push('/workout/active');
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

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
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <button
              onClick={handleSignOut}
              className="text-gray-600 hover:text-gray-900 text-sm"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Active Workout Alert */}
        {activeWorkout && (
          <Card className="bg-green-50 border-2 border-green-500">
            <CardHeader className="text-green-900">
              Workout in Progress
            </CardHeader>
            <CardContent>
              <p className="text-green-700 mb-3">
                You have an active workout started at{' '}
                {new Date(activeWorkout.started_at).toLocaleTimeString()}
              </p>
              <Button onClick={() => router.push('/workout/active')}>
                Continue Workout
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Button
            onClick={startWorkout}
            disabled={!!activeWorkout}
            size="lg"
            fullWidth
            className="!h-24 !text-lg"
          >
            {activeWorkout ? 'Workout Active' : 'Start Workout'}
          </Button>
          <Button
            onClick={() => router.push('/exercises')}
            variant="secondary"
            size="lg"
            fullWidth
            className="!h-24 !text-lg"
          >
            Exercise Library
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Button
            onClick={() => router.push('/analytics')}
            variant="secondary"
            fullWidth
            size="lg"
          >
            Analytics
          </Button>
          <Button
            onClick={() => router.push('/workout/history')}
            variant="secondary"
            fullWidth
            size="lg"
          >
            History
          </Button>
        </div>

        {/* Recent Workouts */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Workouts</h2>
          {recentWorkouts.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8 text-gray-600">
                No workouts yet. Start your first workout to begin tracking!
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {recentWorkouts.map((workout) => (
                <Card
                  key={workout.id}
                  onClick={() => router.push(`/workout/history?id=${workout.id}`)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-gray-900">
                        {new Date(workout.completed_at!).toLocaleDateString('en-US', {
                          weekday: 'long',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </p>
                      <p className="text-sm text-gray-600">
                        {new Date(workout.completed_at!).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm text-gray-500">View Details →</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
