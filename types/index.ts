// Core exercise and workout types
export interface Exercise {
  id: string;
  name: string;
  muscle_group: string;
  equipment: string;
  difficulty_level?: string;
  substitutes?: string[];
}

export interface WorkoutSet {
  id: string;
  workout_id: string;
  exercise_id: string;
  set_number: number;
  weight?: number;
  reps: number;
  rir?: number; // 0-4 scale (Reps in Reserve)
  notes?: string;
  timestamp: string;
}

export interface Workout {
  id: string;
  user_id: string;
  status: 'in_progress' | 'completed';
  started_at: string;
  completed_at?: string;
  notes?: string;
}

export interface ExerciseFeedback {
  id: string;
  workout_id: string;
  exercise_id: string;
  difficulty?: number; // 1-10 scale
  pump_quality?: number; // 1-10 scale
  soreness?: number; // 1-10 scale
  pain?: boolean;
  notes?: string;
  created_at: string;
}

export interface UserProfile {
  id: string;
  name?: string;
  sex?: 'male' | 'female';
  training_level?: 'beginner' | 'intermediate' | 'advanced';
  training_frequency?: number;
  created_at: string;
}

// Volume landmarks based on Renaissance Periodization research
export interface VolumeLandmark {
  muscle_group: string;
  mv_min: number;  // Maintenance Volume minimum
  mv_max: number;  // Maintenance Volume maximum
  mev_min: number; // Minimum Effective Volume minimum
  mev_max: number; // Minimum Effective Volume maximum
  mav_min: number; // Maximum Adaptive Volume minimum
  mav_max: number; // Maximum Adaptive Volume maximum
  mrv_min: number; // Maximum Recoverable Volume minimum
  mrv_max: number; // Maximum Recoverable Volume maximum
}

// Progression suggestions
export interface ProgressionSuggestion {
  exercise_id: string;
  exercise_name: string;
  suggestion: string;
  reason: string;
  recommended_weight?: number;
  recommended_reps?: number;
}

// LLM Program Generation
export interface ProgramGenerationRequest {
  frequency: number;
  sex: 'male' | 'female';
  goals: string;
  weakPoints?: string;
  training_level?: 'beginner' | 'intermediate' | 'advanced';
}

export interface ProgramExercise {
  name: string;
  sets: number;
  rep_range: string;
  notes?: string;
}

export interface ProgramDay {
  day_number: number;
  focus: string;
  exercises: ProgramExercise[];
}

export interface GeneratedProgram {
  program_name: string;
  split_type: 'PPL' | 'Upper-Lower' | 'Full Body' | 'Bro Split';
  days: ProgramDay[];
  rationale: string;
}

// Analytics
export interface VolumeAnalysis {
  muscleGroup: string;
  currentSets: number;
  landmark: VolumeLandmark;
  status: 'under' | 'optimal' | 'approaching_max' | 'over';
}

export interface ProgressData {
  date: string;
  exercise_name: string;
  weight: number;
  reps: number;
  volume: number; // weight * reps
}
