import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Users, Eye, Settings2, Plus, Download, Check, X, Info } from 'lucide-react';
import { UserGroupList } from '@/components/roles/UserGroupList';
import { UserGroupFormModal } from '@/components/roles/UserGroupFormModal';
import { MemberManagementModal } from '@/components/roles/MemberManagementModal';
import { mockUserGroups, mockCategories } from '@/data/mockContent';
import { UserGroup, GroupMember } from '@/types/content';
import { toast } from 'sonner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { ScrollArea } from '@/components/ui/scroll-area';

// Role Definitions
interface RoleDefinition {
  id: string;
  name: string;
  description: string;
  userCount: number;
  color: string;
}

const roleDefinitions: RoleDefinition[] = [
  {
    id: 'super_admin',
    name: 'Super Admin',
    description: 'Complete system control with unrestricted access to all modules, settings, and administrative functions. Can manage other admins.',
    userCount: 3,
    color: 'bg-red-500/15 text-red-500 border-red-500/30',
  },
  {
    id: 'admin',
    name: 'Admin',
    description: 'Full administrative access to manage users, content, and settings. Cannot modify Super Admin accounts or critical system settings.',
    userCount: 12,
    color: 'bg-orange-500/15 text-orange-500 border-orange-500/30',
  },
  {
    id: 'manager',
    name: 'Manager',
    description: 'Oversees teams and content workflows. Can approve/publish content, manage assignments, and view analytics. Limited user management.',
    userCount: 28,
    color: 'bg-purple-500/15 text-purple-500 border-purple-500/30',
  },
  {
    id: 'editor',
    name: 'Editor',
    description: 'Creates and edits content across courses and articles. Can submit for review but cannot publish without approval.',
    userCount: 65,
    color: 'bg-blue-500/15 text-blue-500 border-blue-500/30',
  },
  {
    id: 'contributor',
    name: 'Contributor',
    description: 'Can create draft content and suggest edits. All submissions require editorial review before visibility.',
    userCount: 142,
    color: 'bg-green-500/15 text-green-500 border-green-500/30',
  },
  {
    id: 'viewer',
    name: 'Viewer',
    description: 'Read-only access to published content and basic analytics. Cannot create, edit, or delete any content.',
    userCount: 890,
    color: 'bg-gray-500/15 text-gray-500 border-gray-500/30',
  },
];

// Permission Definitions
interface PermissionDef {
  id: string;
  name: string;
  description: string;
}

const permissionDefinitions: PermissionDef[] = [
  { id: 'view', name: 'View / Read', description: 'View and read content details and data' },
  { id: 'list', name: 'List', description: 'Access lists and browse collections of items' },
  { id: 'search', name: 'Search', description: 'Search and filter through available data' },
  { id: 'download', name: 'Download / Export', description: 'Export data to files or download attachments' },
  { id: 'create', name: 'Create', description: 'Create new items, content, or records' },
  { id: 'edit', name: 'Edit / Update', description: 'Modify existing items and their properties' },
  { id: 'publish', name: 'Publish / Unpublish', description: 'Control visibility and publication status' },
  { id: 'assign', name: 'Assign / Reassign', description: 'Assign items to users or change assignments' },
  { id: 'soft_delete', name: 'Soft Delete / Archive', description: 'Archive items (recoverable)' },
  { id: 'hard_delete', name: 'Permanent Delete', description: 'Permanently remove items (non-recoverable)' },
  { id: 'manage_roles', name: 'Manage Roles', description: 'Create, edit, and assign user roles' },
  { id: 'manage_permissions', name: 'Manage Permissions', description: 'Configure role permissions and access levels' },
  { id: 'configure', name: 'Configure Settings', description: 'Modify system and module configurations' },
  { id: 'integrations', name: 'Manage Integrations', description: 'Connect and configure external services' },
  { id: 'notifications', name: 'Manage Notifications', description: 'Configure notification rules and templates' },
];

// Module definitions
const modules = [
  'User Management',
  'Content',
  'Courses',
  'Articles',
  'Analytics',
  'Settings',
];

// Permission Matrix Data - true = allowed, false = denied
type PermissionMatrix = {
  [module: string]: {
    [permission: string]: {
      [role: string]: boolean;
    };
  };
};

