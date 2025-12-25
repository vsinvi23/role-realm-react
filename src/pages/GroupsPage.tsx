import { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Layers, Plus, Trash2, Loader2, Pencil, Users, UserPlus, X, RefreshCw, Eye, Search, UserMinus } from 'lucide-react';
import { toast } from 'sonner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  useGroupsQuery, 
  useCreateGroup, 
  useUpdateGroup, 
  useDeleteGroup, 
  useGroupMembers, 
  useAddGroupMember, 
  useRemoveGroupMember 
} from '@/api/hooks/useGroups';
import { useUsersQuery } from '@/api/hooks/useUsers';
import { useCategoriesPaged } from '@/api/hooks/useCategories';
import { GroupResponseDto, GroupUserDto } from '@/api/types';

// Content types for group naming
const CONTENT_TYPES = [
  { value: 'ARTICLE', label: 'Article' },
  { value: 'COURSE', label: 'Course' },
];

// Permission types for group naming
const PERMISSION_TYPES = [
  { value: 'CREATE', label: 'Create' },
  { value: 'PUBLISH', label: 'Publish' },
  { value: 'MANAGE', label: 'Manage' },
  { value: 'ADMIN', label: 'Admin' },
];

export default function GroupsPage() {
  const [page, setPage] = useState(0);
  const size = 10;
  
  const { data, isLoading, refetch } = useGroupsQuery({ page, size });
  const { data: categoriesData } = useCategoriesPaged({ page: 0, size: 100 });
  const { data: usersData } = useUsersQuery({ page: 0, size: 100 });
  const createMutation = useCreateGroup();
  const updateMutation = useUpdateGroup();
  const deleteMutation = useDeleteGroup();
  const addMemberMutation = useAddGroupMember();
  const removeMemberMutation = useRemoveGroupMember();

  // Create mode states
  const [formOpen, setFormOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<GroupResponseDto | null>(null);
  const [groupName, setGroupName] = useState('');
  const [isManualName, setIsManualName] = useState(false);
  
  // Dropdown selections for auto-generated name
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedContentType, setSelectedContentType] = useState<string>('');
  const [selectedPermission, setSelectedPermission] = useState<string>('');
  
  // Delete dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState<GroupResponseDto | null>(null);

  // User management sheet
  const [userSheetOpen, setUserSheetOpen] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
  const [selectedGroupName, setSelectedGroupName] = useState('');
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [addUserSearchQuery, setAddUserSearchQuery] = useState('');

  // Fetch members for selected group
  const { data: groupMembers, isLoading: membersLoading, refetch: refetchMembers } = useGroupMembers(
    selectedGroupId || 0,
    selectedGroupId !== null && userSheetOpen
  );

  const groups = data?.items || [];
  const totalElements = data?.totalElements || 0;
  const totalPages = Math.ceil(totalElements / size);
  const categories = categoriesData?.items || [];

  // Generate group name from selections
  const generatedName = useMemo(() => {
    if (isManualName) return groupName;
    const parts: string[] = [];
    if (selectedCategory) {
      const cat = categories.find(c => c.id.toString() === selectedCategory);
      if (cat) parts.push(cat.name);
    }
    if (selectedContentType) parts.push(selectedContentType);
    if (selectedPermission) parts.push(selectedPermission);
    return parts.join('_');
  }, [selectedCategory, selectedContentType, selectedPermission, categories, isManualName, groupName]);

  const handleOpenCreate = () => {
    setEditingGroup(null);
    setGroupName('');
    setIsManualName(false);
    setSelectedCategory('');
    setSelectedContentType('');
    setSelectedPermission('');
    setFormOpen(true);
  };

  const handleOpenEdit = (group: GroupResponseDto) => {
    setEditingGroup(group);
    setGroupName(group.name);
    setIsManualName(true);
    setSelectedCategory('');
    setSelectedContentType('');
    setSelectedPermission('');
    setFormOpen(true);
  };

  const handleDeleteClick = (group: GroupResponseDto) => {
    setGroupToDelete(group);
    setDeleteDialogOpen(true);
  };

  const handleViewUsers = (group: GroupResponseDto) => {
    setSelectedGroupId(group.id);
    setSelectedGroupName(group.name);
    setUserSheetOpen(true);
    setUserSearchQuery('');
    setAddUserSearchQuery('');
  };

  const handleSubmit = async () => {
    const finalName = isManualName ? groupName : generatedName;
    
    if (!finalName.trim()) {
      toast.error('Group name is required');
      return;
    }

    try {
      if (editingGroup) {
        await updateMutation.mutateAsync({ id: editingGroup.id, data: { name: finalName } });
        toast.success(`Group "${finalName}" updated`);
      } else {
        await createMutation.mutateAsync({ name: finalName });
        toast.success(`Group "${finalName}" created`);
      }
      setFormOpen(false);
      setGroupName('');
      setEditingGroup(null);
    } catch (error) {
      toast.error(editingGroup ? 'Failed to update group' : 'Failed to create group');
    }
  };

  const handleDelete = async () => {
    if (!groupToDelete) return;
    
    try {
      await deleteMutation.mutateAsync(groupToDelete.id);
      toast.success(`Group "${groupToDelete.name}" deleted`);
    } catch (error) {
      toast.error('Failed to delete group');
    } finally {
      setDeleteDialogOpen(false);
      setGroupToDelete(null);
    }
  };

  const handleAddMember = async (userId: number, userName: string) => {
    if (!selectedGroupId) return;
    
    try {
      await addMemberMutation.mutateAsync({ groupId: selectedGroupId, userId });
      toast.success(`Added "${userName}" to group`);
      refetchMembers();
      refetch();
    } catch (error) {
      toast.error('Failed to add user to group');
    }
  };

  const handleRemoveMember = async (userId: number, userName: string) => {
    if (!selectedGroupId) return;
    
    try {
      await removeMemberMutation.mutateAsync({ groupId: selectedGroupId, userId });
      toast.success(`Removed "${userName}" from group`);
      refetchMembers();
      refetch();
    } catch (error) {
      toast.error('Failed to remove user from group');
    }
  };

  // Filter members based on search
  const filteredMembers = useMemo(() => {
    const members = groupMembers || [];
    if (!userSearchQuery.trim()) return members;
    const query = userSearchQuery.toLowerCase();
    return members.filter(
      u => u.name.toLowerCase().includes(query) || u.email.toLowerCase().includes(query)
    );
  }, [groupMembers, userSearchQuery]);

  // Filter available users for adding (exclude current members)
  const availableUsers = useMemo(() => {
    const allUsers = usersData?.items || [];
    const memberIds = new Set((groupMembers || []).map(m => m.id));
    const filtered = allUsers.filter(u => !memberIds.has(u.id));
    
    if (!addUserSearchQuery.trim()) return filtered.slice(0, 10); // Limit to 10 for performance
    const query = addUserSearchQuery.toLowerCase();
    return filtered.filter(
      u => u.name.toLowerCase().includes(query) || u.email.toLowerCase().includes(query)
    ).slice(0, 10);
  }, [usersData, groupMembers, addUserSearchQuery]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Groups</h1>
            <p className="text-muted-foreground">Manage user groups for access control</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={() => refetch()} title="Refresh">
              <RefreshCw className="w-4 h-4" />
            </Button>
            <Button onClick={handleOpenCreate} className="gap-2">
              <Plus className="w-4 h-4" />
              Create Group
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layers className="w-5 h-5" />
              All Groups
            </CardTitle>
            <CardDescription>
              {totalElements} group{totalElements !== 1 ? 's' : ''} total
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin" />
              </div>
            ) : groups.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Layers className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No groups created yet.</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={handleOpenCreate}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create your first group
                </Button>
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Members</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {groups.map((group) => (
                      <TableRow key={group.id}>
                        <TableCell className="font-mono text-muted-foreground">{group.id}</TableCell>
                        <TableCell className="font-medium">{group.name}</TableCell>
                        <TableCell>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="gap-1 h-7 px-2"
                            onClick={() => handleViewUsers(group)}
                          >
                            <Users className="w-3 h-3" />
                            {group.users?.length || 0} users
                          </Button>
                        </TableCell>
                        <TableCell className="text-right space-x-1">
                          <Button variant="ghost" size="icon" onClick={() => handleViewUsers(group)} title="View Users">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(group)} title="Edit">
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(group)} title="Delete">
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-4">
                    <p className="text-sm text-muted-foreground">
                      Page {page + 1} of {totalPages}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(p => Math.max(0, p - 1))}
                        disabled={page === 0}
                      >
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(p => p + 1)}
                        disabled={page >= totalPages - 1}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingGroup ? 'Edit Group' : 'Create Group'}</DialogTitle>
            <DialogDescription>
              {editingGroup 
                ? 'Update the group name.' 
                : 'Create a group using dropdowns or enter a custom name.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {!editingGroup && (
              <>
                <div className="flex items-center gap-2 mb-4">
                  <Button 
                    variant={!isManualName ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setIsManualName(false)}
                  >
                    Use Dropdowns
                  </Button>
                  <Button 
                    variant={isManualName ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setIsManualName(true)}
                  >
                    Custom Name
                  </Button>
                </div>

                {!isManualName && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>1. Category</Label>
                      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent className="bg-background border shadow-lg z-50">
                          {categories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id.toString()}>
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>2. Content Type</Label>
                      <Select value={selectedContentType} onValueChange={setSelectedContentType}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select content type" />
                        </SelectTrigger>
                        <SelectContent className="bg-background border shadow-lg z-50">
                          {CONTENT_TYPES.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>3. Permission</Label>
                      <Select value={selectedPermission} onValueChange={setSelectedPermission}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select permission" />
                        </SelectTrigger>
                        <SelectContent className="bg-background border shadow-lg z-50">
                          {PERMISSION_TYPES.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {generatedName && (
                      <div className="p-3 bg-muted rounded-lg">
                        <Label className="text-xs text-muted-foreground">Generated Name</Label>
                        <p className="font-mono text-lg font-semibold">{generatedName}</p>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}

            {(isManualName || editingGroup) && (
              <div className="space-y-2">
                <Label htmlFor="name">Group Name</Label>
                <Input
                  id="name"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="e.g., JAVA_ARTICLE_CREATE"
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFormOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={createMutation.isPending || updateMutation.isPending || (!isManualName && !generatedName) || (isManualName && !groupName)}
            >
              {(createMutation.isPending || updateMutation.isPending) && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              {editingGroup ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* User Management Sheet */}
      <Sheet open={userSheetOpen} onOpenChange={setUserSheetOpen}>
        <SheetContent className="sm:max-w-lg">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              {selectedGroupName}
            </SheetTitle>
            <SheetDescription>
              {groupMembers?.length || 0} user{(groupMembers?.length || 0) !== 1 ? 's' : ''} in this group
            </SheetDescription>
          </SheetHeader>
          
          <div className="mt-6 space-y-4">
            {/* Add User Section */}
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <UserPlus className="w-4 h-4" />
                Add User to Group
              </Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search users to add..."
                  value={addUserSearchQuery}
                  onChange={(e) => setAddUserSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              {addUserSearchQuery && (
                <div className="border rounded-lg max-h-40 overflow-y-auto">
                  {availableUsers.length === 0 ? (
                    <p className="text-sm text-muted-foreground p-3 text-center">No users found</p>
                  ) : (
                    availableUsers.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center justify-between p-2 hover:bg-muted/50 cursor-pointer transition-colors"
                        onClick={() => handleAddMember(user.id, user.name)}
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{user.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                        </div>
                        <Button variant="ghost" size="sm" className="h-7 gap-1">
                          {addMemberMutation.isPending ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <>
                              <Plus className="w-3 h-3" />
                              Add
                            </>
                          )}
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            <div className="border-t pt-4">
              <Label className="text-sm font-medium mb-2 block">Current Members</Label>
              {/* Search Members */}
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search members..."
                  value={userSearchQuery}
                  onChange={(e) => setUserSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>

              {/* Member List */}
              <ScrollArea className="h-[calc(100vh-450px)]">
                {membersLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="w-5 h-5 animate-spin" />
                  </div>
                ) : filteredMembers.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Users className="w-10 h-10 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">
                      {userSearchQuery ? 'No users match your search' : 'No users in this group'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {filteredMembers.map((user) => (
                      <div 
                        key={user.id} 
                        className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{user.name}</p>
                          <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => handleRemoveMember(user.id, user.name)}
                          disabled={removeMemberMutation.isPending}
                        >
                          {removeMemberMutation.isPending ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <>
                              <UserMinus className="w-3 h-3 mr-1" />
                              Remove
                            </>
                          )}
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Group</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{groupToDelete?.name}"? 
              {groupToDelete?.users && groupToDelete.users.length > 0 && (
                <span className="block mt-2 text-destructive">
                  Warning: This group has {groupToDelete.users.length} users assigned.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete} 
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}
