import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { useCmsList } from '@/api/hooks/useCms';
import { CmsResponseDto, CmsStatus } from '@/api/types';
import { WorkflowStatus } from '@/types/content';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Plus, Grid, List, Pencil, Eye, Loader2, BookOpen, Calendar } from 'lucide-react';
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

export default function CourseManagement() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [page, setPage] = useState(0);
  const pageSize = 10;

  // Fetch CMS items with type COURSE
  const { data: cmsData, isLoading, error } = useCmsList({ page, size: pageSize });

  // Filter for courses only and apply search
  const q = searchQuery.trim().toLowerCase();
  const courses = (cmsData?.items || []).filter((item: CmsResponseDto) => {
    if (item.type !== 'COURSE') return false;
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
            <h1 className="text-2xl font-bold">Course Management</h1>
            <p className="text-muted-foreground">Create and manage courses with hierarchical content.</p>
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
                    <StatusBadge status={mapCmsStatus(course.status)} size="sm" />
                  </div>
                  <CardDescription className="line-clamp-2">
                    {course.description || 'No description available'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                    <Calendar className="w-4 h-4" />
                    <span>Created {format(new Date(course.createdAt), 'PP')}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => navigate(`/courses/create?id=${course.id}`)}
                    >
                      <Pencil className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
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
                    <TableHead>Description</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Updated</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {courses.map((course: CmsResponseDto) => (
                    <TableRow key={course.id}>
                      <TableCell className="font-medium">
                        {course.title || 'Untitled'}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">
                        {course.description || '-'}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={mapCmsStatus(course.status)} size="sm" />
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {format(new Date(course.createdAt), 'PP')}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {format(new Date(course.updatedAt), 'PP')}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => navigate(`/courses/create?id=${course.id}`)}
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
            </CardContent>
          </Card>
        )}

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
