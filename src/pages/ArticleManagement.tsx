import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useCmsList, useDeleteCms, usePublishCms, useSendCmsBack } from '@/api/hooks/useCms';
import { CmsResponseDto, CmsStatus } from '@/api/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Search, 
  Plus, 
  Pencil, 
  Loader2, 
  Trash2, 
  CheckCircle, 
  MessageSquare, 
  MoreHorizontal,
  Undo2 
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

const getStatusVariant = (status: CmsStatus) => {
  switch (status) {
    case 'DRAFT':
      return 'secondary';
    case 'REVIEW':
      return 'outline';
    case 'PUBLISHED':
      return 'default';
    default:
      return 'secondary';
  }
};

export default function ArticleManagement() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const pageSize = 10;

  // Dialogs state
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; article: CmsResponseDto | null }>({ open: false, article: null });
  const [sendBackDialog, setSendBackDialog] = useState<{ open: boolean; article: CmsResponseDto | null }>({ open: false, article: null });
  const [comment, setComment] = useState('');

  const { data: cmsData, isLoading, error, refetch } = useCmsList({ page, size: pageSize });
  const deleteCms = useDeleteCms();
  const publishCms = usePublishCms();
  const sendBackCms = useSendCmsBack();

  // Filter for articles only and apply search
  const q = searchQuery.trim().toLowerCase();
  const articles = (cmsData?.items || []).filter((item: CmsResponseDto) => {
    if (item.type !== 'ARTICLE') return false;
    if (!q) return true;
    const title = (item.title ?? '').toLowerCase();
    const desc = (item.description ?? '').toLowerCase();
    return title.includes(q) || desc.includes(q);
  });

  const totalPages = Math.ceil((cmsData?.totalElements || 0) / pageSize);

  const handleDelete = async () => {
    if (!deleteDialog.article) return;
    try {
      await deleteCms.mutateAsync(deleteDialog.article.id);
      toast.success('Article deleted');
      setDeleteDialog({ open: false, article: null });
      refetch();
    } catch {
      toast.error('Failed to delete article');
    }
  };

  const handlePublish = async (article: CmsResponseDto) => {
    try {
      await publishCms.mutateAsync({ id: article.id });
      toast.success('Article published');
      refetch();
    } catch {
      toast.error('Failed to publish article');
    }
  };

  const handleSendBack = async () => {
    if (!sendBackDialog.article || !comment.trim()) {
      toast.error('Please enter a comment');
      return;
    }
    try {
      await sendBackCms.mutateAsync({
        id: sendBackDialog.article.id,
        data: {
          reviewerId: user?.id || 1,
          comment: comment.trim(),
        },
      });
      toast.success('Article sent back to draft');
      setSendBackDialog({ open: false, article: null });
      setComment('');
      refetch();
    } catch {
      toast.error('Failed to send back article');
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Article Management</h1>
            <p className="text-muted-foreground">Create, edit, and publish articles.</p>
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
                    <TableHead>Status</TableHead>
                    <TableHead>Reviewer Comment</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {articles.map((article: CmsResponseDto) => (
                    <TableRow key={article.id}>
                      <TableCell className="font-medium">
                        {article.title || 'Untitled'}
                        {article.description && (
                          <p className="text-xs text-muted-foreground truncate max-w-xs">
                            {article.description}
                          </p>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(article.status)}>
                          {article.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground max-w-xs truncate">
                        {article.reviewerComment || '-'}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {format(new Date(article.createdAt), 'PP')}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-background border">
                            <DropdownMenuItem onClick={() => navigate(`/articles/create?edit=${article.id}`)}>
                              <Pencil className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            
                            {article.status === 'REVIEW' && (
                              <>
                                <DropdownMenuItem onClick={() => handlePublish(article)}>
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  Publish
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setSendBackDialog({ open: true, article })}>
                                  <Undo2 className="w-4 h-4 mr-2" />
                                  Send Back
                                </DropdownMenuItem>
                              </>
                            )}
                            
                            {article.reviewerComment && (
                              <DropdownMenuItem onClick={() => toast.info(article.reviewerComment || 'No comment')}>
                                <MessageSquare className="w-4 h-4 mr-2" />
                                View Comment
                              </DropdownMenuItem>
                            )}
                            
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-destructive focus:text-destructive"
                              onClick={() => setDeleteDialog({ open: true, article })}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

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

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, article: open ? deleteDialog.article : null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Article</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{deleteDialog.article?.title || 'Untitled'}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialog({ open: false, article: null })}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleteCms.isPending}>
              {deleteCms.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Send Back Dialog with Comment */}
      <Dialog open={sendBackDialog.open} onOpenChange={(open) => { setSendBackDialog({ open, article: open ? sendBackDialog.article : null }); if (!open) setComment(''); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Back to Draft</DialogTitle>
            <DialogDescription>
              Add a comment explaining why this article needs revision.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="comment">Reviewer Comment *</Label>
              <Textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Please explain what needs to be revised..."
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setSendBackDialog({ open: false, article: null }); setComment(''); }}>
              Cancel
            </Button>
            <Button onClick={handleSendBack} disabled={sendBackCms.isPending || !comment.trim()}>
              {sendBackCms.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Send Back
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
