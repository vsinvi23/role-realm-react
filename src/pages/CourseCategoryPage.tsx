import { useParams, Link } from 'react-router-dom';
import { Search, BookOpen, Clock, Star, ChevronRight, Play, Users, ArrowLeft, Zap, Target, Route, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';

const categoryData: Record<string, {
  title: string;
  description: string;
  icon: React.ElementType;
  courses: { id: number; title: string; description: string; level: string; duration: string; rating: number; students: number; tags: string[] }[];
}> = {
  bytes: {
    title: 'Course Bytes',
    description: 'Quick, focused learning modules perfect for busy schedules. Master concepts in bite-sized lessons.',
    icon: Zap,
    courses: [
      { id: 1, title: 'Git in 30 Minutes', description: 'Essential Git commands and workflows for everyday development.', level: 'Beginner', duration: '30 min', rating: 4.8, students: 25000, tags: ['Git', 'Version Control'] },
      { id: 2, title: 'Docker Quick Start', description: 'Containerize your first application in under an hour.', level: 'Beginner', duration: '45 min', rating: 4.7, students: 18000, tags: ['Docker', 'DevOps'] },
      { id: 3, title: 'REST API Basics', description: 'Design and consume REST APIs with best practices.', level: 'Beginner', duration: '40 min', rating: 4.6, students: 22000, tags: ['API', 'Backend'] },
      { id: 4, title: 'TypeScript Crash Course', description: 'Add type safety to your JavaScript projects.', level: 'Beginner', duration: '1 hour', rating: 4.9, students: 32000, tags: ['TypeScript', 'JavaScript'] },
      { id: 5, title: 'SQL Essentials', description: 'Write queries to retrieve and manipulate data.', level: 'Beginner', duration: '45 min', rating: 4.7, students: 28000, tags: ['SQL', 'Database'] },
      { id: 6, title: 'Linux Command Line', description: 'Navigate the terminal like a pro.', level: 'Beginner', duration: '50 min', rating: 4.5, students: 15000, tags: ['Linux', 'CLI'] },
    ],
  },
  interview: {
    title: 'Interview Prep',
    description: 'Comprehensive preparation for technical interviews at top tech companies. Practice problems, mock interviews, and strategies.',
    icon: Target,
    courses: [
      { id: 1, title: 'FAANG Interview Masterclass', description: 'Complete preparation for interviews at Facebook, Amazon, Apple, Netflix, and Google.', level: 'Intermediate', duration: '60 hours', rating: 4.9, students: 45000, tags: ['FAANG', 'System Design', 'DSA'] },
      { id: 2, title: 'System Design Interview', description: 'Design scalable systems and ace your senior engineer interviews.', level: 'Advanced', duration: '40 hours', rating: 4.8, students: 28000, tags: ['System Design', 'Architecture'] },
      { id: 3, title: 'Behavioral Interview Mastery', description: 'Craft compelling stories and nail the behavioral round.', level: 'All Levels', duration: '8 hours', rating: 4.7, students: 35000, tags: ['Behavioral', 'Soft Skills'] },
      { id: 4, title: 'Coding Patterns: 14 Essential', description: 'Master the 14 patterns that solve 90% of coding problems.', level: 'Intermediate', duration: '25 hours', rating: 4.9, students: 52000, tags: ['DSA', 'Patterns'] },
      { id: 5, title: 'Database Interview Questions', description: 'SQL, NoSQL, and database design interview preparation.', level: 'Intermediate', duration: '15 hours', rating: 4.6, students: 12000, tags: ['Database', 'SQL'] },
      { id: 6, title: 'Frontend Interview Prep', description: 'React, JavaScript, and web fundamentals for frontend roles.', level: 'Intermediate', duration: '30 hours', rating: 4.7, students: 22000, tags: ['React', 'JavaScript', 'CSS'] },
    ],
  },
  targeted: {
    title: 'Targeted Learning',
    description: 'Skill-specific deep dives to master particular technologies or concepts. Perfect for upskilling.',
    icon: GraduationCap,
    courses: [
      { id: 1, title: 'GraphQL Complete Guide', description: 'Build and consume GraphQL APIs with Apollo.', level: 'Intermediate', duration: '20 hours', rating: 4.7, students: 15000, tags: ['GraphQL', 'Apollo', 'API'] },
      { id: 2, title: 'Kubernetes Deep Dive', description: 'Container orchestration for production environments.', level: 'Advanced', duration: '35 hours', rating: 4.8, students: 18000, tags: ['Kubernetes', 'DevOps'] },
      { id: 3, title: 'React Performance', description: 'Optimize your React apps for maximum performance.', level: 'Advanced', duration: '12 hours', rating: 4.6, students: 9000, tags: ['React', 'Performance'] },
      { id: 4, title: 'AWS Solutions Architect', description: 'Design cloud architectures on Amazon Web Services.', level: 'Intermediate', duration: '45 hours', rating: 4.9, students: 32000, tags: ['AWS', 'Cloud'] },
      { id: 5, title: 'Testing in JavaScript', description: 'Unit, integration, and E2E testing with Jest and Cypress.', level: 'Intermediate', duration: '18 hours', rating: 4.5, students: 11000, tags: ['Testing', 'Jest', 'Cypress'] },
      { id: 6, title: 'Microservices Architecture', description: 'Design and implement microservices systems.', level: 'Advanced', duration: '28 hours', rating: 4.7, students: 14000, tags: ['Microservices', 'Architecture'] },
    ],
  },
  paths: {
    title: 'Learning Paths',
    description: 'Comprehensive, role-based tracks that take you from beginner to job-ready. Structured curriculum with projects.',
    icon: Route,
    courses: [
      { id: 1, title: 'Full Stack Developer Path', description: 'Complete journey from HTML to deploying full-stack applications.', level: 'Beginner to Advanced', duration: '120 hours', rating: 4.9, students: 85000, tags: ['Full Stack', 'React', 'Node.js'] },
      { id: 2, title: 'Data Science Path', description: 'Python, statistics, ML, and data visualization for data scientists.', level: 'Beginner to Advanced', duration: '100 hours', rating: 4.8, students: 52000, tags: ['Data Science', 'Python', 'ML'] },
      { id: 3, title: 'DevOps Engineer Path', description: 'CI/CD, containers, cloud, and infrastructure automation.', level: 'Beginner to Advanced', duration: '90 hours', rating: 4.7, students: 38000, tags: ['DevOps', 'AWS', 'Docker'] },
      { id: 4, title: 'Mobile Developer Path', description: 'Build iOS and Android apps with React Native.', level: 'Beginner to Advanced', duration: '80 hours', rating: 4.6, students: 28000, tags: ['Mobile', 'React Native'] },
      { id: 5, title: 'Security Engineer Path', description: 'Application security, penetration testing, and secure coding.', level: 'Intermediate to Advanced', duration: '75 hours', rating: 4.8, students: 22000, tags: ['Security', 'Ethical Hacking'] },
      { id: 6, title: 'Machine Learning Engineer Path', description: 'Deep learning, NLP, and production ML systems.', level: 'Intermediate to Advanced', duration: '110 hours', rating: 4.9, students: 45000, tags: ['ML', 'Deep Learning', 'Python'] },
    ],
  },
};

const CourseCategoryPage = () => {
  const { category } = useParams<{ category: string }>();
  const { isAuthenticated, user, logout } = useAuth();
  
  const data = category ? categoryData[category] : null;
  
  if (!data) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Category not found</h1>
          <Link to="/"><Button>Go Home</Button></Link>
        </div>
      </div>
    );
  }

  const Icon = data.icon;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <Link to="/" className="text-2xl font-bold text-primary">TechLearn</Link>
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search..." className="pl-9" />
              </div>
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard"><Button variant="outline" size="sm">Dashboard</Button></Link>
                  <Button size="sm" variant="ghost" onClick={logout}>{user?.name}</Button>
                </>
              ) : (
                <>
                  <Link to="/auth"><Button variant="outline" size="sm">Sign In</Button></Link>
                  <Link to="/auth"><Button size="sm">Get Started</Button></Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4">
          <Link to="/" className="inline-flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground mb-6 transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-xl bg-primary-foreground/20">
              <Icon className="h-8 w-8" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold">{data.title}</h1>
          </div>
          <p className="text-lg text-primary-foreground/90 max-w-2xl mb-6">{data.description}</p>
          <Badge className="bg-primary-foreground/20 text-primary-foreground border-0">{data.courses.length} Courses Available</Badge>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.courses.map((course) => (
              <Card key={course.id} className="hover:shadow-lg transition-shadow cursor-pointer group overflow-hidden">
                <div className="h-32 bg-primary p-4 flex items-end">
                  <Badge variant="secondary" className="bg-primary-foreground/20 text-primary-foreground border-0">
                    <Play className="h-3 w-3 mr-1" /> Course
                  </Badge>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg group-hover:text-primary transition-colors mb-2">{course.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{course.description}</p>
                  <div className="flex items-center gap-2 text-sm mb-3">
                    <Badge variant="secondary">{course.level}</Badge>
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="h-3 w-3" /> {course.duration}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="flex items-center gap-1 text-warning">
                      <Star className="h-3 w-3 fill-current" /> {course.rating}
                    </span>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Users className="h-3 w-3" /> {course.students.toLocaleString()}
                    </span>
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <div className="flex flex-wrap gap-1">
                    {course.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                    ))}
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default CourseCategoryPage;
