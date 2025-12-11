import { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, BookOpen, Clock, Star, Play, FileText, Filter, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PublicLayout } from '@/components/layout/PublicLayout';

const allCourses = [
  { id: 1, title: 'System Design Interview Masterclass', description: 'Master distributed systems.', category: 'Interview Prep', level: 'Intermediate', duration: '24 hours', rating: 4.8, students: 12500 },
  { id: 2, title: 'Complete DSA Bootcamp', description: 'Data structures and algorithms.', category: 'DSA', level: 'Beginner', duration: '60 hours', rating: 4.9, students: 45000 },
  { id: 3, title: 'React & TypeScript Deep Dive', description: 'Build production-ready apps.', category: 'Web Development', level: 'Intermediate', duration: '18 hours', rating: 4.6, students: 6700 },
  { id: 4, title: 'Machine Learning A-Z', description: 'Build intelligent systems.', category: 'Machine Learning', level: 'Beginner', duration: '55 hours', rating: 4.9, students: 52000 },
  { id: 5, title: 'DevOps Complete Bootcamp', description: 'CI/CD, Docker, Kubernetes.', category: 'DevOps', level: 'Beginner', duration: '50 hours', rating: 4.8, students: 35000 },
  { id: 6, title: 'Python for Data Science', description: 'Data analysis with Python.', category: 'Python', level: 'Intermediate', duration: '35 hours', rating: 4.8, students: 45000 },
];

const allArticles = [
  { id: 1, title: 'Understanding Microservices Architecture', category: 'System Design', readTime: '8 min', views: 12400 },
  { id: 2, title: 'Top 50 Coding Interview Questions', category: 'Interview Prep', readTime: '15 min', views: 45600 },
  { id: 3, title: 'Kubernetes Best Practices 2024', category: 'DevOps', readTime: '10 min', views: 8900 },
  { id: 4, title: 'Machine Learning Fundamentals', category: 'Machine Learning', readTime: '12 min', views: 15200 },
];

const allTutorials = [
  { id: 1, title: 'Build a REST API with Node.js', steps: 12, difficulty: 'Intermediate', category: 'Backend' },
  { id: 2, title: 'Create a React Dashboard', steps: 15, difficulty: 'Intermediate', category: 'React' },
  { id: 3, title: 'Deploy to Kubernetes', steps: 10, difficulty: 'Advanced', category: 'DevOps' },
];

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [searchInput, setSearchInput] = useState(query);
  const [levelFilter, setLevelFilter] = useState('all');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams({ q: searchInput });
  };

  const filteredCourses = allCourses.filter(c => 
    (c.title.toLowerCase().includes(query.toLowerCase()) || 
     c.category.toLowerCase().includes(query.toLowerCase())) &&
    (levelFilter === 'all' || c.level.toLowerCase().includes(levelFilter.toLowerCase()))
  );

  const filteredArticles = allArticles.filter(a => 
    a.title.toLowerCase().includes(query.toLowerCase()) || 
    a.category.toLowerCase().includes(query.toLowerCase())
  );

  const filteredTutorials = allTutorials.filter(t => 
    t.title.toLowerCase().includes(query.toLowerCase()) || 
    t.category.toLowerCase().includes(query.toLowerCase())
  );

  const totalResults = filteredCourses.length + filteredArticles.length + filteredTutorials.length;

  return (
    <PublicLayout>
      <div className="space-y-6">
        {/* Search Bar */}
        <form onSubmit={handleSearch}>
          <div className="flex gap-4 max-w-2xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search courses, articles, tutorials..."
                className="pl-10"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>
            <Button type="submit">Search</Button>
          </div>
        </form>

        {query && (
          <div>
            <h1 className="text-2xl font-bold mb-1">Search results for "{query}"</h1>
            <p className="text-muted-foreground">{totalResults} results found</p>
          </div>
        )}

        {/* Filters */}
        <div className="flex items-center gap-4">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={levelFilter} onValueChange={setLevelFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Tabs defaultValue="all">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All ({totalResults})</TabsTrigger>
            <TabsTrigger value="courses">Courses ({filteredCourses.length})</TabsTrigger>
            <TabsTrigger value="articles">Articles ({filteredArticles.length})</TabsTrigger>
            <TabsTrigger value="tutorials">Tutorials ({filteredTutorials.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            {filteredCourses.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-4">Courses</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredCourses.slice(0, 3).map((course) => (
                    <Card key={course.id} className="hover:shadow-md transition-shadow cursor-pointer group overflow-hidden">
                      <div className="h-20 bg-primary flex items-center justify-center">
                        <Play className="h-6 w-6 text-primary-foreground" />
                      </div>
                      <CardContent className="p-4">
                        <Badge variant="secondary" className="mb-2">{course.category}</Badge>
                        <h3 className="font-semibold group-hover:text-primary transition-colors mb-2">{course.title}</h3>
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
              </div>
            )}

            {filteredArticles.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-4">Articles</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredArticles.slice(0, 3).map((article) => (
                    <Card key={article.id} className="hover:shadow-md transition-shadow cursor-pointer group">
                      <CardContent className="p-5">
                        <Badge variant="secondary" className="mb-3">{article.category}</Badge>
                        <h3 className="font-semibold group-hover:text-primary transition-colors mb-2">{article.title}</h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {article.readTime}</span>
                          <span>{article.views.toLocaleString()} views</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="courses">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCourses.map((course) => (
                <Card key={course.id} className="hover:shadow-md transition-shadow cursor-pointer group overflow-hidden">
                  <div className="h-20 bg-primary flex items-center justify-center">
                    <Play className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <CardContent className="p-4">
                    <Badge variant="secondary" className="mb-2">{course.category}</Badge>
                    <h3 className="font-semibold group-hover:text-primary transition-colors mb-2">{course.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{course.description}</p>
                    <div className="flex items-center gap-2 text-sm mb-2">
                      <Badge variant="outline">{course.level}</Badge>
                      <span className="flex items-center gap-1 text-muted-foreground"><Clock className="h-3 w-3" /> {course.duration}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="flex items-center gap-1 text-warning"><Star className="h-3 w-3 fill-current" /> {course.rating}</span>
                      <span className="text-muted-foreground"><Users className="h-3 w-3 inline" /> {course.students.toLocaleString()}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="articles">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredArticles.map((article) => (
                <Card key={article.id} className="hover:shadow-md transition-shadow cursor-pointer group">
                  <CardContent className="p-5">
                    <FileText className="h-6 w-6 text-primary mb-3" />
                    <Badge variant="secondary" className="mb-3">{article.category}</Badge>
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
              {filteredTutorials.map((tutorial) => (
                <Card key={tutorial.id} className="hover:shadow-md transition-shadow cursor-pointer group">
                  <CardContent className="p-5">
                    <BookOpen className="h-6 w-6 text-primary mb-3" />
                    <Badge variant="secondary" className="mb-3">{tutorial.category}</Badge>
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

        {totalResults === 0 && query && (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-lg font-semibold mb-2">No results found</h2>
            <p className="text-muted-foreground">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </PublicLayout>
  );
};

export default SearchResults;
