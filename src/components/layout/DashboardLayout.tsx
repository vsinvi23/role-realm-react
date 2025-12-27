import { AppSidebar } from './AppSidebar';
import { Header } from './Header';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { hasNoGroups, isAuthenticated } = useAuth();

  // If user has no groups, show restricted view without sidebar
  if (hasNoGroups && isAuthenticated) {
    return (
      <div className="flex h-screen w-full overflow-hidden">
        <div className="flex flex-col flex-1 overflow-hidden">
          <Header />
          <main className="flex-1 overflow-auto bg-background p-6 flex items-center justify-center">
            <Card className="max-w-md w-full border-warning/50 bg-warning/5">
              <CardContent className="p-8 text-center">
                <AlertCircle className="w-12 h-12 mx-auto text-warning mb-4" />
                <h2 className="text-xl font-semibold text-foreground mb-2">No Access</h2>
                <p className="text-muted-foreground">
                  You have not been assigned to any group. Please contact your administrator for access.
                </p>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <AppSidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto bg-background p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
