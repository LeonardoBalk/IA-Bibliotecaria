interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showPercentage?: boolean;
}

export default function ProgressBar({ 
  value, 
  max = 100, 
  label, 
  showPercentage = true 
}: ProgressBarProps) {
  const percentage = Math.round((value / max) * 100);

  return (
    <div className="w-full">
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-2">
          {label && (
            <span className="text-sm font-medium text-light-text dark:text-dark-text">
              {label}
            </span>
          )}
          {showPercentage && (
            <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
              {percentage}%
            </span>
          )}
        </div>
      )}
      <div className="w-full h-2 bg-light-border dark:bg-dark-border rounded-full overflow-hidden">
        <div 
          className="h-full bg-neuro-green transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
