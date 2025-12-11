import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  UserCheck, 
  UserX, 
  TrendingUp, 
  Clock, 
  Eye,
  BarChart3,
  Activity
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

// Mock data for user access analytics
const dailyAccessData = [
  { date: 'Mon', loggedIn: 245, anonymous: 89 },
  { date: 'Tue', loggedIn: 312, anonymous: 102 },
  { date: 'Wed', loggedIn: 287, anonymous: 95 },
  { date: 'Thu', loggedIn: 356, anonymous: 118 },
  { date: 'Fri', loggedIn: 298, anonymous: 87 },
  { date: 'Sat', loggedIn: 124, anonymous: 45 },
  { date: 'Sun', loggedIn: 98, anonymous: 32 },
];

const weeklyAccessData = [
  { week: 'Week 1', loggedIn: 1720, anonymous: 568 },
  { week: 'Week 2', loggedIn: 1890, anonymous: 612 },
  { week: 'Week 3', loggedIn: 2045, anonymous: 678 },
  { week: 'Week 4', loggedIn: 2234, anonymous: 745 },
];

const userTypeDistribution = [
  { name: 'Logged In Users', value: 78, color: 'hsl(var(--primary))' },
  { name: 'Anonymous Users', value: 22, color: 'hsl(var(--muted-foreground))' },
];

const pageViewsData = [
  { page: 'Dashboard', loggedIn: 1250, anonymous: 0 },
  { page: 'Courses', loggedIn: 890, anonymous: 456 },
  { page: 'Articles', loggedIn: 756, anonymous: 312 },
  { page: 'My Tasks', loggedIn: 543, anonymous: 0 },
  { page: 'Settings', loggedIn: 234, anonymous: 0 },
];

const recentSessions = [
  { id: 1, type: 'logged_in', user: 'john.doe@example.com', duration: '12m 34s', pages: 8, time: '2 min ago' },
  { id: 2, type: 'anonymous', user: 'Anonymous', duration: '3m 21s', pages: 3, time: '5 min ago' },
  { id: 3, type: 'logged_in', user: 'jane.smith@example.com', duration: '25m 12s', pages: 15, time: '8 min ago' },
  { id: 4, type: 'anonymous', user: 'Anonymous', duration: '1m 45s', pages: 2, time: '12 min ago' },
  { id: 5, type: 'logged_in', user: 'mike.wilson@example.com', duration: '8m 56s', pages: 6, time: '15 min ago' },
  { id: 6, type: 'logged_in', user: 'sarah.jones@example.com', duration: '18m 23s', pages: 11, time: '20 min ago' },
  { id: 7, type: 'anonymous', user: 'Anonymous', duration: '2m 10s', pages: 2, time: '25 min ago' },
];

export default function Analytics() {
  const totalLoggedIn = dailyAccessData.reduce((sum, d) => sum + d.loggedIn, 0);
  const totalAnonymous = dailyAccessData.reduce((sum, d) => sum + d.anonymous, 0);
  const totalUsers = totalLoggedIn + totalAnonymous;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
          <p className="text-muted-foreground">
            User access and engagement metrics for the portal
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Visits (7 days)
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalUsers.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3 text-green-500" />
                <span className="text-green-500">+12.5%</span> from last week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Logged In Users
              </CardTitle>
              <UserCheck className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalLoggedIn.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {((totalLoggedIn / totalUsers) * 100).toFixed(1)}% of total visits
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Anonymous Users
              </CardTitle>
              <UserX className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalAnonymous.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {((totalAnonymous / totalUsers) * 100).toFixed(1)}% of total visits
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Avg. Session Duration
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8m 42s</div>
              <p className="text-xs text-muted-foreground mt-1">
                Logged in: 12m 15s | Anonymous: 2m 34s
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <Tabs defaultValue="daily" className="space-y-4">
          <TabsList>
            <TabsTrigger value="daily">Daily</TabsTrigger>
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
          </TabsList>

          <TabsContent value="daily" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Area Chart */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-base">Daily User Access</CardTitle>
                  <CardDescription>Logged in vs Anonymous users over the past week</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={dailyAccessData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="date" className="text-xs" />
                        <YAxis className="text-xs" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'hsl(var(--card))', 
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px'
                          }} 
                        />
                        <Area 
                          type="monotone" 
                          dataKey="loggedIn" 
                          stackId="1"
                          stroke="hsl(var(--primary))" 
                          fill="hsl(var(--primary))" 
                          fillOpacity={0.6}
                          name="Logged In"
                        />
                        <Area 
                          type="monotone" 
                          dataKey="anonymous" 
                          stackId="1"
                          stroke="hsl(var(--muted-foreground))" 
                          fill="hsl(var(--muted-foreground))" 
                          fillOpacity={0.4}
                          name="Anonymous"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Pie Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">User Distribution</CardTitle>
                  <CardDescription>Breakdown by authentication status</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={userTypeDistribution}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {userTypeDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'hsl(var(--card))', 
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px'
                          }} 
                        />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="weekly" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Weekly User Access</CardTitle>
                <CardDescription>User visits by week for the past month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weeklyAccessData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="week" className="text-xs" />
                      <YAxis className="text-xs" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }} 
                      />
                      <Legend />
                      <Bar dataKey="loggedIn" name="Logged In" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="anonymous" name="Anonymous" fill="hsl(var(--muted-foreground))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Page Views & Recent Sessions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Page Views */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Page Views by User Type
              </CardTitle>
              <CardDescription>Which pages are accessed by logged in vs anonymous users</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={pageViewsData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis type="number" className="text-xs" />
                    <YAxis dataKey="page" type="category" className="text-xs" width={80} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }} 
                    />
                    <Legend />
                    <Bar dataKey="loggedIn" name="Logged In" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                    <Bar dataKey="anonymous" name="Anonymous" fill="hsl(var(--muted-foreground))" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Recent Sessions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Recent Sessions
              </CardTitle>
              <CardDescription>Latest user activity on the portal</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-[280px] overflow-y-auto">
                {recentSessions.map((session) => (
                  <div 
                    key={session.id} 
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        session.type === 'logged_in' ? 'bg-primary' : 'bg-muted-foreground'
                      }`} />
                      <div>
                        <p className="text-sm font-medium">{session.user}</p>
                        <p className="text-xs text-muted-foreground">
                          {session.duration} • {session.pages} pages
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={session.type === 'logged_in' ? 'default' : 'secondary'}>
                        {session.type === 'logged_in' ? 'Logged In' : 'Anonymous'}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{session.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
