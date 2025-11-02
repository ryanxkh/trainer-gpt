'use client';

import { useState, useEffect } from 'react';
import { WorkoutSet, Exercise } from '@/types';
import { Button } from '@/components/ui/Button';

interface SetLoggerProps {
  exercise: Exercise;
  previousSets: WorkoutSet[];
  onLogSet: (setData: Omit<WorkoutSet, 'id' | 'timestamp'>) => Promise<void>;
  currentSetNumber?: number;
}

export function SetLogger({
  exercise,
  previousSets,
  onLogSet,
  currentSetNumber = 1,
}: SetLoggerProps) {
  const [setNumber, setSetNumber] = useState(currentSetNumber);
  const [weight, setWeight] = useState(0);
  const [reps, setReps] = useState(10);
  const [rir, setRir] = useState<number>(2);
  const [isLogging, setIsLogging] = useState(false);

  // Auto-populate from previous workout
  useEffect(() => {
    if (previousSets.length > 0) {
      const lastSet = previousSets[0];
      setWeight(lastSet.weight || 0);
      setReps(lastSet.reps);
      setRir(lastSet.rir || 2);
    }
  }, [previousSets]);

  const handleLogSet = async () => {
    setIsLogging(true);
    try {
      await onLogSet({
        workout_id: '', // Will be set by parent
        exercise_id: exercise.id,
        set_number: setNumber,
        weight,
        reps,
        rir,
        notes: '',
      });
      setSetNumber((prev) => prev + 1);
    } catch (error) {
      console.error('Error logging set:', error);
    } finally {
      setIsLogging(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-xl">{exercise.name}</h3>
        <span className="text-sm text-gray-500">{exercise.muscle_group}</span>
      </div>

      {/* Previous Set Reference */}
      {previousSets.length > 0 && (
        <div className="bg-blue-50 p-3 rounded-lg text-sm border border-blue-200">
          <p className="text-blue-900 font-medium mb-1">Last time:</p>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <p className="text-xs text-blue-700">Weight</p>
              <p className="font-bold text-blue-900">{previousSets[0].weight} lbs</p>
            </div>
            <div>
              <p className="text-xs text-blue-700">Reps</p>
              <p className="font-bold text-blue-900">{previousSets[0].reps}</p>
            </div>
            <div>
              <p className="text-xs text-blue-700">RIR</p>
              <p className="font-bold text-blue-900">{previousSets[0].rir}</p>
            </div>
          </div>
        </div>
      )}

      {/* Current Set Number */}
      <div className="text-center py-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600 mb-1">Current Set</p>
        <p className="text-4xl font-bold text-gray-900">{setNumber}</p>
      </div>

      {/* Weight Input - Large touch targets */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Weight (lbs)
        </label>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setWeight((w) => Math.max(0, w - 5))}
            className="bg-gray-200 px-6 py-4 rounded-lg text-2xl font-bold hover:bg-gray-300 active:bg-gray-400 min-w-[70px]"
          >
            -5
          </button>
          <input
            type="number"
            inputMode="decimal"
            value={weight}
            onChange={(e) => setWeight(Number(e.target.value))}
            className="flex-1 text-center text-3xl font-bold border-2 border-gray-300 rounded-lg py-4 focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={() => setWeight((w) => w + 5)}
            className="bg-gray-200 px-6 py-4 rounded-lg text-2xl font-bold hover:bg-gray-300 active:bg-gray-400 min-w-[70px]"
          >
            +5
          </button>
        </div>
      </div>

      {/* Reps Input */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Reps</label>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setReps((r) => Math.max(1, r - 1))}
            className="bg-gray-200 px-6 py-4 rounded-lg text-2xl font-bold hover:bg-gray-300 active:bg-gray-400 min-w-[70px]"
          >
            -1
          </button>
          <input
            type="number"
            inputMode="numeric"
            value={reps}
            onChange={(e) => setReps(Number(e.target.value))}
            className="flex-1 text-center text-3xl font-bold border-2 border-gray-300 rounded-lg py-4 focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={() => setReps((r) => r + 1)}
            className="bg-gray-200 px-6 py-4 rounded-lg text-2xl font-bold hover:bg-gray-300 active:bg-gray-400 min-w-[70px]"
          >
            +1
          </button>
        </div>
      </div>

      {/* RIR Selector - Large touch targets */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          RIR (Reps in Reserve)
        </label>
        <div className="grid grid-cols-5 gap-2">
          {[0, 1, 2, 3, 4].map((value) => (
            <button
              key={value}
              onClick={() => setRir(value)}
              className={`py-5 rounded-lg font-bold text-xl transition-colors ${
                rir === value
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {value}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-500 text-center mt-2">
          0 = Failure, 4 = Very Easy
        </p>
      </div>

      {/* Log Set Button */}
      <Button
        onClick={handleLogSet}
        disabled={isLogging}
        fullWidth
        size="lg"
        className="!py-5 !text-xl"
      >
        {isLogging ? 'Logging...' : 'Log Set'}
      </Button>
    </div>
  );
}
