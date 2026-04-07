import { useState } from 'react';
import { format, addDays, subDays } from 'date-fns';
import { useAppStore } from './hooks/useAppStore';
import { BottomNav, Tab } from './components/BottomNav';
import { TodayView } from './views/TodayView';
import { IngredientView } from './views/IngredientView';
import { HistoryView } from './views/HistoryView';

export default function App() {
  const [currentTab, setCurrentTab] = useState<Tab>('today');
  const [viewDate, setViewDate] = useState<Date>(new Date());
  const store = useAppStore();
  
  const viewDateStr = format(viewDate, 'yyyy-MM-dd');
  const viewMenu = store.getMenuByDate(viewDateStr);

  return (
    <div className="min-h-screen bg-stone-100 font-sans text-stone-900 selection:bg-orange-200">
      <main className="mx-auto bg-white min-h-screen shadow-sm max-w-md relative">
        {currentTab === 'today' && (
          <TodayView
            date={viewDateStr}
            dishes={viewMenu.dishes}
            onAddDish={(dish) => store.addDish(viewDateStr, dish)}
            onRemoveDish={(dishId) => store.removeDish(viewDateStr, dishId)}
            onUpdatePhoto={(dishId, photoUrl) => store.updateDishPhoto(viewDateStr, dishId, photoUrl)}
            onPrevDay={() => setViewDate(prev => subDays(prev, 1))}
            onNextDay={() => setViewDate(prev => addDays(prev, 1))}
            onToday={() => setViewDate(new Date())}
          />
        )}
        
        {currentTab === 'ingredients' && (
          <IngredientView
            ingredients={store.ingredients}
            onAdd={store.addIngredient}
            onRemove={store.removeIngredient}
            onUpdateAmount={store.updateIngredientAmount}
          />
        )}
        
        {currentTab === 'history' && (
          <HistoryView menus={store.menus} />
        )}

        <BottomNav currentTab={currentTab} onChange={setCurrentTab} />
      </main>
    </div>
  );
}
