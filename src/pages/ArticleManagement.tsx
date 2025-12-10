import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ArticleEditor } from '@/components/articles/ArticleEditor';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { WorkflowStatusBar } from '@/components/shared/WorkflowStatusBar';
import { ReviewActionsPanel } from '@/components/shared/ReviewActionsPanel';
import { ReviewerCommentThread } from '@/components/shared/ReviewerCommentThread';
import { Article, WorkflowStatus, ReviewComment } from '@/types/content';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectArticle, setFilters, updateArticle, updateArticleStatus } from '@/store/slices/articleSlice';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Plus, Pencil, Eye, MessageSquare, GitBranch, FileText, Edit } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

export default function ArticleManagement() {
  const dispatch = useAppDispatch();
  const { articles, selectedArticleId, filters, saving } = useAppSelector(state => state.articles);
  const [reviewComments, setReviewComments] = useState<Record<string, ReviewComment[]>>({});
  const [activeTab, setActiveTab] = useState<'content' | 'workflow'>('content');
  
  const selectedArticle = articles.find(a => a.id === selectedArticleId);
  const filteredArticles = articles.filter(a => 
    a.title.toLowerCase().includes(filters.search.toLowerCase())
  );

  const handleWorkflowAction = (action: string, comment?: string) => {
    if (!selectedArticleId) return;
    const statusMap: Record<string, WorkflowStatus> = {
      submit: 'submitted', approve: 'approved', reject: 'rejected', publish: 'published', request_changes: 'draft',
    };
    if (statusMap[action]) {
      dispatch(updateArticleStatus({ articleId: selectedArticleId, status: statusMap[action] }));
      
      // Add system comment for workflow action
      if (comment) {
        handleAddComment(`**${action.replace('_', ' ').toUpperCase()}**: ${comment}`);
      }
      
      toast.success(`Article ${action.replace('_', ' ')} successfully`);
    }
  };

  const handleAddComment = (content: string, parentId?: string) => {
    if (!selectedArticleId) return;
    
    const newComment: ReviewComment = {
      id: `comment-${Date.now()}`,
      authorId: 'current-user',
      authorName: 'Current User',
      content,
      createdAt: new Date().toISOString(),
      replies: [],
    };

    setReviewComments(prev => {
      const articleComments = prev[selectedArticleId] || [];
      if (parentId) {
        // Add as reply
        return {
          ...prev,
          [selectedArticleId]: articleComments.map(c => 
            c.id === parentId 
              ? { ...c, replies: [...(c.replies || []), newComment] }
              : c
          ),
        };
      }
      return {
        ...prev,
        [selectedArticleId]: [...articleComments, newComment],
      };
    });
  };

  const handleSave = (article: Article) => {
    dispatch(updateArticle(article));
    toast.success('Article saved');
  };

  if (selectedArticle) {
    const articleComments = reviewComments[selectedArticle.id] || [];
    
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Button variant="ghost" onClick={() => dispatch(selectArticle(null))} className="mb-2">← Back to Articles</Button>
              <h1 className="text-2xl font-bold">{selectedArticle.title}</h1>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'content' | 'workflow')}>
            <TabsList>
              <TabsTrigger value="content" className="gap-2">
                <FileText className="w-4 h-4" />
                Article Content
              </TabsTrigger>
              <TabsTrigger value="workflow" className="gap-2">
                <GitBranch className="w-4 h-4" />
                Workflow & Review
              </TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="mt-6">
              <ArticleEditor article={selectedArticle} onSave={handleSave} onWorkflowAction={handleWorkflowAction} />
            </TabsContent>

            <TabsContent value="workflow" className="mt-6">
              <div className="grid grid-cols-12 gap-6">
                <div className="col-span-12 lg:col-span-7">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <GitBranch className="w-5 h-5" />
                        Workflow Progress
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <WorkflowStatusBar currentStatus={selectedArticle.status} />
                      <div className="pt-4 border-t">
                        <h4 className="text-sm font-medium mb-3">Available Actions</h4>
                        <ReviewActionsPanel 
                          currentStatus={selectedArticle.status} 
                          onAction={handleWorkflowAction} 
                          isLoading={saving} 
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="col-span-12 lg:col-span-5">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <MessageSquare className="w-4 h-4" />
                        Review Comments ({articleComments.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="max-h-[500px] overflow-y-auto">
                      <ReviewerCommentThread 
                        comments={articleComments} 
                        onAddComment={handleAddComment} 
                      />
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
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