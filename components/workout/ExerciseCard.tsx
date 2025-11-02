'use client';

import { Exercise } from '@/types';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';

interface ExerciseCardProps {
  exercise: Exercise;
  onClick?: () => void;
  showDetails?: boolean;
}

export function ExerciseCard({
  exercise,
  onClick,
  showDetails = false,
}: ExerciseCardProps) {
  return (
    <Card onClick={onClick} className="hover:border-blue-500 border-2 border-transparent">
      <CardHeader className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="font-semibold text-lg">{exercise.name}</h3>
          <div className="flex gap-2 mt-1">
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
              {exercise.muscle_group}
            </span>
            <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
              {exercise.equipment}
            </span>
          </div>
        </div>
      </CardHeader>

      {showDetails && exercise.substitutes && (
        <CardContent className="mt-3 pt-3 border-t border-gray-200">
          <p className="text-xs text-gray-600 mb-1">Substitutes:</p>
          <div className="flex flex-wrap gap-1">
            {exercise.substitutes.map((sub, idx) => (
              <span
                key={idx}
                className="text-xs bg-gray-50 text-gray-600 px-2 py-1 rounded"
              >
                {sub}
              </span>
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  );
}
