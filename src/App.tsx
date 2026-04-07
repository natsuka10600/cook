import { useState } from 'react';
import { format } from 'date-fns';
import { useAppStore } from './hooks/useAppStore';
import { BottomNav, Tab } from './components/BottomNav';
import { TodayView } from './views/TodayView';
import { IngredientView } from './views/IngredientView';
import { HistoryView } from './views/HistoryView';

export default function App() {
  const [currentTab, setCurrentTab] = useState<Tab>('today');
  const store = useAppStore();
  
  const todayDateStr = format(new Date(), 'yyyy-MM-dd');
  const todayMenu = store.getMenuByDate(todayDateStr);

  return (
    <div className="min-h-screen bg-stone-100 font-sans text-stone-900 selection:bg-orange-200">
      <main className="mx-auto bg-white min-h-screen shadow-sm max-w-md relative">
        {currentTab === 'today' && (
          <TodayView
            date={todayDateStr}
            dishes={todayMenu.dishes}
            onAddDish={(dish) => store.addDish(todayDateStr, dish)}
            onRemoveDish={(dishId) => store.removeDish(todayDateStr, dishId)}
            onUpdatePhoto={(dishId, photoUrl) => store.updateDishPhoto(todayDateStr, dishId, photoUrl)}
          />
        )}
        
        {currentTab === 'ingredients' && (
          <IngredientView
            ingredients={store.ingredients}
            onAdd={store.addIngredient}
            onRemove={store.removeIngredient}
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
