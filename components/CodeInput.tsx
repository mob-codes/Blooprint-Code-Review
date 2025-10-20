
import React from 'react';

interface CodeInputProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export const CodeInput: React.FC<CodeInputProps> = ({ value, onChange }) => {
  return (
    <textarea
      value={value}
      onChange={onChange}
      placeholder="function helloWorld() { console.log('Hello, Developer!'); }"
      className="w-full h-64 p-4 font-mono text-sm text-slate-300 bg-base-100 border border-slate-700 rounded-lg focus:ring-2 focus:ring-brand-accent focus:outline-none transition-shadow resize-y"
      spellCheck="false"
    />
  );
};
