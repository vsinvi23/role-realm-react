import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, UserCheck, UserX, UserPlus, TrendingUp, TrendingDown, Shield, UserCog, ArrowRight } from 'lucide-react';
import { getUserCounts, mockUsers } from '@/data/mockUsers';
import { Link } from 'react-router-dom';

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
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link to="/users">
              <Card className="hover:bg-accent/50 transition-colors cursor-pointer group">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">Manage Users</h3>
                    <p className="text-sm text-muted-foreground">View and manage all users</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </CardContent>
              </Card>
            </Link>
            
            <Link to="/roles">
              <Card className="hover:bg-accent/50 transition-colors cursor-pointer group">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-warning/10">
                    <Shield className="w-6 h-6 text-warning" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">Roles & Permissions</h3>
                    <p className="text-sm text-muted-foreground">Configure access levels</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </CardContent>
              </Card>
            </Link>
            
            <Link to="/user-management">
              <Card className="hover:bg-accent/50 transition-colors cursor-pointer group">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-success/10">
                    <UserCog className="w-6 h-6 text-success" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">User Dashboard</h3>
                    <p className="text-sm text-muted-foreground">Overview & analytics</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </CardContent>
              </Card>
            </Link>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
