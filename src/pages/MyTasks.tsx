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
import { 
  Search, BookOpen, FileText, Clock, User, CheckCircle, XCircle, 
  MessageSquare, Eye, Bell, ListTodo, Send, Edit 
} from 'lucide-react';
import { mockCourses, mockArticles, mockCategories, mockReviewComments, flattenCategories } from '@/data/mockContent';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { ReviewerCommentThread } from '@/components/shared/ReviewerCommentThread';
import { format } from 'date-fns';
import { WorkflowStatus } from '@/types/content';

type ContentType = 'all' | 'courses' | 'articles';
type OwnershipFilter = 'all' | 'owned' | 'reviewing' | 'contributed';

interface TaskItem {
  id: string;
  title: string;
  type: 'course' | 'article';
  status: WorkflowStatus;
  author: string;
  categoryId: string;
  categoryPath: string[];
  updatedAt: string;
  ownership: 'owned' | 'reviewing' | 'contributed';
  action?: string;
}

// Mock current user
const currentUser = {
  id: 'u-1',
  name: 'Sarah Johnson',
  email: 'sarah@company.com',
};

// Mock notifications
const mockNotifications = [
  { id: 'n-1', title: 'Course "Advanced TypeScript" submitted for review', type: 'review_request', createdAt: '2024-06-15T10:00:00Z', read: false },
  { id: 'n-2', title: 'Your article "Digital Marketing Trends" was approved', type: 'approval', createdAt: '2024-06-14T14:30:00Z', read: false },
  { id: 'n-3', title: 'Changes requested on "React Fundamentals"', type: 'changes_requested', createdAt: '2024-06-13T09:15:00Z', read: true },
];

