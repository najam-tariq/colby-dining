import { Header } from "@/components/Header";
import { MenuDisplay } from "@/components/MenuDisplay";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header />
      <MenuDisplay />
      <footer className="bg-muted/30 py-8 mt-16">
        <div className="max-w-6xl mx-auto px-6 text-center text-muted-foreground">
          <p>&copy; 2025 Colby College Dining Services</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
