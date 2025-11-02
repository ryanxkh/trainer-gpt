'use client';

import { useState, useEffect } from 'react';

interface WorkoutTimerProps {
  startTime: Date;
}

export function WorkoutTimer({ startTime }: WorkoutTimerProps) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const diff = Math.floor((now.getTime() - startTime.getTime()) / 1000);
      setElapsed(diff);
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  const hours = Math.floor(elapsed / 3600);
  const minutes = Math.floor((elapsed % 3600) / 60);
  const seconds = elapsed % 60;

  return (
    <div className="text-center">
      <p className="text-xs text-gray-600 mb-1">Workout Duration</p>
      <p className="text-2xl font-mono font-bold text-gray-900">
        {hours > 0 && `${hours}:`}
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </p>
    </div>
  );
}
