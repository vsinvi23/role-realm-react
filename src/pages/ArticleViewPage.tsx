import { useParams, Link } from 'react-router-dom';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, Calendar, Eye, ThumbsUp, Bookmark, Share2, ChevronLeft, MessageSquare } from 'lucide-react';

const articleData: Record<string, {
  title: string;
  excerpt: string;
  content: string;
  author: { name: string; avatar: string; role: string };
  category: string;
  tags: string[];
  readTime: string;
  publishedAt: string;
  views: number;
  likes: number;
}> = {
  'understanding-microservices-architecture': {
    title: 'Understanding Microservices Architecture',
    excerpt: 'A comprehensive guide to building scalable and maintainable applications using microservices patterns.',
    content: `
## Introduction

Microservices architecture has revolutionized the way we build and deploy modern applications. Unlike monolithic architectures where all components are tightly coupled, microservices break down applications into smaller, independent services that can be developed, deployed, and scaled independently.

## What are Microservices?

Microservices are an architectural style that structures an application as a collection of loosely coupled services. Each service is:

- **Independently deployable** - Services can be updated without affecting others
- **Loosely coupled** - Minimal dependencies between services
- **Organized around business capabilities** - Each service handles a specific business function
- **Owned by small teams** - Following the "two-pizza team" principle

## Key Benefits

### 1. Scalability
Each service can be scaled independently based on demand. If your user authentication service experiences high load, you can scale just that service without scaling the entire application.

### 2. Technology Flexibility
Different services can use different programming languages, databases, or frameworks. This allows teams to choose the best tool for each job.

### 3. Resilience
If one service fails, it doesn't bring down the entire application. Proper circuit breakers and fallback mechanisms ensure graceful degradation.

### 4. Faster Development Cycles
Small, focused teams can work on individual services without waiting for other teams. This leads to faster release cycles and improved time-to-market.

## Core Components

### API Gateway
The API Gateway serves as the single entry point for all client requests. It handles:
- Request routing
- Authentication and authorization
- Rate limiting
- Load balancing

### Service Discovery
Services need to find and communicate with each other. Service discovery mechanisms like Consul, Eureka, or Kubernetes DNS help services locate each other dynamically.

### Message Queues
Asynchronous communication between services is often handled through message queues like RabbitMQ, Apache Kafka, or AWS SQS. This enables:
- Decoupled communication
- Better fault tolerance
- Improved scalability

## Best Practices

1. **Design for failure** - Assume services will fail and design accordingly
2. **Use containerization** - Docker and Kubernetes simplify deployment and scaling
3. **Implement comprehensive monitoring** - Use tools like Prometheus, Grafana, and distributed tracing
4. **Maintain API versioning** - Ensure backward compatibility as services evolve
5. **Automate everything** - CI/CD pipelines are essential for managing multiple services

## Common Challenges

While microservices offer many benefits, they also introduce complexity:

- **Distributed system complexity** - Network latency, partial failures, and data consistency
- **Operational overhead** - More services mean more deployments, monitoring, and debugging
- **Testing complexity** - Integration testing across services requires careful planning

## Conclusion

Microservices architecture is a powerful approach for building scalable, maintainable applications. However, it's not a silver bullet. Carefully evaluate whether your organization has the maturity and resources to handle the added complexity before adopting this architecture.
    `,
    author: {
      name: 'Sarah Chen',
      avatar: '',
      role: 'Senior Software Architect'
    },
    category: 'System Design',
    tags: ['Microservices', 'Architecture', 'Distributed Systems', 'API Design', 'Scalability'],
    readTime: '12 min read',
    publishedAt: 'December 8, 2024',
    views: 15420,
    likes: 892
  }
};

const relatedArticles = [
  { title: 'API Gateway Patterns', readTime: '8 min', category: 'System Design' },
  { title: 'Event-Driven Architecture', readTime: '10 min', category: 'Architecture' },
  { title: 'Docker for Beginners', readTime: '15 min', category: 'DevOps' },
];

