import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useCmsList, useDeleteCms, usePublishCms, useSendCmsBack } from '@/api/hooks/useCms';
import { CmsResponseDto, CmsStatus } from '@/api/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Search, Plus, Grid, List, Pencil, Loader2, BookOpen, Calendar, MoreHorizontal, Trash2, Send, Undo2, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

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

export default function CourseManagement() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [page, setPage] = useState(0);
  const pageSize = 10;

  // Dialog states
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [sendBackDialogOpen, setSendBackDialogOpen] = useState(false);
  const [commentDialogOpen, setCommentDialogOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<CmsResponseDto | null>(null);
  const [sendBackComment, setSendBackComment] = useState('');

  const { data: cmsData, isLoading, error } = useCmsList({ page, size: pageSize });
  const deleteCms = useDeleteCms();
  const publishCms = usePublishCms();
  const sendBackCms = useSendCmsBack();

  // Filter for courses only and apply search
  const q = searchQuery.trim().toLowerCase();
  const courses = (cmsData?.items || []).filter((item: CmsResponseDto) => {
    if (item.type !== 'COURSE') return false;
    if (!q) return true;
    const title = (item.title ?? '').toLowerCase();
    const desc = (item.description ?? '').toLowerCase();
    return title.includes(q) || desc.includes(q);
  });

  const totalPages = Math.ceil((cmsData?.totalElements || 0) / pageSize);

  const handleDelete = async () => {
    if (!selectedCourse) return;
    try {
      await deleteCms.mutateAsync(selectedCourse.id);
      toast.success('Course deleted successfully');
      setDeleteDialogOpen(false);
      setSelectedCourse(null);
    } catch {
      toast.error('Failed to delete course');
    }
  };

  const handlePublish = async (course: CmsResponseDto) => {
    try {
      await publishCms.mutateAsync({ id: course.id });
      toast.success('Course published successfully');
    } catch {
      toast.error('Failed to publish course');
    }
  };

  const handleSendBack = async () => {
    if (!selectedCourse || !sendBackComment.trim()) return;
    try {
      await sendBackCms.mutateAsync({
        id: selectedCourse.id,
        data: { reviewerId: 0, comment: sendBackComment.trim() },
      });
      toast.success('Course sent back to draft');
      setSendBackDialogOpen(false);
      setSendBackComment('');
      setSelectedCourse(null);
    } catch {
      toast.error('Failed to send course back');
    }
  };

  const openDeleteDialog = (course: CmsResponseDto) => {
    setSelectedCourse(course);
    setDeleteDialogOpen(true);
  };

  const openSendBackDialog = (course: CmsResponseDto) => {
    setSelectedCourse(course);
    setSendBackComment('');
    setSendBackDialogOpen(true);
  };

  const openCommentDialog = (course: CmsResponseDto) => {
    setSelectedCourse(course);
    setCommentDialogOpen(true);
  };

  const renderActions = (course: CmsResponseDto) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => navigate(`/courses/create?edit=${course.id}`)}>
          <Pencil className="w-4 h-4 mr-2" />
          Edit
        </DropdownMenuItem>
        {course.status === 'REVIEW' && (
          <>
            <DropdownMenuItem onClick={() => handlePublish(course)}>
              <Send className="w-4 h-4 mr-2" />
              Publish
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => openSendBackDialog(course)}>
              <Undo2 className="w-4 h-4 mr-2" />
              Send Back
            </DropdownMenuItem>
          </>
        )}
        {course.reviewerComment && (
          <DropdownMenuItem onClick={() => openCommentDialog(course)}>
            <MessageSquare className="w-4 h-4 mr-2" />
            View Comment
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-destructive focus:text-destructive"
          onClick={() => openDeleteDialog(course)}
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Course Management</h1>
            <p className="text-muted-foreground">Create and manage courses.</p>
          </div>
          <Button onClick={() => navigate('/courses/create')}>
            <Plus className="w-4 h-4 mr-2" />
            Create Course
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search courses..." 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)} 
              className="pl-9" 
            />
          </div>
          <div className="flex border rounded-lg">
            <Button 
              variant={view === 'grid' ? 'secondary' : 'ghost'} 
              size="icon" 
              onClick={() => setView('grid')}
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button 
              variant={view === 'list' ? 'secondary' : 'ghost'} 
              size="icon" 
              onClick={() => setView('list')}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">Loading courses...</span>
          </div>
        ) : error ? (
          <div className="text-center py-12 text-destructive">
            Failed to load courses. Please try again.
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No courses found. Create your first course to get started.
          </div>
        ) : view === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map((course: CmsResponseDto) => (
              <Card key={course.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-primary" />
                      <CardTitle className="text-lg line-clamp-1">
                        {course.title || 'Untitled Course'}
                      </CardTitle>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={getStatusVariant(course.status)}>
                        {course.status}
                      </Badge>
                      {renderActions(course)}
                    </div>
                  </div>
                  <CardDescription className="line-clamp-2">
                    {course.description || 'No description'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>{format(new Date(course.createdAt), 'PP')}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="w-[80px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {courses.map((course: CmsResponseDto) => (
                    <TableRow key={course.id}>
                      <TableCell className="font-medium">
                        {course.title || 'Untitled'}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(course.status)}>
                          {course.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {format(new Date(course.createdAt), 'PP')}
                      </TableCell>
                      <TableCell>
                        {renderActions(course)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

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
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Course</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedCourse?.title || 'Untitled'}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Send Back Dialog */}
      <Dialog open={sendBackDialogOpen} onOpenChange={setSendBackDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Back to Draft</DialogTitle>
            <DialogDescription>
              Provide feedback for the author about why this course needs revision.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Enter your feedback..."
            value={sendBackComment}
            onChange={(e) => setSendBackComment(e.target.value)}
            rows={4}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setSendBackDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendBack} disabled={!sendBackComment.trim()}>
              Send Back
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Comment Dialog */}
      <Dialog open={commentDialogOpen} onOpenChange={setCommentDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reviewer Comment</DialogTitle>
          </DialogHeader>
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm">{selectedCourse?.reviewerComment || 'No comment'}</p>
          </div>
          <DialogFooter>
            <Button onClick={() => setCommentDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
