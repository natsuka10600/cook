export type IngredientCategory = '肉' | '菜' | '調味料' | '飲料' | '其他';

export interface Ingredient {
  id: string;
  name: string;
  category: IngredientCategory;
  quantity: string;
  createdAt: number;
}

export type MealType = '早餐' | '午餐' | '晚餐' | '點心';

export interface Dish {
  id: string;
  name: string;
  type: MealType;
  photoUrl?: string;
}

export interface DailyMenu {
  date: string; // YYYY-MM-DD
  dishes: Dish[];
}
