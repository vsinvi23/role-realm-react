import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Users, Eye, Plus, Download, Check, X, Info, ChevronDown, ChevronUp, FolderOpen, BookOpen, FileText, BarChart3, Settings, UserCog, Pencil, Trash2, MoreHorizontal, Loader2 } from 'lucide-react';
import { UserGroupFormModal } from '@/components/roles/UserGroupFormModal';
import { MemberManagementModal } from '@/components/roles/MemberManagementModal';
import { RoleFormModal, RoleDefinition, RolePermissions, moduleDefinitions, permissionDefinitions as permissionDefs } from '@/components/roles/RoleFormModal';
import { PermissionFormModal } from '@/components/roles/PermissionFormModal';
import { mockCategories } from '@/data/mockContent';
import { UserGroup, GroupMember } from '@/types/content';
import { toast } from 'sonner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useRoles } from '@/api/hooks/useRoles';
import { useGroups } from '@/api/hooks/useGroups';
import { usePermissions } from '@/api/hooks/usePermissions';
import { useUsers } from '@/api/hooks/useUsers';
import { RoleResponse, GroupResponse, PermissionResponse, PermissionRequest } from '@/api/types';

// Permission Definitions
interface PermissionDef {
  id: string;
  name: string;
  description: string;
}

const permissionDefinitions: PermissionDef[] = [
  { id: 'view', name: 'View / Read', description: 'View and read content details and data' },
  { id: 'create', name: 'Create', description: 'Create new items, content, or records' },
  { id: 'edit', name: 'Edit / Update', description: 'Modify existing items and their properties' },
  { id: 'delete', name: 'Delete', description: 'Delete items (recoverable)' },
  { id: 'publish', name: 'Publish / Unpublish', description: 'Control visibility and publication status' },
  { id: 'manage', name: 'Manage', description: 'Full management access' },
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

// Role color mapping
const roleColors: Record<string, string> = {
  master: 'bg-red-500/15 text-red-500 border-red-500/30',
  admin: 'bg-orange-500/15 text-orange-500 border-orange-500/30',
  manager: 'bg-purple-500/15 text-purple-500 border-purple-500/30',
  viewer: 'bg-gray-500/15 text-gray-500 border-gray-500/30',
  default: 'bg-blue-500/15 text-blue-500 border-blue-500/30',
};

const getRoleColor = (roleName: string) => {
  const key = roleName.toLowerCase();
  return roleColors[key] || roleColors.default;
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
  onToggle,
  roles,
  permissions
}: { 
  module: string; 
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  isOpen: boolean;
  onToggle: () => void;
  roles: RoleResponse[];
  permissions: PermissionResponse[];
}) => {
  // Find permission for this module
  const modulePermission = permissions.find(p => p.module.toLowerCase() === module.toLowerCase().replace(' ', '_'));
  
  const getPermissionValue = (permId: string): boolean => {
    if (!modulePermission) return false;
    const key = permId as keyof PermissionResponse;
    return Boolean(modulePermission[key]);
  };

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
                    Module permissions
                  </CardDescription>
                </div>
              </div>
              <div className="flex items-center gap-3">
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
                    <TableHead className="text-center w-[90px]">Status</TableHead>
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
                      <TableCell className="text-center p-2">
                        <PermissionCell allowed={getPermissionValue(perm.id)} />
                      </TableCell>
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

// Extended UserGroup type with role association
interface UserGroupWithRole extends UserGroup {
  roleId?: string;
}

export default function RolesPage() {
  // API Hooks
  const { 
    roles: apiRoles, 
    isLoading: rolesLoading, 
    fetchRoles, 
    createRole, 
    updateRole, 
    deleteRole: deleteRoleApi 
  } = useRoles();
  
  const { 
    groups: apiGroups, 
    isLoading: groupsLoading, 
    fetchGroups, 
    createGroup, 
    updateGroup, 
    deleteGroup: deleteGroupApi,
    getRolesByGroup,
    assignRoleToGroup,
    getUsersByGroup,
    addUserToGroup,
    removeUserFromGroup
  } = useGroups();
  
  const { 
    permissions: apiPermissions, 
    isLoading: permissionsLoading, 
    fetchPermissions,
    createPermission,
    updatePermission,
    deletePermission: deletePermissionApi
  } = usePermissions();

  const {
    users: allUsers,
    fetchUsers
  } = useUsers();

  // Local state for UI
  const [userGroups, setUserGroups] = useState<UserGroupWithRole[]>([]);
  const [groupModalOpen, setGroupModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<UserGroupWithRole | null>(null);
  const [memberModalOpen, setMemberModalOpen] = useState(false);
  const [managingGroup, setManagingGroup] = useState<UserGroupWithRole | null>(null);
  const [openModules, setOpenModules] = useState<Record<string, boolean>>({});
  
  // Role management state
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<RoleDefinition | null>(null);
  const [deleteRoleDialogOpen, setDeleteRoleDialogOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<RoleResponse | null>(null);

  // Permission management state
  const [permissionModalOpen, setPermissionModalOpen] = useState(false);
  const [editingPermission, setEditingPermission] = useState<PermissionResponse | null>(null);
  const [deletePermissionDialogOpen, setDeletePermissionDialogOpen] = useState(false);
  const [permissionToDelete, setPermissionToDelete] = useState<PermissionResponse | null>(null);

  // Fetch data on mount
  useEffect(() => {
    fetchRoles();
    fetchGroups();
    fetchPermissions();
    fetchUsers({ page: 0, size: 100 }); // Fetch users for member lookup
  }, []);

  // Sync API groups to local state
  useEffect(() => {
    const syncGroups = async () => {
      const groupsWithRoles = await Promise.all(
        apiGroups.map(async (group) => {
          const roleIds = await getRolesByGroup(group.id);
          return {
            id: group.id,
            name: group.name,
            description: group.description || undefined,
            members: [],
            permissions: [],
            roleId: roleIds[0] || undefined,
          } as UserGroupWithRole;
        })
      );
      setUserGroups(groupsWithRoles);
    };
    
    if (apiGroups.length > 0) {
      syncGroups();
    }
  }, [apiGroups]);

  // Convert API roles to RoleDefinition format
  const roles: RoleDefinition[] = apiRoles.map(role => ({
    id: role.id,
    name: role.name,
    description: role.system ? 'System role' : 'Custom role',
    userCount: 0,
    color: getRoleColor(role.name),
    isDefault: role.system,
  }));

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

  // Role handlers
  const handleCreateRole = () => {
    setEditingRole(null);
    setRoleModalOpen(true);
  };

  const handleEditRole = (role: RoleDefinition) => {
    setEditingRole(role);
    setRoleModalOpen(true);
  };

  const handleDeleteRoleClick = (role: RoleResponse) => {
    if (role.system) {
      toast.error('System roles cannot be deleted');
      return;
    }
    setRoleToDelete(role);
    setDeleteRoleDialogOpen(true);
  };

  const handleDeleteRole = async () => {
    if (roleToDelete) {
      const success = await deleteRoleApi(roleToDelete.id);
      if (success) {
        toast.success(`Role "${roleToDelete.name}" deleted`);
      } else {
        toast.error('Failed to delete role');
      }
      setDeleteRoleDialogOpen(false);
      setRoleToDelete(null);
    }
  };

  const handleRoleSubmit = async (data: { name: string; description?: string; color: string; permissions: RolePermissions }) => {
    if (editingRole) {
      const result = await updateRole(editingRole.id, { name: data.name, system: false });
      if (result) {
        toast.success('Role updated');
      }
    } else {
      const result = await createRole({ name: data.name, system: false });
      if (result) {
        toast.success(`Role "${data.name}" created`);
      }
    }
    setRoleModalOpen(false);
  };

  // User group handlers
  const handleCreateGroup = () => {
    setEditingGroup(null);
    setGroupModalOpen(true);
  };

  const handleEditGroup = (group: UserGroupWithRole) => {
    setEditingGroup(group);
    setGroupModalOpen(true);
  };

  const handleDeleteGroup = async (groupId: string) => {
    const success = await deleteGroupApi(groupId);
    if (success) {
      setUserGroups((prev) => prev.filter((g) => g.id !== groupId));
      toast.success('User group deleted');
    } else {
      toast.error('Failed to delete group');
    }
  };

  const handleManageMembers = async (group: UserGroupWithRole) => {
    // Fetch current members from API
    const memberUserIds = await getUsersByGroup(group.id);
    const members = memberUserIds
      .map(userId => {
        const user = allUsers.find(u => u.id === userId);
        if (!user) return null;
        return {
          id: `m-${userId}`,
          userId: user.id,
          userName: user.name,
          email: user.email,
          role: 'member',
          addedAt: new Date().toISOString(),
        } as GroupMember;
      })
      .filter((m): m is GroupMember => m !== null);
    
    const groupWithMembers = { ...group, members };
    setManagingGroup(groupWithMembers);
    setMemberModalOpen(true);
  };

  const handleGroupSubmit = async (data: { name: string; description?: string; assignToCategories: boolean; selectedCategories: string[]; roleId?: string }) => {
    if (editingGroup) {
      const result = await updateGroup(editingGroup.id, { name: data.name, description: data.description });
      if (result) {
        setUserGroups((prev) =>
          prev.map((g) =>
            g.id === editingGroup.id
              ? { ...g, name: data.name, description: data.description, roleId: data.roleId }
              : g
          )
        );
        // Assign role if provided
        if (data.roleId) {
          await assignRoleToGroup(editingGroup.id, data.roleId);
        }
        toast.success('User group updated');
      }
    } else {
      const result = await createGroup({ name: data.name, description: data.description });
      if (result) {
        const newGroup: UserGroupWithRole = {
          id: result.id,
          name: result.name,
          description: result.description || undefined,
          members: [],
          permissions: [],
          roleId: data.roleId,
        };
        setUserGroups((prev) => [...prev, newGroup]);
        // Assign role if provided
        if (data.roleId) {
          await assignRoleToGroup(result.id, data.roleId);
        }
        toast.success(`User group "${data.name}" created`);
      }
    }
    setGroupModalOpen(false);
  };

  const handleAddMember = async (groupId: string, userId: string) => {
    const user = allUsers.find(u => u.id === userId);
    
    if (!user) {
      toast.error('User not found');
      return;
    }
    
    const success = await addUserToGroup(userId, groupId);
    if (success) {
      const newMember: GroupMember = {
        id: `m-${userId}`,
        userId: user.id,
        userName: user.name,
        email: user.email,
        role: 'member',
        addedAt: new Date().toISOString(),
      };
      
      // Update managing group state for modal
      setManagingGroup((prev) => {
        if (!prev || prev.id !== groupId) return prev;
        return { ...prev, members: [...prev.members, newMember] };
      });
      
      // Update user groups state
      setUserGroups((prev) =>
        prev.map((g) => {
          if (g.id === groupId) {
            return { ...g, members: [...g.members, newMember] };
          }
          return g;
        })
      );
      toast.success(`${user.name} added to group`);
    } else {
      toast.error('Failed to add member');
    }
  };

  const handleRemoveMember = async (groupId: string, userId: string) => {
    const member = managingGroup?.members.find(m => m.userId === userId);
    const success = await removeUserFromGroup(userId, groupId);
    if (success) {
      // Update managing group state for modal
      setManagingGroup((prev) => {
        if (!prev || prev.id !== groupId) return prev;
        return { ...prev, members: prev.members.filter((m) => m.userId !== userId) };
      });
      
      // Update user groups state
      setUserGroups((prev) =>
        prev.map((g) => {
          if (g.id === groupId) {
            return { ...g, members: g.members.filter((m) => m.userId !== userId) };
          }
          return g;
        })
      );
      toast.success(`${member?.userName || 'Member'} removed from group`);
    } else {
      toast.error('Failed to remove member');
    }
  };

  // Permission handlers
  const handleCreatePermission = () => {
    setEditingPermission(null);
    setPermissionModalOpen(true);
  };

  const handleEditPermission = (permission: PermissionResponse) => {
    setEditingPermission(permission);
    setPermissionModalOpen(true);
  };

  const handleDeletePermissionClick = (permission: PermissionResponse) => {
    setPermissionToDelete(permission);
    setDeletePermissionDialogOpen(true);
  };

  const handleDeletePermission = async () => {
    if (permissionToDelete) {
      const success = await deletePermissionApi(permissionToDelete.id);
      if (success) {
        toast.success('Permission deleted');
      } else {
        toast.error('Failed to delete permission');
      }
      setDeletePermissionDialogOpen(false);
      setPermissionToDelete(null);
    }
  };

  const handlePermissionSubmit = async (data: PermissionRequest): Promise<boolean> => {
    if (editingPermission) {
      const result = await updatePermission(editingPermission.id, data);
      if (result) {
        toast.success('Permission updated');
        return true;
      }
      toast.error('Failed to update permission');
      return false;
    } else {
      const result = await createPermission(data);
      if (result) {
        toast.success('Permission created');
        return true;
      }
      toast.error('Failed to create permission');
      return false;
    }
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
    const csvContent = 'Module,View,Create,Edit,Delete,Publish,Manage\n' +
      apiPermissions.map(p => 
        `${p.module},${p.view},${p.create},${p.edit},${p.delete},${p.publish},${p.manage}`
      ).join('\n');
    
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

  // Get role name by ID for display
  const getRoleName = (roleId?: string) => {
    const role = apiRoles.find(r => r.id === roleId);
    return role?.name || 'No Role';
  };

  const getRoleColorById = (roleId?: string) => {
    const role = apiRoles.find(r => r.id === roleId);
    return role ? getRoleColor(role.name) : 'bg-gray-500/15 text-gray-500 border-gray-500/30';
  };

  const isLoading = rolesLoading || groupsLoading || permissionsLoading;

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

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
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
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">User Groups</CardTitle>
                    <CardDescription>
                      Groups are associated with roles to define access levels
                    </CardDescription>
                  </div>
                  <Button onClick={handleCreateGroup}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Group
                  </Button>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Group Name</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Associated Role</TableHead>
                        <TableHead>Members</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {userGroups.map((group) => (
                        <TableRow key={group.id}>
                          <TableCell className="font-medium">{group.name}</TableCell>
                          <TableCell className="text-muted-foreground text-sm max-w-[200px] truncate">
                            {group.description || '—'}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={getRoleColorById(group.roleId)}>
                              {getRoleName(group.roleId)}
                            </Badge>
                          </TableCell>
                          <TableCell>{group.members.length} members</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                               <DropdownMenuContent align="end">
                                 <DropdownMenuItem
                                   onSelect={(e) => {
                                     e.preventDefault();
                                     void handleManageMembers(group);
                                   }}
                                 >
                                   <Users className="w-4 h-4 mr-2" />
                                   Manage Members
                                 </DropdownMenuItem>
                                 <DropdownMenuItem
                                   onSelect={(e) => {
                                     e.preventDefault();
                                     handleEditGroup(group);
                                   }}
                                 >
                                   <Pencil className="w-4 h-4 mr-2" />
                                   Edit
                                 </DropdownMenuItem>
                                 <DropdownMenuItem
                                   onSelect={(e) => {
                                     e.preventDefault();
                                     void handleDeleteGroup(group.id);
                                   }}
                                   className="text-destructive"
                                 >
                                   <Trash2 className="w-4 h-4 mr-2" />
                                   Delete
                                 </DropdownMenuItem>
                               </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                      {userGroups.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                            No user groups created yet
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Roles Tab */}
            <TabsContent value="roles" className="mt-6 space-y-6">
              {/* Role Definitions */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Shield className="w-5 h-5" />
                      Role Definitions
                    </CardTitle>
                    <CardDescription>
                      Create and manage roles with their descriptions
                    </CardDescription>
                  </div>
                  <Button onClick={handleCreateRole}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Role
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {apiRoles.map((role) => (
                      <Card key={role.id} className="border hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3 flex-1 min-w-0">
                              <div className={`p-2 rounded-lg ${getRoleColor(role.name)}`}>
                                <Shield className="w-5 h-5" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <h3 className="font-semibold text-foreground">{role.name}</h3>
                                  {role.system && (
                                    <Badge variant="secondary" className="text-xs">System</Badge>
                                  )}
                                </div>
                                <p className="text-xs text-muted-foreground mt-1 line-clamp-3">
                                  {role.system ? 'System role with predefined permissions' : 'Custom role'}
                                </p>
                              </div>
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleEditRole({
                                  id: role.id,
                                  name: role.name,
                                  description: role.system ? 'System role' : 'Custom role',
                                  userCount: 0,
                                  color: getRoleColor(role.name),
                                  isDefault: role.system,
                                })}>
                                  <Pencil className="w-4 h-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => handleDeleteRoleClick(role)}
                                  className="text-destructive"
                                  disabled={role.system}
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
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
                    roles={apiRoles}
                    permissions={apiPermissions}
                  />
                ))}
              </div>

              {/* Permissions List */}
              <Card className="mt-6">
                <CardHeader className="pb-3 flex flex-row items-center justify-between">
                  <CardTitle className="text-base">All Permissions</CardTitle>
                  <Button size="sm" onClick={handleCreatePermission}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Permission
                  </Button>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Module</TableHead>
                        <TableHead className="text-center">View</TableHead>
                        <TableHead className="text-center">Create</TableHead>
                        <TableHead className="text-center">Edit</TableHead>
                        <TableHead className="text-center">Delete</TableHead>
                        <TableHead className="text-center">Publish</TableHead>
                        <TableHead className="text-center">Manage</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {apiPermissions.map((permission) => (
                        <TableRow key={permission.id}>
                          <TableCell className="font-medium">{permission.module}</TableCell>
                          <TableCell className="text-center">
                            <PermissionCell allowed={permission.view} />
                          </TableCell>
                          <TableCell className="text-center">
                            <PermissionCell allowed={permission.create} />
                          </TableCell>
                          <TableCell className="text-center">
                            <PermissionCell allowed={permission.edit} />
                          </TableCell>
                          <TableCell className="text-center">
                            <PermissionCell allowed={permission.delete} />
                          </TableCell>
                          <TableCell className="text-center">
                            <PermissionCell allowed={permission.publish} />
                          </TableCell>
                          <TableCell className="text-center">
                            <PermissionCell allowed={permission.manage} />
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleEditPermission(permission)}>
                                  <Pencil className="w-4 h-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => handleDeletePermissionClick(permission)}
                                  className="text-destructive"
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                      {apiPermissions.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                            No permissions configured
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}

        {/* Modals */}
        <UserGroupFormModal
          open={groupModalOpen}
          onClose={() => setGroupModalOpen(false)}
          onSubmit={handleGroupSubmit}
          group={editingGroup}
          categories={mockCategories}
          roles={roles}
        />

        <MemberManagementModal
          open={memberModalOpen}
          onClose={() => setMemberModalOpen(false)}
          group={currentManagingGroup}
          allUsers={allUsers}
          onAddMember={handleAddMember}
          onRemoveMember={handleRemoveMember}
        />

        <RoleFormModal
          open={roleModalOpen}
          onClose={() => setRoleModalOpen(false)}
          onSubmit={handleRoleSubmit}
          role={editingRole}
        />

        {/* Delete Role Confirmation Dialog */}
        <AlertDialog open={deleteRoleDialogOpen} onOpenChange={setDeleteRoleDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Role</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete the role "{roleToDelete?.name}"? 
                User groups associated with this role will be reassigned to "Viewer".
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteRole}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Permission Form Modal */}
        <PermissionFormModal
          open={permissionModalOpen}
          onClose={() => {
            setPermissionModalOpen(false);
            setEditingPermission(null);
          }}
          permission={editingPermission}
          onSubmit={handlePermissionSubmit}
        />

        {/* Delete Permission Confirmation Dialog */}
        <AlertDialog open={deletePermissionDialogOpen} onOpenChange={setDeletePermissionDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Permission</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete the permission for module "{permissionToDelete?.module}"? 
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeletePermission}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </DashboardLayout>
  );
}
