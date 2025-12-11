import { cn } from '@/lib/utils';
import { NavLink } from '@/components/NavLink';
import { useLocation, Link } from 'react-router-dom';
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
  href: string; // Main section link
  items: NavItem[];
}

import { FolderTree, BookOpen, FileText, ListTodo } from 'lucide-react';

const standaloneItems: NavItem[] = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: ListTodo, label: 'My Tasks', href: '/my-tasks' },
  { icon: BookOpen, label: 'Courses', href: '/courses' },
  { icon: FileText, label: 'Articles', href: '/articles' },
];

const userManagementSection: NavSection = {
  icon: UserCog,
  label: 'User Management',
  href: '/user-management',
  items: [
    { icon: Users, label: 'Manage Users', href: '/users' },
    { icon: Shield, label: 'Roles & Permissions', href: '/roles' },
  ],
};

const settingsSection: NavSection = {
  icon: Settings,
  label: 'Settings',
  href: '/settings',
  items: [
    { icon: FolderTree, label: 'Category Management', href: '/content' },
    { icon: Globe, label: 'Web Settings', href: '/web-settings' },
  ],
};

const otherNavItems: NavItem[] = [
  { icon: BarChart3, label: 'Analytics', href: '/analytics' },
];

const bottomNavItems: NavItem[] = [
  { icon: HelpCircle, label: 'Help', href: '/help' },
];

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  
  // Check if current route is within user management section
  const isUserManagementActive = 
    location.pathname === userManagementSection.href ||
    userManagementSection.items.some(item => location.pathname === item.href);
  
  // Check if current route is within settings section
  const isSettingsActive = 
    location.pathname === settingsSection.href ||
    settingsSection.items.some(item => location.pathname === item.href);
  
  const [userMgmtOpen, setUserMgmtOpen] = useState(isUserManagementActive);
  const [settingsOpen, setSettingsOpen] = useState(isSettingsActive);

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

  const renderSection = (
    section: NavSection,
    isActive: boolean,
    isOpen: boolean,
    setIsOpen: (open: boolean) => void
  ) => (
    <li>
      {collapsed ? (
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <Link
              to={section.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sidebar-muted hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors',
                isActive && 'bg-sidebar-accent text-sidebar-foreground'
              )}
            >
              <section.icon className="w-5 h-5 flex-shrink-0" />
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right" className="bg-sidebar text-sidebar-foreground">
            {section.label}
          </TooltipContent>
        </Tooltip>
      ) : (
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <div className="flex items-center">
            <Link
              to={section.href}
              className={cn(
                'flex-1 flex items-center gap-3 px-3 py-2.5 rounded-l-lg text-sidebar-muted hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors',
                isActive && 'text-sidebar-foreground',
                location.pathname === section.href && 'bg-sidebar-accent'
              )}
            >
              <section.icon className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm font-medium">{section.label}</span>
            </Link>
            <CollapsibleTrigger asChild>
              <button
                className={cn(
                  'px-2 py-2.5 rounded-r-lg text-sidebar-muted hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors',
                  isActive && 'text-sidebar-foreground'
                )}
              >
                <ChevronDown
                  className={cn(
                    'w-4 h-4 transition-transform duration-200',
                    isOpen && 'rotate-180'
                  )}
                />
              </button>
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent className="mt-1 space-y-1">
            {section.items.map((item) => renderNavItem(item, true))}
          </CollapsibleContent>
        </Collapsible>
      )}
    </li>
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
          {renderSection(userManagementSection, isUserManagementActive, userMgmtOpen, setUserMgmtOpen)}

          {/* Settings Section */}
          {renderSection(settingsSection, isSettingsActive, settingsOpen, setSettingsOpen)}

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
