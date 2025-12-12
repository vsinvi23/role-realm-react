import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Users, Eye, Settings2, Plus, Download, Check, X, Info, ChevronDown, ChevronUp, FolderOpen, BookOpen, FileText, BarChart3, Settings, UserCog } from 'lucide-react';
import { UserGroupList } from '@/components/roles/UserGroupList';
import { UserGroupFormModal } from '@/components/roles/UserGroupFormModal';
import { MemberManagementModal } from '@/components/roles/MemberManagementModal';
import { mockUserGroups, mockCategories } from '@/data/mockContent';
import { UserGroup, GroupMember } from '@/types/content';
import { toast } from 'sonner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

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

// Module definitions with icons
const moduleConfig = [
  { name: 'User Management', icon: UserCog, color: 'text-orange-500' },
  { name: 'Content', icon: FolderOpen, color: 'text-blue-500' },
  { name: 'Courses', icon: BookOpen, color: 'text-purple-500' },
  { name: 'Articles', icon: FileText, color: 'text-green-500' },
  { name: 'Analytics', icon: BarChart3, color: 'text-cyan-500' },
  { name: 'Settings', icon: Settings, color: 'text-gray-500' },
];

// Permission Matrix Data
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

// Module Permission Card Component
const ModulePermissionCard = ({ 
  module, 
  icon: Icon, 
  color,
  isOpen,
  onToggle 
}: { 
  module: string; 
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  isOpen: boolean;
  onToggle: () => void;
}) => {
  const modulePermissions = permissionMatrix[module] || {};
  const allowedCount = permissionDefinitions.reduce((acc, perm) => {
    return acc + roleDefinitions.filter(role => modulePermissions[perm.id]?.[role.id]).length;
  }, 0);
  const totalCount = permissionDefinitions.length * roleDefinitions.length;
  const percentage = Math.round((allowedCount / totalCount) * 100);

  return (
    <Collapsible open={isOpen} onOpenChange={onToggle}>
      <Card className="overflow-hidden">
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-muted ${color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle className="text-base">{module}</CardTitle>
                  <CardDescription className="text-xs mt-0.5">
                    {allowedCount} of {totalCount} permissions enabled ({percentage}%)
                  </CardDescription>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-1">
                  {roleDefinitions.slice(0, 3).map(role => {
                    const roleAllowed = permissionDefinitions.filter(
                      perm => modulePermissions[perm.id]?.[role.id]
                    ).length;
                    return (
                      <Badge 
                        key={role.id} 
                        variant="outline" 
                        className={`text-xs ${role.color}`}
                      >
                        {role.name.split(' ')[0]}: {roleAllowed}
                      </Badge>
                    );
                  })}
                </div>
                {isOpen ? (
                  <ChevronUp className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-muted-foreground" />
                )}
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="pt-0 pb-4">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead className="w-[180px]">Permission</TableHead>
                    {roleDefinitions.map((role) => (
                      <TableHead key={role.id} className="text-center w-[90px]">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="cursor-help text-xs font-medium">
                              {role.name.split(' ')[0]}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="max-w-[200px]">
                            <p className="font-semibold">{role.name}</p>
                            <p className="text-xs mt-1">{role.description}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {permissionDefinitions.map((perm) => (
                    <TableRow key={perm.id} className="hover:bg-muted/20">
                      <TableCell className="text-sm py-2">
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
                            allowed={modulePermissions[perm.id]?.[role.id] ?? false} 
                          />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
};

export default function RolesPage() {
  const [userGroups, setUserGroups] = useState<UserGroup[]>(mockUserGroups);
  const [groupModalOpen, setGroupModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<UserGroup | null>(null);
  const [memberModalOpen, setMemberModalOpen] = useState(false);
  const [managingGroup, setManagingGroup] = useState<UserGroup | null>(null);
  const [openModules, setOpenModules] = useState<Record<string, boolean>>({});

  const handleToggleModule = (moduleName: string) => {
    setOpenModules(prev => ({ ...prev, [moduleName]: !prev[moduleName] }));
  };

  const handleExpandAll = () => {
    const allOpen: Record<string, boolean> = {};
    moduleConfig.forEach(m => { allOpen[m.name] = true; });
    setOpenModules(allOpen);
  };

  const handleCollapseAll = () => {
    setOpenModules({});
  };

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
    
    moduleConfig.forEach(({ name: module }) => {
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
                <Button variant="outline" size="sm" onClick={handleExpandAll}>
                  <ChevronDown className="w-4 h-4 mr-1" />
                  Expand All
                </Button>
                <Button variant="outline" size="sm" onClick={handleCollapseAll}>
                  <ChevronUp className="w-4 h-4 mr-1" />
                  Collapse All
                </Button>
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

            {/* Module Cards */}
            <div className="space-y-3">
              {moduleConfig.map(({ name, icon, color }) => (
                <ModulePermissionCard
                  key={name}
                  module={name}
                  icon={icon}
                  color={color}
                  isOpen={openModules[name] || false}
                  onToggle={() => handleToggleModule(name)}
                />
              ))}
            </div>

            {/* Summary Cards */}
            <Card className="mt-6">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Role Permission Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                  {roleDefinitions.map((role) => {
                    const totalPermissions = moduleConfig.reduce((acc, { name: module }) => {
                      return acc + permissionDefinitions.filter(
                        perm => permissionMatrix[module]?.[perm.id]?.[role.id]
                      ).length;
                    }, 0);
                    const maxPermissions = moduleConfig.length * permissionDefinitions.length;
                    const percentage = Math.round((totalPermissions / maxPermissions) * 100);
                    
                    return (
                      <div key={role.id} className="text-center p-3 rounded-lg bg-muted/30">
                        <div className={`inline-flex p-2 rounded-lg ${role.color} mb-2`}>
                          <Shield className="w-4 h-4" />
                        </div>
                        <h4 className="font-medium text-sm">{role.name}</h4>
                        <p className="text-xl font-bold text-foreground mt-1">{percentage}%</p>
                        <p className="text-xs text-muted-foreground">
                          {totalPermissions}/{maxPermissions}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
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