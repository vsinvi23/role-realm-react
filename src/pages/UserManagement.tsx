import { useState, useMemo } from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setFilters, setPage, setPageSize } from '@/store/slices/userSlice';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { UserTabs } from '@/components/users/UserTabs';
import { UserTable } from '@/components/users/UserTable';
import { Pagination } from '@/components/users/Pagination';
import { InviteUserModal } from '@/components/users/InviteUserModal';
import { getUserCounts } from '@/data/mockUsers';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UserPlus, Search } from 'lucide-react';
import { UserStatus, User } from '@/types/user';

export default function UserManagementPage() {
  const dispatch = useAppDispatch();
  const { users, filteredUsers, filters, pagination } = useAppSelector(
    (state) => state.users
  );
  const [inviteModalOpen, setInviteModalOpen] = useState(false);

  const counts = useMemo(() => getUserCounts(users), [users]);

  const paginatedUsers = useMemo(() => {
    const startIndex = (pagination.currentPage - 1) * pagination.pageSize;
    return filteredUsers.slice(startIndex, startIndex + pagination.pageSize);
  }, [filteredUsers, pagination.currentPage, pagination.pageSize]);

  const handleTabChange = (status: UserStatus | 'all') => {
    dispatch(setFilters({ status }));
  };

  const handleSearch = (search: string) => {
    dispatch(setFilters({ search }));
  };

  const handleSort = (column: keyof User) => {
    const newOrder =
      filters.sortBy === column && filters.sortOrder === 'asc' ? 'desc' : 'asc';
    dispatch(setFilters({ sortBy: column, sortOrder: newOrder }));
  };

  const handlePageChange = (page: number) => {
    dispatch(setPage(page));
  };

  const handlePageSizeChange = (size: number) => {
    dispatch(setPageSize(size));
  };

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
            activeTab={filters.status}
            onTabChange={handleTabChange}
            counts={counts}
          />
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search user"
              value={filters.search}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* User Table */}
        <div className="bg-card rounded-lg border border-border shadow-sm">
          <UserTable
            users={paginatedUsers}
            sortBy={filters.sortBy}
            sortOrder={filters.sortOrder}
            onSort={handleSort}
          />
          <div className="border-t border-border px-4">
            <Pagination
              currentPage={pagination.currentPage}
              pageSize={pagination.pageSize}
              totalItems={pagination.totalItems}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
            />
          </div>
        </div>
      </div>

      <InviteUserModal
        open={inviteModalOpen}
        onClose={() => setInviteModalOpen(false)}
      />
    </DashboardLayout>
  );
}
