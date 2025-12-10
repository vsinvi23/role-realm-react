import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { CategoryTree } from '@/components/content/CategoryTree';
import { CategoryDetailsPanel } from '@/components/content/CategoryDetailsPanel';
import { CategoryFormModal } from '@/components/content/CategoryFormModal';
import { UserGroupAssignmentPanel } from '@/components/content/UserGroupAssignmentPanel';
import { mockUserGroups } from '@/data/mockContent';
import { Category } from '@/types/content';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectCategory, addCategory, updateCategory, updateCategorySettings, deleteCategory } from '@/store/slices/contentSlice';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Users } from 'lucide-react';
import { toast } from 'sonner';

// Helper to find category by ID in nested structure
const findCategoryById = (categories: Category[], id: string): Category | null => {
  for (const cat of categories) {
    if (cat.id === id) return cat;
    if (cat.children.length > 0) {
      const found = findCategoryById(cat.children, id);
      if (found) return found;
    }
  }
  return null;
};

export default function ContentManagement() {
  const dispatch = useAppDispatch();
  const { categories, selectedCategoryId } = useAppSelector(state => state.content);
  const selectedCategory = selectedCategoryId ? findCategoryById(categories, selectedCategoryId) : null;
  
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [parentId, setParentId] = useState<string | null>(null);

  const handleSelect = (category: Category) => {
    dispatch(selectCategory(category.id));
  };

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

  const handleDelete = (category: Category) => {
    dispatch(deleteCategory(category.id));
    toast.success('Category deleted');
  };

  const handleSubmit = (data: { name: string; description?: string }) => {
    if (editingCategory) {
      dispatch(updateCategory({ id: editingCategory.id, ...data }));
      toast.success('Category updated');
    } else {
      dispatch(addCategory({ parentId, ...data }));
      toast.success('Category created');
    }
    setModalOpen(false);
  };

  const handleUpdateSettings = (settings: Category['settings']) => {
    if (selectedCategoryId) {
      dispatch(updateCategorySettings({ id: selectedCategoryId, settings }));
      toast.success('Settings updated');
    }
  };

  return (
    <DashboardLayout>
      <div className="h-full flex flex-col">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Content Management</h1>
          <p className="text-muted-foreground">Manage categories, permissions, and content organization.</p>
        </div>

        <div className="flex-1 grid grid-cols-12 gap-6 min-h-0">
          <div className="col-span-12 lg:col-span-4 border border-border rounded-lg bg-card overflow-hidden">
            <CategoryTree
              categories={categories}
              selectedId={selectedCategoryId}
              onSelect={handleSelect}
              onAdd={handleAdd}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>

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
                    onUpdateSettings={handleUpdateSettings}
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
          onSubmit={handleSubmit}
          category={editingCategory}
        />
      </div>
    </DashboardLayout>
  );
}