const ArticleViewPage = () => {
  const { slug } = useParams();
  const article = articleData[slug || 'understanding-microservices-architecture'] || articleData['understanding-microservices-architecture'];

  return (
    <PublicLayout>
      <div className="min-h-screen bg-background">
        {/* Header Section */}
        <div className="bg-primary/5 border-b border-border">
          <div className="max-w-4xl mx-auto px-6 py-8">
            <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-primary mb-6 transition-colors">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Articles
            </Link>
            
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                {article.category}
              </Badge>
              <span className="text-muted-foreground text-sm flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {article.readTime}
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight">
              {article.title}
            </h1>
            
            <p className="text-lg text-muted-foreground mb-6">
              {article.excerpt}
            </p>

            {/* Author Info */}
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12 border-2 border-primary/20">
                  <AvatarImage src={article.author.avatar} />
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                    {article.author.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-foreground">{article.author.name}</p>
                  <p className="text-sm text-muted-foreground">{article.author.role}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {article.publishedAt}
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  {article.views.toLocaleString()} views
                </span>
                <span className="flex items-center gap-1">
                  <ThumbsUp className="h-4 w-4" />
                  {article.likes} likes
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-8">
            {/* Article Content */}
            <article className="prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-li:text-muted-foreground">
              {article.content.split('\n').map((paragraph, index) => {
                if (paragraph.startsWith('## ')) {
                  return <h2 key={index} className="text-2xl font-bold mt-8 mb-4 text-foreground">{paragraph.replace('## ', '')}</h2>;
                }
                if (paragraph.startsWith('### ')) {
                  return <h3 key={index} className="text-xl font-semibold mt-6 mb-3 text-foreground">{paragraph.replace('### ', '')}</h3>;
                }
                if (paragraph.startsWith('- **')) {
                  const match = paragraph.match(/- \*\*(.+?)\*\* - (.+)/);
                  if (match) {
                    return (
                      <div key={index} className="flex gap-2 my-2">
                        <span className="text-primary">•</span>
                        <p className="text-muted-foreground"><strong className="text-foreground">{match[1]}</strong> - {match[2]}</p>
                      </div>
                    );
                  }
                }
                if (paragraph.startsWith('1. ') || paragraph.match(/^\d+\./)) {
                  const match = paragraph.match(/^\d+\.\s+\*\*(.+?)\*\*\s*-?\s*(.*)/) || paragraph.match(/^\d+\.\s+(.+)/);
                  if (match) {
                    return (
                      <div key={index} className="flex gap-2 my-2 ml-4">
                        <span className="text-primary font-semibold">{paragraph.match(/^\d+/)?.[0]}.</span>
                        <p className="text-muted-foreground">
                          {match[2] ? <><strong className="text-foreground">{match[1]}</strong> - {match[2]}</> : match[1]}
                        </p>
                      </div>
                    );
                  }
                }
                if (paragraph.startsWith('- ')) {
                  return (
                    <div key={index} className="flex gap-2 my-2">
                      <span className="text-primary">•</span>
                      <p className="text-muted-foreground">{paragraph.replace('- ', '')}</p>
                    </div>
                  );
                }
                if (paragraph.trim()) {
                  return <p key={index} className="text-muted-foreground leading-relaxed my-4">{paragraph}</p>;
                }
                return null;
              })}
            </article>

            {/* Sidebar */}
            <aside className="space-y-6">
              {/* Actions */}
              <Card className="border-border">
                <CardContent className="p-4 space-y-3">
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <Bookmark className="h-4 w-4" />
                    Save Article
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <Share2 className="h-4 w-4" />
                    Share
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Discussion
                  </Button>
                </CardContent>
              </Card>

              {/* Tags */}
              <Card className="border-border">
                <CardContent className="p-4">
                  <h4 className="font-semibold text-foreground mb-3">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {article.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs hover:bg-primary/10 cursor-pointer">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Related Articles */}
              <Card className="border-border">
                <CardContent className="p-4">
                  <h4 className="font-semibold text-foreground mb-3">Related Articles</h4>
                  <div className="space-y-3">
                    {relatedArticles.map((related) => (
                      <div key={related.title} className="group cursor-pointer">
                        <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                          {related.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {related.category} • {related.readTime}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </aside>
          </div>

          <Separator className="my-8" />

          {/* Tags Footer */}
          <div className="flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="bg-muted hover:bg-primary/10 cursor-pointer">
                #{tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default ArticleViewPage;