const MyTasks = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [contentFilter, setContentFilter] = useState<ContentType>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [ownershipFilter, setOwnershipFilter] = useState<OwnershipFilter>('all');
  const [selectedItem, setSelectedItem] = useState<TaskItem | null>(null);
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [reviewComment, setReviewComment] = useState('');
  const [comments, setComments] = useState(mockReviewComments);
  const [activeTab, setActiveTab] = useState('tasks');

  const allCategories = flattenCategories(mockCategories);

  // Build task items from courses and articles
  const courseItems: TaskItem[] = mockCourses.map(c => ({
    id: c.id,
    title: c.title,
    type: 'course' as const,
    status: c.status,
    author: c.instructor,
    categoryId: c.categoryId,
    categoryPath: c.categoryPath,
    updatedAt: c.updatedAt,
    ownership: c.instructor === currentUser.name ? 'owned' : 
      (c.status === 'submitted' || c.status === 'in_review') ? 'reviewing' : 'contributed',
    action: c.status === 'submitted' ? 'Needs Review' : 
      c.status === 'in_review' ? 'Under Review' :
      c.status === 'draft' ? 'Continue Editing' : undefined,
  }));

  const articleItems: TaskItem[] = mockArticles.map(a => ({
    id: a.id,
    title: a.title,
    type: 'article' as const,
    status: a.status,
    author: a.author,
    categoryId: a.categoryId,
    categoryPath: a.categoryPath,
    updatedAt: a.updatedAt,
    ownership: a.author === currentUser.name ? 'owned' : 
      (a.status === 'submitted' || a.status === 'in_review') ? 'reviewing' : 'contributed',
    action: a.status === 'submitted' ? 'Needs Review' : 
      a.status === 'in_review' ? 'Under Review' :
      a.status === 'draft' ? 'Continue Editing' : undefined,
  }));

  const allItems = [...courseItems, ...articleItems];

  // Filter items
  const filteredItems = allItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = contentFilter === 'all' || 
      (contentFilter === 'courses' && item.type === 'course') ||
      (contentFilter === 'articles' && item.type === 'article');
    const matchesCategory = categoryFilter === 'all' || item.categoryId === categoryFilter;
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchesOwnership = ownershipFilter === 'all' || item.ownership === ownershipFilter;
    return matchesSearch && matchesType && matchesCategory && matchesStatus && matchesOwnership;
  });

  // Stats
  const stats = {
    pendingReview: allItems.filter(i => i.ownership === 'reviewing' && (i.status === 'submitted' || i.status === 'in_review')).length,
    myContent: allItems.filter(i => i.ownership === 'owned').length,
    drafts: allItems.filter(i => i.ownership === 'owned' && i.status === 'draft').length,
    published: allItems.filter(i => i.ownership === 'owned' && i.status === 'published').length,
    notifications: mockNotifications.filter(n => !n.read).length,
  };

  const handleApprove = (item: TaskItem) => {
    console.log('Approving:', item.id);
    setShowReviewDialog(false);
    setSelectedItem(null);
  };

  const handleReject = (item: TaskItem) => {
    console.log('Rejecting:', item.id, 'Comment:', reviewComment);
    setShowReviewDialog(false);
    setSelectedItem(null);
    setReviewComment('');
  };

  const handleRequestChanges = (item: TaskItem) => {
    console.log('Requesting changes:', item.id, 'Comment:', reviewComment);
    setShowReviewDialog(false);
    setSelectedItem(null);
    setReviewComment('');
  };

  const openReviewDialog = (item: TaskItem) => {
    setSelectedItem(item);
    setShowReviewDialog(true);
  };

  const handleAddComment = (content: string, parentId?: string) => {
    const newComment = {
      id: `rc-${Date.now()}`,
      authorId: currentUser.id,
      authorName: currentUser.name,
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

  const getOwnershipBadge = (ownership: string) => {
    switch (ownership) {
      case 'owned':
        return <Badge variant="default" className="bg-blue-500">My Content</Badge>;
      case 'reviewing':
        return <Badge variant="secondary" className="bg-orange-500 text-white">To Review</Badge>;
      case 'contributed':
        return <Badge variant="outline">Contributed</Badge>;
      default:
        return null;
    }
  };

  const getActionButton = (item: TaskItem) => {
    if (item.ownership === 'owned') {
      if (item.status === 'draft') {
        return (
          <Button size="sm" variant="outline">
            <Edit className="w-4 h-4 mr-1" />
            Edit
          </Button>
        );
      }
      return (
        <Button size="sm" variant="outline" onClick={() => openReviewDialog(item)}>
          <Eye className="w-4 h-4 mr-1" />
          View Status
        </Button>
      );
    }
    if (item.ownership === 'reviewing') {
      return (
        <Button size="sm" variant="default" onClick={() => openReviewDialog(item)}>
          <Eye className="w-4 h-4 mr-1" />
          Review
        </Button>
      );
    }
    return (
      <Button size="sm" variant="ghost" onClick={() => openReviewDialog(item)}>
        <Eye className="w-4 h-4 mr-1" />
        View
      </Button>
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Tasks</h1>
          <p className="text-muted-foreground mt-1">
            View your content, pending reviews, and notifications
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card className="cursor-pointer hover:border-primary/50 transition-colors" onClick={() => setOwnershipFilter('reviewing')}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-500/10 rounded-lg">
                  <Clock className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pending Review</p>
                  <p className="text-2xl font-bold">{stats.pendingReview}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:border-primary/50 transition-colors" onClick={() => setOwnershipFilter('owned')}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <ListTodo className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">My Content</p>
                  <p className="text-2xl font-bold">{stats.myContent}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-500/10 rounded-lg">
                  <Edit className="w-5 h-5 text-yellow-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">My Drafts</p>
                  <p className="text-2xl font-bold">{stats.drafts}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Published</p>
                  <p className="text-2xl font-bold">{stats.published}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:border-primary/50 transition-colors" onClick={() => setActiveTab('notifications')}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg relative">
                  <Bell className="w-5 h-5 text-primary" />
                  {stats.notifications > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {stats.notifications}
                    </span>
                  )}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Notifications</p>
                  <p className="text-2xl font-bold">{stats.notifications}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="tasks" className="gap-2">
              <ListTodo className="w-4 h-4" />
              Tasks & Content
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2">
              <Bell className="w-4 h-4" />
              Notifications
              {stats.notifications > 0 && (
                <Badge variant="destructive" className="ml-1 h-5 px-1.5">
                  {stats.notifications}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tasks" className="space-y-4 mt-4">
            {/* Filters */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by title or author..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <Select value={ownershipFilter} onValueChange={(v) => setOwnershipFilter(v as OwnershipFilter)}>
                    <SelectTrigger className="w-full lg:w-[160px]">
                      <SelectValue placeholder="Ownership" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Items</SelectItem>
                      <SelectItem value="owned">My Content</SelectItem>
                      <SelectItem value="reviewing">To Review</SelectItem>
                      <SelectItem value="contributed">Contributed</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={contentFilter} onValueChange={(v) => setContentFilter(v as ContentType)}>
                    <SelectTrigger className="w-full lg:w-[140px]">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="courses">Courses</SelectItem>
                      <SelectItem value="articles">Articles</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-full lg:w-[180px]">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {allCategories.map(cat => (
                        <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full lg:w-[140px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="submitted">Submitted</SelectItem>
                      <SelectItem value="in_review">In Review</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Tasks Table */}
            <Card>
              <CardHeader>
                <CardTitle>Content & Tasks ({filteredItems.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {filteredItems.length === 0 ? (
                  <div className="text-center py-12">
                    <CheckCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground">No items found</h3>
                    <p className="text-muted-foreground mt-1">
                      Try adjusting your filters or check back later.
                    </p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Ownership</TableHead>
                        <TableHead>Author</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Updated</TableHead>
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
                          <TableCell>{getOwnershipBadge(item.ownership)}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-muted-foreground" />
                              {item.author}
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-muted-foreground">
                              {item.categoryPath.slice(-2).join(' > ')}
                            </span>
                          </TableCell>
                          <TableCell>
                            <StatusBadge status={item.status} />
                          </TableCell>
                          <TableCell>
                            {format(new Date(item.updatedAt), 'MMM d, yyyy')}
                          </TableCell>
                          <TableCell className="text-right">
                            {getActionButton(item)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Notifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                {mockNotifications.length === 0 ? (
                  <div className="text-center py-12">
                    <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground">No notifications</h3>
                    <p className="text-muted-foreground mt-1">You're all caught up!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {mockNotifications.map(notification => (
                      <div 
                        key={notification.id}
                        className={`p-4 rounded-lg border flex items-start gap-3 ${
                          !notification.read ? 'bg-primary/5 border-primary/20' : 'bg-muted/30'
                        }`}
                      >
                        <div className={`p-2 rounded-full ${
                          notification.type === 'review_request' ? 'bg-orange-500/10' :
                          notification.type === 'approval' ? 'bg-green-500/10' : 'bg-yellow-500/10'
                        }`}>
                          {notification.type === 'review_request' ? (
                            <Clock className="w-4 h-4 text-orange-500" />
                          ) : notification.type === 'approval' ? (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          ) : (
                            <MessageSquare className="w-4 h-4 text-yellow-500" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className={`text-sm ${!notification.read ? 'font-medium' : ''}`}>
                            {notification.title}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {format(new Date(notification.createdAt), 'MMM d, yyyy \'at\' h:mm a')}
                          </p>
                        </div>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

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
                {selectedItem?.ownership === 'reviewing' ? 'Review: ' : 'View: '}
                {selectedItem?.title}
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
                  <div>
                    <p className="text-sm text-muted-foreground">Ownership</p>
                    {getOwnershipBadge(selectedItem.ownership)}
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Last Updated</p>
                    <p className="font-medium">{format(new Date(selectedItem.updatedAt), 'MMM d, yyyy')}</p>
                  </div>
                </div>

                {/* Comments Section */}
                <div>
                  <h3 className="font-medium mb-3 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Comments & Feedback
                  </h3>
                  <ReviewerCommentThread 
                    comments={comments}
                    onAddComment={handleAddComment}
                  />
                </div>

                {/* Review Actions - only show for reviewers */}
                {selectedItem.ownership === 'reviewing' && (
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
                )}

                {/* Owner Actions */}
                {selectedItem.ownership === 'owned' && selectedItem.status === 'draft' && (
                  <div className="border-t pt-4">
                    <div className="flex gap-2">
                      <Button variant="outline">
                        <Edit className="w-4 h-4 mr-2" />
                        Continue Editing
                      </Button>
                      <Button>
                        <Send className="w-4 h-4 mr-2" />
                        Submit for Review
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default MyTasks;
