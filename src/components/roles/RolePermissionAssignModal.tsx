import { useState, useEffect, useMemo } from 'react';
import { RoleResponse, PermissionResponse } from '@/api/types';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Loader2, Shield, Check, X } from 'lucide-react';

interface RolePermissionAssignModalProps {
  open: boolean;
  onClose: () => void;
  role: RoleResponse | null;
  allPermissions: PermissionResponse[];
  assignedPermissionIds: string[];
  onAssign: (roleId: string, permissionId: string) => Promise<boolean>;
  onRemove: (roleId: string, permissionId: string) => Promise<boolean>;
  isLoading?: boolean;
}

export function RolePermissionAssignModal({
  open,
  onClose,
  role,
  allPermissions,
  assignedPermissionIds,
  onAssign,
  onRemove,
  isLoading = false,
}: RolePermissionAssignModalProps) {
  const [localAssigned, setLocalAssigned] = useState<Set<string>>(new Set());
  const [pendingChanges, setPendingChanges] = useState<Map<string, 'add' | 'remove'>>(new Map());
  const [saving, setSaving] = useState(false);

  // Sync local state with props
  useEffect(() => {
    setLocalAssigned(new Set(assignedPermissionIds));
    setPendingChanges(new Map());
  }, [assignedPermissionIds, open]);

  const handleToggle = (permissionId: string) => {
    const isCurrentlyAssigned = assignedPermissionIds.includes(permissionId);
    const isLocallyAssigned = localAssigned.has(permissionId);

    setLocalAssigned((prev) => {
      const next = new Set(prev);
      if (isLocallyAssigned) {
        next.delete(permissionId);
      } else {
        next.add(permissionId);
      }
      return next;
    });

    setPendingChanges((prev) => {
      const next = new Map(prev);
      if (isCurrentlyAssigned && isLocallyAssigned) {
        next.set(permissionId, 'remove');
      } else if (!isCurrentlyAssigned && !isLocallyAssigned) {
        next.set(permissionId, 'add');
      } else {
        next.delete(permissionId);
      }
      return next;
    });
  };

  const handleSave = async () => {
    if (!role || pendingChanges.size === 0) {
      onClose();
      return;
    }

    setSaving(true);
    try {
      const promises: Promise<boolean>[] = [];
      
      pendingChanges.forEach((action, permissionId) => {
        if (action === 'add') {
          promises.push(onAssign(role.id, permissionId));
        } else {
          promises.push(onRemove(role.id, permissionId));
        }
      });

      await Promise.all(promises);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const hasChanges = pendingChanges.size > 0;

  if (!role) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[85vh] flex flex-col overflow-hidden">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Assign Permissions - {role.name}
          </DialogTitle>
          <DialogDescription>
            Select which permissions to assign to this role.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : (
          <div className="flex-1 min-h-0 overflow-y-auto pr-4">
            <div className="space-y-2">
              {allPermissions.map((permission) => {
                const isAssigned = localAssigned.has(permission.id);
                const pendingAction = pendingChanges.get(permission.id);

                return (
                  <div
                    key={permission.id}
                    className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                      isAssigned
                        ? 'bg-primary/5 border-primary/20'
                        : 'bg-background border-border hover:bg-muted/50'
                    }`}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <Checkbox
                        checked={isAssigned}
                        onCheckedChange={() => handleToggle(permission.id)}
                      />
                      <div>
                        <p className="font-medium text-sm">{permission.module}</p>
                        <div className="flex items-center gap-1 mt-1 flex-wrap">
                          {permission.view && (
                            <Badge variant="outline" className="text-xs py-0 px-1">View</Badge>
                          )}
                          {permission.create && (
                            <Badge variant="outline" className="text-xs py-0 px-1">Create</Badge>
                          )}
                          {permission.edit && (
                            <Badge variant="outline" className="text-xs py-0 px-1">Edit</Badge>
                          )}
                          {permission.delete && (
                            <Badge variant="outline" className="text-xs py-0 px-1">Delete</Badge>
                          )}
                          {permission.publish && (
                            <Badge variant="outline" className="text-xs py-0 px-1">Publish</Badge>
                          )}
                          {permission.manage && (
                            <Badge variant="outline" className="text-xs py-0 px-1">Manage</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    {pendingAction && (
                      <Badge 
                        variant={pendingAction === 'add' ? 'default' : 'destructive'}
                        className="text-xs"
                      >
                        {pendingAction === 'add' ? (
                          <>
                            <Check className="w-3 h-3 mr-1" />
                            Adding
                          </>
                        ) : (
                          <>
                            <X className="w-3 h-3 mr-1" />
                            Removing
                          </>
                        )}
                      </Badge>
                    )}
                  </div>
                );
              })}

              {allPermissions.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No permissions available. Create permissions first.
                </div>
              )}
            </div>
          </div>
        )}

        <DialogFooter className="flex-shrink-0 gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving || !hasChanges}>
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              `Save Changes${hasChanges ? ` (${pendingChanges.size})` : ''}`
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
