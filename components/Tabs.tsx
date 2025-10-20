
import React from 'react';

interface TabProps {
  label: string;
  active: boolean;
  onClick: () => void;
  disabled?: boolean;
}

const Tab: React.FC<TabProps> = ({ label, active, onClick, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2 focus:ring-offset-base-200
      ${
        active
          ? 'bg-base-200 border-b-2 border-brand-accent text-white'
          : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
      }
      ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
    `}
  >
    {label}
  </button>
);

interface TabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  tabs: { id: string; label: string; disabled?: boolean }[];
}

export const Tabs: React.FC<TabsProps> = ({ activeTab, setActiveTab, tabs }) => {
  return (
    <div className="border-b border-slate-700">
      <nav className="-mb-px flex space-x-2" aria-label="Tabs">
        {tabs.map((tab) => (
          <Tab
            key={tab.id}
            label={tab.label}
            active={activeTab === tab.id}
            onClick={() => !tab.disabled && setActiveTab(tab.id)}
            disabled={tab.disabled}
          />
        ))}
      </nav>
    </div>
  );
};
