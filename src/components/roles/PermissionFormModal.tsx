import { useState, useEffect } from 'react';
import { PermissionResponse, PermissionRequest } from '@/api/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';

interface PermissionFormModalProps {
  open: boolean;
  onClose: () => void;
  permission: PermissionResponse | null;
  onSubmit: (data: PermissionRequest) => Promise<boolean>;
}

export function PermissionFormModal({ open, onClose, permission, onSubmit }: PermissionFormModalProps) {
  const [module, setModule] = useState('');
  const [view, setView] = useState(false);
  const [create, setCreate] = useState(false);
  const [edit, setEdit] = useState(false);
  const [deleteP, setDeleteP] = useState(false);
  const [publish, setPublish] = useState(false);
  const [manage, setManage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (permission) {
      setModule(permission.module);
      setView(permission.view);
      setCreate(permission.create);
      setEdit(permission.edit);
      setDeleteP(permission.delete);
      setPublish(permission.publish);
      setManage(permission.manage);
    } else {
      setModule('');
      setView(false);
      setCreate(false);
      setEdit(false);
      setDeleteP(false);
      setPublish(false);
      setManage(false);
    }
  }, [permission, open]);

  const handleSubmit = async () => {
    if (!module.trim()) return;
    
    setIsSubmitting(true);
    const success = await onSubmit({
      module: module.trim(),
      view,
      create,
      edit,
      delete: deleteP,
      publish,
      manage,
    });
    setIsSubmitting(false);
    
    if (success) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{permission ? 'Edit Permission' : 'Create Permission'}</DialogTitle>
          <DialogDescription>
            {permission ? 'Update module permissions' : 'Create a new module permission set'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="module">Module Name</Label>
            <Input
              id="module"
              value={module}
              onChange={(e) => setModule(e.target.value)}
              placeholder="e.g., User_Management"
              disabled={!!permission}
            />
          </div>

          <div className="space-y-3">
            <Label>Permission Actions</Label>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="view" className="font-normal">View / Read</Label>
              <Switch id="view" checked={view} onCheckedChange={setView} />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="create" className="font-normal">Create</Label>
              <Switch id="create" checked={create} onCheckedChange={setCreate} />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="edit" className="font-normal">Edit / Update</Label>
              <Switch id="edit" checked={edit} onCheckedChange={setEdit} />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="delete" className="font-normal">Delete</Label>
              <Switch id="delete" checked={deleteP} onCheckedChange={setDeleteP} />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="publish" className="font-normal">Publish / Unpublish</Label>
              <Switch id="publish" checked={publish} onCheckedChange={setPublish} />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="manage" className="font-normal">Full Manage</Label>
              <Switch id="manage" checked={manage} onCheckedChange={setManage} />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting || !module.trim()}>
            {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {permission ? 'Save Changes' : 'Create Permission'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
