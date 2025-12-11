import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ChevronLeft, ChevronDown, ChevronRight, Search, Play, 
  CheckCircle2, Circle, Lock, Clock, Users, Star, BookOpen,
  Share2, Facebook, Twitter, Linkedin, Award, Globe, FileText,
  Video, GraduationCap, Check
} from 'lucide-react';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

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
  longDescription: string;
  price: string;
  originalPrice?: string;
  level: string;
  duration: string;
  students: number;
  rating: number;
  reviews: number;
  instructor: string;
  instructorTitle: string;
  instructorAvatar: string;
  language: string;
  lastUpdated: string;
  whatYouWillLearn: string[];
  requirements: string[];
  sections: Section[];
}

// Mock course data
const coursesData: Record<string, CourseData> = {
  'system-design-interview-masterclass': {
    id: '1',
    title: 'System Design Interview Masterclass',
    description: 'Master distributed systems, scalability patterns, and ace your system design interviews with real-world examples.',
    longDescription: 'This comprehensive course will take you from system design fundamentals to advanced distributed systems concepts. You\'ll learn how to design scalable, reliable, and efficient systems that can handle millions of users. Perfect for software engineers preparing for FAANG interviews or anyone looking to level up their system design skills.',
    price: '$79.99',
    originalPrice: '$199.99',
    level: 'Intermediate',
    duration: '24 hours',
    students: 12500,
    rating: 4.8,
    reviews: 2340,
    instructor: 'Alex Chen',
    instructorTitle: 'Tech Lead at FAANG',
    instructorAvatar: 'AC',
    language: 'English',
    lastUpdated: 'December 2024',
    whatYouWillLearn: [
      'Design scalable systems that handle millions of requests',
      'Master load balancing, caching, and database sharding',
      'Understand CAP theorem and distributed system trade-offs',
      'Design real-world systems like Twitter, Netflix, Uber',
      'Ace system design interviews at top tech companies',
      'Learn microservices architecture and event-driven design',
    ],
    requirements: [
      'Basic understanding of data structures and algorithms',
      'Familiarity with at least one programming language',
      'Understanding of basic database concepts',
      'No prior system design experience required',
    ],
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
    longDescription: 'Master data structures and algorithms with this comprehensive course designed for coding interviews. Learn problem-solving patterns used by top engineers at Google, Amazon, and other tech giants. Practice with 500+ curated problems and develop the intuition to tackle any coding challenge.',
    price: '$89.99',
    originalPrice: '$249.99',
    level: 'All Levels',
    duration: '60 hours',
    students: 25000,
    rating: 4.9,
    reviews: 4560,
    instructor: 'Sarah Miller',
    instructorTitle: 'Ex-Google Engineer',
    instructorAvatar: 'SM',
    language: 'English',
    lastUpdated: 'November 2024',
    whatYouWillLearn: [
      'Master all essential data structures from arrays to graphs',
      'Learn 20+ problem-solving patterns for coding interviews',
      'Practice 500+ carefully curated coding problems',
      'Understand time and space complexity analysis',
      'Build confidence for FAANG-level interviews',
      'Develop systematic approach to problem-solving',
    ],
    requirements: [
      'Basic programming knowledge in any language',
      'Willingness to practice coding problems daily',
      'No prior DSA experience required',
    ],
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
    longDescription: 'Learn modern DevOps practices from ground up. This course covers everything from containerization with Docker to orchestration with Kubernetes, and integrates cutting-edge AI tools for automation. Perfect for developers looking to transition into DevOps or enhance their infrastructure skills.',
    price: '$99.99',
    originalPrice: '$299.99',
    level: 'Beginner to Advanced',
    duration: '40 hours',
    students: 8900,
    rating: 4.7,
    reviews: 1890,
    instructor: 'Mike Johnson',
    instructorTitle: 'DevOps Architect',
    instructorAvatar: 'MJ',
    language: 'English',
    lastUpdated: 'December 2024',
    whatYouWillLearn: [
      'Master Docker and containerization best practices',
      'Deploy applications on Kubernetes at scale',
      'Build CI/CD pipelines with GitHub Actions and Jenkins',
      'Leverage AI for automated testing and monitoring',
      'Implement Infrastructure as Code with Terraform',
      'Monitor and troubleshoot production systems',
    ],
    requirements: [
      'Basic Linux command line knowledge',
      'Understanding of software development lifecycle',
      'Familiarity with Git version control',
    ],
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
    longDescription: 'Take your React skills to the next level with TypeScript. Learn advanced patterns, state management strategies, and build type-safe applications that scale. This course covers React 18 features including concurrent rendering, Suspense, and Server Components.',
    price: '$69.99',
    originalPrice: '$179.99',
    level: 'Intermediate',
    duration: '18 hours',
    students: 6700,
    rating: 4.6,
    reviews: 1250,
    instructor: 'Emma Wilson',
    instructorTitle: 'Senior Frontend Engineer',
    instructorAvatar: 'EW',
    language: 'English',
    lastUpdated: 'November 2024',
    whatYouWillLearn: [
      'Master TypeScript with React for type-safe development',
      'Understand React 18 concurrent features and Suspense',
      'Implement advanced state management patterns',
      'Build reusable component libraries',
      'Write comprehensive tests for React applications',
      'Deploy production-ready applications',
    ],
    requirements: [
      'Solid understanding of JavaScript ES6+',
      'Basic React knowledge (components, hooks)',
      'Familiarity with HTML and CSS',
    ],
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

// Course Overview Page Component
const CourseOverview = ({ 
  course, 
  onEnroll 
}: { 
  course: CourseData; 
  onEnroll: () => void;
}) => {
  const totalLessons = course.sections.reduce((acc, s) => acc + s.lessons.length, 0);
  const totalVideos = course.sections.reduce(
    (acc, s) => acc + s.lessons.filter(l => l.type === 'video').length, 0
  );

  return (
    <div className="max-w-6xl mx-auto">
      {/* Back Link */}
      <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
        <ChevronLeft className="h-4 w-4 mr-1" /> Back to Courses
      </Link>
      
      {/* Hero Section */}
      <div className="bg-primary/10 text-foreground rounded-xl p-6 md:p-8 mb-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Badge className="mb-3 bg-primary/20 text-primary hover:bg-primary/30">
              {course.level}
            </Badge>
            <h1 className="text-xl md:text-2xl font-bold mb-4">{course.title}</h1>
            <p className="text-muted-foreground">{course.description}</p>
          </div>

          {/* Enrollment Buttons */}
          <div className="flex flex-col gap-3">
            <Button onClick={onEnroll} size="lg">
              <GraduationCap className="h-4 w-4 mr-2" />
              Enroll Now
            </Button>
            <Button variant="outline" size="lg">
              Add to Wishlist
            </Button>
          </div>
        </div>
      </div>

      {/* Course Content Tabs */}
      <Tabs defaultValue="overview" className="mb-8">
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
          <TabsTrigger value="instructor">Instructor</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* What You'll Learn */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="text-xl font-semibold mb-4">What you'll learn</h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {course.whatYouWillLearn.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="text-xl font-semibold mb-4">Description</h2>
                <p className="text-muted-foreground leading-relaxed">{course.longDescription}</p>
              </div>

              {/* Requirements */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="text-xl font-semibold mb-4">Requirements</h2>
                <ul className="space-y-2">
                  {course.requirements.map((req, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <Circle className="h-2 w-2 mt-2 flex-shrink-0 fill-foreground" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="font-semibold mb-4">This course includes</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3">
                    <Video className="h-5 w-5 text-primary" />
                    <span>{course.duration} on-demand video</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-primary" />
                    <span>{totalLessons} lessons</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <BookOpen className="h-5 w-5 text-primary" />
                    <span>Downloadable resources</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Globe className="h-5 w-5 text-primary" />
                    <span>Full lifetime access</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Award className="h-5 w-5 text-primary" />
                    <span>Certificate of completion</span>
                  </div>
                </div>
              </div>

              {/* Share */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="font-semibold mb-4">Share this course</h3>
                <div className="flex items-center gap-2">
                  <Button size="icon" variant="outline" className="rounded-full">
                    <Facebook className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="outline" className="rounded-full">
                    <Twitter className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="outline" className="rounded-full">
                    <Linkedin className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="outline" className="rounded-full">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="curriculum">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Course Content</h2>
              <span className="text-sm text-muted-foreground">
                {course.sections.length} sections • {totalLessons} lessons • {course.duration}
              </span>
            </div>
            <div className="space-y-2">
              {course.sections.map((section, idx) => (
                <CurriculumSection key={section.id} section={section} index={idx} />
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="instructor">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-start gap-4">
              <div className="h-20 w-20 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-2xl font-bold">
                {course.instructorAvatar}
              </div>
              <div>
                <h2 className="text-xl font-semibold">{course.instructor}</h2>
                <p className="text-muted-foreground">{course.instructorTitle}</p>
                <div className="flex items-center gap-4 mt-2 text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-warning text-warning" />
                    <span>{course.rating} Instructor Rating</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{course.students.toLocaleString()} Students</span>
                  </div>
                </div>
                <p className="mt-4 text-sm text-muted-foreground">
                  Passionate educator with years of industry experience helping thousands of students achieve their career goals in tech.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="reviews">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary">{course.rating}</div>
                <div className="flex items-center gap-1 justify-center mt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star} 
                      className={cn(
                        "h-4 w-4",
                        star <= Math.floor(course.rating) ? "fill-warning text-warning" : "text-muted"
                      )} 
                    />
                  ))}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {course.reviews.toLocaleString()} reviews
                </div>
              </div>
            </div>
            
            {/* Sample Reviews */}
            <div className="space-y-4">
              {[
                { name: 'John D.', rating: 5, comment: 'Excellent course! The explanations are clear and the examples are practical.', time: '2 weeks ago' },
                { name: 'Sarah K.', rating: 5, comment: 'This course helped me land my dream job. Highly recommended!', time: '1 month ago' },
                { name: 'Mike R.', rating: 4, comment: 'Great content, would love more practice problems.', time: '1 month ago' },
              ].map((review, idx) => (
                <div key={idx} className="border-b border-border pb-4 last:border-0">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center font-medium">
                      {review.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="font-medium">{review.name}</div>
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star 
                              key={star} 
                              className={cn(
                                "h-3 w-3",
                                star <= review.rating ? "fill-warning text-warning" : "text-muted"
                              )} 
                            />
                          ))}
                        </div>
                        <span className="text-xs text-muted-foreground">{review.time}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Curriculum Section Component
const CurriculumSection = ({ section, index }: { section: Section; index: number }) => {
  const [isExpanded, setIsExpanded] = useState(index < 2);
  const sectionDuration = section.lessons.reduce((acc, l) => {
    const mins = parseInt(l.duration);
    return acc + (isNaN(mins) ? 0 : mins);
  }, 0);

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 bg-muted/30 hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          {isExpanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
          <span className="font-medium">{section.title}</span>
        </div>
        <span className="text-sm text-muted-foreground">
          {section.lessons.length} lessons • {sectionDuration} min
        </span>
      </button>
      
      {isExpanded && (
        <div className="divide-y divide-border">
          {section.lessons.map((lesson) => (
            <div key={lesson.id} className="flex items-center gap-3 p-4 text-sm">
              {lesson.type === 'video' ? (
                <Play className="h-4 w-4 text-muted-foreground" />
              ) : lesson.type === 'article' ? (
                <FileText className="h-4 w-4 text-muted-foreground" />
              ) : (
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              )}
              <span className="flex-1">{lesson.title}</span>
              {lesson.isLocked ? (
                <Lock className="h-4 w-4 text-muted-foreground" />
              ) : (
                <span className="text-primary text-xs">Preview</span>
              )}
              <span className="text-muted-foreground">{lesson.duration}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Course Learning Page Component (After Enrollment)
const CourseLearningPage = ({ 
  course 
}: { 
  course: CourseData;
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSections, setExpandedSections] = useState<string[]>(['s1', 's2']);
  const [selectedLesson, setSelectedLesson] = useState<string>('l1');

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
            <Badge className="bg-success text-success-foreground">Enrolled</Badge>
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

          {/* Video Player Placeholder */}
          <div className="aspect-video bg-muted rounded-xl mb-6 flex items-center justify-center">
            <Button size="lg" className="rounded-full h-16 w-16">
              <Play className="h-6 w-6 ml-1" />
            </Button>
          </div>

          {/* Lesson Content */}
          <div className="prose prose-slate max-w-none">
            <h3>Lesson Overview</h3>
            <p className="text-muted-foreground">
              In this lesson, we'll cover the fundamental concepts of {currentLesson?.title}. 
              Make sure to complete the practice exercises at the end.
            </p>
          </div>

          {/* Course Stats */}
          <div className="mt-8 p-6 bg-card rounded-xl border border-border">
            <h3 className="font-semibold text-foreground mb-4">Your Progress</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <Clock className="h-5 w-5 mx-auto mb-2 text-primary" />
                <p className="text-sm font-medium text-foreground">{course.duration}</p>
                <p className="text-xs text-muted-foreground">Duration</p>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <BookOpen className="h-5 w-5 mx-auto mb-2 text-primary" />
                <p className="text-sm font-medium text-foreground">{completedLessons}/{totalLessons}</p>
                <p className="text-xs text-muted-foreground">Completed</p>
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
  );
};

const CourseViewPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [isEnrolled, setIsEnrolled] = useState(false);

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

  const handleEnroll = () => {
    setIsEnrolled(true);
    toast.success('Successfully enrolled in the course!', {
      description: 'You now have access to all course materials.',
    });
  };

  return (
    <PublicLayout>
      {isEnrolled ? (
        <CourseLearningPage course={course} />
      ) : (
        <CourseOverview course={course} onEnroll={handleEnroll} />
      )}
    </PublicLayout>
  );
};

export default CourseViewPage;
