import { useState, useMemo } from 'react';
import { format, parseISO, startOfMonth, endOfMonth, eachWeekOfInterval, startOfWeek, endOfWeek, isSameMonth, isSameWeek } from 'date-fns';
import { zhTW } from 'date-fns/locale';
import { Download, ChevronDown, ChevronRight, ImageIcon } from 'lucide-react';
import { DailyMenu } from '../types';
import { cn } from '../lib/utils';

interface HistoryViewProps {
  menus: DailyMenu[];
}

export function HistoryView({ menus }: HistoryViewProps) {
  const [selectedMonthStr, setSelectedMonthStr] = useState<string>(() => format(new Date(), 'yyyy-MM'));
  const [expandedWeek, setExpandedWeek] = useState<string | null>(null);

  // Get unique months from menus, plus current month
  const availableMonths = useMemo(() => {
    const months = new Set<string>();
    months.add(format(new Date(), 'yyyy-MM'));
    menus.forEach(m => {
      months.add(format(parseISO(m.date), 'yyyy-MM'));
    });
    return Array.from(months).sort().reverse();
  }, [menus]);

  const selectedMonthDate = parseISO(`${selectedMonthStr}-01`);

  // Get weeks for the selected month
  const weeksInMonth = useMemo(() => {
    const start = startOfMonth(selectedMonthDate);
    const end = endOfMonth(selectedMonthDate);
    return eachWeekOfInterval({ start, end }, { weekStartsOn: 1 }); // Start on Monday
  }, [selectedMonthDate]);

  const handleExport = () => {
    const dataStr = JSON.stringify(menus, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `meal-records-${format(new Date(), 'yyyy-MM-dd')}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="p-4 pb-24 max-w-md mx-auto min-h-screen bg-stone-50">
      <header className="mb-6 pt-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-stone-800">歷史紀錄</h1>
        <button
          onClick={handleExport}
          className="flex items-center gap-1 text-sm text-stone-600 bg-white border border-stone-200 px-3 py-1.5 rounded-lg hover:bg-stone-50 transition-colors"
        >
          <Download className="w-4 h-4" />
          匯出
        </button>
      </header>

      <div className="mb-6">
        <select
          value={selectedMonthStr}
          onChange={(e) => {
            setSelectedMonthStr(e.target.value);
            setExpandedWeek(null);
          }}
          className="w-full bg-white border border-stone-200 text-stone-800 text-lg font-medium rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-200 appearance-none"
        >
          {availableMonths.map(m => (
            <option key={m} value={m}>
              {format(parseISO(`${m}-01`), 'yyyy年 MM月', { locale: zhTW })}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-3">
        {weeksInMonth.map((weekStart, index) => {
          const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
          const weekKey = format(weekStart, 'yyyy-MM-dd');
          const isExpanded = expandedWeek === weekKey;

          // Filter menus for this week
          const weekMenus = menus.filter(m => {
            const date = parseISO(m.date);
            return isSameWeek(date, weekStart, { weekStartsOn: 1 });
          }).sort((a, b) => a.date.localeCompare(b.date));

          return (
            <div key={weekKey} className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
              <button
                onClick={() => setExpandedWeek(isExpanded ? null : weekKey)}
                className="w-full px-4 py-4 flex items-center justify-between bg-white hover:bg-stone-50 transition-colors"
              >
                <div className="text-left">
                  <h3 className="font-semibold text-stone-800">第 {index + 1} 週</h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    {format(weekStart, 'MM/dd')} - {format(weekEnd, 'MM/dd')}
                  </p>
                </div>
                <div className="flex items-center gap-3 text-stone-400">
                  <span className="text-xs bg-stone-100 px-2 py-1 rounded-md">
                    {weekMenus.length} 天有紀錄
                  </span>
                  {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                </div>
              </button>

              {isExpanded && (
                <div className="border-t border-stone-100 bg-stone-50/50 p-4 max-h-[60vh] overflow-y-auto">
                  {weekMenus.length === 0 ? (
                    <p className="text-center text-stone-400 py-4 text-sm">這週沒有紀錄</p>
                  ) : (
                    <div className="space-y-6">
                      {weekMenus.map(menu => (
                        <div key={menu.date} className="space-y-2">
                          <h4 className="font-medium text-stone-700 text-sm border-b border-stone-200 pb-1">
                            {format(parseISO(menu.date), 'MM/dd EEEE', { locale: zhTW })}
                          </h4>
                          {menu.dishes.length === 0 ? (
                            <p className="text-xs text-stone-400 italic">無餐點</p>
                          ) : (
                            <ul className="space-y-2">
                              {menu.dishes.map(dish => (
                                <li key={dish.id} className="bg-white p-2.5 rounded-lg border border-stone-100 flex gap-3">
                                  {dish.photoUrl ? (
                                    <img src={dish.photoUrl} alt={dish.name} className="w-12 h-12 rounded object-cover shrink-0" />
                                  ) : (
                                    <div className="w-12 h-12 rounded bg-stone-100 flex items-center justify-center shrink-0 text-stone-300">
                                      <ImageIcon className="w-5 h-5" />
                                    </div>
                                  )}
                                  <div className="flex flex-col justify-center">
                                    <span className="text-xs font-medium text-orange-600 mb-0.5">{dish.type}</span>
                                    <span className="text-sm text-stone-800">{dish.name}</span>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
