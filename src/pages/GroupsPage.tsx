import { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Layers, Plus, Trash2, Loader2, Pencil, Users, UserPlus, X, RefreshCw, Eye, Search } from 'lucide-react';
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
import { useGroupsQuery, useCreateGroup, useUpdateGroup, useDeleteGroup, useGroup } from '@/api/hooks/useGroups';
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
  const createMutation = useCreateGroup();
  const updateMutation = useUpdateGroup();
  const deleteMutation = useDeleteGroup();

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
  const [selectedGroup, setSelectedGroup] = useState<GroupResponseDto | null>(null);
  const [userSearchQuery, setUserSearchQuery] = useState('');

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
    setSelectedGroup(group);
    setUserSheetOpen(true);
    setUserSearchQuery('');
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

  // Filter users in selected group based on search
  const filteredUsers = useMemo(() => {
    if (!selectedGroup?.users) return [];
    if (!userSearchQuery.trim()) return selectedGroup.users;
    const query = userSearchQuery.toLowerCase();
    return selectedGroup.users.filter(
      u => u.name.toLowerCase().includes(query) || u.email.toLowerCase().includes(query)
    );
  }, [selectedGroup, userSearchQuery]);

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
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              {selectedGroup?.name}
            </SheetTitle>
            <SheetDescription>
              {selectedGroup?.users?.length || 0} user{(selectedGroup?.users?.length || 0) !== 1 ? 's' : ''} in this group
            </SheetDescription>
          </SheetHeader>
          
          <div className="mt-6 space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={userSearchQuery}
                onChange={(e) => setUserSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* User List */}
            <ScrollArea className="h-[calc(100vh-280px)]">
              {filteredUsers.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="w-10 h-10 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">
                    {userSearchQuery ? 'No users match your search' : 'No users in this group'}
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredUsers.map((user) => (
                    <div 
                      key={user.id} 
                      className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{user.name}</p>
                        <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                      </div>
                      <Badge variant="secondary" className="ml-2">ID: {user.id}</Badge>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>

            {/* Add User Section */}
            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground mb-2">
                To add users to this group, go to User Management and assign groups to individual users.
              </p>
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
