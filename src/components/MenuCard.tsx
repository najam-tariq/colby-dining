import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MenuItem } from "@/data/menuData";

interface MenuCardProps {
  title: string;
  items: MenuItem[];
  isCurrentMeal?: boolean;
}

export function MenuCard({ title, items, isCurrentMeal = false }: MenuCardProps) {
  return (
    <Card className={`relative overflow-hidden transition-all duration-300 ${
      isCurrentMeal 
        ? 'ring-2 ring-primary shadow-elegant bg-gradient-to-br from-card to-accent/10' 
        : 'shadow-card hover:shadow-elegant'
    }`}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl font-semibold">
          {title}
          {isCurrentMeal && (
            <Badge className="bg-gradient-primary text-primary-foreground">
              Current
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {items.map((item, index) => (
            <div 
              key={index} 
              className="flex items-start justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
            >
              <span className="font-medium text-foreground leading-relaxed">
                {item.name}
              </span>
              {item.station && (
                <Badge variant="secondary" className="ml-2 text-xs">
                  {item.station}
                </Badge>
              )}
            </div>
          ))}
          {items.length === 0 && (
            <p className="text-muted-foreground text-center py-8">
              No items available
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}