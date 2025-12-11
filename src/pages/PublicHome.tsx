import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, BookOpen, Code, Zap, Shield, Server, Cloud, ChevronRight, Star, Clock, Play, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PublicLayout } from '@/components/layout/PublicLayout';

const popularTags = [
  'System Design',
  'Interview Prep',
  'React',
  'Python',
  'DevOps',
  'Machine Learning',
];

const learningPaths = [
  { id: 1, title: 'Software Development Engineer', icon: Code, color: 'bg-primary', courses: 24, hours: 120 },
  { id: 2, title: 'System Architect', icon: Server, color: 'bg-primary/80', courses: 18, hours: 90 },
  { id: 3, title: 'Security Architect', icon: Shield, color: 'bg-destructive', courses: 15, hours: 75 },
  { id: 4, title: 'DevOps Engineer', icon: Cloud, color: 'bg-success', courses: 20, hours: 100 },
  { id: 5, title: 'Data Engineer', icon: Zap, color: 'bg-warning', courses: 16, hours: 80 },
  { id: 6, title: 'Full Stack Developer', icon: BookOpen, color: 'bg-info', courses: 22, hours: 110 },
];

const courseCategories = [
  { id: 'bytes', name: 'Course Bytes', description: 'Quick, focused learning modules', path: '/explore/bytes' },
  { id: 'interview', name: 'Interview Prep', description: 'Ace your technical interviews', path: '/explore/interview' },
  { id: 'targeted', name: 'Targeted Learning', description: 'Skill-specific deep dives', path: '/explore/targeted' },
  { id: 'paths', name: 'Learning Paths', description: 'Comprehensive role-based tracks', path: '/explore/paths' },
];

const featuredCourses = [
  {
    id: 1,
    title: 'System Design Interview Masterclass',
    description: 'Master distributed systems, scalability patterns, and ace your system design interviews.',
    category: 'interview',
    level: 'Intermediate',
    rating: 4.8,
    students: 12500,
    duration: '24 hours',
    instructor: 'Tech Lead at FAANG',
    tags: ['System Design', 'Scalability', 'Distributed Systems'],
  },
  {
    id: 2,
    title: 'Complete DevOps with AI Integration',
    description: 'From CI/CD pipelines to Kubernetes, with AI-powered automation techniques.',
    category: 'paths',
    level: 'Beginner to Advanced',
    rating: 4.7,
    students: 8900,
    duration: '40 hours',
    instructor: 'DevOps Architect',
    tags: ['DevOps', 'Kubernetes', 'CI/CD', 'AI'],
  },
  {
    id: 3,
    title: 'Data Structures & Algorithms',
    description: 'Comprehensive DSA course with 500+ problems and interview patterns.',
    category: 'interview',
    level: 'All Levels',
    rating: 4.9,
    students: 25000,
    duration: '60 hours',
    instructor: 'Ex-Google Engineer',
    tags: ['DSA', 'Algorithms', 'Problem Solving'],
  },
  {
    id: 4,
    title: 'React & TypeScript Deep Dive',
    description: 'Build production-ready applications with React 18 and TypeScript.',
    category: 'targeted',
    level: 'Intermediate',
    rating: 4.6,
    students: 6700,
    duration: '18 hours',
    instructor: 'Senior Frontend Engineer',
    tags: ['React', 'TypeScript', 'Frontend'],
  },
];

const articles = [
  { id: 1, title: 'Understanding Microservices Architecture', slug: 'understanding-microservices-architecture', category: 'System Design', readTime: '8 min', views: 12400 },
  { id: 2, title: 'Top 50 Coding Interview Questions', slug: 'top-50-coding-interview-questions', category: 'Interview Prep', readTime: '15 min', views: 45600 },
  { id: 3, title: 'Kubernetes Best Practices 2024', slug: 'kubernetes-best-practices-2024', category: 'DevOps', readTime: '10 min', views: 8900 },
  { id: 4, title: 'Machine Learning Fundamentals', slug: 'machine-learning-fundamentals', category: 'AI/ML', readTime: '12 min', views: 15200 },
  { id: 5, title: 'Security Best Practices for Cloud', slug: 'security-best-practices-cloud', category: 'Security', readTime: '7 min', views: 6300 },
  { id: 6, title: 'GraphQL vs REST: Complete Guide', slug: 'graphql-vs-rest-complete-guide', category: 'Backend', readTime: '9 min', views: 11000 },
];

