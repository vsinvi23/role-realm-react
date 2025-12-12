import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronUp, UserCog, FolderOpen, BookOpen, FileText, BarChart3, Settings } from 'lucide-react';

const roleColors = [
  { value: 'bg-red-500/15 text-red-500 border-red-500/30', label: 'Red' },
  { value: 'bg-orange-500/15 text-orange-500 border-orange-500/30', label: 'Orange' },
  { value: 'bg-amber-500/15 text-amber-500 border-amber-500/30', label: 'Amber' },
  { value: 'bg-yellow-500/15 text-yellow-500 border-yellow-500/30', label: 'Yellow' },
  { value: 'bg-lime-500/15 text-lime-500 border-lime-500/30', label: 'Lime' },
  { value: 'bg-green-500/15 text-green-500 border-green-500/30', label: 'Green' },
  { value: 'bg-emerald-500/15 text-emerald-500 border-emerald-500/30', label: 'Emerald' },
  { value: 'bg-teal-500/15 text-teal-500 border-teal-500/30', label: 'Teal' },
  { value: 'bg-cyan-500/15 text-cyan-500 border-cyan-500/30', label: 'Cyan' },
  { value: 'bg-sky-500/15 text-sky-500 border-sky-500/30', label: 'Sky' },
  { value: 'bg-blue-500/15 text-blue-500 border-blue-500/30', label: 'Blue' },
  { value: 'bg-indigo-500/15 text-indigo-500 border-indigo-500/30', label: 'Indigo' },
  { value: 'bg-violet-500/15 text-violet-500 border-violet-500/30', label: 'Violet' },
  { value: 'bg-purple-500/15 text-purple-500 border-purple-500/30', label: 'Purple' },
  { value: 'bg-fuchsia-500/15 text-fuchsia-500 border-fuchsia-500/30', label: 'Fuchsia' },
  { value: 'bg-pink-500/15 text-pink-500 border-pink-500/30', label: 'Pink' },
  { value: 'bg-rose-500/15 text-rose-500 border-rose-500/30', label: 'Rose' },
  { value: 'bg-gray-500/15 text-gray-500 border-gray-500/30', label: 'Gray' },
];

// Permission Definitions
export const permissionDefinitions = [
  { id: 'view', name: 'View / Read' },
  { id: 'list', name: 'List' },
  { id: 'search', name: 'Search' },
  { id: 'download', name: 'Download / Export' },
  { id: 'create', name: 'Create' },
  { id: 'edit', name: 'Edit / Update' },
  { id: 'publish', name: 'Publish / Unpublish' },
  { id: 'assign', name: 'Assign / Reassign' },
  { id: 'soft_delete', name: 'Soft Delete / Archive' },
  { id: 'hard_delete', name: 'Permanent Delete' },
  { id: 'manage_roles', name: 'Manage Roles' },
  { id: 'manage_permissions', name: 'Manage Permissions' },
  { id: 'configure', name: 'Configure Settings' },
  { id: 'integrations', name: 'Manage Integrations' },
  { id: 'notifications', name: 'Manage Notifications' },
];

// Module definitions
export const moduleDefinitions = [
  { id: 'user_management', name: 'User Management', icon: UserCog, color: 'text-orange-500' },
  { id: 'content', name: 'Content', icon: FolderOpen, color: 'text-blue-500' },
  { id: 'courses', name: 'Courses', icon: BookOpen, color: 'text-purple-500' },
  { id: 'articles', name: 'Articles', icon: FileText, color: 'text-green-500' },
  { id: 'analytics', name: 'Analytics', icon: BarChart3, color: 'text-cyan-500' },
  { id: 'settings', name: 'Settings', icon: Settings, color: 'text-gray-500' },
];

// Permission matrix type
export type RolePermissions = {
  [moduleId: string]: string[];
};

const roleSchema = z.object({
  name: z.string().trim().min(1, 'Role name is required').max(50, 'Role name must be less than 50 characters'),
  description: z.string().trim().max(200, 'Description must be less than 200 characters').optional(),
  color: z.string().min(1, 'Color is required'),
});

type RoleFormData = z.infer<typeof roleSchema>;

export interface RoleDefinition {
  id: string;
  name: string;
  description: string;
  userCount: number;
  color: string;
  isDefault?: boolean;
  permissions?: RolePermissions;
}

interface RoleFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: RoleFormData & { permissions: RolePermissions }) => void;
  role?: RoleDefinition | null;
}

// Default permissions for new roles
const getDefaultPermissions = (): RolePermissions => {
  const permissions: RolePermissions = {};
  moduleDefinitions.forEach(module => {
    permissions[module.id] = ['view', 'list', 'search'];
  });
  return permissions;
};

