import React, { useState, useRef } from 'react';
import { format, isToday } from 'date-fns';
import { zhTW } from 'date-fns/locale';
import { Plus, Camera, Trash2, Image as ImageIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { Dish, MealType } from '../types';
import { cn } from '../lib/utils';

interface TodayViewProps {
  date: string;
  dishes: Dish[];
  onAddDish: (dish: Omit<Dish, 'id'>) => void;
  onRemoveDish: (dishId: string) => void;
  onUpdatePhoto: (dishId: string, photoUrl: string) => void;
  onPrevDay: () => void;
  onNextDay: () => void;
  onToday: () => void;
}

const MEAL_TYPES: MealType[] = ['早餐', '午餐', '晚餐', '點心'];

export function TodayView({ date, dishes, onAddDish, onRemoveDish, onUpdatePhoto, onPrevDay, onNextDay, onToday }: TodayViewProps) {
  const [addingType, setAddingType] = useState<MealType | null>(null);
  const [newDishName, setNewDishName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeDishId, setActiveDishId] = useState<string | null>(null);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newDishName.trim() && addingType) {
      onAddDish({ name: newDishName.trim(), type: addingType });
      setNewDishName('');
      setAddingType(null);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && activeDishId) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdatePhoto(activeDishId, reader.result as string);
      };
      reader.readAsDataURL(file);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setActiveDishId(null);
  };

  const triggerFileInput = (dishId: string) => {
    setActiveDishId(dishId);
    fileInputRef.current?.click();
  };

  return (
    <div className="p-4 pb-24 max-w-md mx-auto min-h-screen bg-stone-50">
      <header className="mb-6 pt-4 flex items-start justify-between">
        <div className="flex items-center gap-2">
          <button onClick={onPrevDay} className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-200 rounded-full transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-stone-800">
              {format(new Date(date), 'MM月dd日 EEEE', { locale: zhTW })}
            </h1>
            <p className="text-stone-500 text-sm mt-1">
              {isToday(new Date(date)) ? '今天的料理計畫' : '料理計畫'}
            </p>
          </div>
          <button onClick={onNextDay} className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-200 rounded-full transition-colors">
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
        {!isToday(new Date(date)) && (
          <button onClick={onToday} className="text-sm text-orange-600 font-medium bg-orange-50 hover:bg-orange-100 px-3 py-1.5 rounded-lg transition-colors">
            回到今日
          </button>
        )}
      </header>

      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={fileInputRef}
        onChange={handlePhotoUpload}
      />

      <div className="space-y-6">
        {MEAL_TYPES.map(type => {
          const mealDishes = dishes.filter(d => d.type === type);
          return (
            <section key={type} className="bg-white rounded-2xl p-4 shadow-sm border border-stone-100">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold text-stone-700 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-orange-400"></span>
                  {type}
                </h2>
                <button
                  onClick={() => setAddingType(type)}
                  className="p-1.5 text-orange-600 hover:bg-orange-50 rounded-full transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              {addingType === type && (
                <form onSubmit={handleAddSubmit} className="mb-3 flex gap-2">
                  <input
                    type="text"
                    autoFocus
                    placeholder="輸入料理名稱..."
                    value={newDishName}
                    onChange={e => setNewDishName(e.target.value)}
                    className="flex-1 bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200"
                  />
                  <button
                    type="submit"
                    disabled={!newDishName.trim()}
                    className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
                  >
                    新增
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAddingType(null);
                      setNewDishName('');
                    }}
                    className="text-stone-400 px-2"
                  >
                    取消
                  </button>
                </form>
              )}

              {mealDishes.length === 0 && addingType !== type ? (
                <p className="text-stone-400 text-sm italic py-2 text-center">尚未規劃</p>
              ) : (
                <ul className="space-y-3">
                  {mealDishes.map(dish => (
                    <li key={dish.id} className="group flex flex-col gap-2 p-3 rounded-xl bg-stone-50 border border-stone-100">
                      <div className="flex justify-between items-start">
                        <span className="font-medium text-stone-800">{dish.name}</span>
                        <div className="flex items-center gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => triggerFileInput(dish.id)}
                            className="p-1.5 text-stone-400 hover:text-orange-600 rounded-lg hover:bg-white"
                            title="上傳照片"
                          >
                            <Camera className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onRemoveDish(dish.id)}
                            className="p-1.5 text-stone-400 hover:text-red-500 rounded-lg hover:bg-white"
                            title="刪除"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      {dish.photoUrl ? (
                        <div className="relative w-full h-32 rounded-lg overflow-hidden mt-1">
                          <img src={dish.photoUrl} alt={dish.name} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <button
                          onClick={() => triggerFileInput(dish.id)}
                          className="w-full h-12 rounded-lg border border-dashed border-stone-300 flex items-center justify-center text-stone-400 hover:text-stone-600 hover:border-stone-400 hover:bg-stone-100/50 transition-colors text-xs gap-1 mt-1"
                        >
                          <ImageIcon className="w-4 h-4" />
                          <span>新增照片紀錄</span>
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
