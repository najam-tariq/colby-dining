import { useState, useEffect } from "react";
import { getCurrentMeal, getTodaysMenu, menuData, MenuItem } from "@/data/menuData";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Calendar, ChefHat, Utensils } from "lucide-react";

export function MenuDisplay() {
  const [currentMeal, setCurrentMeal] = useState(getCurrentMeal());
  const [todaysMenu, setTodaysMenu] = useState(getTodaysMenu());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentMeal(getCurrentMeal());
      setTodaysMenu(getTodaysMenu());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  if (!todaysMenu) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center">
          <ChefHat className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Menu Not Available
          </h2>
          <p className="text-muted-foreground">
            Today's menu is not currently available. Please check back later.
          </p>
        </div>
      </div>
    );
  }

  const getMealIcon = (meal: string) => {
    switch (meal) {
      case 'breakfast':
        return <Calendar className="h-5 w-5" />;
      case 'lunch':
        return <Utensils className="h-5 w-5" />;
      case 'dinner':
        return <ChefHat className="h-5 w-5" />;
      default:
        return <Utensils className="h-5 w-5" />;
    }
  };

  const getMealTiming = (meal: string) => {
    switch (meal) {
      case 'breakfast':
        return '7:00 AM – 10:00 AM';
      case 'lunch':
        return '11:00 AM – 2:00 PM';
      case 'dinner':
        return '5:00 PM – 7:00 PM';
      default:
        return '';
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* Today's Date Banner */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-accent/20 px-6 py-3 rounded-full">
          <Calendar className="h-5 w-5 text-primary" />
          <span className="font-semibold text-lg">
            {todaysMenu.dayOfWeek},{" "}
            {new Date(todaysMenu.date).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
              timeZone: 'UTC'
            })}
          </span>
        </div>
      </div>

      {/* Current Meal Highlight */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-lg">
          {getMealIcon(currentMeal)}
          <span className="font-medium text-primary">
            Current Meal: {currentMeal.charAt(0).toUpperCase() + currentMeal.slice(1)}
          </span>
          <Badge variant="outline" className="text-xs">
            {getMealTiming(currentMeal)}
          </Badge>
        </div>
      </div>

      {/* Menu Cards */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <MenuCard
          title="Breakfast"
          items={todaysMenu.meals.breakfast}
          isCurrentMeal={currentMeal === 'breakfast'}
        />
        <MenuCard
          title="Lunch"
          items={todaysMenu.meals.lunch}
          isCurrentMeal={currentMeal === 'lunch'}
        />
        <MenuCard
          title="Dinner"
          items={todaysMenu.meals.dinner}
          isCurrentMeal={currentMeal === 'dinner'}
        />
      </div>

      {/* All Week Menu Preview */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-center mb-8">This Week's Menu</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {menuData.map((day) => (
            <div
              key={day.date}
              className={`p-6 rounded-lg border transition-all ${
                day.date === todaysMenu.date
                  ? 'bg-primary/5 border-primary'
                  : 'bg-card border-border hover:border-primary/50'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg">{day.dayOfWeek}</h3>
                <Badge variant={day.date === todaysMenu.date ? 'default' : 'secondary'}>
                  {new Date(day.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    timeZone: 'UTC',
                  })}
                </Badge>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    {day.meals.breakfast.length} breakfast items
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Utensils className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    {day.meals.lunch.length} lunch items
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <ChefHat className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    {day.meals.dinner.length} dinner items
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}