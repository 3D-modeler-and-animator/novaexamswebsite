import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { GraduationCap } from "lucide-react";

const StudyAbroad = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar bgColor="bg-gradient-secondary" />
      <main className="flex flex-col items-center justify-center min-h-screen text-center px-4">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center mb-6">
          <GraduationCap className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-4xl font-bold mb-4">
          Study Abroad <span className="text-primary">Hub</span>
        </h1>
        <p className="text-muted-foreground text-lg max-w-md">
          Coming soon. We're building something great for your study abroad journey.
        </p>
      </main>
      <Footer />
    </div>
  );
};

export default StudyAbroad;
