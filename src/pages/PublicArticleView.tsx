import { useParams, Link } from 'react-router-dom';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { usePublicCmsById, usePublicCmsBody } from '@/api/hooks/usePublicCms';
import { publicCmsService } from '@/api/services/publicCmsService';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { 
  Clock, 
  Calendar, 
  User, 
  Share2, 
  Bookmark, 
  ArrowLeft, 
  ChevronRight,
  MessageSquare,
  Heart,
  Eye,
  BookOpen
} from 'lucide-react';

function ArticleSkeleton() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Skeleton className="h-8 w-32" />
      <Skeleton className="h-12 w-3/4" />
      <Skeleton className="h-6 w-full" />
      <div className="flex gap-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
      <Skeleton className="aspect-video w-full rounded-xl" />
      <div className="space-y-4">
        {[...Array(8)].map((_, i) => (
          <Skeleton key={i} className="h-4 w-full" />
        ))}
      </div>
    </div>
  );
}

export default function PublicArticleView() {
  const { id } = useParams<{ id: string }>();
  const articleId = parseInt(id || '0', 10);

  const { data: article, isLoading: loadingArticle, error } = usePublicCmsById(articleId);
  const { data: bodyHtml, isLoading: loadingBody } = usePublicCmsBody(articleId, !!article);

  if (loadingArticle) {
    return (
      <PublicLayout>
        <ArticleSkeleton />
      </PublicLayout>
    );
  }

  if (error || !article) {
    return (
      <PublicLayout>
        <div className="max-w-4xl mx-auto text-center py-20">
          <BookOpen className="h-16 w-16 mx-auto text-muted-foreground/30 mb-6" />
          <h1 className="text-2xl font-bold text-foreground mb-2">Article Not Found</h1>
          <p className="text-muted-foreground mb-6">
            This article doesn't exist or hasn't been published yet.
          </p>
          <Button asChild>
            <Link to="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </Button>
        </div>
      </PublicLayout>
    );
  }

  const thumbnailUrl = publicCmsService.getThumbnailUrl(article.id);
  const publishDate = article.publishedAt 
    ? new Date(article.publishedAt).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    : new Date(article.createdAt).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });

  return (
    <PublicLayout>
      <article className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <Link to="/explore/articles" className="hover:text-primary transition-colors">Articles</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-foreground truncate max-w-[200px]">{article.title || 'Untitled'}</span>
        </nav>

        {/* Header Section */}
        <header className="mb-8">
          <Badge variant="secondary" className="mb-4">
            <BookOpen className="w-3 h-3 mr-1" />
            Article
          </Badge>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 leading-tight">
            {article.title || 'Untitled Article'}
          </h1>

          {article.description && (
            <p className="text-xl text-muted-foreground mb-6 leading-relaxed">
              {article.description}
            </p>
          )}

          {/* Author and meta info */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground">Content Team</p>
                <p className="text-xs">Author</p>
              </div>
            </div>
            
            <Separator orientation="vertical" className="h-8" />
            
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {publishDate}
            </div>
            
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              5 min read
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3 pb-6 border-b border-border">
            <Button variant="outline" size="sm">
              <Heart className="w-4 h-4 mr-2" />
              Like
            </Button>
            <Button variant="outline" size="sm">
              <Bookmark className="w-4 h-4 mr-2" />
              Save
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" size="sm">
              <MessageSquare className="w-4 h-4 mr-2" />
              Discuss
            </Button>
          </div>
        </header>

        {/* Featured Image */}
        <div className="relative aspect-video rounded-2xl overflow-hidden bg-gradient-to-br from-primary/10 to-accent/10 mb-10">
          <img
            src={thumbnailUrl}
            alt={article.title || 'Article thumbnail'}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </div>

        {/* Article Content */}
        <div className="prose prose-lg max-w-none">
          {loadingBody ? (
            <div className="space-y-4">
              {[...Array(10)].map((_, i) => (
                <Skeleton key={i} className="h-4 w-full" />
              ))}
            </div>
          ) : bodyHtml ? (
            <div 
              className="article-content text-foreground leading-relaxed"
              dangerouslySetInnerHTML={{ __html: bodyHtml }}
            />
          ) : (
            <Card className="p-8 text-center border-dashed bg-muted/30">
              <p className="text-muted-foreground">No content available for this article.</p>
            </Card>
          )}
        </div>

        {/* Attachments */}
        {article.attachments && article.attachments.length > 0 && (
          <section className="mt-12">
            <h3 className="text-xl font-semibold mb-4">Attachments</h3>
            <div className="grid gap-3">
              {article.attachments.map((attachment) => (
                <a
                  key={attachment.name}
                  href={publicCmsService.getAttachmentUrl(article.id, attachment.name)}
                  download
                  className="flex items-center gap-3 p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-muted/50 transition-colors"
                >
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{attachment.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(attachment.size / 1024).toFixed(1)} KB • {attachment.mimeType}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Footer actions */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex items-center justify-between">
            <Button variant="outline" asChild>
              <Link to="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Link>
            </Button>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <Heart className="w-4 h-4 mr-2" />
                Like this article
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </article>

      {/* Article content styles */}
      <style>{`
        .article-content h1 { font-size: 2rem; font-weight: 700; margin-top: 2rem; margin-bottom: 1rem; }
        .article-content h2 { font-size: 1.5rem; font-weight: 600; margin-top: 1.75rem; margin-bottom: 0.75rem; }
        .article-content h3 { font-size: 1.25rem; font-weight: 600; margin-top: 1.5rem; margin-bottom: 0.5rem; }
        .article-content p { margin-bottom: 1rem; line-height: 1.75; }
        .article-content ul, .article-content ol { margin-bottom: 1rem; padding-left: 1.5rem; }
        .article-content li { margin-bottom: 0.5rem; }
        .article-content code { background: hsl(var(--muted)); padding: 0.2rem 0.4rem; border-radius: 0.25rem; font-size: 0.9em; }
        .article-content pre { background: hsl(var(--muted)); padding: 1rem; border-radius: 0.5rem; overflow-x: auto; margin-bottom: 1rem; }
        .article-content pre code { background: none; padding: 0; }
        .article-content blockquote { border-left: 4px solid hsl(var(--primary)); padding-left: 1rem; margin: 1.5rem 0; font-style: italic; color: hsl(var(--muted-foreground)); }
        .article-content img { max-width: 100%; height: auto; border-radius: 0.5rem; margin: 1.5rem 0; }
        .article-content a { color: hsl(var(--primary)); text-decoration: underline; }
        .article-content a:hover { text-decoration: none; }
        .article-content table { width: 100%; border-collapse: collapse; margin-bottom: 1rem; }
        .article-content th, .article-content td { border: 1px solid hsl(var(--border)); padding: 0.75rem; text-align: left; }
        .article-content th { background: hsl(var(--muted)); font-weight: 600; }
      `}</style>
    </PublicLayout>
  );
}
