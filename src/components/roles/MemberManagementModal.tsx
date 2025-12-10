import { useState } from 'react';
import { cn } from '@/lib/utils';
import { UserGroup, GroupMember } from '@/types/content';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { ScrollArea } from '@/components/ui/scroll-area';
import { UserPlus, Trash2, Mail } from 'lucide-react';
import { toast } from 'sonner';

interface MemberManagementModalProps {
  open: boolean;
  onClose: () => void;
  group: UserGroup | null;
  onAddMember: (groupId: string, email: string, role: GroupMember['role']) => void;
  onRemoveMember: (groupId: string, memberId: string) => void;
  onChangeRole: (groupId: string, memberId: string, role: GroupMember['role']) => void;
}

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const roleColors: Record<GroupMember['role'], string> = {
  admin: 'bg-primary/10 text-primary border-primary/30',
  member: 'bg-info/10 text-info border-info/30',
  viewer: 'bg-muted text-muted-foreground border-muted-foreground/30',
};

export function MemberManagementModal({
  open,
  onClose,
  group,
  onAddMember,
  onRemoveMember,
  onChangeRole,
}: MemberManagementModalProps) {
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberRole, setNewMemberRole] = useState<GroupMember['role']>('member');

  const handleAddMember = () => {
    if (!group || !newMemberEmail.trim()) return;
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newMemberEmail)) {
      toast.error('Please enter a valid email address');
      return;
    }

    onAddMember(group.id, newMemberEmail.trim(), newMemberRole);
    setNewMemberEmail('');
    setNewMemberRole('member');
    toast.success('Member added successfully');
  };

  if (!group) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Manage Members - {group.name}</DialogTitle>
          <DialogDescription>
            Add or remove members from this group and manage their roles.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Add Member Form */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Email address"
                value={newMemberEmail}
                onChange={(e) => setNewMemberEmail(e.target.value)}
                className="pl-9"
                onKeyDown={(e) => e.key === 'Enter' && handleAddMember()}
              />
            </div>
            <Select value={newMemberRole} onValueChange={(v: GroupMember['role']) => setNewMemberRole(v)}>
              <SelectTrigger className="w-28">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="member">Member</SelectItem>
                <SelectItem value="viewer">Viewer</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleAddMember} disabled={!newMemberEmail.trim()}>
              <UserPlus className="w-4 h-4" />
            </Button>
          </div>

          {/* Members List */}
          <div className="border rounded-lg">
            <div className="px-4 py-2 border-b bg-muted/50">
              <span className="text-sm font-medium">
                {group.members.length} Member{group.members.length !== 1 ? 's' : ''}
              </span>
            </div>
            <ScrollArea className="h-64">
              {group.members.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  <UserPlus className="w-10 h-10 mx-auto mb-2 opacity-30" />
                  <p>No members yet</p>
                  <p className="text-sm">Add members using the form above</p>
                </div>
              ) : (
                <div className="divide-y">
                  {group.members.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-3 hover:bg-muted/30"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="w-9 h-9">
                          <AvatarFallback className="bg-primary/10 text-primary text-sm">
                            {getInitials(member.userName)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">{member.userName}</p>
                          <p className="text-xs text-muted-foreground">{member.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Select
                          value={member.role}
                          onValueChange={(role: GroupMember['role']) =>
                            onChangeRole(group.id, member.id, role)
                          }
                        >
                          <SelectTrigger className="w-24 h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="member">Member</SelectItem>
                            <SelectItem value="viewer">Viewer</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => onRemoveMember(group.id, member.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
