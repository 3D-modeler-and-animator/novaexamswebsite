import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

import Index from "./pages/Index";
import About from "./pages/About";
import Blog from "./pages/Blog";
import Resources from "./pages/Resources";
import Contact from "./pages/Contact";
import Booking from "./pages/Booking";
import Admin from "./pages/Admin";
import PracticeHub from "./pages/PracticeHub";
import StudyAbroad from "./pages/StudyAbroad";
import NotFound from "./pages/NotFound";

import { useSession } from "@/hooks/useAuth"; 
import  PrivacyPage  from "./pages/PrivacyPage";
import  TermsPage from "./pages/TermsPage";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { data: user, isLoading } = useSession();

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Checking session...</div>;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/about-us" element={<About />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/contact-us" element={<Contact />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/practice" element={<PracticeHub />} />
            <Route path="/study-abroad" element={<StudyAbroad />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <Admin />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
