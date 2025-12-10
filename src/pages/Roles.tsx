import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Users, Eye, Settings2, Plus } from 'lucide-react';
import { UserGroupList } from '@/components/roles/UserGroupList';
import { UserGroupFormModal } from '@/components/roles/UserGroupFormModal';
import { MemberManagementModal } from '@/components/roles/MemberManagementModal';
import { mockUserGroups, mockCategories } from '@/data/mockContent';
import { UserGroup, GroupMember } from '@/types/content';
import { toast } from 'sonner';

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

export default function RolesPage() {
  const [userGroups, setUserGroups] = useState<UserGroup[]>(mockUserGroups);
  const [groupModalOpen, setGroupModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<UserGroup | null>(null);
  const [memberModalOpen, setMemberModalOpen] = useState(false);
  const [managingGroup, setManagingGroup] = useState<UserGroup | null>(null);

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
    // Update the managingGroup state to reflect changes
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

  // Keep managingGroup in sync with userGroups
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

        <Tabs defaultValue="groups" className="w-full">
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
          <TabsContent value="roles" className="mt-6">
            <div className="flex justify-end mb-4">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Role
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {roles.map((role) => (
                <Card key={role.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${colorClasses[role.color]}`}>
                          <Shield className="w-5 h-5" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{role.name}</CardTitle>
                          <CardDescription className="mt-1">{role.description}</CardDescription>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon">
                        <Settings2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 mb-4">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {role.userCount} users assigned
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {role.permissions.map((permission) => (
                        <Badge key={permission} variant="secondary" className="text-xs">
                          {permission}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Permissions Matrix Tab */}
          <TabsContent value="permissions" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Permissions Overview
                </CardTitle>
                <CardDescription>
                  Quick view of role capabilities across different modules
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Module</th>
                        <th className="text-center py-3 px-4 font-medium text-role-admin">Admin</th>
                        <th className="text-center py-3 px-4 font-medium text-role-moderator">Moderator</th>
                        <th className="text-center py-3 px-4 font-medium text-role-editor">Editor</th>
                        <th className="text-center py-3 px-4 font-medium text-role-viewer">Viewer</th>
                      </tr>
                    </thead>
                    <tbody>
                      {['User Management', 'Content', 'Courses', 'Articles', 'Analytics', 'Settings'].map((module) => (
                        <tr key={module} className="border-b">
                          <td className="py-3 px-4 font-medium">{module}</td>
                          <td className="text-center py-3 px-4">
                            <Badge className="bg-success/15 text-success border-success/30">Full</Badge>
                          </td>
                          <td className="text-center py-3 px-4">
                            <Badge className="bg-warning/15 text-warning border-warning/30">
                              {module === 'Settings' ? 'None' : 'Limited'}
                            </Badge>
                          </td>
                          <td className="text-center py-3 px-4">
                            <Badge className="bg-info/15 text-info border-info/30">
                              {['Content', 'Courses', 'Articles'].includes(module) ? 'Edit' : 'View'}
                            </Badge>
                          </td>
                          <td className="text-center py-3 px-4">
                            <Badge variant="secondary">View</Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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
