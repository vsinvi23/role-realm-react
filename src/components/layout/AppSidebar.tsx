import { cn } from '@/lib/utils';
import { NavLink } from '@/components/NavLink';
import { useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Shield,
  Settings,
  Bell,
  Search,
  Globe,
  BarChart3,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  UserCog,
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

interface NavItem {
  icon: React.ElementType;
  label: string;
  href: string;
}

interface NavSection {
  icon: React.ElementType;
  label: string;
  items: NavItem[];
}

const standaloneItems: NavItem[] = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
];

const userManagementSection: NavSection = {
  icon: UserCog,
  label: 'User Management',
  items: [
    { icon: Users, label: 'Manage Users', href: '/' },
    { icon: Shield, label: 'Roles & Permissions', href: '/roles' },
  ],
};

const otherNavItems: NavItem[] = [
  { icon: BarChart3, label: 'Analytics', href: '/analytics' },
  { icon: Globe, label: 'Integrations', href: '/integrations' },
  { icon: Bell, label: 'Notifications', href: '/notifications' },
  { icon: Search, label: 'Search', href: '/search' },
];

const bottomNavItems: NavItem[] = [
  { icon: Settings, label: 'Settings', href: '/settings' },
  { icon: HelpCircle, label: 'Help', href: '/help' },
];

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  
  // Check if current route is within user management section
  const isUserManagementActive = userManagementSection.items.some(
    item => location.pathname === item.href
  );
  
  const [userMgmtOpen, setUserMgmtOpen] = useState(isUserManagementActive);

  const renderNavItem = (item: NavItem, isNested: boolean = false) => (
    <Tooltip key={item.href} delayDuration={0}>
      <TooltipTrigger asChild>
        <NavLink
          to={item.href}
          className={cn(
            'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sidebar-muted hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors',
            isNested && !collapsed && 'ml-4'
          )}
          activeClassName="bg-sidebar-accent text-sidebar-foreground"
        >
          <item.icon className="w-5 h-5 flex-shrink-0" />
          {!collapsed && (
            <span className="text-sm font-medium animate-fade-in">
              {item.label}
            </span>
          )}
        </NavLink>
      </TooltipTrigger>
      {collapsed && (
        <TooltipContent side="right" className="bg-sidebar text-sidebar-foreground">
          {item.label}
        </TooltipContent>
      )}
    </Tooltip>
  );

  return (
    <aside
      className={cn(
        'flex flex-col bg-sidebar h-screen transition-all duration-300 border-r border-sidebar-border',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className="flex items-center h-16 px-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-sidebar-primary flex items-center justify-center">
            <span className="text-sidebar-primary-foreground font-bold text-sm">FX</span>
          </div>
          {!collapsed && (
            <span className="font-semibold text-sidebar-foreground animate-fade-in">
              Fuel iX
            </span>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto scrollbar-thin">
        <ul className="space-y-1 px-2">
          {/* Standalone items */}
          {standaloneItems.map((item) => (
            <li key={item.href}>{renderNavItem(item)}</li>
          ))}

          {/* User Management Section */}
          <li>
            {collapsed ? (
              // When collapsed, show just the section icon with tooltip
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <NavLink
                    to="/"
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sidebar-muted hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors',
                      isUserManagementActive && 'bg-sidebar-accent text-sidebar-foreground'
                    )}
                  >
                    <userManagementSection.icon className="w-5 h-5 flex-shrink-0" />
                  </NavLink>
                </TooltipTrigger>
                <TooltipContent side="right" className="bg-sidebar text-sidebar-foreground">
                  {userManagementSection.label}
                </TooltipContent>
              </Tooltip>
            ) : (
              // When expanded, show collapsible section
              <Collapsible open={userMgmtOpen} onOpenChange={setUserMgmtOpen}>
                <CollapsibleTrigger className="w-full">
                  <div
                    className={cn(
                      'flex items-center justify-between px-3 py-2.5 rounded-lg text-sidebar-muted hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors cursor-pointer',
                      isUserManagementActive && 'text-sidebar-foreground'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <userManagementSection.icon className="w-5 h-5 flex-shrink-0" />
                      <span className="text-sm font-medium">{userManagementSection.label}</span>
                    </div>
                    <ChevronDown
                      className={cn(
                        'w-4 h-4 transition-transform duration-200',
                        userMgmtOpen && 'rotate-180'
                      )}
                    />
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-1 space-y-1">
                  {userManagementSection.items.map((item) => renderNavItem(item, true))}
                </CollapsibleContent>
              </Collapsible>
            )}
          </li>

          {/* Other nav items */}
          {otherNavItems.map((item) => (
            <li key={item.href}>{renderNavItem(item)}</li>
          ))}
        </ul>
      </nav>

      {/* Bottom Navigation */}
      <div className="border-t border-sidebar-border py-4 px-2">
        <ul className="space-y-1">
          {bottomNavItems.map((item) => (
            <li key={item.href}>{renderNavItem(item)}</li>
          ))}
        </ul>
      </div>

      {/* Collapse Toggle */}
      <div className="p-2 border-t border-sidebar-border">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-center text-sidebar-muted hover:text-sidebar-foreground hover:bg-sidebar-accent"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4 mr-2" />
              <span className="text-sm">Collapse</span>
            </>
          )}
        </Button>
      </div>
    </aside>
  );
}
