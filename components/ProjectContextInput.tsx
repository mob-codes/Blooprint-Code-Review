
import React from 'react';

interface ProjectContextInputProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export const ProjectContextInput: React.FC<ProjectContextInputProps> = ({ value, onChange }) => {
  return (
    <textarea
      value={value}
      onChange={onChange}
      placeholder="e.g., 'This is a React component for a shopping cart checkout page. I'm trying to improve its performance and reusability.'"
      className="w-full h-24 p-4 font-sans text-sm text-slate-300 bg-base-100 border border-slate-700 rounded-lg focus:ring-2 focus:ring-brand-accent focus:outline-none transition-shadow resize-y"
      spellCheck="false"
    />
  );
};
