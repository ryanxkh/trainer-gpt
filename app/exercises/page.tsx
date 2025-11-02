'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Exercise } from '@/types';
import { ExerciseCard } from '@/components/workout/ExerciseCard';
import exercisesData from '@/data/exercises.json';

export default function ExercisesPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<string>('all');

  const exercises = exercisesData.exercises as Exercise[];

  // Get unique muscle groups
  const muscleGroups = ['all', ...Array.from(new Set(exercises.map((e) => e.muscle_group)))];

  // Filter exercises
  const filteredExercises = exercises.filter((ex) => {
    const matchesSearch =
      ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ex.muscle_group.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ex.equipment.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesMuscleGroup =
      selectedMuscleGroup === 'all' || ex.muscle_group === selectedMuscleGroup;

    return matchesSearch && matchesMuscleGroup;
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Exercise Library</h1>
            <button
              onClick={() => router.push('/dashboard')}
              className="text-blue-500 hover:underline"
            >
              Dashboard
            </button>
          </div>

          {/* Search */}
          <input
            type="text"
            placeholder="Search exercises..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 mb-3"
          />

          {/* Muscle Group Filter */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
            {muscleGroups.map((group) => (
              <button
                key={group}
                onClick={() => setSelectedMuscleGroup(group)}
                className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap ${
                  selectedMuscleGroup === group
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {group === 'all' ? 'All' : group.charAt(0).toUpperCase() + group.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <p className="text-gray-600 mb-4">
          {filteredExercises.length} exercise{filteredExercises.length !== 1 ? 's' : ''} found
        </p>

        <div className="space-y-3">
          {filteredExercises.map((exercise) => (
            <ExerciseCard key={exercise.id} exercise={exercise} showDetails />
          ))}
        </div>

        {filteredExercises.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No exercises found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
