import menuDataJson from './menuData.json';

// Types for individual menu items and daily menus
export interface MenuItem {
  name: string;
  /** Optional serving station, e.g. "Grill" or "V2" */
  station?: string;
}

export interface MealData {
  breakfast: MenuItem[];
  lunch: MenuItem[];
  dinner: MenuItem[];
}

export interface DayMenu {
  date: string; // ISO-8601 date, e.g. 2025-07-22
  dayOfWeek: string; // Monday, Tuesday, …
  meals: MealData;
}

// The full week’s data is now loaded from a JSON file generated from the official csv
export const menuData: DayMenu[] = menuDataJson as DayMenu[];

// Helper function: determine the current meal based on EST/EDT time
export function getCurrentMeal(): 'breakfast' | 'lunch' | 'dinner' | null {
  const now = new Date();
  const est = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }));
  const hour = est.getHours();

  // Breakfast: 7 – 10 AM
  if (hour >= 7 && hour < 10) return 'breakfast';

  // Lunch: 11 AM – 2 PM
  if (hour >= 11 && hour < 14) return 'lunch';

  // Dinner: 5 – 7 PM (17–19)
  if (hour >= 17 && hour < 19) return 'dinner';

  // Outside service hours – return null so no meal is auto-opened
  return null;
}

// Helper: look up today’s menu (EST). Falls back to null if outside the csv range
export function getTodaysMenu(): DayMenu | null {
  const now = new Date();
  const estDate = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }));
  const iso = estDate.toISOString().slice(0, 10); // YYYY-MM-DD
  return menuData.find((d) => d.date === iso) || null;
} 