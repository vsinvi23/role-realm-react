import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, BookOpen, Code, Zap, Shield, Server, Cloud, ChevronRight, Clock, Loader2, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { usePublicCmsList } from '@/api/hooks/usePublicCms';
import { FeaturedContentCard } from '@/components/public/FeaturedContentCard';
import { ContentCard } from '@/components/public/ContentCard';
import { Skeleton } from '@/components/ui/skeleton';

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

// Skeleton component for loading state
function ContentSkeleton() {
  return (
    <Card className="overflow-hidden">
      <Skeleton className="aspect-[16/10] w-full" />
      <CardContent className="p-4 space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-3 w-1/2" />
      </CardContent>
    </Card>
  );
}

function FeaturedSkeleton() {
  return (
    <Card className="overflow-hidden">
      <div className="grid md:grid-cols-2 gap-0">
        <Skeleton className="aspect-video md:aspect-auto md:min-h-[300px]" />
        <CardContent className="p-6 md:p-8 space-y-4">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-10 w-32" />
        </CardContent>
      </div>
    </Card>
  );
}

const PublicHome = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  // Fetch published articles
  const { data: articlesData, isLoading: loadingArticles } = usePublicCmsList({ 
    type: 'ARTICLE', 
    page: 0, 
    size: 6 
  });

  // Fetch published courses
  const { data: coursesData, isLoading: loadingCourses } = usePublicCmsList({ 
    type: 'COURSE', 
    page: 0, 
    size: 6 
  });

  const articles = articlesData?.items || [];
  const courses = coursesData?.items || [];
  const allContent = [...courses, ...articles];
  const featuredItem = allContent[0]; // First item as featured

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <PublicLayout>
      <div className="space-y-12">
        {/* Hero Section */}
        <section className="text-center py-12 relative">
          {/* Background decoration */}
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute top-0 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
          </div>

          <Badge variant="secondary" className="mb-4">
            <Sparkles className="w-3 h-3 mr-1" /> Learn from the best
          </Badge>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 tracking-tight">
            Learn tech skills <span className="text-primary">3x faster</span>
            <br className="hidden md:block" /> with expert-led content
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Master in-demand skills with structured courses, in-depth articles, and hands-on projects designed by industry experts.
          </p>
          
          {/* Search Box */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8">
            <div className="relative bg-card border-2 border-border rounded-2xl shadow-lg hover:shadow-xl transition-shadow focus-within:border-primary/50">
              <div className="flex items-center p-2">
                <Zap className="h-5 w-5 text-primary ml-4" />
                <Input
                  placeholder="Search for courses, articles, topics..."
                  className="border-0 focus-visible:ring-0 text-lg h-12 bg-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button size="lg" className="rounded-xl px-6">
                  <Search className="h-5 w-5 mr-2" />
                  Search
                </Button>
              </div>
            </div>
          </form>

          {/* Quick Tags */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="text-sm text-muted-foreground">Popular:</span>
            {popularTags.map((tag) => (
              <Badge 
                key={tag} 
                variant="outline" 
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300"
                onClick={() => navigate(`/search?q=${encodeURIComponent(tag)}`)}
              >
                {tag} <ChevronRight className="h-3 w-3 ml-1" />
              </Badge>
            ))}
          </div>
        </section>

        {/* Featured Content */}
        {(featuredItem || loadingArticles || loadingCourses) && (
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-8 w-1 bg-primary rounded-full" />
              <h2 className="text-2xl font-bold text-foreground">Featured</h2>
            </div>
            
            {loadingArticles && loadingCourses ? (
              <FeaturedSkeleton />
            ) : featuredItem ? (
              <FeaturedContentCard item={featuredItem} featured />
            ) : null}
          </section>
        )}

        {/* Course Categories */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {courseCategories.map((cat) => (
              <Link key={cat.id} to={cat.path}>
                <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 group h-full border-border/50 hover:border-primary/30">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <BookOpen className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{cat.name}</h3>
                        <p className="text-sm text-muted-foreground">{cat.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Courses Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="h-8 w-1 bg-primary rounded-full" />
              <div>
                <h2 className="text-2xl font-bold text-foreground">Popular Courses</h2>
                <p className="text-muted-foreground text-sm">Hands-on learning from industry experts</p>
              </div>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link to="/explore/courses">
                View All <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>

          {loadingCourses ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => <ContentSkeleton key={i} />)}
            </div>
          ) : courses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.slice(0, 6).map((course) => (
                <FeaturedContentCard key={course.id} item={course} />
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center border-dashed">
              <BookOpen className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">No courses published yet. Check back soon!</p>
            </Card>
          )}
        </section>

        {/* Articles Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="h-8 w-1 bg-primary rounded-full" />
              <div>
                <h2 className="text-2xl font-bold text-foreground">Latest Articles</h2>
                <p className="text-muted-foreground text-sm">Insights and tutorials from the community</p>
              </div>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link to="/explore/articles">
                Browse All <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>

          {loadingArticles ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => <ContentSkeleton key={i} />)}
            </div>
          ) : articles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.slice(0, 6).map((article) => (
                <ContentCard key={article.id} item={article} />
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center border-dashed">
              <BookOpen className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">No articles published yet. Check back soon!</p>
            </Card>
          )}
        </section>

        {/* Learning Paths by Role */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="h-8 w-1 bg-primary rounded-full" />
              <div>
                <h2 className="text-2xl font-bold text-foreground">Learning Paths by Role</h2>
                <p className="text-muted-foreground text-sm">Comprehensive tracks designed for your career goals</p>
              </div>
            </div>
            <Button variant="outline" size="sm">View All Paths</Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {learningPaths.map((path) => (
              <Link key={path.id} to={`/learn/${path.id === 1 ? 'sde' : path.id === 2 ? 'system-architect' : path.id === 3 ? 'security-architect' : path.id === 4 ? 'devops' : path.id === 5 ? 'data-engineer' : 'full-stack'}`}>
                <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 group h-full border-border/50 hover:border-primary/30">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-xl ${path.color} text-white shadow-md`}>
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
                      <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="rounded-2xl bg-gradient-to-br from-primary via-primary to-primary/80 text-primary-foreground p-10 md:p-14 text-center relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-white/10 rounded-full blur-2xl" />
            <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-black/10 rounded-full blur-2xl" />
          </div>
          
          <div className="relative z-10">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">Ready to accelerate your learning?</h3>
            <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto text-lg">
              Join thousands of developers who are mastering new skills and advancing their careers.
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Button size="lg" variant="secondary" className="shadow-lg hover:shadow-xl transition-shadow">
                Start Free Trial
              </Button>
              <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:border-primary-foreground/50">
                View Pricing
              </Button>
            </div>
          </div>
        </section>
      </div>
    </PublicLayout>
  );
};

export default PublicHome;
