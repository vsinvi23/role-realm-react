import { useParams, Link } from 'react-router-dom';
import { BookOpen, Code, Clock, Star, Play, FileText, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PublicLayout } from '@/components/layout/PublicLayout';

const technologyData: Record<string, { 
  title: string; 
  description: string; 
  courses: { id: number; title: string; level: string; duration: string; rating: number; students: number }[];
  articles: { id: number; title: string; readTime: string; views: number }[];
  tutorials: { id: number; title: string; steps: number; difficulty: string }[];
}> = {
  dsa: {
    title: 'Data Structures & Algorithms',
    description: 'Master fundamental data structures and algorithms for coding interviews and competitive programming.',
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
    courses: [
      { id: 1, title: 'Modern C++ Complete Guide', level: 'Beginner', duration: '45 hours', rating: 4.8, students: 42000 },
      { id: 2, title: 'C++ STL Deep Dive', level: 'Intermediate', duration: '20 hours', rating: 4.7, students: 18000 },
      { id: 3, title: 'Game Development with C++', level: 'Intermediate', duration: '35 hours', rating: 4.6, students: 15000 },
    ],
    articles: [
      { id: 1, title: 'Smart Pointers Explained', readTime: '10 min', views: 32000 },
      { id: 2, title: 'Understanding Move Semantics', readTime: '15 min', views: 28000 },
    ],
    tutorials: [
      { id: 1, title: 'Build a 2D Game Engine', steps: 20, difficulty: 'Advanced' },
      { id: 2, title: 'Create a Custom Container Class', steps: 8, difficulty: 'Intermediate' },
    ],
  },
  java: {
    title: 'Java Programming',
    description: 'Enterprise-grade programming with Java for web applications, Android, and backend systems.',
    courses: [
      { id: 1, title: 'Java Fundamentals to Advanced', level: 'All Levels', duration: '50 hours', rating: 4.8, students: 55000 },
      { id: 2, title: 'Spring Boot Masterclass', level: 'Intermediate', duration: '35 hours', rating: 4.9, students: 28000 },
    ],
    articles: [
      { id: 1, title: 'Java Collections Framework Guide', readTime: '15 min', views: 42000 },
      { id: 2, title: 'Understanding JVM Internals', readTime: '20 min', views: 35000 },
    ],
    tutorials: [
      { id: 1, title: 'Build a REST API with Spring Boot', steps: 10, difficulty: 'Intermediate' },
    ],
  },
  python: {
    title: 'Python Programming',
    description: 'Versatile programming language for web development, data science, AI, and automation.',
    courses: [
      { id: 1, title: 'Python Complete Bootcamp', level: 'Beginner', duration: '40 hours', rating: 4.9, students: 85000 },
      { id: 2, title: 'Python for Data Science', level: 'Intermediate', duration: '35 hours', rating: 4.8, students: 45000 },
    ],
    articles: [
      { id: 1, title: 'Python Best Practices 2024', readTime: '12 min', views: 55000 },
      { id: 2, title: 'Async Programming in Python', readTime: '15 min', views: 38000 },
    ],
    tutorials: [
      { id: 1, title: 'Build a Web Scraper', steps: 8, difficulty: 'Beginner' },
    ],
  },
  javascript: {
    title: 'JavaScript',
    description: 'The language of the web - build interactive websites, web apps, and server-side applications.',
    courses: [
      { id: 1, title: 'JavaScript Complete Guide', level: 'Beginner', duration: '45 hours', rating: 4.8, students: 72000 },
      { id: 2, title: 'Node.js Backend Development', level: 'Intermediate', duration: '30 hours', rating: 4.8, students: 35000 },
    ],
    articles: [
      { id: 1, title: 'Understanding Closures', readTime: '10 min', views: 48000 },
      { id: 2, title: 'Promises vs Async/Await', readTime: '12 min', views: 42000 },
    ],
    tutorials: [
      { id: 1, title: 'Build a Todo App with Vanilla JS', steps: 6, difficulty: 'Beginner' },
    ],
  },
  'data-science': {
    title: 'Data Science',
    description: 'Extract insights from data using statistics, machine learning, and visualization techniques.',
    courses: [
      { id: 1, title: 'Data Science Bootcamp', level: 'Beginner', duration: '60 hours', rating: 4.8, students: 38000 },
    ],
    articles: [
      { id: 1, title: 'Pandas vs NumPy: When to Use', readTime: '10 min', views: 32000 },
    ],
    tutorials: [
      { id: 1, title: 'Exploratory Data Analysis Project', steps: 10, difficulty: 'Beginner' },
    ],
  },
  'machine-learning': {
    title: 'Machine Learning',
    description: 'Build intelligent systems that learn from data and make predictions.',
    courses: [
      { id: 1, title: 'Machine Learning A-Z', level: 'Beginner', duration: '55 hours', rating: 4.9, students: 52000 },
      { id: 2, title: 'Deep Learning Specialization', level: 'Advanced', duration: '45 hours', rating: 4.8, students: 28000 },
    ],
    articles: [
      { id: 1, title: 'Neural Networks from Scratch', readTime: '20 min', views: 45000 },
    ],
    tutorials: [
      { id: 1, title: 'Build an Image Classifier', steps: 12, difficulty: 'Intermediate' },
    ],
  },
  linux: {
    title: 'Linux',
    description: 'Master the command line and system administration for servers and development environments.',
    courses: [
      { id: 1, title: 'Linux Fundamentals', level: 'Beginner', duration: '20 hours', rating: 4.7, students: 28000 },
    ],
    articles: [
      { id: 1, title: 'Essential Linux Commands', readTime: '15 min', views: 52000 },
    ],
    tutorials: [
      { id: 1, title: 'Set Up a Linux Server', steps: 15, difficulty: 'Intermediate' },
    ],
  },
  devops: {
    title: 'DevOps',
    description: 'Bridge development and operations with CI/CD, containerization, and infrastructure as code.',
    courses: [
      { id: 1, title: 'DevOps Complete Bootcamp', level: 'Beginner', duration: '50 hours', rating: 4.8, students: 35000 },
      { id: 2, title: 'Kubernetes Mastery', level: 'Intermediate', duration: '30 hours', rating: 4.9, students: 22000 },
    ],
    articles: [
      { id: 1, title: 'CI/CD Pipeline Best Practices', readTime: '12 min', views: 42000 },
    ],
    tutorials: [
      { id: 1, title: 'Build a CI/CD Pipeline from Scratch', steps: 15, difficulty: 'Intermediate' },
    ],
  },
  sql: {
    title: 'SQL & Databases',
    description: 'Query, manage, and optimize relational databases for applications of any scale.',
    courses: [
      { id: 1, title: 'SQL Complete Course', level: 'Beginner', duration: '25 hours', rating: 4.8, students: 48000 },
    ],
    articles: [
      { id: 1, title: 'SQL Joins Explained', readTime: '10 min', views: 65000 },
    ],
    tutorials: [
      { id: 1, title: 'Design a Database Schema', steps: 8, difficulty: 'Beginner' },
    ],
  },
  'web-development': {
    title: 'Web Development',
    description: 'Build modern, responsive websites and web applications from frontend to backend.',
    courses: [
      { id: 1, title: 'Full Stack Web Development', level: 'Beginner', duration: '80 hours', rating: 4.9, students: 92000 },
      { id: 2, title: 'React Complete Guide', level: 'Intermediate', duration: '40 hours', rating: 4.8, students: 55000 },
    ],
    articles: [
      { id: 1, title: 'React vs Vue vs Angular 2024', readTime: '15 min', views: 72000 },
    ],
    tutorials: [
      { id: 1, title: 'Build a Portfolio Website', steps: 8, difficulty: 'Beginner' },
    ],
  },
};

const TechnologyPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const tech = slug ? technologyData[slug] : null;
  
  if (!tech) {
    return (
      <PublicLayout>
        <div className="text-center py-16">
          <h1 className="text-2xl font-bold mb-4">Technology not found</h1>
          <Link to="/"><Button>Go Home</Button></Link>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div className="space-y-6">
        {/* Hero */}
        <section className="rounded-xl bg-primary text-primary-foreground p-8">
          <h1 className="text-3xl font-bold mb-3">{tech.title}</h1>
          <p className="text-primary-foreground/90 max-w-2xl mb-4">{tech.description}</p>
          <div className="flex items-center gap-3">
            <Badge className="bg-primary-foreground/20 text-primary-foreground border-0">{tech.courses.length} Courses</Badge>
            <Badge className="bg-primary-foreground/20 text-primary-foreground border-0">{tech.articles.length} Articles</Badge>
            <Badge className="bg-primary-foreground/20 text-primary-foreground border-0">{tech.tutorials.length} Tutorials</Badge>
          </div>
        </section>

        {/* Content */}
        <Tabs defaultValue="courses">
          <TabsList className="mb-6">
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="articles">Articles</TabsTrigger>
            <TabsTrigger value="tutorials">Tutorials</TabsTrigger>
          </TabsList>

          <TabsContent value="courses">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {tech.courses.map((course) => (
                <Card key={course.id} className="hover:shadow-md transition-shadow cursor-pointer group">
                  <div className="h-20 bg-primary rounded-t-lg flex items-center justify-center">
                    <Play className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold group-hover:text-primary transition-colors mb-2">{course.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <Badge variant="secondary">{course.level}</Badge>
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {course.duration}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="flex items-center gap-1 text-warning">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tech.articles.map((article) => (
                <Card key={article.id} className="hover:shadow-md transition-shadow cursor-pointer group">
                  <CardContent className="p-5">
                    <FileText className="h-6 w-6 text-primary mb-3" />
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tech.tutorials.map((tutorial) => (
                <Card key={tutorial.id} className="hover:shadow-md transition-shadow cursor-pointer group">
                  <CardContent className="p-5">
                    <Code className="h-6 w-6 text-primary mb-3" />
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
    </PublicLayout>
  );
};

export default TechnologyPage;
