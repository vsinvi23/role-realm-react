import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { CourseCard } from '@/components/courses/CourseCard';
import { CourseHierarchyEditor } from '@/components/courses/CourseHierarchyEditor';
import { LessonEditor } from '@/components/courses/LessonEditor';
import { WorkflowStatusBar } from '@/components/shared/WorkflowStatusBar';
import { ReviewActionsPanel } from '@/components/shared/ReviewActionsPanel';
import { mockCourses } from '@/data/mockContent';
import { Course, Lesson } from '@/types/content';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Plus, Grid, List } from 'lucide-react';

export default function CourseManagement() {
  const [courses] = useState(mockCourses);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCourses = courses.filter(c => 
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (selectedCourse) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Button variant="ghost" onClick={() => { setSelectedCourse(null); setSelectedLesson(null); }} className="mb-2">← Back to Courses</Button>
              <h1 className="text-2xl font-bold">{selectedCourse.title}</h1>
            </div>
          </div>

          <Card><CardContent className="pt-6">
            <WorkflowStatusBar currentStatus={selectedCourse.status} />
            <div className="mt-4 pt-4 border-t"><ReviewActionsPanel currentStatus={selectedCourse.status} onAction={() => {}} /></div>
          </CardContent></Card>

          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 lg:col-span-5">
              <CourseHierarchyEditor
                sections={selectedCourse.sections}
                onSectionsChange={() => {}}
                selectedLessonId={selectedLesson?.id}
                onLessonSelect={(lesson) => setSelectedLesson(lesson)}
              />
            </div>
            <div className="col-span-12 lg:col-span-7">
              {selectedLesson ? (
                <LessonEditor lesson={selectedLesson} onSave={() => {}} />
              ) : (
                <div className="border border-dashed rounded-lg p-8 text-center text-muted-foreground">
                  Select a lesson to edit
                </div>
              )}
            </div>
          </div>
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
            <Input placeholder="Search courses..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9" />
          </div>
          <div className="flex border rounded-lg">
            <Button variant={view === 'grid' ? 'secondary' : 'ghost'} size="icon" onClick={() => setView('grid')}><Grid className="w-4 h-4" /></Button>
            <Button variant={view === 'list' ? 'secondary' : 'ghost'} size="icon" onClick={() => setView('list')}><List className="w-4 h-4" /></Button>
          </div>
        </div>

        <div className={view === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-4'}>
          {filteredCourses.map(course => (
            <CourseCard key={course.id} course={course} onEdit={setSelectedCourse} onView={setSelectedCourse} />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
