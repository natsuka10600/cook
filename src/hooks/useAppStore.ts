import { useState, useEffect } from 'react';
import { Ingredient, DailyMenu, Dish, MealType } from '../types';

const STORAGE_KEY_INGREDIENTS = 'app_ingredients';
const STORAGE_KEY_MENUS = 'app_menus';

export function useAppStore() {
  const [ingredients, setIngredients] = useState<Ingredient[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_INGREDIENTS);
    return saved ? JSON.parse(saved) : [];
  });

  const [menus, setMenus] = useState<DailyMenu[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_MENUS);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_INGREDIENTS, JSON.stringify(ingredients));
  }, [ingredients]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_MENUS, JSON.stringify(menus));
  }, [menus]);

  // --- Ingredients ---
  const addIngredient = (ingredient: Omit<Ingredient, 'id' | 'createdAt'>) => {
    const newIngredient: Ingredient = {
      ...ingredient,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
    };
    setIngredients(prev => [...prev, newIngredient]);
  };

  const removeIngredient = (id: string) => {
    setIngredients(prev => prev.filter(i => i.id !== id));
  };

  // --- Menus ---
  const getMenuByDate = (date: string) => {
    return menus.find(m => m.date === date) || { date, dishes: [] };
  };

  const addDish = (date: string, dish: Omit<Dish, 'id'>) => {
    setMenus(prev => {
      const existingMenuIndex = prev.findIndex(m => m.date === date);
      const newDish: Dish = { ...dish, id: crypto.randomUUID() };

      if (existingMenuIndex >= 0) {
        const newMenus = [...prev];
        newMenus[existingMenuIndex] = {
          ...newMenus[existingMenuIndex],
          dishes: [...newMenus[existingMenuIndex].dishes, newDish],
        };
        return newMenus;
      } else {
        return [...prev, { date, dishes: [newDish] }];
      }
    });
  };

  const removeDish = (date: string, dishId: string) => {
    setMenus(prev => {
      return prev.map(m => {
        if (m.date === date) {
          return { ...m, dishes: m.dishes.filter(d => d.id !== dishId) };
        }
        return m;
      });
    });
  };

  const updateDishPhoto = (date: string, dishId: string, photoUrl: string) => {
    setMenus(prev => {
      return prev.map(m => {
        if (m.date === date) {
          return {
            ...m,
            dishes: m.dishes.map(d => d.id === dishId ? { ...d, photoUrl } : d)
          };
        }
        return m;
      });
    });
  };

  return {
    ingredients,
    addIngredient,
    removeIngredient,
    menus,
    getMenuByDate,
    addDish,
    removeDish,
    updateDishPhoto,
  };
}
