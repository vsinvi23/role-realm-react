import { useEffect } from 'react';
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
}

interface RoleFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: RoleFormData) => void;
  role?: RoleDefinition | null;
}

export function RoleFormModal({ open, onClose, onSubmit, role }: RoleFormModalProps) {
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
      } else {
        form.reset({
          name: '',
          description: '',
          color: roleColors[0].value,
        });
      }
    }
  }, [open, role, form]);

  const handleSubmit = (data: RoleFormData) => {
    onSubmit(data);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{role ? 'Edit Role' : 'Create New Role'}</DialogTitle>
          <DialogDescription>
            {role ? 'Update the role details below.' : 'Define a new role with permissions.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
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
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the role's responsibilities and access level"
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
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
            <DialogFooter className="pt-4">
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
