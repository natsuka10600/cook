import { Calendar, Refrigerator, Clock } from 'lucide-react';
import { cn } from '../lib/utils';

export type Tab = 'today' | 'ingredients' | 'history';

interface BottomNavProps {
  currentTab: Tab;
  onChange: (tab: Tab) => void;
}

export function BottomNav({ currentTab, onChange }: BottomNavProps) {
  const tabs = [
    { id: 'today', label: '今日菜單', icon: Calendar },
    { id: 'ingredients', label: '冰箱庫存', icon: Refrigerator },
    { id: 'history', label: '歷史紀錄', icon: Clock },
  ] as const;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 pb-safe">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto">
        {tabs.map(({ id, label, icon: Icon }) => {
          const isActive = currentTab === id;
          return (
            <button
              key={id}
              onClick={() => onChange(id)}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors",
                isActive ? "text-orange-600" : "text-stone-400 hover:text-stone-600"
              )}
            >
              <Icon className="w-6 h-6" strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-medium">{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
