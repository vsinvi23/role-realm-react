import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { useCmsList } from '@/api/hooks/useCms';
import { CmsResponseDto, CmsStatus } from '@/api/types';
import { WorkflowStatus } from '@/types/content';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Plus, Pencil, Eye, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

// Map CMS status to workflow status for StatusBadge
const mapCmsStatus = (status: CmsStatus): WorkflowStatus => {
  const statusMap: Record<CmsStatus, WorkflowStatus> = {
    'DRAFT': 'draft',
    'PENDING_REVIEW': 'submitted',
    'PUBLISHED': 'published',
    'REJECTED': 'rejected',
  };
  return statusMap[status] || 'draft';
};

export default function ArticleManagement() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const pageSize = 10;

  // Fetch CMS items with type ARTICLE
  const { data: cmsData, isLoading, error } = useCmsList({ page, size: pageSize });

  // Filter for articles only and apply search
  const q = searchQuery.trim().toLowerCase();
  const articles = (cmsData?.items || []).filter((item: CmsResponseDto) => {
    if (item.type !== 'ARTICLE') return false;
    if (!q) return true;
    const title = (item.title ?? '').toLowerCase();
    const desc = (item.description ?? '').toLowerCase();
    return title.includes(q) || desc.includes(q);
  });

  const totalPages = Math.ceil((cmsData?.total || 0) / pageSize);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Article Management</h1>
            <p className="text-muted-foreground">Create, edit, and publish articles with SEO optimization.</p>
          </div>
          <Button onClick={() => navigate('/articles/create')}>
            <Plus className="w-4 h-4 mr-2" />
            Create Article
          </Button>
        </div>

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search articles..." 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
            className="pl-9" 
          />
        </div>

        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                <span className="ml-2 text-muted-foreground">Loading articles...</span>
              </div>
            ) : error ? (
              <div className="text-center py-12 text-destructive">
                Failed to load articles. Please try again.
              </div>
            ) : articles.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No articles found. Create your first article to get started.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Updated</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {articles.map((article: CmsResponseDto) => (
                    <TableRow key={article.id}>
                      <TableCell className="font-medium">
                        {article.title || 'Untitled'}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">
                        {article.description || '-'}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={mapCmsStatus(article.status)} size="sm" />
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {format(new Date(article.createdAt), 'PP')}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {format(new Date(article.updatedAt), 'PP')}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => navigate(`/articles/create?id=${article.id}`)}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
            >
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {page + 1} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
