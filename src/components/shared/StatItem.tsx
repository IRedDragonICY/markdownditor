import React from 'react';

interface StatItemProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
}

export const StatItem: React.FC<StatItemProps> = ({ label, value, icon }) => {
  return (
    <div className="flex items-center space-x-1.5 text-sm text-[var(--color-text-muted)] p-1">
      {icon && <span className="opacity-70">{icon}</span>}
      <span className="hidden sm:inline">{label}:</span>
      <span className="font-mono font-medium text-[var(--color-text-main)]">{value}</span>
    </div>
  );
};
