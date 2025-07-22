import { useState, useEffect } from "react";
import { Clock } from "lucide-react";

export function TimeDisplay() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const estTime = new Date(time.toLocaleString("en-US", {timeZone: "America/New_York"}));
  const timeString = estTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZone: 'America/New_York'
  });

  const dateString = estTime.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'America/New_York'
  });

  return (
    <div className="flex items-center gap-3 text-center">
      <div className="p-3 rounded-full bg-primary/10">
        <Clock className="h-6 w-6 text-primary-foreground" />
      </div>
      <div>
        <div className="text-2xl font-bold text-primary-foreground">{timeString}</div>
        <div className="text-sm text-primary-foreground/80">{dateString} (EST)</div>
      </div>
    </div>
  );
}