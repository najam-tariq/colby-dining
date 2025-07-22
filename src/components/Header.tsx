import { TimeDisplay } from "./TimeDisplay";

export function Header() {
  return (
    <header className="bg-gradient-primary text-primary-foreground py-8 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold mb-2">
              Dana Dining Hall
            </h1>
            <p className="text-xl text-primary-foreground/90">
              Colby College • Service Week at a Glance
            </p>
          </div>
          <TimeDisplay />
        </div>
      </div>
    </header>
  );
}