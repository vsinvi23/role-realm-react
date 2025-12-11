import { useParams, Link } from 'react-router-dom';
import { BookOpen, Clock, Star, Play, Users, Zap, Target, Route, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { PublicLayout } from '@/components/layout/PublicLayout';

const categoryData: Record<string, {
  title: string;
  description: string;
  icon: React.ElementType;
  courses: { id: number; title: string; description: string; level: string; duration: string; rating: number; students: number; tags: string[] }[];
}> = {
  bytes: {
    title: 'Course Bytes',
    description: 'Quick, focused learning modules perfect for busy schedules.',
    icon: Zap,
    courses: [
      { id: 1, title: 'Git in 30 Minutes', description: 'Essential Git commands and workflows.', level: 'Beginner', duration: '30 min', rating: 4.8, students: 25000, tags: ['Git', 'Version Control'] },
      { id: 2, title: 'Docker Quick Start', description: 'Containerize your first application.', level: 'Beginner', duration: '45 min', rating: 4.7, students: 18000, tags: ['Docker', 'DevOps'] },
      { id: 3, title: 'REST API Basics', description: 'Design and consume REST APIs.', level: 'Beginner', duration: '40 min', rating: 4.6, students: 22000, tags: ['API', 'Backend'] },
      { id: 4, title: 'TypeScript Crash Course', description: 'Add type safety to JavaScript.', level: 'Beginner', duration: '1 hour', rating: 4.9, students: 32000, tags: ['TypeScript', 'JavaScript'] },
    ],
  },
  interview: {
    title: 'Interview Prep',
    description: 'Comprehensive preparation for technical interviews.',
    icon: Target,
    courses: [
      { id: 1, title: 'FAANG Interview Masterclass', description: 'Complete preparation for top tech interviews.', level: 'Intermediate', duration: '60 hours', rating: 4.9, students: 45000, tags: ['FAANG', 'System Design'] },
      { id: 2, title: 'System Design Interview', description: 'Design scalable systems.', level: 'Advanced', duration: '40 hours', rating: 4.8, students: 28000, tags: ['System Design'] },
      { id: 3, title: 'Coding Patterns: 14 Essential', description: 'Master patterns that solve 90% of problems.', level: 'Intermediate', duration: '25 hours', rating: 4.9, students: 52000, tags: ['DSA', 'Patterns'] },
    ],
  },
  targeted: {
    title: 'Targeted Learning',
    description: 'Skill-specific deep dives to master particular technologies.',
    icon: GraduationCap,
    courses: [
      { id: 1, title: 'GraphQL Complete Guide', description: 'Build GraphQL APIs with Apollo.', level: 'Intermediate', duration: '20 hours', rating: 4.7, students: 15000, tags: ['GraphQL', 'API'] },
      { id: 2, title: 'Kubernetes Deep Dive', description: 'Container orchestration for production.', level: 'Advanced', duration: '35 hours', rating: 4.8, students: 18000, tags: ['Kubernetes', 'DevOps'] },
      { id: 3, title: 'AWS Solutions Architect', description: 'Design cloud architectures on AWS.', level: 'Intermediate', duration: '45 hours', rating: 4.9, students: 32000, tags: ['AWS', 'Cloud'] },
    ],
  },
  paths: {
    title: 'Learning Paths',
    description: 'Comprehensive, role-based tracks from beginner to job-ready.',
    icon: Route,
    courses: [
      { id: 1, title: 'Full Stack Developer Path', description: 'Complete journey to full-stack development.', level: 'Beginner to Advanced', duration: '120 hours', rating: 4.9, students: 85000, tags: ['Full Stack', 'React'] },
      { id: 2, title: 'Data Science Path', description: 'Python, statistics, ML, and visualization.', level: 'Beginner to Advanced', duration: '100 hours', rating: 4.8, students: 52000, tags: ['Data Science', 'Python'] },
      { id: 3, title: 'DevOps Engineer Path', description: 'CI/CD, containers, and infrastructure.', level: 'Beginner to Advanced', duration: '90 hours', rating: 4.7, students: 38000, tags: ['DevOps', 'AWS'] },
    ],
  },
};

const CourseCategoryPage = () => {
  const { category } = useParams<{ category: string }>();
  const data = category ? categoryData[category] : null;
  
  if (!data) {
    return (
      <PublicLayout>
        <div className="text-center py-16">
          <h1 className="text-2xl font-bold mb-4">Category not found</h1>
          <Link to="/"><Button>Go Home</Button></Link>
        </div>
      </PublicLayout>
    );
  }

  const Icon = data.icon;

  return (
    <PublicLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-primary/10">
            <Icon className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{data.title}</h1>
            <p className="text-muted-foreground">{data.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="secondary">{data.courses.length} Courses Available</Badge>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.courses.map((course) => (
            <Card key={course.id} className="hover:shadow-md transition-shadow cursor-pointer group overflow-hidden">
              <div className="p-4 bg-primary/10">
                <h3 className="font-semibold text-primary text-center">{course.title}</h3>
              </div>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{course.description}</p>
                <div className="flex items-center gap-2 text-sm mb-2">
                  <Badge variant="secondary">{course.level}</Badge>
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="h-3 w-3" /> {course.duration}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="flex items-center gap-1 text-warning">
                    <Star className="h-3 w-3 fill-current" /> {course.rating}
                  </span>
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Users className="h-3 w-3" /> {course.students.toLocaleString()}
                  </span>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <div className="flex flex-wrap gap-1">
                  {course.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                  ))}
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </PublicLayout>
  );
};

export default CourseCategoryPage;
