import { WorkoutSet, Exercise, ProgressionSuggestion } from '@/types';

/**
 * Calculate progression suggestion based on previous performance
 * Uses RIR (Reps in Reserve) to determine if weight/reps should increase
 *
 * Rules:
 * - If average RIR ≤ 1: Too easy → increase weight by 5lbs
 * - If average RIR > 3: Too hard → decrease weight by 5lbs
 * - If RIR 2-3: Sweet spot → maintain weight, try +1 rep
 */
export function calculateProgression(
  previousSets: WorkoutSet[],
  exercise: Exercise
): ProgressionSuggestion {
  // No previous data
  if (previousSets.length === 0) {
    return {
      exercise_id: exercise.id,
      exercise_name: exercise.name,
      suggestion: 'No previous data',
      reason: 'This is your first time logging this exercise. Start conservative.',
    };
  }

  // Get last workout's sets for this exercise (most recent)
  const lastWorkoutSets = previousSets
    .filter((s) => s.exercise_id === exercise.id)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 5); // Last 5 sets max

  if (lastWorkoutSets.length === 0) {
    return {
      exercise_id: exercise.id,
      exercise_name: exercise.name,
      suggestion: 'No previous data',
      reason: 'This is your first time logging this exercise.',
    };
  }

  // Calculate average RIR
  const setsWithRir = lastWorkoutSets.filter((s) => s.rir !== null && s.rir !== undefined);

  if (setsWithRir.length === 0) {
    return {
      exercise_id: exercise.id,
      exercise_name: exercise.name,
      suggestion: 'No RIR data',
      reason: 'Previous sets missing RIR data. Log RIR for better suggestions.',
    };
  }

  const avgRir = setsWithRir.reduce((sum, s) => sum + (s.rir || 0), 0) / setsWithRir.length;
  const lastWeight = lastWorkoutSets[0].weight || 0;
  const lastReps = lastWorkoutSets[0].reps;

  // Rule-based progression logic
  if (avgRir <= 1) {
    // Too easy - increase weight
    const newWeight = lastWeight + 5;
    return {
      exercise_id: exercise.id,
      exercise_name: exercise.name,
      suggestion: 'Increase weight',
      reason: `Last workout averaged ${avgRir.toFixed(1)} RIR (too easy). Time to progress!`,
      recommended_weight: newWeight,
      recommended_reps: lastReps,
    };
  } else if (avgRir > 3) {
    // Too hard - decrease weight
    const newWeight = Math.max(lastWeight - 5, 0);
    return {
      exercise_id: exercise.id,
      exercise_name: exercise.name,
      suggestion: 'Decrease weight',
      reason: `Last workout averaged ${avgRir.toFixed(1)} RIR (too hard). Back off slightly.`,
      recommended_weight: newWeight,
      recommended_reps: lastReps,
    };
  } else {
    // In sweet spot (RIR 2-3)
    return {
      exercise_id: exercise.id,
      exercise_name: exercise.name,
      suggestion: 'Maintain or add 1 rep',
      reason: `You're in the optimal RIR range (${avgRir.toFixed(1)}). Great work!`,
      recommended_weight: lastWeight,
      recommended_reps: lastReps + 1,
    };
  }
}

/**
 * Detect if user should consider a deload based on recent performance
 * Returns true if multiple indicators suggest fatigue
 */
export function shouldDeload(recentSets: WorkoutSet[], weekNumber: number): {
  shouldDeload: boolean;
  reason: string;
} {
  // Always deload at end of mesocycle (typically week 4-6)
  if (weekNumber >= 4) {
    return {
      shouldDeload: true,
      reason: 'End of mesocycle - time for a deload week to recover',
    };
  }

  // Check for early fatigue indicators
  const setsWithRir = recentSets.filter((s) => s.rir !== null);

  if (setsWithRir.length < 5) {
    return {
      shouldDeload: false,
      reason: 'Not enough data to assess fatigue',
    };
  }

  const avgRir = setsWithRir.reduce((sum, s) => sum + (s.rir || 0), 0) / setsWithRir.length;

  // If average RIR is consistently high (>3.5), user might be accumulating fatigue
  if (avgRir > 3.5) {
    return {
      shouldDeload: true,
      reason: 'Consistently high RIR suggests accumulated fatigue - consider a deload',
    };
  }

  return {
    shouldDeload: false,
    reason: 'Recovery appears adequate - continue training',
  };
}

/**
 * Generate deload recommendations
 */
export function getDeloadRecommendations(): string[] {
  return [
    'Reduce volume by 50% (half the sets)',
    'Reduce intensity by 10-20% (lighter weights)',
    'Maintain same exercises and rep ranges',
    'Keep RIR at 3-4 (don\'t push hard)',
    'Duration: 1 week',
    'After deload, resume normal training and add volume',
  ];
}
