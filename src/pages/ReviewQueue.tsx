import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Search, BookOpen, FileText, Clock, User, CheckCircle, XCircle, MessageSquare, Eye } from 'lucide-react';
import { mockCourses, mockArticles, mockUserGroups, mockReviewComments } from '@/data/mockContent';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { ReviewerCommentThread } from '@/components/shared/ReviewerCommentThread';
import { format } from 'date-fns';

type ContentType = 'all' | 'courses' | 'articles';
type ReviewStatus = 'submitted' | 'in_review';

interface ReviewItem {
  id: string;
  title: string;
  type: 'course' | 'article';
  status: ReviewStatus;
  author: string;
  categoryPath: string[];
  submittedAt: string;
  updatedAt: string;
}

const ReviewQueue = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [contentFilter, setContentFilter] = useState<ContentType>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<ReviewItem | null>(null);
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [reviewComment, setReviewComment] = useState('');
  const [comments, setComments] = useState(mockReviewComments);

  // Get pending review items (submitted or in_review status)
  const pendingCourses: ReviewItem[] = mockCourses
    .filter(c => c.status === 'submitted' || c.status === 'in_review')
    .map(c => ({
      id: c.id,
      title: c.title,
      type: 'course' as const,
      status: c.status as ReviewStatus,
      author: c.instructor,
      categoryPath: c.categoryPath,
      submittedAt: c.updatedAt,
      updatedAt: c.updatedAt,
    }));

  const pendingArticles: ReviewItem[] = mockArticles
    .filter(a => a.status === 'submitted' || a.status === 'in_review')
    .map(a => ({
      id: a.id,
      title: a.title,
      type: 'article' as const,
      status: a.status as ReviewStatus,
      author: a.author,
      categoryPath: a.categoryPath,
      submittedAt: a.updatedAt,
      updatedAt: a.updatedAt,
    }));

  const allPendingItems = [...pendingCourses, ...pendingArticles];

  // Filter items based on search and filters
  const filteredItems = allPendingItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = contentFilter === 'all' || 
      (contentFilter === 'courses' && item.type === 'course') ||
      (contentFilter === 'articles' && item.type === 'article');
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleApprove = (item: ReviewItem) => {
    // In real app, this would update the status via API
    console.log('Approving:', item.id);
    setShowReviewDialog(false);
    setSelectedItem(null);
  };

  const handleReject = (item: ReviewItem) => {
    // In real app, this would update the status via API
    console.log('Rejecting:', item.id, 'Comment:', reviewComment);
    setShowReviewDialog(false);
    setSelectedItem(null);
    setReviewComment('');
  };

  const handleRequestChanges = (item: ReviewItem) => {
    // In real app, this would update the status and add comment
    console.log('Requesting changes:', item.id, 'Comment:', reviewComment);
    setShowReviewDialog(false);
    setSelectedItem(null);
    setReviewComment('');
  };

  const openReviewDialog = (item: ReviewItem) => {
    setSelectedItem(item);
    setShowReviewDialog(true);
  };

  const handleAddComment = (content: string, parentId?: string) => {
    const newComment = {
      id: `rc-${Date.now()}`,
      authorId: 'current-user',
      authorName: 'Current User',
      content,
      createdAt: new Date().toISOString(),
      replies: [],
    };
    
    if (parentId) {
      setComments(prev => prev.map(c => 
        c.id === parentId 
          ? { ...c, replies: [...c.replies, newComment] }
          : c
      ));
    } else {
      setComments(prev => [...prev, newComment]);
    }
  };

  // Stats
  const stats = {
    total: allPendingItems.length,
    courses: pendingCourses.length,
    articles: pendingArticles.length,
    submitted: allPendingItems.filter(i => i.status === 'submitted').length,
    inReview: allPendingItems.filter(i => i.status === 'in_review').length,
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Review Queue</h1>
          <p className="text-muted-foreground mt-1">
            Manage pending content reviews for courses and articles
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Pending</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <BookOpen className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Courses</p>
                  <p className="text-2xl font-bold">{stats.courses}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/10 rounded-lg">
                  <FileText className="w-5 h-5 text-purple-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Articles</p>
                  <p className="text-2xl font-bold">{stats.articles}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-500/10 rounded-lg">
                  <Clock className="w-5 h-5 text-yellow-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Submitted</p>
                  <p className="text-2xl font-bold">{stats.submitted}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-500/10 rounded-lg">
                  <Eye className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">In Review</p>
                  <p className="text-2xl font-bold">{stats.inReview}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by title or author..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={contentFilter} onValueChange={(v) => setContentFilter(v as ContentType)}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Content Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Content</SelectItem>
                  <SelectItem value="courses">Courses Only</SelectItem>
                  <SelectItem value="articles">Articles Only</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="submitted">Submitted</SelectItem>
                  <SelectItem value="in_review">In Review</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Review Items Table */}
        <Card>
          <CardHeader>
            <CardTitle>Pending Reviews ({filteredItems.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredItems.length === 0 ? (
              <div className="text-center py-12">
                <CheckCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground">No pending reviews</h3>
                <p className="text-muted-foreground mt-1">
                  All content has been reviewed. Check back later for new submissions.
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.title}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="gap-1">
                          {item.type === 'course' ? (
                            <BookOpen className="w-3 h-3" />
                          ) : (
                            <FileText className="w-3 h-3" />
                          )}
                          {item.type === 'course' ? 'Course' : 'Article'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-muted-foreground" />
                          {item.author}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {item.categoryPath.join(' > ')}
                        </span>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={item.status} />
                      </TableCell>
                      <TableCell>
                        {format(new Date(item.submittedAt), 'MMM d, yyyy')}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openReviewDialog(item)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Review
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

        {/* Review Dialog */}
        <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {selectedItem?.type === 'course' ? (
                  <BookOpen className="w-5 h-5 text-blue-500" />
                ) : (
                  <FileText className="w-5 h-5 text-purple-500" />
                )}
                Review: {selectedItem?.title}
              </DialogTitle>
            </DialogHeader>

            {selectedItem && (
              <div className="space-y-6">
                {/* Item Details */}
                <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">Author</p>
                    <p className="font-medium">{selectedItem.author}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Type</p>
                    <p className="font-medium capitalize">{selectedItem.type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Category</p>
                    <p className="font-medium">{selectedItem.categoryPath.join(' > ')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <StatusBadge status={selectedItem.status} />
                  </div>
                </div>

                {/* Comments Section */}
                <div>
                  <h3 className="font-medium mb-3 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Review Comments
                  </h3>
                  <ReviewerCommentThread 
                    comments={comments}
                    onAddComment={handleAddComment}
                  />
                </div>

                {/* Review Actions */}
                <div className="border-t pt-4">
                  <h3 className="font-medium mb-3">Add Review Comment</h3>
                  <Textarea
                    placeholder="Enter your review comments or feedback..."
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    rows={3}
                  />
                  <div className="flex gap-2 mt-4">
                    <Button
                      variant="default"
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => handleApprove(selectedItem)}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleRequestChanges(selectedItem)}
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Request Changes
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleReject(selectedItem)}
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default ReviewQueue;