const permissionMatrix: PermissionMatrix = {
  'User Management': {
    view: { super_admin: true, admin: true, manager: true, editor: false, contributor: false, viewer: false },
    list: { super_admin: true, admin: true, manager: true, editor: false, contributor: false, viewer: false },
    search: { super_admin: true, admin: true, manager: true, editor: false, contributor: false, viewer: false },
    download: { super_admin: true, admin: true, manager: false, editor: false, contributor: false, viewer: false },
    create: { super_admin: true, admin: true, manager: false, editor: false, contributor: false, viewer: false },
    edit: { super_admin: true, admin: true, manager: false, editor: false, contributor: false, viewer: false },
    publish: { super_admin: false, admin: false, manager: false, editor: false, contributor: false, viewer: false },
    assign: { super_admin: true, admin: true, manager: true, editor: false, contributor: false, viewer: false },
    soft_delete: { super_admin: true, admin: true, manager: false, editor: false, contributor: false, viewer: false },
    hard_delete: { super_admin: true, admin: false, manager: false, editor: false, contributor: false, viewer: false },
    manage_roles: { super_admin: true, admin: true, manager: false, editor: false, contributor: false, viewer: false },
    manage_permissions: { super_admin: true, admin: false, manager: false, editor: false, contributor: false, viewer: false },
    configure: { super_admin: true, admin: true, manager: false, editor: false, contributor: false, viewer: false },
    integrations: { super_admin: true, admin: false, manager: false, editor: false, contributor: false, viewer: false },
    notifications: { super_admin: true, admin: true, manager: true, editor: false, contributor: false, viewer: false },
  },
  'Content': {
    view: { super_admin: true, admin: true, manager: true, editor: true, contributor: true, viewer: true },
    list: { super_admin: true, admin: true, manager: true, editor: true, contributor: true, viewer: true },
    search: { super_admin: true, admin: true, manager: true, editor: true, contributor: true, viewer: true },
    download: { super_admin: true, admin: true, manager: true, editor: true, contributor: false, viewer: false },
    create: { super_admin: true, admin: true, manager: true, editor: true, contributor: true, viewer: false },
    edit: { super_admin: true, admin: true, manager: true, editor: true, contributor: true, viewer: false },
    publish: { super_admin: true, admin: true, manager: true, editor: false, contributor: false, viewer: false },
    assign: { super_admin: true, admin: true, manager: true, editor: false, contributor: false, viewer: false },
    soft_delete: { super_admin: true, admin: true, manager: true, editor: true, contributor: false, viewer: false },
    hard_delete: { super_admin: true, admin: true, manager: false, editor: false, contributor: false, viewer: false },
    manage_roles: { super_admin: false, admin: false, manager: false, editor: false, contributor: false, viewer: false },
    manage_permissions: { super_admin: false, admin: false, manager: false, editor: false, contributor: false, viewer: false },
    configure: { super_admin: true, admin: true, manager: false, editor: false, contributor: false, viewer: false },
    integrations: { super_admin: true, admin: true, manager: false, editor: false, contributor: false, viewer: false },
    notifications: { super_admin: true, admin: true, manager: true, editor: true, contributor: false, viewer: false },
  },
  'Courses': {
    view: { super_admin: true, admin: true, manager: true, editor: true, contributor: true, viewer: true },
    list: { super_admin: true, admin: true, manager: true, editor: true, contributor: true, viewer: true },
    search: { super_admin: true, admin: true, manager: true, editor: true, contributor: true, viewer: true },
    download: { super_admin: true, admin: true, manager: true, editor: true, contributor: true, viewer: false },
    create: { super_admin: true, admin: true, manager: true, editor: true, contributor: true, viewer: false },
    edit: { super_admin: true, admin: true, manager: true, editor: true, contributor: true, viewer: false },
    publish: { super_admin: true, admin: true, manager: true, editor: false, contributor: false, viewer: false },
    assign: { super_admin: true, admin: true, manager: true, editor: false, contributor: false, viewer: false },
    soft_delete: { super_admin: true, admin: true, manager: true, editor: true, contributor: false, viewer: false },
    hard_delete: { super_admin: true, admin: true, manager: false, editor: false, contributor: false, viewer: false },
    manage_roles: { super_admin: false, admin: false, manager: false, editor: false, contributor: false, viewer: false },
    manage_permissions: { super_admin: false, admin: false, manager: false, editor: false, contributor: false, viewer: false },
    configure: { super_admin: true, admin: true, manager: true, editor: false, contributor: false, viewer: false },
    integrations: { super_admin: true, admin: true, manager: false, editor: false, contributor: false, viewer: false },
    notifications: { super_admin: true, admin: true, manager: true, editor: true, contributor: true, viewer: false },
  },
  'Articles': {
    view: { super_admin: true, admin: true, manager: true, editor: true, contributor: true, viewer: true },
    list: { super_admin: true, admin: true, manager: true, editor: true, contributor: true, viewer: true },
    search: { super_admin: true, admin: true, manager: true, editor: true, contributor: true, viewer: true },
    download: { super_admin: true, admin: true, manager: true, editor: true, contributor: true, viewer: false },
    create: { super_admin: true, admin: true, manager: true, editor: true, contributor: true, viewer: false },
    edit: { super_admin: true, admin: true, manager: true, editor: true, contributor: true, viewer: false },
    publish: { super_admin: true, admin: true, manager: true, editor: false, contributor: false, viewer: false },
    assign: { super_admin: true, admin: true, manager: true, editor: false, contributor: false, viewer: false },
    soft_delete: { super_admin: true, admin: true, manager: true, editor: true, contributor: false, viewer: false },
    hard_delete: { super_admin: true, admin: true, manager: false, editor: false, contributor: false, viewer: false },
    manage_roles: { super_admin: false, admin: false, manager: false, editor: false, contributor: false, viewer: false },
    manage_permissions: { super_admin: false, admin: false, manager: false, editor: false, contributor: false, viewer: false },
    configure: { super_admin: true, admin: true, manager: true, editor: false, contributor: false, viewer: false },
    integrations: { super_admin: true, admin: true, manager: false, editor: false, contributor: false, viewer: false },
    notifications: { super_admin: true, admin: true, manager: true, editor: true, contributor: true, viewer: false },
  },
  'Analytics': {
    view: { super_admin: true, admin: true, manager: true, editor: true, contributor: false, viewer: true },
    list: { super_admin: true, admin: true, manager: true, editor: true, contributor: false, viewer: true },
    search: { super_admin: true, admin: true, manager: true, editor: true, contributor: false, viewer: true },
    download: { super_admin: true, admin: true, manager: true, editor: false, contributor: false, viewer: false },
    create: { super_admin: true, admin: true, manager: true, editor: false, contributor: false, viewer: false },
    edit: { super_admin: true, admin: true, manager: false, editor: false, contributor: false, viewer: false },
    publish: { super_admin: false, admin: false, manager: false, editor: false, contributor: false, viewer: false },
    assign: { super_admin: true, admin: true, manager: true, editor: false, contributor: false, viewer: false },
    soft_delete: { super_admin: true, admin: true, manager: false, editor: false, contributor: false, viewer: false },
    hard_delete: { super_admin: true, admin: false, manager: false, editor: false, contributor: false, viewer: false },
    manage_roles: { super_admin: false, admin: false, manager: false, editor: false, contributor: false, viewer: false },
    manage_permissions: { super_admin: false, admin: false, manager: false, editor: false, contributor: false, viewer: false },
    configure: { super_admin: true, admin: true, manager: true, editor: false, contributor: false, viewer: false },
    integrations: { super_admin: true, admin: true, manager: false, editor: false, contributor: false, viewer: false },
    notifications: { super_admin: true, admin: true, manager: true, editor: false, contributor: false, viewer: false },
  },
  'Settings': {
    view: { super_admin: true, admin: true, manager: false, editor: false, contributor: false, viewer: false },
    list: { super_admin: true, admin: true, manager: false, editor: false, contributor: false, viewer: false },
    search: { super_admin: true, admin: true, manager: false, editor: false, contributor: false, viewer: false },
    download: { super_admin: true, admin: true, manager: false, editor: false, contributor: false, viewer: false },
    create: { super_admin: true, admin: false, manager: false, editor: false, contributor: false, viewer: false },
    edit: { super_admin: true, admin: true, manager: false, editor: false, contributor: false, viewer: false },
    publish: { super_admin: false, admin: false, manager: false, editor: false, contributor: false, viewer: false },
    assign: { super_admin: true, admin: true, manager: false, editor: false, contributor: false, viewer: false },
    soft_delete: { super_admin: true, admin: false, manager: false, editor: false, contributor: false, viewer: false },
    hard_delete: { super_admin: true, admin: false, manager: false, editor: false, contributor: false, viewer: false },
    manage_roles: { super_admin: true, admin: true, manager: false, editor: false, contributor: false, viewer: false },
    manage_permissions: { super_admin: true, admin: false, manager: false, editor: false, contributor: false, viewer: false },
    configure: { super_admin: true, admin: true, manager: false, editor: false, contributor: false, viewer: false },
    integrations: { super_admin: true, admin: true, manager: false, editor: false, contributor: false, viewer: false },
    notifications: { super_admin: true, admin: true, manager: false, editor: false, contributor: false, viewer: false },
  },
};

