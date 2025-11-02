import { VolumeLandmark, VolumeAnalysis, WorkoutSet, Exercise } from '@/types';

/**
 * Volume landmarks based on Renaissance Periodization research
 * MV = Maintenance Volume (minimum to maintain muscle)
 * MEV = Minimum Effective Volume (minimum to grow)
 * MAV = Maximum Adaptive Volume (optimal growth zone)
 * MRV = Maximum Recoverable Volume (upper limit before overtraining)
 *
 * All values are in sets per week
 */
export const VOLUME_LANDMARKS: Record<string, VolumeLandmark> = {
  chest: {
    muscle_group: 'chest',
    mv_min: 2,
    mv_max: 4,
    mev_min: 4,
    mev_max: 6,
    mav_min: 6,
    mav_max: 16,
    mrv_min: 16,
    mrv_max: 24,
  },
  back: {
    muscle_group: 'back',
    mv_min: 2,
    mv_max: 6,
    mev_min: 6,
    mev_max: 8,
    mav_min: 8,
    mav_max: 20,
    mrv_min: 20,
    mrv_max: 26,
  },
  quads: {
    muscle_group: 'quads',
    mv_min: 2,
    mv_max: 4,
    mev_min: 4,
    mev_max: 6,
    mav_min: 6,
    mav_max: 14,
    mrv_min: 14,
    mrv_max: 18,
  },
  hamstrings: {
    muscle_group: 'hamstrings',
    mv_min: 2,
    mv_max: 4,
    mev_min: 4,
    mev_max: 6,
    mav_min: 6,
    mav_max: 12,
    mrv_min: 12,
    mrv_max: 16,
  },
  shoulders: {
    muscle_group: 'shoulders',
    mv_min: 2,
    mv_max: 6,
    mev_min: 6,
    mev_max: 8,
    mav_min: 8,
    mav_max: 24,
    mrv_min: 24,
    mrv_max: 30,
  },
  biceps: {
    muscle_group: 'biceps',
    mv_min: 0,
    mv_max: 4,
    mev_min: 4,
    mev_max: 8,
    mav_min: 8,
    mav_max: 20,
    mrv_min: 20,
    mrv_max: 26,
  },
  triceps: {
    muscle_group: 'triceps',
    mv_min: 0,
    mv_max: 4,
    mev_min: 4,
    mev_max: 6,
    mav_min: 6,
    mav_max: 16,
    mrv_min: 16,
    mrv_max: 20,
  },
  glutes: {
    muscle_group: 'glutes',
    mv_min: 2,
    mv_max: 4,
    mev_min: 4,
    mev_max: 6,
    mav_min: 6,
    mav_max: 14,
    mrv_min: 14,
    mrv_max: 18,
  },
  calves: {
    muscle_group: 'calves',
    mv_min: 2,
    mv_max: 6,
    mev_min: 6,
    mev_max: 8,
    mav_min: 8,
    mav_max: 16,
    mrv_min: 16,
    mrv_max: 20,
  },
  abs: {
    muscle_group: 'abs',
    mv_min: 0,
    mv_max: 4,
    mev_min: 0,
    mev_max: 4,
    mav_min: 4,
    mav_max: 12,
    mrv_min: 12,
    mrv_max: 20,
  },
};

/**
 * Get volume landmark for a specific muscle group
 */
export function getVolumeLandmark(muscleGroup: string): VolumeLandmark | null {
  return VOLUME_LANDMARKS[muscleGroup.toLowerCase()] || null;
}

/**
 * Analyze weekly volume and compare to landmarks
 * Returns status for each muscle group
 */
export function analyzeWeeklyVolume(
  sets: WorkoutSet[],
  exercises: Exercise[]
): VolumeAnalysis[] {
  // Group sets by muscle group
  const volumeByMuscle: Record<string, number> = {};

  sets.forEach((set) => {
    const exercise = exercises.find((e) => e.id === set.exercise_id);
    if (exercise) {
      const muscle = exercise.muscle_group.toLowerCase();
      volumeByMuscle[muscle] = (volumeByMuscle[muscle] || 0) + 1;
    }
  });

  // Compare to landmarks
  return Object.entries(volumeByMuscle).map(([muscle, setCount]) => {
    const landmark = getVolumeLandmark(muscle);

    if (!landmark) {
      return {
        muscleGroup: muscle,
        currentSets: setCount,
        landmark: {
          muscle_group: muscle,
          mv_min: 0,
          mv_max: 0,
          mev_min: 0,
          mev_max: 0,
          mav_min: 0,
          mav_max: 0,
          mrv_min: 0,
          mrv_max: 0,
        },
        status: 'optimal' as const,
      };
    }

    let status: 'under' | 'optimal' | 'approaching_max' | 'over' = 'optimal';

    if (setCount < landmark.mev_min) {
      status = 'under';
    } else if (setCount >= landmark.mav_min && setCount <= landmark.mav_max) {
      status = 'optimal';
    } else if (setCount > landmark.mav_max && setCount < landmark.mrv_max) {
      status = 'approaching_max';
    } else if (setCount >= landmark.mrv_max) {
      status = 'over';
    }

    return {
      muscleGroup: muscle,
      currentSets: setCount,
      landmark,
      status,
    };
  });
}

/**
 * Get recommendation based on volume status
 */
export function getVolumeRecommendation(analysis: VolumeAnalysis): string {
  switch (analysis.status) {
    case 'under':
      return `Add ${analysis.landmark.mev_min - analysis.currentSets} more sets to reach minimum effective volume`;
    case 'optimal':
      return 'Volume is in the optimal range for growth';
    case 'approaching_max':
      return 'Approaching maximum recoverable volume - consider maintaining current volume';
    case 'over':
      return 'Volume exceeds recovery capacity - reduce sets or consider a deload';
    default:
      return 'Unknown status';
  }
}
