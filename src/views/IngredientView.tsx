import React, { useState } from 'react';
import { Plus, Trash2, Search, Minus, Check } from 'lucide-react';
import { Ingredient, IngredientCategory } from '../types';
import { cn } from '../lib/utils';

interface IngredientViewProps {
  ingredients: Ingredient[];
  onAdd: (ingredient: Omit<Ingredient, 'id' | 'createdAt'>) => void;
  onRemove: (id: string) => void;
  onUpdateAmount: (id: string, amount: number) => void;
}

const CATEGORIES: IngredientCategory[] = ['肉', '菜', '調味料', '飲料', '其他'];

export function IngredientView({ ingredients, onAdd, onRemove, onUpdateAmount }: IngredientViewProps) {
  const [activeCategory, setActiveCategory] = useState<IngredientCategory>('肉');
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newAmount, setNewAmount] = useState<number>(1);
  const [newUnit, setNewUnit] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredIngredients = ingredients.filter(i => 
    (searchQuery ? i.name.includes(searchQuery) : i.category === activeCategory)
  );

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newName.trim() && newUnit.trim()) {
      onAdd({
        name: newName.trim(),
        category: activeCategory,
        amount: newAmount,
        unit: newUnit.trim(),
      });
      setNewName('');
      setNewAmount(1);
      setNewUnit('');
      setIsAdding(false);
    }
  };

  const amountOptions = Array.from({ length: 40 }, (_, i) => (i + 1) * 0.5);

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
                <div className="flex gap-2">
                  <select
                    value={newAmount}
                    onChange={e => setNewAmount(Number(e.target.value))}
                    className="w-24 bg-white border border-stone-200 rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200"
                  >
                    {amountOptions.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    placeholder="量詞 (例: 盒, 把)"
                    value={newUnit}
                    onChange={e => setNewUnit(e.target.value)}
                    className="flex-1 bg-white border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <button
                  type="submit"
                  disabled={!newName.trim() || !newUnit.trim()}
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
                <li key={item.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-stone-50 border border-stone-100 transition-colors group bg-white shadow-sm mb-2">
                  <div className="flex-1">
                    <p className="font-medium text-stone-800">{item.name}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center bg-stone-50 rounded-lg border border-stone-200">
                        <button
                          onClick={() => onUpdateAmount(item.id, Math.max(0, item.amount - 0.5))}
                          className="p-1.5 hover:bg-stone-200 text-stone-600 rounded-l-lg transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-sm font-medium w-10 text-center text-stone-700">
                          {item.amount}
                        </span>
                        <button
                          onClick={() => onUpdateAmount(item.id, item.amount + 0.5)}
                          className="p-1.5 hover:bg-stone-200 text-stone-600 rounded-r-lg transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <span className="text-sm text-stone-500">{item.unit}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 ml-4">
                    <button
                      onClick={() => onRemove(item.id)}
                      className="flex items-center justify-center gap-1 px-3 py-2 bg-orange-50 text-orange-600 hover:bg-orange-100 hover:text-orange-700 rounded-lg text-xs font-medium transition-colors border border-orange-100"
                    >
                      <Check className="w-4 h-4" />
                      <span className="whitespace-nowrap">使用完畢</span>
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
