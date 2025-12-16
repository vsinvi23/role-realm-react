import { useState, useEffect, useMemo } from 'react';
import { useUsers } from '@/api/hooks/useUsers';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { UserTabs } from '@/components/users/UserTabs';
import { UserTable } from '@/components/users/UserTable';
import { Pagination } from '@/components/users/Pagination';
import { InviteUserModal } from '@/components/users/InviteUserModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UserPlus, Search, Loader2 } from 'lucide-react';
import { UserStatus as ApiUserStatus } from '@/api/types';
import { toast } from 'sonner';

type TabStatus = 'all' | 'active' | 'deactivated' | 'invited';

// Map UI status to API status
const statusMap: Record<TabStatus, ApiUserStatus | undefined> = {
  all: undefined,
  active: 'ACTIVE',
  deactivated: 'DEACTIVATED',
  invited: 'PENDING',
};

export default function UserManagementPage() {
  const {
    users,
    totalElements,
    totalPages,
    currentPage,
    isLoading,
    error,
    fetchUsers,
    deleteUser,
    updateUser,
  } = useUsers();

  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState<string>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Fetch users on mount and when filters change
  useEffect(() => {
    fetchUsers({
      page: currentPage,
      size: pageSize,
      status: statusMap[activeTab],
      search: searchQuery || undefined,
    });
  }, [activeTab, pageSize, searchQuery]);

  // Initial fetch
  useEffect(() => {
    fetchUsers({ page: 0, size: pageSize });
  }, []);

  const counts = useMemo(() => {
    // For now, show total count - in a real app, you'd get counts from API
    return {
      all: totalElements,
      active: users.filter(u => u.status === 'ACTIVE').length,
      deactivated: users.filter(u => u.status === 'DEACTIVATED').length,
      invited: users.filter(u => u.status === 'PENDING').length,
    };
  }, [users, totalElements]);

  const handleTabChange = (status: TabStatus) => {
    setActiveTab(status);
  };

  const handleSearch = (search: string) => {
    setSearchQuery(search);
  };

  const handleSort = (column: string) => {
    const newOrder = sortBy === column && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortBy(column);
    setSortOrder(newOrder);
  };

  const handlePageChange = (page: number) => {
    fetchUsers({
      page: page - 1, // API uses 0-indexed pages
      size: pageSize,
      status: statusMap[activeTab],
      search: searchQuery || undefined,
    });
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    fetchUsers({
      page: 0,
      size,
      status: statusMap[activeTab],
      search: searchQuery || undefined,
    });
  };

  const handleToggleStatus = async (userId: string, currentStatus: ApiUserStatus) => {
    const newStatus: ApiUserStatus = currentStatus === 'ACTIVE' ? 'DEACTIVATED' : 'ACTIVE';
    const user = users.find(u => u.id === userId);
    if (user) {
      const result = await updateUser(userId, {
        name: user.name,
        email: user.email,
        status: newStatus,
      });
      if (result) {
        toast.success(`User ${newStatus === 'ACTIVE' ? 'activated' : 'deactivated'}`);
      }
    }
  };

  const handleDeleteUser = async (userId: string) => {
    const success = await deleteUser(userId);
    if (success) {
      toast.success('User deleted successfully');
    }
  };

  const handleUserCreated = () => {
    // Refresh the user list
    fetchUsers({
      page: 0,
      size: pageSize,
      status: statusMap[activeTab],
      search: searchQuery || undefined,
    });
  };

  if (error) {
    toast.error(error);
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Page Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Manage Users</h1>
            <p className="text-muted-foreground mt-1">
              Managing the scope of application accessibility and content visibility to the users
            </p>
          </div>
          <Button onClick={() => setInviteModalOpen(true)} className="gap-2">
            <UserPlus className="w-4 h-4" />
            Invite User
          </Button>
        </div>

        {/* Tabs and Search */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <UserTabs
            activeTab={activeTab}
            onTabChange={handleTabChange}
            counts={counts}
          />
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search user"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* User Table */}
        <div className="bg-card rounded-lg border border-border shadow-sm">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              <UserTable
                users={users}
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSort={handleSort}
                onToggleStatus={handleToggleStatus}
                onDeleteUser={handleDeleteUser}
              />
              <div className="border-t border-border px-4">
                <Pagination
                  currentPage={currentPage + 1} // API uses 0-indexed, UI uses 1-indexed
                  pageSize={pageSize}
                  totalItems={totalElements}
                  onPageChange={handlePageChange}
                  onPageSizeChange={handlePageSizeChange}
                />
              </div>
            </>
          )}
        </div>
      </div>

      <InviteUserModal
        open={inviteModalOpen}
        onClose={() => setInviteModalOpen(false)}
        onUserCreated={handleUserCreated}
      />
    </DashboardLayout>
  );
}
