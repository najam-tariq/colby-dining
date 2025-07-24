import { useState, useEffect } from "react";
import { getCurrentMeal, getTodaysMenu, menuData, MenuItem, DayMenu } from "@/data/menuData";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Calendar, ChefHat, Utensils, Lock } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

export function MenuDisplay() {
  const todayMenu = getTodaysMenu();
  const initialMeal = getCurrentMeal();

  const [selectedDate, setSelectedDate] = useState<string>(todayMenu?.date ?? menuData[0].date);
  const [currentMeal, setCurrentMeal] = useState(initialMeal);
  const [openTab, setOpenTab] = useState<string | undefined>(initialMeal ?? undefined);
  const [nextMealInfo, setNextMealInfo] = useState<{ meal: string; diffMinutes: number } | null>(null);

  // Helper to calculate next meal start relative to current EST time
  const calculateNextMeal = () => {
    const now = new Date();
    const est = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }));

    const periods: { meal: string; start: number }[] = [
      { meal: 'breakfast', start: 7 },
      { meal: 'lunch', start: 11 },
      { meal: 'dinner', start: 17 },
    ];

    // Build potential next meal times for today
    for (const p of periods) {
      const startDate = new Date(est);
      startDate.setHours(p.start, 0, 0, 0);
      if (startDate > est) {
        const diffMinutes = Math.round((startDate.getTime() - est.getTime()) / 60000);
        return { meal: p.meal, diffMinutes };
      }
    }
    // Otherwise next is tomorrow breakfast 7am
    const tomorrow = new Date(est);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(7, 0, 0, 0);
    const diffMinutes = Math.round((tomorrow.getTime() - est.getTime()) / 60000);
    return { meal: 'breakfast', diffMinutes };
  };

  useEffect(() => {
    const timer = setInterval(() => {
      const mealNow = getCurrentMeal();
      setCurrentMeal(mealNow);
      setOpenTab(mealNow ?? undefined);
      setNextMealInfo(calculateNextMeal());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);
  // Initial next meal calculation
  useEffect(() => {
    setNextMealInfo(calculateNextMeal());
  }, []);

  const todaysMenu: DayMenu | undefined = menuData.find(d => d.date === selectedDate);

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

  const getMealIcon = (meal: string | null) => {
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
      {currentMeal ? (
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
      ) : (
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 bg-muted/20 px-4 py-2 rounded-lg">
            <Lock className="h-5 w-5 text-muted-foreground" />
            <span className="font-medium text-muted-foreground">
              Dining hall is currently closed;
              {nextMealInfo && (
                <> {nextMealInfo.meal.charAt(0) + nextMealInfo.meal.slice(1)} starts in{' '}
                {Math.floor(nextMealInfo.diffMinutes / 60) > 0 && (
                  <>
                    {Math.floor(nextMealInfo.diffMinutes / 60)} hour{Math.floor(nextMealInfo.diffMinutes / 60) === 1 ? '' : 's'}{' '}
                  </>
                )}
                {nextMealInfo.diffMinutes % 60} mins
                </>
              )}
            </span>
          </div>
        </div>
      )}

      {/* Collapsible Meal Sections */}
      <Accordion
        type="single"
        collapsible
        value={openTab}
        onValueChange={(val) => setOpenTab(val || undefined)}
        className="space-y-4"
      >
        {([
          { key: 'breakfast', label: 'Breakfast', items: todaysMenu.meals.breakfast },
          { key: 'lunch', label: 'Lunch', items: todaysMenu.meals.lunch },
          { key: 'dinner', label: 'Dinner', items: todaysMenu.meals.dinner },
        ] as { key: string; label: string; items: MenuItem[] }[]).map((meal) => (
          <AccordionItem key={meal.key} value={meal.key} className="border rounded-lg">
            <AccordionTrigger className="px-4">
              <div className="flex items-center gap-2">
                {getMealIcon(meal.key)}
                <span className="font-semibold">
                  {meal.label}
                </span>
                {meal.key === currentMeal && (
                  <Badge className="ml-2 bg-gradient-primary text-primary-foreground">Current</Badge>
                )}
              </div>
              <Badge variant="outline" className="ml-auto hidden sm:inline-block">
                {getMealTiming(meal.key)}
              </Badge>
            </AccordionTrigger>
            <AccordionContent className="px-4">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {meal.items.map((item, idx) => (
                  <Card
                    key={idx}
                    className="bg-muted/30 hover:bg-muted/40 transition-all duration-200 transform hover:scale-[1.03] h-24 flex flex-col justify-center px-4"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-foreground leading-relaxed line-clamp-2">
                        {item.name}
                      </span>
                      {item.station && (
                        <Badge variant="secondary" className="ml-2 text-xs">
                          {item.station}
                        </Badge>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      {/* All Week Menu Preview */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-center mb-8">This Week's Menu</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {menuData.map((day) => (
            <div
              key={day.date}
              onClick={() => setSelectedDate(day.date)}
              className={`cursor-pointer p-6 rounded-lg border transition-all ${
                day.date === selectedDate
                  ? 'bg-primary/5 border-primary shadow-sm'
                  : 'bg-card border-border hover:border-primary/50'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg">{day.dayOfWeek}</h3>
                <Badge variant={day.date === selectedDate ? 'default' : 'secondary'}>
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