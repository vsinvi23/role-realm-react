import { useState, useEffect, useMemo } from 'react';
import { useUsers } from '@/api/hooks/useUsers';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { UserTabs } from '@/components/users/UserTabs';
import { UserTable } from '@/components/users/UserTable';
import { Pagination } from '@/components/users/Pagination';
import { InviteUserModal } from '@/components/users/InviteUserModal';
import { EditUserModal } from '@/components/users/EditUserModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UserPlus, Search, Loader2 } from 'lucide-react';
import { UserStatus, UserResponse } from '@/api/types';
import { toast } from 'sonner';

type TabStatus = 'all' | 'active' | 'deactivated' | 'invited';

export default function UserManagementPage() {
  const {
    users,
    totalElements,
    currentPage,
    isLoading,
    error,
    fetchUsers,
  } = useUsers();

  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserResponse | null>(null);
  const [activeTab, setActiveTab] = useState<TabStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState<string>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    fetchUsers({ page: 0, size: pageSize });
  }, [pageSize]);

  const counts = useMemo(() => ({
    all: totalElements,
    active: users.filter(u => u.status === 'ACTIVE').length,
    deactivated: users.filter(u => u.status === 'DEACTIVATED').length,
    invited: users.filter(u => u.status === 'PENDING').length,
  }), [users, totalElements]);

  const filteredUsers = useMemo(() => {
    let result = users;
    if (activeTab === 'active') result = result.filter(u => u.status === 'ACTIVE');
    else if (activeTab === 'deactivated') result = result.filter(u => u.status === 'DEACTIVATED');
    else if (activeTab === 'invited') result = result.filter(u => u.status === 'PENDING');
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(u => u.name.toLowerCase().includes(query) || u.email.toLowerCase().includes(query));
    }
    return result;
  }, [users, activeTab, searchQuery]);

  const handleTabChange = (status: TabStatus) => setActiveTab(status);
  const handleSearch = (search: string) => setSearchQuery(search);
  const handleSort = (column: string) => {
    setSortOrder(sortBy === column && sortOrder === 'asc' ? 'desc' : 'asc');
    setSortBy(column);
  };

  const handlePageChange = (page: number) => fetchUsers({ page: page - 1, size: pageSize });
  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    fetchUsers({ page: 0, size });
  };

  const handleToggleStatus = async (userId: string, currentStatus: UserStatus) => {
    toast.info('User status update requires backend API support');
  };

  const handleDeleteUser = async (userId: string) => {
    toast.info('User deletion requires backend API support');
  };

  const handleEditUser = (user: UserResponse) => {
    setEditingUser(user);
    setEditModalOpen(true);
  };

  const handleSaveUser = async (userId: string, data: { name: string; email: string; status: UserStatus }): Promise<boolean> => {
    toast.info('User update requires backend API support');
    return false;
  };

  const handleUserCreated = () => fetchUsers({ page: 0, size: pageSize });

  if (error) toast.error(error);

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Manage Users</h1>
            <p className="text-muted-foreground mt-1">View and manage platform users</p>
          </div>
          <Button onClick={() => setInviteModalOpen(true)} className="gap-2">
            <UserPlus className="w-4 h-4" />
            Invite User
          </Button>
        </div>

        <div className="flex items-center justify-between gap-4 flex-wrap">
          <UserTabs activeTab={activeTab} onTabChange={handleTabChange} counts={counts} />
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search user" value={searchQuery} onChange={(e) => handleSearch(e.target.value)} className="pl-10" />
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border shadow-sm">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              <UserTable users={filteredUsers} sortBy={sortBy} sortOrder={sortOrder} onSort={handleSort} onToggleStatus={handleToggleStatus} onDeleteUser={handleDeleteUser} onEditUser={handleEditUser} />
              <div className="border-t border-border px-4">
                <Pagination currentPage={currentPage + 1} pageSize={pageSize} totalItems={totalElements} onPageChange={handlePageChange} onPageSizeChange={handlePageSizeChange} />
              </div>
            </>
          )}
        </div>
      </div>

      <InviteUserModal open={inviteModalOpen} onClose={() => setInviteModalOpen(false)} onUserCreated={handleUserCreated} />
      <EditUserModal open={editModalOpen} onClose={() => { setEditModalOpen(false); setEditingUser(null); }} user={editingUser} onSave={handleSaveUser} />
    </DashboardLayout>
  );
}