const PublicHome = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <PublicLayout>
      <div className="space-y-8">
        {/* Hero Section */}
        <section className="text-center py-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Learn tech skills <span className="text-primary">3x faster</span> with the
            <br className="hidden md:block" /> platform that <span className="text-primary">adapts</span> to you.
          </h1>
          <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
            Master in-demand skills with structured learning paths, hands-on projects, and interview preparation.
          </p>
          
          {/* Search Box */}
          <div className="max-w-2xl mx-auto mb-6">
            <div className="relative bg-card border rounded-xl shadow-sm">
              <div className="flex items-center p-2">
                <Zap className="h-5 w-5 text-primary ml-3" />
                <Input
                  placeholder="I want to prepare for a..."
                  className="border-0 focus-visible:ring-0 text-base"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button size="sm" className="rounded-lg">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Quick Tags */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="text-sm text-muted-foreground">Popular:</span>
            {popularTags.map((tag) => (
              <Badge key={tag} variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors">
                {tag} <ChevronRight className="h-3 w-3 ml-1" />
              </Badge>
            ))}
          </div>
        </section>

        {/* Course Categories */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {courseCategories.map((cat) => (
              <Link key={cat.id} to={cat.path}>
                <Card className="cursor-pointer hover:shadow-md transition-shadow group h-full">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                        <BookOpen className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{cat.name}</h3>
                        <p className="text-sm text-muted-foreground">{cat.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Learning Paths by Role */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-foreground">Learning Paths by Role</h2>
              <p className="text-muted-foreground text-sm">Comprehensive tracks designed for your career goals</p>
            </div>
            <Button variant="outline" size="sm">View All Paths</Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {learningPaths.map((path) => (
              <Link key={path.id} to={`/learn/${path.id === 1 ? 'sde' : path.id === 2 ? 'system-architect' : path.id === 3 ? 'security-architect' : path.id === 4 ? 'devops' : path.id === 5 ? 'data-engineer' : 'full-stack'}`}>
                <Card className="cursor-pointer hover:shadow-md transition-all group h-full">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-xl ${path.color} text-white shadow-sm`}>
                        <path.icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                          {path.title}
                        </h4>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <BookOpen className="h-3 w-3" /> {path.courses} Courses
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" /> {path.hours}h
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Popular Courses */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-foreground">Popular Courses</h2>
              <p className="text-muted-foreground text-sm">Trending resources on in-demand topics</p>
            </div>
            <Button variant="outline" size="sm">View All</Button>
          </div>

          <Tabs defaultValue="all" className="mb-6">
            <TabsList>
              <TabsTrigger value="all">Most Popular</TabsTrigger>
              <TabsTrigger value="interview">Interview Prep</TabsTrigger>
              <TabsTrigger value="paths">Learning Paths</TabsTrigger>
              <TabsTrigger value="targeted">Targeted Learning</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {featuredCourses.map((course) => (
              <Card key={course.id} className="hover:shadow-md transition-shadow cursor-pointer group overflow-hidden">
                <div className="p-4 bg-primary/10">
                  <h4 className="font-semibold text-primary text-center line-clamp-2">{course.title}</h4>
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
                    {course.tags.slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                    ))}
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>

        {/* Articles & Tutorials */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-foreground">Articles & Tutorials</h2>
              <p className="text-muted-foreground text-sm">Latest insights and guides from industry experts</p>
            </div>
            <Button variant="outline" size="sm">Browse All</Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {articles.map((article) => (
              <Link key={article.id} to={`/article/${article.slug}`}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer group h-full">
                  <CardContent className="p-5">
                    <Badge variant="secondary" className="mb-3">{article.category}</Badge>
                    <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
                      {article.title}
                    </h4>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {article.readTime}
                      </span>
                      <span>{article.views.toLocaleString()} views</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="rounded-xl bg-primary text-primary-foreground p-8 text-center">
          <h3 className="text-2xl font-bold mb-3">Ready to accelerate your learning?</h3>
          <p className="text-primary-foreground/80 mb-6 max-w-xl mx-auto">
            Join millions of developers who are mastering new skills and advancing their careers.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button size="lg" variant="secondary">
              Start Free Trial
            </Button>
            <Button size="lg" variant="outline" className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10">
              View Pricing
            </Button>
          </div>
        </section>
      </div>
    </PublicLayout>
  );
};

export default PublicHome;
