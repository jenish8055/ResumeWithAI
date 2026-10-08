import React from 'react';

export default function ProgressBar({
  value = 0,
  max = 100,
  showLabel = false,
  size = 'md', // 'sm' | 'md' | 'lg'
  color = 'brand', // 'brand' | 'emerald' | 'amber' | 'blue'
  className = '',
}) {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)));

  const sizeClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  const colorClasses = {
    brand: 'bg-gradient-to-r from-orange-400 to-brand-500',
    emerald: 'bg-gradient-to-r from-emerald-400 to-emerald-600',
    amber: 'bg-gradient-to-r from-amber-400 to-orange-500',
    blue: 'bg-gradient-to-r from-sky-400 to-blue-600',
  };

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center text-xs font-semibold mb-1 text-neutral-600 dark:text-neutral-300">
          <span>Progress</span>
          <span>{percentage}%</span>
        </div>
      )}
      <div className={`w-full bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden ${sizeClasses[size]}`}>
        <div
          className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
