import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, BookOpen, Code, Zap, Users, GraduationCap, Shield, Server, Cloud, ChevronRight, Star, Clock, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';

const popularTags = [
  'System Design',
  'Interview Prep',
  'React',
  'Python',
  'DevOps',
  'Machine Learning',
];

const learningPaths = [
  { id: 1, title: 'Software Development Engineer', icon: Code, color: 'bg-blue-500', courses: 24, hours: 120 },
  { id: 2, title: 'System Architect', icon: Server, color: 'bg-purple-500', courses: 18, hours: 90 },
  { id: 3, title: 'Security Architect', icon: Shield, color: 'bg-red-500', courses: 15, hours: 75 },
  { id: 4, title: 'DevOps Engineer', icon: Cloud, color: 'bg-green-500', courses: 20, hours: 100 },
  { id: 5, title: 'Data Engineer', icon: Zap, color: 'bg-orange-500', courses: 16, hours: 80 },
  { id: 6, title: 'Full Stack Developer', icon: BookOpen, color: 'bg-teal-500', courses: 22, hours: 110 },
];

const courseCategories = [
  { id: 'bytes', name: 'Course Bytes', description: 'Quick, focused learning modules' },
  { id: 'interview', name: 'Interview Prep', description: 'Ace your technical interviews' },
  { id: 'targeted', name: 'Targeted Learning', description: 'Skill-specific deep dives' },
  { id: 'paths', name: 'Learning Paths', description: 'Comprehensive role-based tracks' },
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
    gradient: 'from-blue-600 to-indigo-700',
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
    gradient: 'from-green-600 to-emerald-700',
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
    gradient: 'from-purple-600 to-pink-700',
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
    gradient: 'from-cyan-600 to-blue-700',
  },
];

const articles = [
  { id: 1, title: 'Understanding Microservices Architecture', category: 'System Design', readTime: '8 min', views: 12400 },
  { id: 2, title: 'Top 50 Coding Interview Questions', category: 'Interview Prep', readTime: '15 min', views: 45600 },
  { id: 3, title: 'Kubernetes Best Practices 2024', category: 'DevOps', readTime: '10 min', views: 8900 },
  { id: 4, title: 'Machine Learning Fundamentals', category: 'AI/ML', readTime: '12 min', views: 15200 },
  { id: 5, title: 'Security Best Practices for Cloud', category: 'Security', readTime: '7 min', views: 6300 },
  { id: 6, title: 'GraphQL vs REST: Complete Guide', category: 'Backend', readTime: '9 min', views: 11000 },
];

const technologies = ['DSA', 'Practice Problems', 'C', 'C++', 'Java', 'Python', 'JavaScript', 'Data Science', 'Machine Learning', 'Linux', 'DevOps', 'SQL', 'Web Development'];