export function RoleFormModal({ open, onClose, onSubmit, role }: RoleFormModalProps) {
  const [permissions, setPermissions] = useState<RolePermissions>(getDefaultPermissions());
  const [openModules, setOpenModules] = useState<Record<string, boolean>>({});

  const form = useForm<RoleFormData>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      name: '',
      description: '',
      color: roleColors[0].value,
    },
  });

  useEffect(() => {
    if (open) {
      if (role) {
        form.reset({
          name: role.name,
          description: role.description || '',
          color: role.color,
        });
        setPermissions(role.permissions || getDefaultPermissions());
      } else {
        form.reset({
          name: '',
          description: '',
          color: roleColors[0].value,
        });
        setPermissions(getDefaultPermissions());
      }
      setOpenModules({});
    }
  }, [open, role, form]);

  const handleSubmit = (data: RoleFormData) => {
    onSubmit({ ...data, permissions });
    onClose();
  };

  const toggleModule = (moduleId: string) => {
    setOpenModules(prev => ({ ...prev, [moduleId]: !prev[moduleId] }));
  };

  const togglePermission = (moduleId: string, permissionId: string) => {
    setPermissions(prev => {
      const modulePerms = prev[moduleId] || [];
      if (modulePerms.includes(permissionId)) {
        return { ...prev, [moduleId]: modulePerms.filter(p => p !== permissionId) };
      } else {
        return { ...prev, [moduleId]: [...modulePerms, permissionId] };
      }
    });
  };

  const selectAllForModule = (moduleId: string) => {
    setPermissions(prev => ({
      ...prev,
      [moduleId]: permissionDefinitions.map(p => p.id),
    }));
  };

  const clearAllForModule = (moduleId: string) => {
    setPermissions(prev => ({
      ...prev,
      [moduleId]: [],
    }));
  };

  const getModulePermissionCount = (moduleId: string) => {
    return (permissions[moduleId] || []).length;
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{role ? 'Edit Role' : 'Create New Role'}</DialogTitle>
          <DialogDescription>
            {role ? 'Update the role details and permissions.' : 'Define a new role with custom permissions.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col flex-1 overflow-hidden">
            <ScrollArea className="flex-1 pr-4">
              <div className="space-y-4 pb-4">
                {/* Basic Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Role Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Content Manager" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="color"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Color Theme</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a color" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {roleColors.map((color) => (
                              <SelectItem key={color.value} value={color.value}>
                                <div className="flex items-center gap-2">
                                  <div className={`w-4 h-4 rounded-full ${color.value}`} />
                                  {color.label}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe the role's responsibilities and access level"
                          className="resize-none"
                          rows={2}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Permissions Section */}
                <div className="border-t pt-4 mt-4">
                  <h3 className="font-semibold text-sm mb-3">Module Permissions</h3>
                  <div className="space-y-2">
                    {moduleDefinitions.map((module) => {
                      const Icon = module.icon;
                      const permCount = getModulePermissionCount(module.id);
                      const isOpen = openModules[module.id] || false;

                      return (
                        <Collapsible key={module.id} open={isOpen} onOpenChange={() => toggleModule(module.id)}>
                          <div className="border rounded-lg overflow-hidden">
                            <CollapsibleTrigger asChild>
                              <div className="flex items-center justify-between p-3 cursor-pointer hover:bg-muted/50 transition-colors">
                                <div className="flex items-center gap-3">
                                  <div className={`p-1.5 rounded bg-muted ${module.color}`}>
                                    <Icon className="w-4 h-4" />
                                  </div>
                                  <span className="font-medium text-sm">{module.name}</span>
                                  <Badge variant="secondary" className="text-xs">
                                    {permCount}/{permissionDefinitions.length}
                                  </Badge>
                                </div>
                                {isOpen ? (
                                  <ChevronUp className="w-4 h-4 text-muted-foreground" />
                                ) : (
                                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                                )}
                              </div>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                              <div className="px-3 pb-3 border-t bg-muted/20">
                                <div className="flex items-center gap-2 py-2 mb-2 border-b">
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 text-xs"
                                    onClick={() => selectAllForModule(module.id)}
                                  >
                                    Select All
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 text-xs"
                                    onClick={() => clearAllForModule(module.id)}
                                  >
                                    Clear All
                                  </Button>
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                  {permissionDefinitions.map((perm) => {
                                    const isChecked = (permissions[module.id] || []).includes(perm.id);
                                    return (
                                      <div
                                        key={perm.id}
                                        className="flex items-center gap-2 p-2 rounded hover:bg-muted cursor-pointer"
                                        onClick={() => togglePermission(module.id, perm.id)}
                                      >
                                        <Checkbox
                                          checked={isChecked}
                                          onCheckedChange={() => togglePermission(module.id, perm.id)}
                                        />
                                        <span className="text-xs">{perm.name}</span>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            </CollapsibleContent>
                          </div>
                        </Collapsible>
                      );
                    })}
                  </div>
                </div>
              </div>
            </ScrollArea>

            <DialogFooter className="pt-4 border-t mt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">{role ? 'Save Changes' : 'Create Role'}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
