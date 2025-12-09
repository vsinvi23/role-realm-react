import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppSelector } from '@/store/hooks';
import { getUserCounts } from '@/data/mockUsers';
import { useMemo } from 'react';
import {
  Users,
  UserCheck,
  UserX,
  UserPlus,
  TrendingUp,
  Shield,
  Clock,
  Activity,
} from 'lucide-react';
import { RoleBadge } from '@/components/users/RoleBadge';
import { format } from 'date-fns';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { UserRole } from '@/types/user';

export default function UserManagementDashboard() {
  const { users } = useAppSelector((state) => state.users);
  const counts = useMemo(() => getUserCounts(users), [users]);

  // Calculate role distribution
  const roleDistribution = useMemo(() => {
    const distribution: Record<UserRole, number> = {
      Admin: 0,
      Viewer: 0,
      Editor: 0,
      Moderator: 0,
    };
    users.forEach((user) => {
      distribution[user.role]++;
    });
    return distribution;
  }, [users]);

  // Get recent users (last 5)
  const recentUsers = useMemo(() => {
    return [...users]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  }, [users]);

  // Get recently active users
  const activeUsers = useMemo(() => {
    return users
      .filter((u) => u.lastLogin)
      .sort((a, b) => new Date(b.lastLogin!).getTime() - new Date(a.lastLogin!).getTime())
      .slice(0, 5);
  }, [users]);

  const stats = [
    {
      title: 'Total Users',
      value: counts.total,
      icon: Users,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      description: 'All registered users',
    },
    {
      title: 'Active Users',
      value: counts.active,
      icon: UserCheck,
      color: 'text-success',
      bgColor: 'bg-success/10',
      description: 'Currently active accounts',
    },
    {
      title: 'Deactivated',
      value: counts.deactivated,
      icon: UserX,
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
      description: 'Suspended accounts',
    },
    {
      title: 'Pending Invites',
      value: counts.invited,
      icon: UserPlus,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      description: 'Awaiting acceptance',
    },
  ];

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Page Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">User Management Overview</h1>
            <p className="text-muted-foreground mt-1">
              Monitor user activity, roles distribution, and manage access across the platform
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link to="/roles">Manage Roles</Link>
            </Button>
            <Button asChild>
              <Link to="/users">View All Users</Link>
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
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
                  <div className="text-3xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Role Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                Role Distribution
              </CardTitle>
              <CardDescription>Users by role type</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {(Object.entries(roleDistribution) as [UserRole, number][]).map(([role, count]) => {
                const percentage = Math.round((count / users.length) * 100);
                return (
                  <div key={role} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <RoleBadge role={role} />
                      <span className="text-sm text-muted-foreground">
                        {count} users ({percentage}%)
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Recent Users */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-success" />
                Recent Users
              </CardTitle>
              <CardDescription>Newly registered accounts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentUsers.map((user) => (
                  <div key={user.id} className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="bg-muted text-muted-foreground text-xs">
                        {getInitials(user.firstName, user.lastName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
                    <div className="text-right">
                      <RoleBadge role={user.role} className="text-[10px] px-1.5" />
                      <p className="text-xs text-muted-foreground mt-1">
                        {format(new Date(user.createdAt), 'MMM d')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recently Active */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity className="w-5 h-5 text-info" />
                Recently Active
              </CardTitle>
              <CardDescription>Latest user activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeUsers.map((user) => (
                  <div key={user.id} className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="bg-muted text-muted-foreground text-xs">
                        {getInitials(user.firstName, user.lastName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {user.firstName} {user.lastName}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        <span>
                          Last login: {format(new Date(user.lastLogin!), 'MMM d, h:mm a')}
                        </span>
                      </div>
                    </div>
                    <div className="w-2 h-2 rounded-full bg-success" title="Online" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
                <Link to="/users">
                  <Users className="w-5 h-5" />
                  <span>Manage All Users</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
                <Link to="/roles">
                  <Shield className="w-5 h-5" />
                  <span>Configure Roles</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                <UserPlus className="w-5 h-5" />
                <span>Invite New User</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
