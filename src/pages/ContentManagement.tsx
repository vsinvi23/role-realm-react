import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { CategoryTree } from '@/components/content/CategoryTree';
import { CategoryDetailsPanel } from '@/components/content/CategoryDetailsPanel';
import { CategoryFormModal } from '@/components/content/CategoryFormModal';
import { UserGroupAssignmentPanel } from '@/components/content/UserGroupAssignmentPanel';
import { mockCategories, mockUserGroups } from '@/data/mockContent';
import { Category } from '@/types/content';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Users } from 'lucide-react';

export default function ContentManagement() {
  const [categories, setCategories] = useState(mockCategories);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [parentId, setParentId] = useState<string | null>(null);

  const handleAdd = (parentIdParam: string | null) => {
    setParentId(parentIdParam);
    setEditingCategory(null);
    setModalOpen(true);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setParentId(category.parentId);
    setModalOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="h-full flex flex-col">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Content Management</h1>
          <p className="text-muted-foreground">Manage categories, permissions, and content organization.</p>
        </div>

        <div className="flex-1 grid grid-cols-12 gap-6 min-h-0">
          {/* Category Tree */}
          <div className="col-span-12 lg:col-span-4 border border-border rounded-lg bg-card overflow-hidden">
            <CategoryTree
              categories={categories}
              selectedId={selectedCategory?.id}
              onSelect={setSelectedCategory}
              onAdd={handleAdd}
              onEdit={handleEdit}
              onDelete={() => {}}
            />
          </div>

          {/* Details Panel */}
          <div className="col-span-12 lg:col-span-8 border border-border rounded-lg bg-card p-6 overflow-auto">
            {selectedCategory ? (
              <Tabs defaultValue="details">
                <TabsList>
                  <TabsTrigger value="details"><Settings className="w-4 h-4 mr-2" />Settings</TabsTrigger>
                  <TabsTrigger value="groups"><Users className="w-4 h-4 mr-2" />User Groups</TabsTrigger>
                </TabsList>
                <TabsContent value="details" className="mt-4">
                  <CategoryDetailsPanel
                    category={selectedCategory}
                    reviewerGroups={mockUserGroups}
                    onUpdateSettings={() => {}}
                  />
                </TabsContent>
                <TabsContent value="groups" className="mt-4">
                  <UserGroupAssignmentPanel
                    groups={selectedCategory.userGroups}
                    availableGroups={mockUserGroups}
                    onAssignGroup={() => {}}
                    onRemoveGroup={() => {}}
                  />
                </TabsContent>
              </Tabs>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                Select a category to view details
              </div>
            )}
          </div>
        </div>

        <CategoryFormModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onSubmit={() => setModalOpen(false)}
          category={editingCategory}
        />
      </div>
    </DashboardLayout>
  );
}
