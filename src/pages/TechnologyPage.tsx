import { useParams, Link } from 'react-router-dom';
import { Search, BookOpen, Code, Clock, Star, ChevronRight, Play, FileText, Users, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';

const technologyData: Record<string, { 
  title: string; 
  description: string; 
  color: string;
  courses: { id: number; title: string; level: string; duration: string; rating: number; students: number }[];
  articles: { id: number; title: string; readTime: string; views: number }[];
  tutorials: { id: number; title: string; steps: number; difficulty: string }[];
}> = {
  dsa: {
    title: 'Data Structures & Algorithms',
    description: 'Master fundamental data structures and algorithms for coding interviews and competitive programming.',
    color: 'from-blue-600 to-indigo-700',
    courses: [
      { id: 1, title: 'Complete DSA Bootcamp', level: 'Beginner', duration: '60 hours', rating: 4.9, students: 45000 },
      { id: 2, title: 'Advanced Algorithms Masterclass', level: 'Advanced', duration: '40 hours', rating: 4.8, students: 12000 },
      { id: 3, title: 'Dynamic Programming Patterns', level: 'Intermediate', duration: '20 hours', rating: 4.7, students: 8500 },
      { id: 4, title: 'Graph Algorithms Deep Dive', level: 'Intermediate', duration: '15 hours', rating: 4.6, students: 6200 },
    ],
    articles: [
      { id: 1, title: 'Understanding Big O Notation', readTime: '8 min', views: 45000 },
      { id: 2, title: 'Top 10 Sorting Algorithms Explained', readTime: '12 min', views: 38000 },
      { id: 3, title: 'Binary Search: Complete Guide', readTime: '10 min', views: 32000 },
      { id: 4, title: 'Tree Traversal Techniques', readTime: '15 min', views: 28000 },
    ],
    tutorials: [
      { id: 1, title: 'Implement a Hash Table from Scratch', steps: 8, difficulty: 'Intermediate' },
      { id: 2, title: 'Build Your Own Heap', steps: 6, difficulty: 'Intermediate' },
      { id: 3, title: 'Create a Balanced BST', steps: 10, difficulty: 'Advanced' },
    ],
  },
  'practice-problems': {
    title: 'Practice Problems',
    description: 'Sharpen your coding skills with thousands of practice problems across all difficulty levels.',
    color: 'from-green-600 to-emerald-700',
    courses: [
      { id: 1, title: '500+ Coding Problems Bundle', level: 'All Levels', duration: '100 hours', rating: 4.9, students: 65000 },
      { id: 2, title: 'LeetCode Patterns Mastery', level: 'Intermediate', duration: '45 hours', rating: 4.8, students: 28000 },
      { id: 3, title: 'Daily Coding Challenge Course', level: 'Beginner', duration: '30 hours', rating: 4.7, students: 15000 },
    ],
    articles: [
      { id: 1, title: 'How to Approach Coding Problems', readTime: '10 min', views: 52000 },
      { id: 2, title: 'Common Problem-Solving Patterns', readTime: '15 min', views: 41000 },
      { id: 3, title: 'Debugging Tips for Competitive Programming', readTime: '8 min', views: 25000 },
    ],
    tutorials: [
      { id: 1, title: 'Solve Two Sum in 5 Different Ways', steps: 5, difficulty: 'Beginner' },
      { id: 2, title: 'Master the Sliding Window Technique', steps: 7, difficulty: 'Intermediate' },
    ],
  },
  c: {
    title: 'C Programming',
    description: 'Learn the foundational programming language that powers operating systems and embedded systems.',
    color: 'from-gray-600 to-slate-700',
    courses: [
      { id: 1, title: 'C Programming Fundamentals', level: 'Beginner', duration: '25 hours', rating: 4.7, students: 32000 },
      { id: 2, title: 'Advanced C: Pointers & Memory', level: 'Intermediate', duration: '18 hours', rating: 4.6, students: 12000 },
      { id: 3, title: 'Systems Programming with C', level: 'Advanced', duration: '30 hours', rating: 4.8, students: 8000 },
    ],
    articles: [
      { id: 1, title: 'Understanding Pointers in C', readTime: '12 min', views: 28000 },
      { id: 2, title: 'Memory Management Best Practices', readTime: '10 min', views: 22000 },
      { id: 3, title: 'C vs C++: Key Differences', readTime: '8 min', views: 35000 },
    ],
    tutorials: [
      { id: 1, title: 'Build a Simple Shell in C', steps: 12, difficulty: 'Advanced' },
      { id: 2, title: 'Create a File System Simulator', steps: 15, difficulty: 'Advanced' },
    ],
  },
  'cpp': {
    title: 'C++ Programming',
    description: 'Master modern C++ for high-performance applications, game development, and systems programming.',
    color: 'from-blue-700 to-blue-900',
    courses: [
      { id: 1, title: 'Modern C++ Complete Guide', level: 'Beginner', duration: '45 hours', rating: 4.8, students: 42000 },
      { id: 2, title: 'C++ STL Deep Dive', level: 'Intermediate', duration: '20 hours', rating: 4.7, students: 18000 },
      { id: 3, title: 'Game Development with C++', level: 'Intermediate', duration: '35 hours', rating: 4.6, students: 15000 },
      { id: 4, title: 'C++20 New Features', level: 'Advanced', duration: '12 hours', rating: 4.5, students: 6000 },
    ],
    articles: [
      { id: 1, title: 'Smart Pointers Explained', readTime: '10 min', views: 32000 },
      { id: 2, title: 'Understanding Move Semantics', readTime: '15 min', views: 28000 },
      { id: 3, title: 'Templates vs Generics', readTime: '12 min', views: 24000 },
    ],
    tutorials: [
      { id: 1, title: 'Build a 2D Game Engine', steps: 20, difficulty: 'Advanced' },
      { id: 2, title: 'Create a Custom Container Class', steps: 8, difficulty: 'Intermediate' },
    ],
  },
  java: {
    title: 'Java Programming',
    description: 'Enterprise-grade programming with Java for web applications, Android, and backend systems.',
    color: 'from-orange-600 to-red-700',
    courses: [
      { id: 1, title: 'Java Fundamentals to Advanced', level: 'All Levels', duration: '50 hours', rating: 4.8, students: 55000 },
      { id: 2, title: 'Spring Boot Masterclass', level: 'Intermediate', duration: '35 hours', rating: 4.9, students: 28000 },
      { id: 3, title: 'Java Concurrency Deep Dive', level: 'Advanced', duration: '18 hours', rating: 4.7, students: 9000 },
      { id: 4, title: 'Android Development with Java', level: 'Intermediate', duration: '40 hours', rating: 4.6, students: 22000 },
    ],
    articles: [
      { id: 1, title: 'Java Collections Framework Guide', readTime: '15 min', views: 42000 },
      { id: 2, title: 'Understanding JVM Internals', readTime: '20 min', views: 35000 },
      { id: 3, title: 'Java 21 Features Overview', readTime: '12 min', views: 28000 },
    ],
    tutorials: [
      { id: 1, title: 'Build a REST API with Spring Boot', steps: 10, difficulty: 'Intermediate' },
      { id: 2, title: 'Create a Task Manager App', steps: 12, difficulty: 'Beginner' },
    ],
  },
  python: {
    title: 'Python Programming',
    description: 'Versatile programming language for web development, data science, AI, and automation.',
    color: 'from-yellow-500 to-green-600',
    courses: [
      { id: 1, title: 'Python Complete Bootcamp', level: 'Beginner', duration: '40 hours', rating: 4.9, students: 85000 },
      { id: 2, title: 'Python for Data Science', level: 'Intermediate', duration: '35 hours', rating: 4.8, students: 45000 },
      { id: 3, title: 'Django Web Framework', level: 'Intermediate', duration: '28 hours', rating: 4.7, students: 22000 },
      { id: 4, title: 'Python Automation Scripts', level: 'Beginner', duration: '15 hours', rating: 4.6, students: 18000 },
    ],
    articles: [
      { id: 1, title: 'Python Best Practices 2024', readTime: '12 min', views: 55000 },
      { id: 2, title: 'Async Programming in Python', readTime: '15 min', views: 38000 },
      { id: 3, title: 'Virtual Environments Explained', readTime: '8 min', views: 32000 },
    ],
    tutorials: [
      { id: 1, title: 'Build a Web Scraper', steps: 8, difficulty: 'Beginner' },
      { id: 2, title: 'Create a Discord Bot', steps: 10, difficulty: 'Intermediate' },
    ],
  },
  javascript: {
    title: 'JavaScript',
    description: 'The language of the web - build interactive websites, web apps, and server-side applications.',
    color: 'from-yellow-400 to-yellow-600',
    courses: [
      { id: 1, title: 'JavaScript Complete Guide', level: 'Beginner', duration: '45 hours', rating: 4.8, students: 72000 },
      { id: 2, title: 'Advanced JavaScript Patterns', level: 'Advanced', duration: '25 hours', rating: 4.7, students: 18000 },
      { id: 3, title: 'Node.js Backend Development', level: 'Intermediate', duration: '30 hours', rating: 4.8, students: 35000 },
      { id: 4, title: 'TypeScript Essentials', level: 'Intermediate', duration: '18 hours', rating: 4.9, students: 28000 },
    ],
    articles: [
      { id: 1, title: 'Understanding Closures', readTime: '10 min', views: 48000 },
      { id: 2, title: 'Promises vs Async/Await', readTime: '12 min', views: 42000 },
      { id: 3, title: 'Event Loop Explained', readTime: '15 min', views: 38000 },
    ],
    tutorials: [
      { id: 1, title: 'Build a Todo App with Vanilla JS', steps: 6, difficulty: 'Beginner' },
      { id: 2, title: 'Create a Real-time Chat App', steps: 12, difficulty: 'Intermediate' },
    ],
  },
  'data-science': {
    title: 'Data Science',
    description: 'Extract insights from data using statistics, machine learning, and visualization techniques.',
    color: 'from-purple-600 to-pink-700',
    courses: [
      { id: 1, title: 'Data Science Bootcamp', level: 'Beginner', duration: '60 hours', rating: 4.8, students: 38000 },
      { id: 2, title: 'Statistical Analysis with Python', level: 'Intermediate', duration: '25 hours', rating: 4.7, students: 15000 },
      { id: 3, title: 'Data Visualization Masterclass', level: 'All Levels', duration: '20 hours', rating: 4.6, students: 22000 },
    ],
    articles: [
      { id: 1, title: 'Pandas vs NumPy: When to Use', readTime: '10 min', views: 32000 },
      { id: 2, title: 'Feature Engineering Techniques', readTime: '15 min', views: 28000 },
      { id: 3, title: 'Data Cleaning Best Practices', readTime: '12 min', views: 25000 },
    ],
    tutorials: [
      { id: 1, title: 'Exploratory Data Analysis Project', steps: 10, difficulty: 'Beginner' },
      { id: 2, title: 'Build a Dashboard with Plotly', steps: 8, difficulty: 'Intermediate' },
    ],
  },
  'machine-learning': {
    title: 'Machine Learning',
    description: 'Build intelligent systems that learn from data and make predictions.',
    color: 'from-indigo-600 to-purple-700',
    courses: [
      { id: 1, title: 'Machine Learning A-Z', level: 'Beginner', duration: '55 hours', rating: 4.9, students: 52000 },
      { id: 2, title: 'Deep Learning Specialization', level: 'Advanced', duration: '45 hours', rating: 4.8, students: 28000 },
      { id: 3, title: 'Natural Language Processing', level: 'Intermediate', duration: '30 hours', rating: 4.7, students: 18000 },
      { id: 4, title: 'Computer Vision with PyTorch', level: 'Intermediate', duration: '25 hours', rating: 4.6, students: 12000 },
    ],
    articles: [
      { id: 1, title: 'Neural Networks from Scratch', readTime: '20 min', views: 45000 },
      { id: 2, title: 'Gradient Descent Explained', readTime: '12 min', views: 38000 },
      { id: 3, title: 'Overfitting vs Underfitting', readTime: '10 min', views: 32000 },
    ],
    tutorials: [
      { id: 1, title: 'Build an Image Classifier', steps: 12, difficulty: 'Intermediate' },
      { id: 2, title: 'Create a Sentiment Analyzer', steps: 10, difficulty: 'Intermediate' },
    ],
  },
  linux: {
    title: 'Linux',
    description: 'Master the command line and system administration for servers and development environments.',
    color: 'from-orange-500 to-yellow-600',
    courses: [
      { id: 1, title: 'Linux Fundamentals', level: 'Beginner', duration: '20 hours', rating: 4.7, students: 28000 },
      { id: 2, title: 'Linux System Administration', level: 'Intermediate', duration: '35 hours', rating: 4.8, students: 15000 },
      { id: 3, title: 'Shell Scripting Mastery', level: 'Intermediate', duration: '18 hours', rating: 4.6, students: 12000 },
    ],
    articles: [
      { id: 1, title: 'Essential Linux Commands', readTime: '15 min', views: 52000 },
      { id: 2, title: 'Understanding File Permissions', readTime: '10 min', views: 38000 },
      { id: 3, title: 'Process Management in Linux', readTime: '12 min', views: 28000 },
    ],
    tutorials: [
      { id: 1, title: 'Set Up a Linux Server', steps: 15, difficulty: 'Intermediate' },
      { id: 2, title: 'Automate Tasks with Cron', steps: 6, difficulty: 'Beginner' },
    ],
  },
  devops: {
    title: 'DevOps',
    description: 'Bridge development and operations with CI/CD, containerization, and infrastructure as code.',
    color: 'from-teal-600 to-cyan-700',
    courses: [
      { id: 1, title: 'DevOps Complete Bootcamp', level: 'Beginner', duration: '50 hours', rating: 4.8, students: 35000 },
      { id: 2, title: 'Kubernetes Mastery', level: 'Intermediate', duration: '30 hours', rating: 4.9, students: 22000 },
      { id: 3, title: 'Docker Deep Dive', level: 'Intermediate', duration: '20 hours', rating: 4.7, students: 28000 },
      { id: 4, title: 'Terraform & Infrastructure as Code', level: 'Intermediate', duration: '25 hours', rating: 4.6, students: 15000 },
    ],
    articles: [
      { id: 1, title: 'CI/CD Pipeline Best Practices', readTime: '12 min', views: 42000 },
      { id: 2, title: 'Docker vs Kubernetes', readTime: '10 min', views: 55000 },
      { id: 3, title: 'GitOps Explained', readTime: '8 min', views: 28000 },
    ],
    tutorials: [
      { id: 1, title: 'Build a CI/CD Pipeline from Scratch', steps: 15, difficulty: 'Intermediate' },
      { id: 2, title: 'Deploy to Kubernetes', steps: 12, difficulty: 'Intermediate' },
    ],
  },
  sql: {
    title: 'SQL & Databases',
    description: 'Query, manage, and optimize relational databases for applications of any scale.',
    color: 'from-cyan-600 to-blue-700',
    courses: [
      { id: 1, title: 'SQL Complete Course', level: 'Beginner', duration: '25 hours', rating: 4.8, students: 48000 },
      { id: 2, title: 'Advanced SQL & Query Optimization', level: 'Advanced', duration: '18 hours', rating: 4.7, students: 12000 },
      { id: 3, title: 'PostgreSQL Administration', level: 'Intermediate', duration: '22 hours', rating: 4.6, students: 8000 },
    ],
    articles: [
      { id: 1, title: 'SQL Joins Explained', readTime: '10 min', views: 65000 },
      { id: 2, title: 'Database Indexing Guide', readTime: '15 min', views: 42000 },
      { id: 3, title: 'Normalization Best Practices', readTime: '12 min', views: 35000 },
    ],
    tutorials: [
      { id: 1, title: 'Design a Database Schema', steps: 8, difficulty: 'Beginner' },
      { id: 2, title: 'Write Complex Queries', steps: 10, difficulty: 'Intermediate' },
    ],
  },
  'web-development': {
    title: 'Web Development',
    description: 'Build modern, responsive websites and web applications from frontend to backend.',
    color: 'from-pink-600 to-rose-700',
    courses: [
      { id: 1, title: 'Full Stack Web Development', level: 'Beginner', duration: '80 hours', rating: 4.9, students: 92000 },
      { id: 2, title: 'React Complete Guide', level: 'Intermediate', duration: '40 hours', rating: 4.8, students: 55000 },
      { id: 3, title: 'Next.js & Modern React', level: 'Intermediate', duration: '28 hours', rating: 4.7, students: 32000 },
      { id: 4, title: 'CSS & Tailwind Mastery', level: 'All Levels', duration: '20 hours', rating: 4.6, students: 25000 },
    ],
    articles: [
      { id: 1, title: 'React vs Vue vs Angular 2024', readTime: '15 min', views: 72000 },
      { id: 2, title: 'CSS Grid Complete Guide', readTime: '12 min', views: 48000 },
      { id: 3, title: 'Web Performance Optimization', readTime: '18 min', views: 38000 },
    ],
    tutorials: [
      { id: 1, title: 'Build a Portfolio Website', steps: 8, difficulty: 'Beginner' },
      { id: 2, title: 'Create an E-commerce Store', steps: 20, difficulty: 'Intermediate' },
    ],
  },
};

const TechnologyPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { isAuthenticated, user, logout } = useAuth();
  
  const tech = slug ? technologyData[slug] : null;
  
  if (!tech) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Technology not found</h1>
          <Link to="/">
            <Button>Go Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/" className="text-2xl font-bold text-primary">TechLearn</Link>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search..." className="pl-9" />
              </div>
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard">
                    <Button variant="outline" size="sm">Dashboard</Button>
                  </Link>
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
      <section className={`bg-gradient-to-br ${tech.color} text-white py-16`}>
        <div className="container mx-auto px-4">
          <Link to="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{tech.title}</h1>
          <p className="text-lg text-white/90 max-w-2xl mb-6">{tech.description}</p>
          <div className="flex items-center gap-4">
            <Badge className="bg-white/20 text-white border-0">{tech.courses.length} Courses</Badge>
            <Badge className="bg-white/20 text-white border-0">{tech.articles.length} Articles</Badge>
            <Badge className="bg-white/20 text-white border-0">{tech.tutorials.length} Tutorials</Badge>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="courses">
            <TabsList className="mb-8">
              <TabsTrigger value="courses">Courses</TabsTrigger>
              <TabsTrigger value="articles">Articles</TabsTrigger>
              <TabsTrigger value="tutorials">Tutorials</TabsTrigger>
            </TabsList>

            <TabsContent value="courses">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {tech.courses.map((course) => (
                  <Card key={course.id} className="hover:shadow-lg transition-shadow cursor-pointer group">
                    <div className={`h-24 bg-gradient-to-br ${tech.color} rounded-t-lg flex items-center justify-center`}>
                      <Play className="h-8 w-8 text-white" />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold group-hover:text-primary transition-colors mb-2">{course.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <Badge variant="secondary">{course.level}</Badge>
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {course.duration}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="flex items-center gap-1 text-yellow-500">
                          <Star className="h-3 w-3 fill-current" /> {course.rating}
                        </span>
                        <span className="text-muted-foreground">{course.students.toLocaleString()} students</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="articles">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tech.articles.map((article) => (
                  <Card key={article.id} className="hover:shadow-md transition-shadow cursor-pointer group">
                    <CardContent className="p-6">
                      <FileText className="h-8 w-8 text-primary mb-4" />
                      <h3 className="font-semibold group-hover:text-primary transition-colors mb-2">{article.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {article.readTime}</span>
                        <span>{article.views.toLocaleString()} views</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="tutorials">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tech.tutorials.map((tutorial) => (
                  <Card key={tutorial.id} className="hover:shadow-md transition-shadow cursor-pointer group">
                    <CardContent className="p-6">
                      <Code className="h-8 w-8 text-primary mb-4" />
                      <h3 className="font-semibold group-hover:text-primary transition-colors mb-2">{tutorial.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <Badge variant="outline">{tutorial.difficulty}</Badge>
                        <span>{tutorial.steps} steps</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
};

export default TechnologyPage;