const PublicHome = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {/* Public Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-8">
              <h1 className="text-2xl font-bold text-primary">TechLearn</h1>
              <nav className="hidden md:flex items-center gap-6">
                <button className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                  Courses <ChevronRight className="h-3 w-3 rotate-90" />
                </button>
                <button className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                  Tutorials <ChevronRight className="h-3 w-3 rotate-90" />
                </button>
                <button className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                  Practice <ChevronRight className="h-3 w-3 rotate-90" />
                </button>
                <button className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                  Jobs
                </button>
              </nav>
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
                  <Link to="/auth">
                    <Button variant="outline" size="sm">Sign In</Button>
                  </Link>
                  <Link to="/auth">
                    <Button size="sm">Get Started</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
        {/* Technology Navigation */}
        <div className="border-t bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-4 overflow-x-auto py-2 scrollbar-hide">
              {technologies.map((tech) => (
                <button
                  key={tech}
                  className="text-xs font-medium text-muted-foreground hover:text-primary whitespace-nowrap transition-colors"
                >
                  {tech}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            Learn tech skills <span className="text-primary">3x faster</span> with the
            <br className="hidden md:block" /> platform that <span className="text-primary">adapts</span> to you.
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Master in-demand skills with structured learning paths, hands-on projects, and interview preparation.
          </p>
          
          {/* Search Box */}
          <div className="max-w-2xl mx-auto mb-6">
            <div className="relative bg-card border rounded-xl shadow-lg">
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
          <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
            <span className="text-sm text-muted-foreground">Or try a personalized course</span>
            {popularTags.map((tag) => (
              <Badge key={tag} variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors">
                {tag} <ChevronRight className="h-3 w-3 ml-1" />
              </Badge>
            ))}
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-8 text-muted-foreground">
            <span className="text-sm">Join <strong className="text-foreground">2.8 million</strong> developers working at</span>
            <div className="flex items-center gap-6 text-muted-foreground/60 font-semibold">
              <span>Meta</span>
              <span>Amazon</span>
              <span>Google</span>
              <span>Netflix</span>
              <span>Stripe</span>
            </div>
          </div>
        </div>
      </section>

      {/* Course Categories */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {courseCategories.map((cat) => (
              <Card key={cat.id} className="cursor-pointer hover:shadow-md transition-shadow group">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <BookOpen className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{cat.name}</h3>
                      <p className="text-sm text-muted-foreground">{cat.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Learning Paths by Role */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-2xl font-bold text-foreground">Learning Paths by Role</h3>
              <p className="text-muted-foreground">Comprehensive tracks designed for your career goals</p>
            </div>
            <Button variant="outline">View All Paths</Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {learningPaths.map((path) => (
              <Card key={path.id} className="cursor-pointer hover:shadow-lg transition-all group overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl ${path.color} text-white shadow-lg`}>
                      <path.icon className="h-6 w-6" />
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
            ))}
          </div>
        </div>
      </section>

      {/* Popular Courses */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-2xl font-bold text-foreground">Popular Roadmaps & Learning Guides</h3>
              <p className="text-muted-foreground">Trending resources on in-demand topics</p>
            </div>
            <Button variant="outline">View All</Button>
          </div>

          <Tabs defaultValue="all" className="mb-8">
            <TabsList>
              <TabsTrigger value="all">Most Popular</TabsTrigger>
              <TabsTrigger value="interview">Interview Prep</TabsTrigger>
              <TabsTrigger value="paths">Learning Paths</TabsTrigger>
              <TabsTrigger value="targeted">Targeted Learning</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredCourses.map((course) => (
              <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer">
                <div className={`h-32 bg-gradient-to-br ${course.gradient} p-4 flex items-end`}>
                  <Badge variant="secondary" className="bg-white/20 text-white border-0">
                    <Play className="h-3 w-3 mr-1" /> Course
                  </Badge>
                </div>
                <CardContent className="p-4">
                  <h4 className="font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors mb-2">
                    {course.title}
                  </h4>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {course.description}
                  </p>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="flex items-center gap-1 text-yellow-500">
                      <Star className="h-3 w-3 fill-current" /> {course.rating}
                    </span>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-muted-foreground">{course.students.toLocaleString()} students</span>
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <div className="flex flex-wrap gap-1">
                    {course.tags.slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Articles & Tutorials */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-2xl font-bold text-foreground">Articles & Tutorials</h3>
              <p className="text-muted-foreground">Latest insights and guides from industry experts</p>
            </div>
            <Button variant="outline">Browse All</Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <Card key={article.id} className="hover:shadow-md transition-shadow cursor-pointer group">
                <CardContent className="p-6">
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
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold mb-4">Ready to accelerate your learning?</h3>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
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
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-semibold text-foreground mb-4">Courses</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="hover:text-foreground cursor-pointer">Course Bytes</li>
                <li className="hover:text-foreground cursor-pointer">Interview Prep</li>
                <li className="hover:text-foreground cursor-pointer">Learning Paths</li>
                <li className="hover:text-foreground cursor-pointer">Certifications</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Tutorials</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="hover:text-foreground cursor-pointer">Web Development</li>
                <li className="hover:text-foreground cursor-pointer">Data Science</li>
                <li className="hover:text-foreground cursor-pointer">DevOps</li>
                <li className="hover:text-foreground cursor-pointer">System Design</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="hover:text-foreground cursor-pointer">Practice Problems</li>
                <li className="hover:text-foreground cursor-pointer">Blog</li>
                <li className="hover:text-foreground cursor-pointer">Community</li>
                <li className="hover:text-foreground cursor-pointer">Help Center</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="hover:text-foreground cursor-pointer">About</li>
                <li className="hover:text-foreground cursor-pointer">Careers</li>
                <li className="hover:text-foreground cursor-pointer">Contact</li>
                <li className="hover:text-foreground cursor-pointer">Privacy</li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            © 2024 TechLearn. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicHome;
