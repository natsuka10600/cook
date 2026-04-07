import React, { useState } from 'react';
import { Plus, Trash2, Search } from 'lucide-react';
import { Ingredient, IngredientCategory } from '../types';
import { cn } from '../lib/utils';

interface IngredientViewProps {
  ingredients: Ingredient[];
  onAdd: (ingredient: Omit<Ingredient, 'id' | 'createdAt'>) => void;
  onRemove: (id: string) => void;
}

const CATEGORIES: IngredientCategory[] = ['肉', '菜', '調味料', '飲料', '其他'];

export function IngredientView({ ingredients, onAdd, onRemove }: IngredientViewProps) {
  const [activeCategory, setActiveCategory] = useState<IngredientCategory>('肉');
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newQuantity, setNewQuantity] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredIngredients = ingredients.filter(i => 
    (searchQuery ? i.name.includes(searchQuery) : i.category === activeCategory)
  );

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newName.trim()) {
      onAdd({
        name: newName.trim(),
        category: activeCategory,
        quantity: newQuantity.trim() || '1',
      });
      setNewName('');
      setNewQuantity('');
      setIsAdding(false);
    }
  };

  return (
    <div className="p-4 pb-24 max-w-md mx-auto min-h-screen bg-stone-50 flex flex-col">
      <header className="mb-4 pt-4">
        <h1 className="text-2xl font-bold text-stone-800">冰箱庫存</h1>
      </header>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
        <input
          type="text"
          placeholder="搜尋食材..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full bg-white border border-stone-200 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200"
        />
      </div>

      {!searchQuery && (
        <div className="flex gap-2 overflow-x-auto pb-2 mb-2 scrollbar-hide">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-colors",
                activeCategory === cat
                  ? "bg-stone-800 text-white"
                  : "bg-white text-stone-600 border border-stone-200 hover:bg-stone-100"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      <div className="flex-1 bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden flex flex-col">
        <div className="p-4 border-b border-stone-100 flex justify-between items-center bg-stone-50/50">
          <h2 className="font-semibold text-stone-700">
            {searchQuery ? '搜尋結果' : `${activeCategory}類`}
          </h2>
          {!searchQuery && (
            <button
              onClick={() => setIsAdding(true)}
              className="flex items-center gap-1 text-sm text-orange-600 font-medium hover:bg-orange-50 px-2 py-1 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              新增
            </button>
          )}
        </div>

        <div className="p-4 flex-1 overflow-y-auto">
          {isAdding && !searchQuery && (
            <form onSubmit={handleAddSubmit} className="mb-4 flex gap-2 items-start bg-orange-50/50 p-3 rounded-xl border border-orange-100">
              <div className="flex-1 space-y-2">
                <input
                  type="text"
                  autoFocus
                  placeholder="食材名稱 (例: 雞胸肉)"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  className="w-full bg-white border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200"
                />
                <input
                  type="text"
                  placeholder="數量/單位 (例: 2盒)"
                  value={newQuantity}
                  onChange={e => setNewQuantity(e.target.value)}
                  className="w-full bg-white border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200"
                />
              </div>
              <div className="flex flex-col gap-2">
                <button
                  type="submit"
                  disabled={!newName.trim()}
                  className="bg-orange-500 text-white px-3 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
                >
                  儲存
                </button>
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="text-stone-500 px-3 py-2 text-sm"
                >
                  取消
                </button>
              </div>
            </form>
          )}

          {filteredIngredients.length === 0 && !isAdding ? (
            <div className="text-center py-12 text-stone-400">
              <p>目前沒有{searchQuery ? '符合的' : ''}食材</p>
            </div>
          ) : (
            <ul className="space-y-2">
              {filteredIngredients.map(item => (
                <li key={item.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-stone-50 border border-transparent hover:border-stone-100 transition-colors group">
                  <div>
                    <p className="font-medium text-stone-800">{item.name}</p>
                    <p className="text-xs text-stone-500 mt-0.5">數量: {item.quantity}</p>
                  </div>
                  <button
                    onClick={() => onRemove(item.id)}
                    className="p-2 text-stone-300 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors opacity-100 sm:opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
