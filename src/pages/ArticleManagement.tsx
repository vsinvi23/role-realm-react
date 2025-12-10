import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ArticleEditor } from '@/components/articles/ArticleEditor';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Article, WorkflowStatus } from '@/types/content';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectArticle, setFilters, updateArticle, updateArticleStatus } from '@/store/slices/articleSlice';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Plus, Pencil, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

export default function ArticleManagement() {
  const dispatch = useAppDispatch();
  const { articles, selectedArticleId, filters, saving } = useAppSelector(state => state.articles);
  
  const selectedArticle = articles.find(a => a.id === selectedArticleId);
  const filteredArticles = articles.filter(a => 
    a.title.toLowerCase().includes(filters.search.toLowerCase())
  );

  const handleWorkflowAction = (action: string) => {
    if (!selectedArticleId) return;
    const statusMap: Record<string, WorkflowStatus> = {
      submit: 'submitted', approve: 'approved', reject: 'rejected', publish: 'published', request_changes: 'draft',
    };
    if (statusMap[action]) {
      dispatch(updateArticleStatus({ articleId: selectedArticleId, status: statusMap[action] }));
      toast.success(`Article ${action}ed successfully`);
    }
  };

  const handleSave = (article: Article) => {
    dispatch(updateArticle(article));
    dispatch(selectArticle(null));
    toast.success('Article saved');
  };

  if (selectedArticle) {
    return (
      <DashboardLayout>
        <Button variant="ghost" onClick={() => dispatch(selectArticle(null))} className="mb-4">← Back to Articles</Button>
        <ArticleEditor article={selectedArticle} onSave={handleSave} onWorkflowAction={handleWorkflowAction} />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Article Management</h1>
            <p className="text-muted-foreground">Create, edit, and publish articles with SEO optimization.</p>
          </div>
          <Button><Plus className="w-4 h-4 mr-2" />Create Article</Button>
        </div>

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search articles..." value={filters.search} onChange={(e) => dispatch(setFilters({ search: e.target.value }))} className="pl-9" />
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Updated</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredArticles.map(article => (
                  <TableRow key={article.id}>
                    <TableCell className="font-medium">{article.title}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{article.categoryPath.join(' / ')}</TableCell>
                    <TableCell>{article.author}</TableCell>
                    <TableCell><StatusBadge status={article.status} size="sm" /></TableCell>
                    <TableCell className="text-sm text-muted-foreground">{format(new Date(article.updatedAt), 'PP')}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => dispatch(selectArticle(article.id))}><Pencil className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8"><Eye className="w-4 h-4" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
