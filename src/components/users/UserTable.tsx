import { User } from '@/types/user';
import { format } from 'date-fns';
import { RoleBadge } from './RoleBadge';
import { StatusToggle } from './StatusToggle';
import { useAppDispatch } from '@/store/hooks';
import { toggleUserStatus } from '@/store/slices/userSlice';
import { ChevronDown, ChevronUp, History, Edit, MoreHorizontal } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface UserTableProps {
  users: User[];
  sortBy: keyof User;
  sortOrder: 'asc' | 'desc';
  onSort: (column: keyof User) => void;
}

interface SortableHeaderProps {
  label: string;
  column: keyof User;
  currentSort: keyof User;
  sortOrder: 'asc' | 'desc';
  onSort: (column: keyof User) => void;
}

function SortableHeader({ label, column, currentSort, sortOrder, onSort }: SortableHeaderProps) {
  const isActive = currentSort === column;

  return (
    <button
      onClick={() => onSort(column)}
      className="flex items-center gap-1 font-medium text-muted-foreground hover:text-foreground transition-colors"
    >
      {label}
      <span className="flex flex-col">
        <ChevronUp
          className={cn(
            'w-3 h-3 -mb-1',
            isActive && sortOrder === 'asc' ? 'text-primary' : 'text-muted-foreground/40'
          )}
        />
        <ChevronDown
          className={cn(
            'w-3 h-3',
            isActive && sortOrder === 'desc' ? 'text-primary' : 'text-muted-foreground/40'
          )}
        />
      </span>
    </button>
  );
}

export function UserTable({ users, sortBy, sortOrder, onSort }: UserTableProps) {
  const dispatch = useAppDispatch();

  const handleToggleStatus = (userId: string) => {
    dispatch(toggleUserStatus(userId));
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  };

  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <p className="text-lg font-medium">No users found</p>
        <p className="text-sm">Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-table-border bg-table-header">
            <th className="text-left py-3 px-4 text-sm font-medium">
              <SortableHeader
                label="User"
                column="firstName"
                currentSort={sortBy}
                sortOrder={sortOrder}
                onSort={onSort}
              />
            </th>
            <th className="text-left py-3 px-4 text-sm font-medium">
              <SortableHeader
                label="Email Id"
                column="email"
                currentSort={sortBy}
                sortOrder={sortOrder}
                onSort={onSort}
              />
            </th>
            <th className="text-left py-3 px-4 text-sm font-medium">
              <SortableHeader
                label="Role"
                column="role"
                currentSort={sortBy}
                sortOrder={sortOrder}
                onSort={onSort}
              />
            </th>
            <th className="text-left py-3 px-4 text-sm font-medium">
              <SortableHeader
                label="Created"
                column="createdAt"
                currentSort={sortBy}
                sortOrder={sortOrder}
                onSort={onSort}
              />
            </th>
            <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
              Status
            </th>
            <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr
              key={user.id}
              className={cn(
                'border-b border-table-border hover:bg-table-row-hover transition-colors',
                index % 2 === 0 ? 'bg-card' : 'bg-background'
              )}
              style={{ animationDelay: `${index * 30}ms` }}
            >
              <td className="py-3 px-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-muted text-muted-foreground text-xs">
                      {getInitials(user.firstName, user.lastName)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium">
                    {user.firstName} {user.lastName}
                  </span>
                </div>
              </td>
              <td className="py-3 px-4 text-muted-foreground">
                {user.email}
              </td>
              <td className="py-3 px-4">
                <RoleBadge role={user.role} />
              </td>
              <td className="py-3 px-4 text-muted-foreground text-sm">
                {format(new Date(user.createdAt), 'MM/dd/yyyy, hh:mm a')}
              </td>
              <td className="py-3 px-4">
                <StatusToggle
                  status={user.status}
                  onToggle={() => handleToggleStatus(user.id)}
                />
              </td>
              <td className="py-3 px-4">
                <div className="flex items-center justify-end gap-1">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <History className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Login History</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Edit User</TooltipContent>
                  </Tooltip>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View Profile</DropdownMenuItem>
                      <DropdownMenuItem>Reset Password</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        Delete User
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
