import { useState, useMemo } from 'react';
import { UserGroup, GroupMember } from '@/types/content';
import { UserResponse } from '@/api/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, Minus, Search, Users, UserPlus } from 'lucide-react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

interface MemberManagementModalProps {
  open: boolean;
  onClose: () => void;
  group: UserGroup | null;
  allUsers: UserResponse[];
  onAddMember: (groupId: string, userId: string) => void;
  onRemoveMember: (groupId: string, userId: string) => void;
}

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const PAGE_SIZE = 5;

export function MemberManagementModal({
  open,
  onClose,
  group,
  allUsers,
  onAddMember,
  onRemoveMember,
}: MemberManagementModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Get member user IDs
  const memberUserIds = useMemo(() => {
    if (!group) return new Set<string>();
    return new Set(group.members.map((m) => m.userId));
  }, [group]);

  // Filter non-members based on search
  const nonMembers = useMemo(() => {
    return allUsers.filter((user) => {
      const isNotMember = !memberUserIds.has(user.id);
      if (!searchQuery.trim()) return isNotMember;
      
      const query = searchQuery.toLowerCase();
      return isNotMember && (
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query)
      );
    });
  }, [allUsers, memberUserIds, searchQuery]);

  // Pagination for non-members
  const totalPages = Math.ceil(nonMembers.length / PAGE_SIZE);
  const paginatedNonMembers = nonMembers.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  // Reset page when search changes
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  if (!group) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[80vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>Manage Members - {group.name}</DialogTitle>
          <DialogDescription>
            Add or remove members from this group.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4" style={{ maxHeight: 'calc(80vh - 120px)' }}>
          <div className="flex flex-col gap-4">
            {/* Current Members Section */}
            <div className="border rounded-lg">
              <div className="px-4 py-2 border-b bg-muted/50 flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span className="text-sm font-medium">
                  Current Members ({group.members.length})
                </span>
              </div>
              <div className="max-h-[200px] overflow-y-auto">
                {group.members.length === 0 ? (
                  <div className="p-4 text-center text-muted-foreground text-sm">
                    No members yet
                  </div>
                ) : (
                  <div className="divide-y">
                    {group.members.map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center justify-between p-3 hover:bg-muted/30"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="bg-primary/10 text-primary text-xs">
                              {getInitials(member.userName)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-sm">{member.userName}</p>
                            <p className="text-xs text-muted-foreground">{member.email}</p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => onRemoveMember(group.id, member.userId)}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Available Users Section */}
            <div className="border rounded-lg">
              <div className="px-4 py-2 border-b bg-muted/50 flex items-center gap-2">
                <UserPlus className="w-4 h-4" />
                <span className="text-sm font-medium">
                  Available Users ({nonMembers.length})
                </span>
              </div>
              
              {/* Search */}
              <div className="p-2 border-b">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="pl-9 h-8"
                  />
                </div>
              </div>

              {/* Users List */}
              <div className="max-h-[200px] overflow-y-auto">
                {paginatedNonMembers.length === 0 ? (
                  <div className="p-4 text-center text-muted-foreground text-sm">
                    {searchQuery ? 'No users found' : 'All users are members'}
                  </div>
                ) : (
                  <div className="divide-y">
                    {paginatedNonMembers.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center justify-between p-3 hover:bg-muted/30"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="bg-secondary/50 text-secondary-foreground text-xs">
                              {getInitials(user.name || user.email)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-sm">{user.name || user.email}</p>
                            <p className="text-xs text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-primary hover:text-primary hover:bg-primary/10"
                          onClick={() => onAddMember(group.id, user.id)}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="p-2 border-t">
                  <Pagination>
                    <PaginationContent className="gap-1">
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                          className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                        />
                      </PaginationItem>
                      {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
                        const page = currentPage <= 2 ? i + 1 : currentPage - 1 + i;
                        if (page > totalPages) return null;
                        return (
                          <PaginationItem key={page}>
                            <PaginationLink
                              onClick={() => setCurrentPage(page)}
                              isActive={currentPage === page}
                              className="cursor-pointer"
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      })}
                      <PaginationItem>
                        <PaginationNext
                          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                          className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