// Legacy role interface for backward compatibility
interface Role {
  id: string;
  name: string;
  description: string;
  userCount: number;
  permissions: string[];
  color: 'admin' | 'viewer' | 'editor' | 'moderator';
}

const roles: Role[] = [
  {
    id: '1',
    name: 'Admin',
    description: 'Full system access with all permissions enabled',
    userCount: 24,
    permissions: ['Create', 'Read', 'Update', 'Delete', 'Manage Users', 'System Settings'],
    color: 'admin',
  },
  {
    id: '2',
    name: 'Moderator',
    description: 'Content moderation and user management capabilities',
    userCount: 18,
    permissions: ['Read', 'Update', 'Moderate Content', 'Manage Reports'],
    color: 'moderator',
  },
  {
    id: '3',
    name: 'Editor',
    description: 'Create and edit content across the platform',
    userCount: 45,
    permissions: ['Create', 'Read', 'Update'],
    color: 'editor',
  },
  {
    id: '4',
    name: 'Viewer',
    description: 'Read-only access to content and dashboards',
    userCount: 89,
    permissions: ['Read'],
    color: 'viewer',
  },
];

const colorClasses = {
  admin: 'bg-role-admin/15 text-role-admin border-role-admin/30',
  viewer: 'bg-role-viewer/15 text-role-viewer border-role-viewer/30',
  editor: 'bg-role-editor/15 text-role-editor border-role-editor/30',
  moderator: 'bg-role-moderator/15 text-role-moderator border-role-moderator/30',
};

