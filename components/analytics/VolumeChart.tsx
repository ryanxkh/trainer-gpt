'use client';

import { VolumeAnalysis } from '@/types';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';

interface VolumeChartProps {
  volumeData: VolumeAnalysis[];
}

export function VolumeChart({ volumeData }: VolumeChartProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'under':
        return 'bg-yellow-500';
      case 'optimal':
        return 'bg-green-500';
      case 'approaching_max':
        return 'bg-orange-500';
      case 'over':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'under':
        return 'Below MEV';
      case 'optimal':
        return 'Optimal (MAV)';
      case 'approaching_max':
        return 'Near MRV';
      case 'over':
        return 'Over MRV';
      default:
        return status;
    }
  };

  return (
    <Card>
      <CardHeader>Weekly Volume by Muscle Group</CardHeader>
      <CardContent className="space-y-4">
        {volumeData.length === 0 ? (
          <p className="text-gray-600 text-center py-4">
            No volume data yet. Start logging workouts!
          </p>
        ) : (
          volumeData.map((data) => (
            <div key={data.muscleGroup} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium capitalize">{data.muscleGroup}</span>
                <span className="text-sm text-gray-600">
                  {data.currentSets} sets
                </span>
              </div>

              {/* Progress Bar */}
              <div className="relative h-8 bg-gray-100 rounded-lg overflow-hidden">
                {/* MAV Range (Optimal) */}
                <div
                  className="absolute h-full bg-green-100"
                  style={{
                    left: `${(data.landmark.mav_min / data.landmark.mrv_max) * 100}%`,
                    width: `${((data.landmark.mav_max - data.landmark.mav_min) / data.landmark.mrv_max) * 100}%`,
                  }}
                />

                {/* Current Volume */}
                <div
                  className={`absolute h-full ${getStatusColor(data.status)} transition-all`}
                  style={{
                    width: `${Math.min((data.currentSets / data.landmark.mrv_max) * 100, 100)}%`,
                  }}
                />

                {/* Labels */}
                <div className="absolute inset-0 flex items-center justify-between px-2 text-xs font-medium">
                  <span className="text-gray-600">0</span>
                  <span className="text-white drop-shadow">
                    {data.currentSets} / {data.landmark.mrv_max}
                  </span>
                </div>
              </div>

              {/* Status and Recommendation */}
              <div className="flex justify-between items-center text-sm">
                <span className={`font-medium ${getStatusColor(data.status)} text-white px-2 py-1 rounded text-xs`}>
                  {getStatusText(data.status)}
                </span>
                <span className="text-gray-600 text-xs">
                  Optimal: {data.landmark.mav_min}-{data.landmark.mav_max} sets
                </span>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
