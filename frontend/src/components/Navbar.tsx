import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff, Menu, Shield, X, GraduationCap } from "lucide-react";
import navLogo from "@/assets/navlogo.png";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useLogin, useSession } from "@/hooks/useAuth";
import { useQueryClient } from "@tanstack/react-query";

const navItems = [
  { label: "Home", path: "/" },
  { label: "About Us", path: "/about-us" },
  { label: "Nova Practice Hub", path: "/practice" },
  { label: "Study Abroad Hub", path: "/study-abroad", highlight: true },
  { label: "Blog", path: "/blog" },
  { label: "Resources", path: "/resources" },
  { label: "Contact Us", path: "/contact-us" },
];

interface NavbarProps {
  bgColor?: string;
}

export function Navbar({ bgColor = "bg-[hsl(var(--hero-bg))]/70" }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const { mutateAsync: login, isPending } = useLogin();
  const { data: user } = useSession();
  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await login({ email, password });
      if (res.success) {
        toast.success("Login successful");
        setIsLoginOpen(false);
        setEmail("");
        setPassword("");
        queryClient.setQueryData(["session"], {
          id: res.user?.id,
          email: res.user?.email,
          isAdmin: true,
        });
        navigate("/admin");
      } else {
        toast.error("Invalid Credential");
      }
    } catch {
      toast.error("Login failed");
    }
  };

  const handleLoginClick = () => {
    if (user) navigate("/admin");
    else setIsLoginOpen(true);
  };

  const isActive = (path: string) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 ${bgColor} backdrop-blur-md border-b border-white/5`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center">
              <img src={navLogo} alt="Nova Exams Logo" className="w-6 h-6" />
            </div>
            <span className="text-secondary-foreground font-display font-bold text-lg tracking-tight">
              <span className="text-primary">Nova </span>Exams
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden xl:flex items-center gap-1">
            {navItems.map((item) => (
              item.highlight ? (
                <Link
                  key={item.label}
                  to={item.path}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold transition-all ml-1"
                  style={{
                    background: isActive(item.path)
                      ? "rgba(201,168,76,0.25)"
                      : "rgba(201,168,76,0.10)",
                    color: "#C9A84C",
                    border: "1px solid rgba(201,168,76,0.35)",
                  }}
                >
                  <GraduationCap className="w-3.5 h-3.5" />
                  {item.label}
                </Link>
              ) : (
                <Link
                  key={item.label}
                  to={item.path}
                  className={`relative px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 group
                    ${isActive(item.path)
                      ? "text-primary bg-primary/10"
                      : "text-secondary-foreground/70 hover:text-secondary-foreground hover:bg-white/5"
                    }`}
                >
                  {item.label}
                  {/* Active underline */}
                  {isActive(item.path) && (
                    <span className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-primary" />
                  )}
                </Link>
              )
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleLoginClick}
              className="hidden xl:flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200
                bg-primary text-primary-foreground hover:bg-accent hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
            >
              {user ? "Dashboard" : "Log in"}
            </button>

            {/* Mobile hamburger */}
            <button
              className="xl:hidden flex items-center justify-center w-9 h-9 rounded-lg bg-white/5 border border-white/10 text-secondary-foreground transition-colors hover:bg-white/10"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className={`xl:hidden border-t border-white/10 ${bgColor} backdrop-blur-md`}>
          <div className="container mx-auto px-4 py-4 flex flex-col gap-1">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all
                  ${item.highlight
                    ? "text-primary bg-primary/10 border border-primary/20"
                    : isActive(item.path)
                      ? "text-primary bg-primary/10"
                      : "text-secondary-foreground/80 hover:bg-white/5 hover:text-secondary-foreground"
                  }`}
              >
                {item.highlight && <GraduationCap className="w-4 h-4" />}
                {item.label}
              </Link>
            ))}
            <button
              onClick={() => { handleLoginClick(); setMobileMenuOpen(false); }}
              className="mt-2 w-full px-4 py-3 rounded-xl text-sm font-semibold bg-primary text-primary-foreground hover:bg-accent transition-all"
            >
              {user ? "Go to Dashboard" : "Log in"}
            </button>
          </div>
        </div>
      )}

      {/* Login dialog */}
      {!user && (
        <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
          <DialogContent className="w-full max-w-sm sm:max-w-md bg-card border-border rounded-xl">
            <DialogHeader className="text-center">
              <div className="mx-auto w-12 h-12 rounded-xl bg-gradient-secondary flex items-center justify-center">
                <img src={navLogo} alt="Nova Exams Logo" className="w-8 h-8" />
              </div>
              <DialogTitle className="font-display text-2xl text-center">Admin Login</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                This login is for administrators only.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email" type="email" placeholder="admin@novaexams.com"
                  value={email} onChange={(e) => setEmail(e.target.value)} required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password" type={showPassword ? "text" : "password"}
                    placeholder="••••••••" value={password}
                    onChange={(e) => setPassword(e.target.value)} required className="pr-10"
                  />
                  <button
                    type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <Button type="submit" variant="cta" size="lg" className="w-full" disabled={isPending}>
                {isPending ? "Signing in..." : "Sign In"}
              </Button>
              <p className="text-center text-xs text-muted-foreground mt-4">
                <Shield className="inline w-3 h-3 mr-1" />
                Admin access only
              </p>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </nav>
  );
}
