import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  BookOpen, 
  Search, 
  Home, 
  GraduationCap, 
  FileText, 
  Code, 
  Briefcase,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';

interface PublicLayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { icon: Home, label: 'Home', href: '/' },
  { icon: BookOpen, label: 'Courses', href: '/explore/courses' },
  { icon: GraduationCap, label: 'Learning Paths', href: '/explore/paths' },
  { icon: FileText, label: 'Articles', href: '/explore/articles' },
  { icon: Code, label: 'Practice', href: '/explore/practice' },
  { icon: Briefcase, label: 'Interview Prep', href: '/explore/interview' },
];

export function PublicLayout({ children }: PublicLayoutProps) {
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-50 bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-all duration-300 lg:static",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          sidebarExpanded ? "w-52" : "w-16"
        )}
        onMouseEnter={() => setSidebarExpanded(true)}
        onMouseLeave={() => setSidebarExpanded(false)}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-3 border-b border-sidebar-border">
            <Link to="/" className="flex items-center gap-2 overflow-hidden">
              <div className="w-8 h-8 min-w-8 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg">
                <span className="text-sidebar-primary-foreground font-bold text-lg">G</span>
              </div>
              <span className={cn(
                "text-lg font-bold text-sidebar-foreground whitespace-nowrap transition-opacity duration-300",
                sidebarExpanded ? "opacity-100" : "opacity-0 lg:opacity-0"
              )}>GeekGully</span>
            </Link>
            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden text-sidebar-foreground"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-2 space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    isActive 
                      ? "bg-sidebar-primary text-sidebar-primary-foreground" 
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  )}
                  title={!sidebarExpanded ? item.label : undefined}
                >
                  <item.icon className="h-5 w-5 min-w-5" />
                  <span className={cn(
                    "whitespace-nowrap transition-opacity duration-300",
                    sidebarExpanded ? "opacity-100" : "opacity-0"
                  )}>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Auth Section */}
          <div className="p-2 border-t border-sidebar-border">
            {isAuthenticated ? (
              <div className="space-y-2">
                <Link to="/dashboard">
                  <Button variant="secondary" className={cn(
                    "w-full justify-start",
                    !sidebarExpanded && "px-3"
                  )}>
                    <GraduationCap className="h-4 w-4 min-w-4" />
                    <span className={cn(
                      "ml-2 whitespace-nowrap transition-opacity duration-300",
                      sidebarExpanded ? "opacity-100" : "opacity-0 hidden"
                    )}>My Dashboard</span>
                  </Button>
                </Link>
                <Button 
                  variant="ghost" 
                  className={cn(
                    "w-full justify-start text-sidebar-muted",
                    !sidebarExpanded && "px-3"
                  )}
                  onClick={logout}
                  title={!sidebarExpanded ? `Sign Out (${user?.name})` : undefined}
                >
                  <X className="h-4 w-4 min-w-4" />
                  <span className={cn(
                    "ml-2 whitespace-nowrap transition-opacity duration-300",
                    sidebarExpanded ? "opacity-100" : "opacity-0 hidden"
                  )}>Sign Out</span>
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <Link to="/auth">
                  <Button className={cn(
                    "w-full",
                    !sidebarExpanded && "px-3"
                  )}>
                    <span className={cn(
                      "whitespace-nowrap",
                      sidebarExpanded ? "block" : "hidden"
                    )}>Get Started</span>
                    <ChevronRight className={cn(
                      "h-4 w-4",
                      sidebarExpanded ? "hidden" : "block"
                    )} />
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button variant="ghost" className={cn(
                    "w-full text-sidebar-foreground",
                    !sidebarExpanded && "px-3"
                  )}>
                    <span className={cn(
                      "whitespace-nowrap",
                      sidebarExpanded ? "block" : "hidden"
                    )}>Sign In</span>
                    <BookOpen className={cn(
                      "h-4 w-4",
                      sidebarExpanded ? "hidden" : "block"
                    )} />
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-card border-b border-border flex items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="hidden sm:flex relative w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search courses, tutorials..." className="pl-9" />
            </div>
          </div>
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard">
                  <Button variant="outline" size="sm">Dashboard</Button>
                </Link>
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-medium">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
              </>
            ) : (
              <>
                <Link to="/auth">
                  <Button variant="ghost" size="sm">Sign In</Button>
                </Link>
                <Link to="/auth">
                  <Button size="sm">Get Started</Button>
                </Link>
              </>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto bg-background p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
