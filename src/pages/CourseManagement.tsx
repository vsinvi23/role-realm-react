import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { CourseCard } from '@/components/courses/CourseCard';
import { CourseHierarchyEditor } from '@/components/courses/CourseHierarchyEditor';
import { LessonEditor } from '@/components/courses/LessonEditor';
import { WorkflowStatusBar } from '@/components/shared/WorkflowStatusBar';
import { ReviewActionsPanel } from '@/components/shared/ReviewActionsPanel';
import { ReviewerCommentThread } from '@/components/shared/ReviewerCommentThread';
import { Course, Lesson, WorkflowStatus, ReviewComment } from '@/types/content';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectCourse, selectLesson, setFilters, updateCourseSections, updateLesson, updateCourseStatus } from '@/store/slices/courseSlice';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Plus, Grid, List, GitBranch, MessageSquare, BookOpen, Edit } from 'lucide-react';
import { toast } from 'sonner';

export default function CourseManagement() {
  const dispatch = useAppDispatch();
  const { courses, selectedCourseId, selectedLessonId, filters, saving } = useAppSelector(state => state.courses);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [activeTab, setActiveTab] = useState<'content' | 'workflow'>('content');
  const [reviewComments, setReviewComments] = useState<Record<string, ReviewComment[]>>({});

  const selectedCourse = courses.find(c => c.id === selectedCourseId);
  const selectedLessonData = selectedCourse?.sections
    .flatMap(s => s.subsections)
    .flatMap(sub => sub.lessons)
    .find(l => l.id === selectedLessonId);

  const filteredCourses = courses.filter(c => 
    c.title.toLowerCase().includes(filters.search.toLowerCase()) &&
    (filters.status === 'all' || c.status === filters.status)
  );

  const handleWorkflowAction = (action: string, comment?: string) => {
    if (!selectedCourseId) return;
    const statusMap: Record<string, WorkflowStatus> = {
      submit: 'submitted', approve: 'approved', reject: 'rejected', publish: 'published', request_changes: 'draft',
    };
    if (statusMap[action]) {
      dispatch(updateCourseStatus({ courseId: selectedCourseId, status: statusMap[action] }));
      
      // Add system comment for workflow action
      if (comment) {
        handleAddComment(`**${action.replace('_', ' ').toUpperCase()}**: ${comment}`);
      }
      
      toast.success(`Course ${action.replace('_', ' ')} successfully`);
    }
  };

  const handleAddComment = (content: string, parentId?: string) => {
    if (!selectedCourseId) return;
    
    const newComment: ReviewComment = {
      id: `comment-${Date.now()}`,
      authorId: 'current-user',
      authorName: 'Current User',
      content,
      createdAt: new Date().toISOString(),
      replies: [],
    };

    setReviewComments(prev => {
      const courseComments = prev[selectedCourseId] || [];
      if (parentId) {
        return {
          ...prev,
          [selectedCourseId]: courseComments.map(c => 
            c.id === parentId 
              ? { ...c, replies: [...(c.replies || []), newComment] }
              : c
          ),
        };
      }
      return {
        ...prev,
        [selectedCourseId]: [...courseComments, newComment],
      };
    });
  };

  const handleLessonSave = (lesson: Lesson) => {
    if (selectedCourseId) {
      dispatch(updateLesson({ courseId: selectedCourseId, lesson }));
      toast.success('Lesson saved');
    }
  };

  if (selectedCourse) {
    const courseComments = reviewComments[selectedCourse.id] || [];
    
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Button variant="ghost" onClick={() => dispatch(selectCourse(null))} className="mb-2">← Back to Courses</Button>
              <h1 className="text-2xl font-bold">{selectedCourse.title}</h1>
              <p className="text-muted-foreground">{selectedCourse.description}</p>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'content' | 'workflow')}>
            <TabsList>
              <TabsTrigger value="content" className="gap-2">
                <BookOpen className="w-4 h-4" />
                Course Content
              </TabsTrigger>
              <TabsTrigger value="workflow" className="gap-2">
                <GitBranch className="w-4 h-4" />
                Workflow & Review
              </TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="mt-6">
              <div className="grid grid-cols-12 gap-6">
                <div className="col-span-12 lg:col-span-5">
                  <CourseHierarchyEditor
                    sections={selectedCourse.sections}
                    onSectionsChange={(sections) => dispatch(updateCourseSections({ courseId: selectedCourse.id, sections }))}
                    selectedLessonId={selectedLessonId}
                    onLessonSelect={(lesson) => dispatch(selectLesson(lesson.id))}
                    autoSaving={saving}
                  />
                </div>
                <div className="col-span-12 lg:col-span-7">
                  {selectedLessonData ? (
                    <LessonEditor lesson={selectedLessonData} onSave={handleLessonSave} />
                  ) : (
                    <div className="border border-dashed rounded-lg p-8 text-center text-muted-foreground">
                      <Edit className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p>Select a lesson to edit its content</p>
                    </div>
                  )}
                </div>
              </div>
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
                      <WorkflowStatusBar currentStatus={selectedCourse.status} />
                      <div className="pt-4 border-t">
                        <h4 className="text-sm font-medium mb-3">Available Actions</h4>
                        <ReviewActionsPanel 
                          currentStatus={selectedCourse.status} 
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
                        Review Comments ({courseComments.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="max-h-[500px] overflow-y-auto">
                      <ReviewerCommentThread 
                        comments={courseComments} 
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
            <h1 className="text-2xl font-bold">Course Management</h1>
            <p className="text-muted-foreground">Create and manage courses with hierarchical content.</p>
          </div>
          <Button><Plus className="w-4 h-4 mr-2" />Create Course</Button>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search courses..." value={filters.search} onChange={(e) => dispatch(setFilters({ search: e.target.value }))} className="pl-9" />
          </div>
          <div className="flex border rounded-lg">
            <Button variant={view === 'grid' ? 'secondary' : 'ghost'} size="icon" onClick={() => setView('grid')}><Grid className="w-4 h-4" /></Button>
            <Button variant={view === 'list' ? 'secondary' : 'ghost'} size="icon" onClick={() => setView('list')}><List className="w-4 h-4" /></Button>
          </div>
        </div>

        <div className={view === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-4'}>
          {filteredCourses.map(course => (
            <CourseCard key={course.id} course={course} onEdit={(c) => dispatch(selectCourse(c.id))} onView={(c) => dispatch(selectCourse(c.id))} />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
