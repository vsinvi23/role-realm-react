import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, UserCheck, UserX, UserPlus, TrendingUp, TrendingDown } from 'lucide-react';
import { getUserCounts, mockUsers } from '@/data/mockUsers';

const stats = [
  {
    title: 'Total Users',
    value: '359',
    change: '+12%',
    trend: 'up',
    icon: Users,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
  },
  {
    title: 'Active Users',
    value: '129',
    change: '+8%',
    trend: 'up',
    icon: UserCheck,
    color: 'text-success',
    bgColor: 'bg-success/10',
  },
  {
    title: 'Deactivated',
    value: '230',
    change: '-3%',
    trend: 'down',
    icon: UserX,
    color: 'text-destructive',
    bgColor: 'bg-destructive/10',
  },
  {
    title: 'Pending Invites',
    value: '0',
    change: '0%',
    trend: 'neutral',
    icon: UserPlus,
    color: 'text-warning',
    bgColor: 'bg-warning/10',
  },
];

export default function DashboardPage() {
  const counts = getUserCounts(mockUsers);

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Overview of user management and system statistics
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            const TrendIcon = stat.trend === 'up' ? TrendingUp : TrendingDown;
            
            return (
              <Card key={stat.title} className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`w-4 h-4 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold">{stat.value}</span>
                    {stat.trend !== 'neutral' && (
                      <span
                        className={`flex items-center text-sm ${
                          stat.trend === 'up' ? 'text-success' : 'text-destructive'
                        }`}
                      >
                        <TrendIcon className="w-3 h-3 mr-1" />
                        {stat.change}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">vs last month</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Navigate to <strong>Manage Users</strong> to view and manage all users, 
              or visit <strong>Roles & Permissions</strong> to configure access levels.
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
