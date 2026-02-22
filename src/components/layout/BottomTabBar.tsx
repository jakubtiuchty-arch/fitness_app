import { Home, Calendar, BarChart3, Settings } from 'lucide-react';

interface BottomTabBarProps {
  activeTab: string;
  onChange: (tab: string) => void;
}

export function BottomTabBar({ activeTab, onChange }: BottomTabBarProps) {
  const tabs = [
    { id: 'today', icon: Home, label: 'Dzisiaj' },
    { id: 'schedule', icon: Calendar, label: 'Plan' },
    { id: 'stats', icon: BarChart3, label: 'Postępy' },
    { id: 'settings', icon: Settings, label: 'Ustawienia' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-ios-glass backdrop-blur-xl border-t border-ios-gray4/50 pb-safe">
      <div className="flex items-center justify-around h-[68px] px-2 max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className="flex flex-col items-center justify-center w-16 h-full gap-1"
            >
              <Icon 
                size={24} 
                className={`transition-colors duration-200 ${isActive ? 'text-ios-primary' : 'text-ios-gray'}`}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span className={`text-[10px] font-medium transition-colors duration-200 ${isActive ? 'text-ios-primary' : 'text-ios-gray'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}