// Permission Cell Component
const PermissionCell = ({ allowed }: { allowed: boolean }) => (
  <div className="flex justify-center">
    {allowed ? (
      <div className="w-6 h-6 rounded-full bg-success/20 flex items-center justify-center">
        <Check className="w-4 h-4 text-success" />
      </div>
    ) : (
      <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
        <X className="w-4 h-4 text-muted-foreground" />
      </div>
    )}
  </div>
);

export default function RolesPage() {
  const [userGroups, setUserGroups] = useState<UserGroup[]>(mockUserGroups);
  const [groupModalOpen, setGroupModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<UserGroup | null>(null);
  const [memberModalOpen, setMemberModalOpen] = useState(false);
  const [managingGroup, setManagingGroup] = useState<UserGroup | null>(null);
  const [selectedModule, setSelectedModule] = useState<string>('all');

  const handleCreateGroup = () => {
    setEditingGroup(null);
    setGroupModalOpen(true);
  };

  const handleEditGroup = (group: UserGroup) => {
    setEditingGroup(group);
    setGroupModalOpen(true);
  };

  const handleDeleteGroup = (groupId: string) => {
    setUserGroups((prev) => prev.filter((g) => g.id !== groupId));
    toast.success('User group deleted');
  };

  const handleManageMembers = (group: UserGroup) => {
    setManagingGroup(group);
    setMemberModalOpen(true);
  };

  const handleGroupSubmit = (data: { name: string; description?: string; assignToCategories: boolean; selectedCategories: string[] }) => {
    if (editingGroup) {
      setUserGroups((prev) =>
        prev.map((g) =>
          g.id === editingGroup.id
            ? { ...g, name: data.name, description: data.description }
            : g
        )
      );
      toast.success('User group updated');
    } else {
      const newGroup: UserGroup = {
        id: `ug-${Date.now()}`,
        name: data.name,
        description: data.description,
        members: [],
        permissions: [],
      };
      setUserGroups((prev) => [...prev, newGroup]);
      toast.success(`User group "${data.name}" created${data.assignToCategories && data.selectedCategories.length > 0 ? ` and assigned to ${data.selectedCategories.length} categories` : ''}`);
    }
    setGroupModalOpen(false);
  };

  const handleAddMember = (groupId: string, email: string, role: GroupMember['role']) => {
    setUserGroups((prev) =>
      prev.map((g) => {
        if (g.id === groupId) {
          const newMember: GroupMember = {
            id: `m-${Date.now()}`,
            userId: `u-${Date.now()}`,
            userName: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
            email,
            role,
            addedAt: new Date().toISOString(),
          };
          return { ...g, members: [...g.members, newMember] };
        }
        return g;
      })
    );
    setManagingGroup((prev) => {
      if (prev && prev.id === groupId) {
        const updated = userGroups.find((g) => g.id === groupId);
        return updated || prev;
      }
      return prev;
    });
  };

  const handleRemoveMember = (groupId: string, memberId: string) => {
    setUserGroups((prev) =>
      prev.map((g) => {
        if (g.id === groupId) {
          return { ...g, members: g.members.filter((m) => m.id !== memberId) };
        }
        return g;
      })
    );
    toast.success('Member removed');
  };

  const handleChangeRole = (groupId: string, memberId: string, role: GroupMember['role']) => {
    setUserGroups((prev) =>
      prev.map((g) => {
        if (g.id === groupId) {
          return {
            ...g,
            members: g.members.map((m) => (m.id === memberId ? { ...m, role } : m)),
          };
        }
        return g;
      })
    );
  };

  const handleExportMatrix = () => {
    const headers = ['Module', 'Permission', ...roleDefinitions.map(r => r.name)];
    const rows: string[][] = [];
    
    modules.forEach(module => {
      permissionDefinitions.forEach(perm => {
        const row = [
          module,
          perm.name,
          ...roleDefinitions.map(role => 
            permissionMatrix[module]?.[perm.id]?.[role.id] ? 'Yes' : 'No'
          )
        ];
        rows.push(row);
      });
    });
    
    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'permission-matrix.csv';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Permission matrix exported');
  };

  const currentManagingGroup = managingGroup
    ? userGroups.find((g) => g.id === managingGroup.id) || managingGroup
    : null;

  const filteredModules = selectedModule === 'all' ? modules : [selectedModule];

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Roles & Permissions</h1>
          <p className="text-muted-foreground mt-1">
            Define access levels, manage user groups, and control permissions
          </p>
        </div>

        <Tabs defaultValue="permissions" className="w-full">
          <TabsList>
            <TabsTrigger value="groups">
              <Users className="w-4 h-4 mr-2" />
              User Groups
            </TabsTrigger>
            <TabsTrigger value="roles">
              <Shield className="w-4 h-4 mr-2" />
              Roles
            </TabsTrigger>
            <TabsTrigger value="permissions">
              <Eye className="w-4 h-4 mr-2" />
              Permissions Matrix
            </TabsTrigger>
          </TabsList>

          {/* User Groups Tab */}
          <TabsContent value="groups" className="mt-6">
            <UserGroupList
              groups={userGroups}
              onCreateGroup={handleCreateGroup}
              onEditGroup={handleEditGroup}
              onDeleteGroup={handleDeleteGroup}
              onManageMembers={handleManageMembers}
            />
          </TabsContent>

          {/* Roles Tab */}
          <TabsContent value="roles" className="mt-6 space-y-6">
            {/* Role Definitions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Role Definitions
                </CardTitle>
                <CardDescription>
                  Standard roles with their descriptions and current user counts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {roleDefinitions.map((role) => (
                    <Card key={role.id} className="border hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg ${role.color}`}>
                            <Shield className="w-5 h-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-foreground">{role.name}</h3>
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-3">
                              {role.description}
                            </p>
                            <div className="flex items-center gap-2 mt-3">
                              <Users className="w-3 h-3 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">
                                {role.userCount} users
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Permission Type Definitions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Info className="w-5 h-5" />
                  Permission Types
                </CardTitle>
                <CardDescription>
                  Available permission actions and their descriptions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {permissionDefinitions.map((perm) => (
                    <div key={perm.id} className="flex items-start gap-2 p-3 rounded-lg bg-muted/50">
                      <Badge variant="outline" className="shrink-0 text-xs">
                        {perm.name}
                      </Badge>
                      <p className="text-xs text-muted-foreground">
                        {perm.description}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Permissions Matrix Tab */}
          <TabsContent value="permissions" className="mt-6 space-y-4">
            {/* Controls */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Filter by module:</span>
                <select
                  value={selectedModule}
                  onChange={(e) => setSelectedModule(e.target.value)}
                  className="px-3 py-1.5 text-sm border rounded-lg bg-background"
                >
                  <option value="all">All Modules</option>
                  {modules.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
              <Button variant="outline" size="sm" onClick={handleExportMatrix}>
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-success/20 flex items-center justify-center">
                  <Check className="w-3 h-3 text-success" />
                </div>
                <span className="text-muted-foreground">Allowed</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center">
                  <X className="w-3 h-3 text-muted-foreground" />
                </div>
                <span className="text-muted-foreground">Denied</span>
              </div>
            </div>

            {/* Matrix Table */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Complete Permission Matrix
                </CardTitle>
                <CardDescription>
                  Detailed view of all permissions across modules and roles
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="w-full">
                  <div className="min-w-[900px]">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50">
                          <TableHead className="w-[140px] sticky left-0 bg-muted/50 z-10">Module</TableHead>
                          <TableHead className="w-[160px]">Permission</TableHead>
                          {roleDefinitions.map((role) => (
                            <TableHead key={role.id} className="text-center w-[100px]">
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span className="cursor-help font-medium text-xs">
                                    {role.name}
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent side="top" className="max-w-[200px]">
                                  <p className="text-xs">{role.description}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredModules.map((module, moduleIndex) => (
                          permissionDefinitions.map((perm, permIndex) => (
                            <TableRow 
                              key={`${module}-${perm.id}`}
                              className={moduleIndex % 2 === 0 ? 'bg-background' : 'bg-muted/30'}
                            >
                              {permIndex === 0 && (
                                <TableCell 
                                  rowSpan={permissionDefinitions.length}
                                  className="font-medium text-sm border-r sticky left-0 bg-inherit z-10"
                                >
                                  {module}
                                </TableCell>
                              )}
                              <TableCell className="text-sm">
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <span className="cursor-help">{perm.name}</span>
                                  </TooltipTrigger>
                                  <TooltipContent side="right">
                                    <p className="text-xs">{perm.description}</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TableCell>
                              {roleDefinitions.map((role) => (
                                <TableCell key={role.id} className="text-center p-2">
                                  <PermissionCell 
                                    allowed={permissionMatrix[module]?.[perm.id]?.[role.id] ?? false} 
                                  />
                                </TableCell>
                              ))}
                            </TableRow>
                          ))
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {roleDefinitions.map((role) => {
                const totalPermissions = modules.reduce((acc, module) => {
                  return acc + permissionDefinitions.filter(
                    perm => permissionMatrix[module]?.[perm.id]?.[role.id]
                  ).length;
                }, 0);
                const maxPermissions = modules.length * permissionDefinitions.length;
                const percentage = Math.round((totalPermissions / maxPermissions) * 100);
                
                return (
                  <Card key={role.id} className="text-center">
                    <CardContent className="p-4">
                      <div className={`inline-flex p-2 rounded-lg ${role.color} mb-2`}>
                        <Shield className="w-4 h-4" />
                      </div>
                      <h4 className="font-medium text-sm">{role.name}</h4>
                      <p className="text-2xl font-bold text-foreground mt-1">{percentage}%</p>
                      <p className="text-xs text-muted-foreground">
                        {totalPermissions}/{maxPermissions} permissions
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>

        {/* Modals */}
        <UserGroupFormModal
          open={groupModalOpen}
          onClose={() => setGroupModalOpen(false)}
          onSubmit={handleGroupSubmit}
          group={editingGroup}
          categories={mockCategories}
        />

        <MemberManagementModal
          open={memberModalOpen}
          onClose={() => setMemberModalOpen(false)}
          group={currentManagingGroup}
          onAddMember={handleAddMember}
          onRemoveMember={handleRemoveMember}
          onChangeRole={handleChangeRole}
        />
      </div>
    </DashboardLayout>
  );
}