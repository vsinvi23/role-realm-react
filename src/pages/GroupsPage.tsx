import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Layers, Plus, Trash2, Loader2, Pencil, Users } from 'lucide-react';
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
import { useGroupsQuery, useCreateGroup, useUpdateGroup, useDeleteGroup } from '@/api/hooks/useGroups';
import { GroupResponseDto } from '@/api/types';

export default function GroupsPage() {
  const [page, setPage] = useState(0);
  const size = 10;
  
  const { data, isLoading, refetch } = useGroupsQuery({ page, size });
  const createMutation = useCreateGroup();
  const updateMutation = useUpdateGroup();
  const deleteMutation = useDeleteGroup();

  const [formOpen, setFormOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<GroupResponseDto | null>(null);
  const [groupName, setGroupName] = useState('');
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState<GroupResponseDto | null>(null);

  const groups = data?.items || [];
  const totalElements = data?.totalElements || 0;
  const totalPages = Math.ceil(totalElements / size);

  const handleOpenCreate = () => {
    setEditingGroup(null);
    setGroupName('');
    setFormOpen(true);
  };

  const handleOpenEdit = (group: GroupResponseDto) => {
    setEditingGroup(group);
    setGroupName(group.name);
    setFormOpen(true);
  };

  const handleDeleteClick = (group: GroupResponseDto) => {
    setGroupToDelete(group);
    setDeleteDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!groupName.trim()) {
      toast.error('Group name is required');
      return;
    }

    try {
      if (editingGroup) {
        await updateMutation.mutateAsync({ id: editingGroup.id, data: { name: groupName } });
        toast.success(`Group "${groupName}" updated`);
      } else {
        await createMutation.mutateAsync({ name: groupName });
        toast.success(`Group "${groupName}" created`);
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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Groups</h1>
            <p className="text-muted-foreground">Manage user groups for access control</p>
          </div>
          <Button onClick={handleOpenCreate} className="gap-2">
            <Plus className="w-4 h-4" />
            Create Group
          </Button>
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
                No groups created yet. Create your first group to get started.
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
                          <Badge variant="secondary" className="gap-1">
                            <Users className="w-3 h-3" />
                            {group.users?.length || 0}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(group)}>
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(group)}>
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingGroup ? 'Edit Group' : 'Create Group'}</DialogTitle>
            <DialogDescription>
              {editingGroup ? 'Update the group name.' : 'Enter a name for the new group.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Group Name</Label>
              <Input
                id="name"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="e.g., ADMIN, EDITORS, VIEWERS"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFormOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {(createMutation.isPending || updateMutation.isPending) && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              {editingGroup ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Group</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{groupToDelete?.name}"? This action cannot be undone.
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
