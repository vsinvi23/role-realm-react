import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ChevronLeft, ChevronDown, ChevronRight, Search, Play, 
  CheckCircle2, Circle, Lock, Clock, Users, Star, BookOpen,
  Share2, Facebook, Twitter, Linkedin
} from 'lucide-react';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface Lesson {
  id: string;
  title: string;
  duration: string;
  isCompleted: boolean;
  isLocked: boolean;
  type: 'video' | 'article' | 'quiz';
}

interface Section {
  id: string;
  title: string;
  description?: string;
  lessons: Lesson[];
}

interface CourseData {
  id: string;
  title: string;
  description: string;
  price: string;
  level: string;
  duration: string;
  students: number;
  rating: number;
  instructor: string;
  sections: Section[];
}

// Mock course data
const coursesData: Record<string, CourseData> = {
  'system-design-interview-masterclass': {
    id: '1',
    title: 'System Design Interview Masterclass',
    description: 'Master distributed systems, scalability patterns, and ace your system design interviews with real-world examples.',
    price: '$79.99',
    level: 'Intermediate',
    duration: '24 hours',
    students: 12500,
    rating: 4.8,
    instructor: 'Tech Lead at FAANG',
    sections: [
      {
        id: 's1',
        title: 'Introduction to System Design',
        description: 'Before we start, let\'s understand the fundamentals of system design.',
        lessons: [
          { id: 'l1', title: 'What is System Design?', duration: '12 min', isCompleted: true, isLocked: false, type: 'video' },
          { id: 'l2', title: 'Why System Design Matters', duration: '8 min', isCompleted: true, isLocked: false, type: 'article' },
          { id: 'l3', title: 'How to Approach SD Interviews', duration: '15 min', isCompleted: false, isLocked: false, type: 'video' },
          { id: 'l4', title: 'Introduction Quiz', duration: '10 min', isCompleted: false, isLocked: false, type: 'quiz' },
        ],
      },
      {
        id: 's2',
        title: 'Scalability Fundamentals',
        description: 'Learn the core concepts of building scalable systems.',
        lessons: [
          { id: 'l5', title: 'Vertical vs Horizontal Scaling', duration: '18 min', isCompleted: false, isLocked: false, type: 'video' },
          { id: 'l6', title: 'Load Balancing Strategies', duration: '22 min', isCompleted: false, isLocked: false, type: 'video' },
          { id: 'l7', title: 'Database Sharding', duration: '25 min', isCompleted: false, isLocked: false, type: 'video' },
          { id: 'l8', title: 'Caching Mechanisms', duration: '20 min', isCompleted: false, isLocked: false, type: 'video' },
          { id: 'l9', title: 'CDN and Edge Computing', duration: '15 min', isCompleted: false, isLocked: true, type: 'video' },
        ],
      },
      {
        id: 's3',
        title: 'Database Design',
        description: 'Deep dive into SQL vs NoSQL and when to use each.',
        lessons: [
          { id: 'l10', title: 'SQL vs NoSQL Trade-offs', duration: '20 min', isCompleted: false, isLocked: true, type: 'video' },
          { id: 'l11', title: 'CAP Theorem Explained', duration: '18 min', isCompleted: false, isLocked: true, type: 'article' },
          { id: 'l12', title: 'ACID vs BASE', duration: '15 min', isCompleted: false, isLocked: true, type: 'video' },
          { id: 'l13', title: 'Database Indexing', duration: '22 min', isCompleted: false, isLocked: true, type: 'video' },
          { id: 'l14', title: 'Replication Strategies', duration: '20 min', isCompleted: false, isLocked: true, type: 'video' },
        ],
      },
      {
        id: 's4',
        title: 'Distributed Systems',
        description: 'Understanding the challenges of distributed computing.',
        lessons: [
          { id: 'l15', title: 'Distributed System Challenges', duration: '25 min', isCompleted: false, isLocked: true, type: 'video' },
          { id: 'l16', title: 'Consensus Algorithms', duration: '30 min', isCompleted: false, isLocked: true, type: 'video' },
          { id: 'l17', title: 'Message Queues', duration: '22 min', isCompleted: false, isLocked: true, type: 'video' },
          { id: 'l18', title: 'Event-Driven Architecture', duration: '25 min', isCompleted: false, isLocked: true, type: 'video' },
        ],
      },
      {
        id: 's5',
        title: 'Real-World System Designs',
        description: 'Design popular systems from scratch with detailed walkthroughs.',
        lessons: [
          { id: 'l19', title: 'Design URL Shortener', duration: '35 min', isCompleted: false, isLocked: true, type: 'video' },
          { id: 'l20', title: 'Design Twitter Feed', duration: '45 min', isCompleted: false, isLocked: true, type: 'video' },
          { id: 'l21', title: 'Design Netflix', duration: '50 min', isCompleted: false, isLocked: true, type: 'video' },
          { id: 'l22', title: 'Design Uber', duration: '55 min', isCompleted: false, isLocked: true, type: 'video' },
          { id: 'l23', title: 'Design WhatsApp', duration: '40 min', isCompleted: false, isLocked: true, type: 'video' },
        ],
      },
    ],
  },
  'data-structures-algorithms': {
    id: '2',
    title: 'Data Structures & Algorithms',
    description: 'Comprehensive DSA course with 500+ problems and interview patterns.',
    price: '$89.99',
    level: 'All Levels',
    duration: '60 hours',
    students: 25000,
    rating: 4.9,
    instructor: 'Ex-Google Engineer',
    sections: [
      {
        id: 's1',
        title: 'Introduction',
        description: 'Before we start, let\'s talk about the basics you\'ll need to succeed.',
        lessons: [
          { id: 'l1', title: 'Course Overview', duration: '10 min', isCompleted: true, isLocked: false, type: 'video' },
          { id: 'l2', title: 'Big O Notation', duration: '25 min', isCompleted: true, isLocked: false, type: 'video' },
          { id: 'l3', title: 'Space Complexity', duration: '18 min', isCompleted: false, isLocked: false, type: 'video' },
          { id: 'l4', title: 'Problem Solving Approach', duration: '20 min', isCompleted: false, isLocked: false, type: 'article' },
        ],
      },
      {
        id: 's2',
        title: 'Arrays and Strings',
        description: 'Arrays and strings are two of the most fundamental data structures seen in interviews.',
        lessons: [
          { id: 'l5', title: 'Array Fundamentals', duration: '22 min', isCompleted: false, isLocked: false, type: 'video' },
          { id: 'l6', title: 'Two Pointers Technique', duration: '30 min', isCompleted: false, isLocked: false, type: 'video' },
          { id: 'l7', title: 'Sliding Window', duration: '35 min', isCompleted: false, isLocked: false, type: 'video' },
          { id: 'l8', title: 'String Manipulation', duration: '28 min', isCompleted: false, isLocked: true, type: 'video' },
        ],
      },
      {
        id: 's3',
        title: 'Hashing',
        description: 'Hashing can be used to implement a hash map - arguably the most powerful data structure.',
        lessons: [
          { id: 'l9', title: 'Hash Tables Deep Dive', duration: '28 min', isCompleted: false, isLocked: true, type: 'video' },
          { id: 'l10', title: 'Hash Set Applications', duration: '20 min', isCompleted: false, isLocked: true, type: 'video' },
          { id: 'l11', title: 'Collision Handling', duration: '25 min', isCompleted: false, isLocked: true, type: 'video' },
        ],
      },
      {
        id: 's4',
        title: 'Linked Lists',
        description: 'Linked lists are like arrays - they\'re an ordered collection of elements.',
        lessons: [
          { id: 'l12', title: 'Singly Linked Lists', duration: '25 min', isCompleted: false, isLocked: true, type: 'video' },
          { id: 'l13', title: 'Doubly Linked Lists', duration: '20 min', isCompleted: false, isLocked: true, type: 'video' },
          { id: 'l14', title: 'Fast and Slow Pointers', duration: '30 min', isCompleted: false, isLocked: true, type: 'video' },
        ],
      },
      {
        id: 's5',
        title: 'Stacks and Queues',
        description: 'Stacks and queues are data structures defined by their interfaces.',
        lessons: [
          { id: 'l15', title: 'Stack Operations', duration: '20 min', isCompleted: false, isLocked: true, type: 'video' },
          { id: 'l16', title: 'Queue Implementations', duration: '22 min', isCompleted: false, isLocked: true, type: 'video' },
          { id: 'l17', title: 'Monotonic Stack', duration: '28 min', isCompleted: false, isLocked: true, type: 'video' },
        ],
      },
      {
        id: 's6',
        title: 'Trees and Graphs',
        description: 'Trees and graphs are arguably the most important topics in interviews.',
        lessons: [
          { id: 'l18', title: 'Binary Trees', duration: '30 min', isCompleted: false, isLocked: true, type: 'video' },
          { id: 'l19', title: 'Binary Search Trees', duration: '35 min', isCompleted: false, isLocked: true, type: 'video' },
          { id: 'l20', title: 'Graph Traversals', duration: '40 min', isCompleted: false, isLocked: true, type: 'video' },
          { id: 'l21', title: 'Shortest Path Algorithms', duration: '45 min', isCompleted: false, isLocked: true, type: 'video' },
        ],
      },
    ],
  },
  'complete-devops-ai': {
    id: '3',
    title: 'Complete DevOps with AI Integration',
    description: 'From CI/CD pipelines to Kubernetes, with AI-powered automation techniques.',
    price: '$99.99',
    level: 'Beginner to Advanced',
    duration: '40 hours',
    students: 8900,
    rating: 4.7,
    instructor: 'DevOps Architect',
    sections: [
      {
        id: 's1',
        title: 'DevOps Fundamentals',
        description: 'Understanding the DevOps culture and practices.',
        lessons: [
          { id: 'l1', title: 'What is DevOps?', duration: '15 min', isCompleted: true, isLocked: false, type: 'video' },
          { id: 'l2', title: 'DevOps vs Traditional IT', duration: '12 min', isCompleted: false, isLocked: false, type: 'article' },
          { id: 'l3', title: 'CI/CD Overview', duration: '20 min', isCompleted: false, isLocked: false, type: 'video' },
        ],
      },
      {
        id: 's2',
        title: 'Containerization with Docker',
        description: 'Master Docker containers from basics to production.',
        lessons: [
          { id: 'l4', title: 'Docker Basics', duration: '25 min', isCompleted: false, isLocked: false, type: 'video' },
          { id: 'l5', title: 'Dockerfile Best Practices', duration: '22 min', isCompleted: false, isLocked: false, type: 'video' },
          { id: 'l6', title: 'Docker Compose', duration: '30 min', isCompleted: false, isLocked: true, type: 'video' },
        ],
      },
      {
        id: 's3',
        title: 'Kubernetes Orchestration',
        description: 'Deploy and manage containerized applications at scale.',
        lessons: [
          { id: 'l7', title: 'Kubernetes Architecture', duration: '35 min', isCompleted: false, isLocked: true, type: 'video' },
          { id: 'l8', title: 'Pods and Deployments', duration: '28 min', isCompleted: false, isLocked: true, type: 'video' },
          { id: 'l9', title: 'Services and Ingress', duration: '30 min', isCompleted: false, isLocked: true, type: 'video' },
          { id: 'l10', title: 'Helm Charts', duration: '25 min', isCompleted: false, isLocked: true, type: 'video' },
        ],
      },
      {
        id: 's4',
        title: 'AI-Powered Automation',
        description: 'Leverage AI to automate DevOps workflows.',
        lessons: [
          { id: 'l11', title: 'AI in DevOps', duration: '20 min', isCompleted: false, isLocked: true, type: 'video' },
          { id: 'l12', title: 'Automated Testing with AI', duration: '35 min', isCompleted: false, isLocked: true, type: 'video' },
          { id: 'l13', title: 'Predictive Scaling', duration: '28 min', isCompleted: false, isLocked: true, type: 'video' },
        ],
      },
    ],
  },
  'react-typescript-deep-dive': {
    id: '4',
    title: 'React & TypeScript Deep Dive',
    description: 'Build production-ready applications with React 18 and TypeScript.',
    price: '$69.99',
    level: 'Intermediate',
    duration: '18 hours',
    students: 6700,
    rating: 4.6,
    instructor: 'Senior Frontend Engineer',
    sections: [
      {
        id: 's1',
        title: 'TypeScript Foundations',
        description: 'Get started with TypeScript for React development.',
        lessons: [
          { id: 'l1', title: 'TypeScript Basics', duration: '20 min', isCompleted: true, isLocked: false, type: 'video' },
          { id: 'l2', title: 'Types and Interfaces', duration: '25 min', isCompleted: false, isLocked: false, type: 'video' },
          { id: 'l3', title: 'Generics', duration: '30 min', isCompleted: false, isLocked: false, type: 'video' },
        ],
      },
      {
        id: 's2',
        title: 'React 18 Features',
        description: 'Explore the latest React 18 features and patterns.',
        lessons: [
          { id: 'l4', title: 'Concurrent Rendering', duration: '28 min', isCompleted: false, isLocked: false, type: 'video' },
          { id: 'l5', title: 'Suspense Deep Dive', duration: '32 min', isCompleted: false, isLocked: true, type: 'video' },
          { id: 'l6', title: 'Server Components', duration: '35 min', isCompleted: false, isLocked: true, type: 'video' },
        ],
      },
      {
        id: 's3',
        title: 'State Management',
        description: 'Modern state management patterns in React.',
        lessons: [
          { id: 'l7', title: 'Context API Advanced', duration: '25 min', isCompleted: false, isLocked: true, type: 'video' },
          { id: 'l8', title: 'Redux Toolkit', duration: '40 min', isCompleted: false, isLocked: true, type: 'video' },
          { id: 'l9', title: 'Zustand and Jotai', duration: '30 min', isCompleted: false, isLocked: true, type: 'video' },
        ],
      },
    ],
  },
};

const CourseViewPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSections, setExpandedSections] = useState<string[]>(['s1', 's2']);
  const [selectedLesson, setSelectedLesson] = useState<string>('l1');

  const course = slug ? coursesData[slug] : null;

  if (!course) {
    return (
      <PublicLayout>
        <div className="flex flex-col items-center justify-center py-20">
          <h1 className="text-2xl font-bold text-foreground mb-4">Course Not Found</h1>
          <p className="text-muted-foreground mb-6">The course you're looking for doesn't exist.</p>
          <Link to="/">
            <Button>
              <ChevronLeft className="h-4 w-4 mr-2" /> Back to Home
            </Button>
          </Link>
        </div>
      </PublicLayout>
    );
  }

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const totalLessons = course.sections.reduce((acc, s) => acc + s.lessons.length, 0);
  const completedLessons = course.sections.reduce(
    (acc, s) => acc + s.lessons.filter(l => l.isCompleted).length, 0
  );
  const progressPercent = Math.round((completedLessons / totalLessons) * 100);

  const currentSection = course.sections.find(s => 
    s.lessons.some(l => l.id === selectedLesson)
  );
  const currentLesson = currentSection?.lessons.find(l => l.id === selectedLesson);

  const filteredSections = course.sections.map(section => ({
    ...section,
    lessons: section.lessons.filter(lesson =>
      lesson.title.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter(section => section.lessons.length > 0 || section.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <PublicLayout>
      <div className="flex flex-col lg:flex-row gap-0 -mx-4 -mt-4">
        {/* Left Sidebar - Course Navigation */}
        <div className="w-full lg:w-80 xl:w-96 bg-card border-r border-border flex-shrink-0">
          {/* Course Header */}
          <div className="p-4 border-b border-border bg-primary text-primary-foreground">
            <Link to="/" className="inline-flex items-center text-sm text-primary-foreground/80 hover:text-primary-foreground mb-3">
              <ChevronLeft className="h-4 w-4 mr-1" /> Back to Courses
            </Link>
            <h1 className="text-lg font-bold mb-2">{course.title}</h1>
            <div className="flex items-center gap-2 text-sm text-primary-foreground/80 mb-3">
              <span className="font-semibold text-xl text-primary-foreground">{course.price}</span>
            </div>
            <div className="flex items-center gap-2">
              <Progress value={progressPercent} className="flex-1 h-2 bg-primary-foreground/20" />
              <span className="text-xs text-primary-foreground/80">{progressPercent}%</span>
            </div>
          </div>

          {/* Search */}
          <div className="p-3 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search Content"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9"
              />
            </div>
          </div>

          {/* Sections */}
          <ScrollArea className="h-[calc(100vh-320px)]">
            <div className="p-2">
              {filteredSections.map((section, idx) => (
                <div key={section.id} className="mb-1">
                  {/* Section Header */}
                  <button
                    onClick={() => toggleSection(section.id)}
                    className={cn(
                      "w-full text-left p-3 rounded-lg transition-colors",
                      expandedSections.includes(section.id) 
                        ? "bg-primary/10 text-primary"
                        : "hover:bg-muted"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        {expandedSections.includes(section.id) ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-muted-foreground">{idx + 1}.</span>
                          <h3 className="font-semibold text-sm">{section.title}</h3>
                        </div>
                        {section.description && (
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                            {section.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </button>

                  {/* Lessons */}
                  {expandedSections.includes(section.id) && (
                    <div className="ml-6 mt-1 space-y-0.5">
                      {section.lessons.map((lesson) => (
                        <button
                          key={lesson.id}
                          onClick={() => !lesson.isLocked && setSelectedLesson(lesson.id)}
                          disabled={lesson.isLocked}
                          className={cn(
                            "w-full text-left p-2.5 rounded-md flex items-center gap-3 transition-colors text-sm",
                            selectedLesson === lesson.id
                              ? "bg-primary text-primary-foreground"
                              : lesson.isLocked
                              ? "text-muted-foreground cursor-not-allowed"
                              : "hover:bg-muted"
                          )}
                        >
                          <div className="flex-shrink-0">
                            {lesson.isCompleted ? (
                              <CheckCircle2 className="h-4 w-4 text-success" />
                            ) : lesson.isLocked ? (
                              <Lock className="h-4 w-4" />
                            ) : (
                              <Circle className={cn(
                                "h-4 w-4",
                                selectedLesson === lesson.id ? "text-primary-foreground" : "text-primary"
                              )} />
                            )}
                          </div>
                          <span className="flex-1 truncate">{lesson.title}</span>
                          <span className={cn(
                            "text-xs",
                            selectedLesson === lesson.id 
                              ? "text-primary-foreground/70"
                              : "text-muted-foreground"
                          )}>
                            {lesson.duration}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 min-w-0">
          {/* Breadcrumb */}
          <div className="px-6 py-3 border-b border-border bg-muted/30">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link to="/" className="hover:text-foreground">{course.title}</Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-foreground">{currentLesson?.title}</span>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Lesson Header */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-foreground mb-2">
                  {currentLesson?.title}
                </h1>
                <p className="text-muted-foreground">
                  {currentSection?.description}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button size="icon" variant="outline" className="rounded-full bg-[#1877F2] text-white border-none hover:bg-[#1877F2]/90">
                  <Facebook className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="outline" className="rounded-full bg-[#1DA1F2] text-white border-none hover:bg-[#1DA1F2]/90">
                  <Twitter className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="outline" className="rounded-full bg-[#0A66C2] text-white border-none hover:bg-[#0A66C2]/90">
                  <Linkedin className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Login Prompt for Locked Content */}
            <div className="bg-warning/10 border border-warning/20 rounded-lg p-4 mb-6">
              <p className="text-sm text-foreground">
                Please <Link to="/auth" className="text-primary font-medium hover:underline">login</Link> to see more details.
              </p>
            </div>

            {/* Sample Content */}
            <div className="prose prose-slate max-w-none">
              <div className="space-y-4">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="flex items-center gap-3 p-3 border border-border rounded-lg">
                    <input type="checkbox" className="h-4 w-4 rounded border-border" disabled />
                    <span className="text-primary font-medium">A</span>
                    <div className={cn(
                      "h-4 rounded flex-1",
                      item <= 2 ? "bg-muted" : "bg-muted/50"
                    )} style={{ maxWidth: '300px' }} />
                    {item > 2 && <Lock className="h-4 w-4 text-muted-foreground" />}
                  </div>
                ))}
              </div>
            </div>

            {/* Course Stats */}
            <div className="mt-8 p-6 bg-card rounded-xl border border-border">
              <h3 className="font-semibold text-foreground mb-4">About This Course</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <Clock className="h-5 w-5 mx-auto mb-2 text-primary" />
                  <p className="text-sm font-medium text-foreground">{course.duration}</p>
                  <p className="text-xs text-muted-foreground">Duration</p>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <BookOpen className="h-5 w-5 mx-auto mb-2 text-primary" />
                  <p className="text-sm font-medium text-foreground">{totalLessons} Lessons</p>
                  <p className="text-xs text-muted-foreground">Total Content</p>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <Users className="h-5 w-5 mx-auto mb-2 text-primary" />
                  <p className="text-sm font-medium text-foreground">{course.students.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Students</p>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <Star className="h-5 w-5 mx-auto mb-2 text-warning fill-warning" />
                  <p className="text-sm font-medium text-foreground">{course.rating}</p>
                  <p className="text-xs text-muted-foreground">Rating</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default CourseViewPage;
