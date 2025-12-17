import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { RichContentEditor } from '@/components/articles/RichContentEditor';
import { SeoSettingsPanel } from '@/components/articles/SeoSettingsPanel';
import { PublishScheduler } from '@/components/articles/PublishScheduler';
import { AttachmentUploader } from '@/components/shared/AttachmentUploader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Save,
  Eye,
  Send,
  FileText,
  Search,
  Calendar,
  Paperclip,
  ArrowLeft,
  Plus,
  X,
  Image,
  Code,
  Sparkles,
} from 'lucide-react';
import { Article, SeoSettings, Attachment, WorkflowStatus, ContentBlock } from '@/types/content';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addArticle, updateArticle } from '@/store/slices/articleSlice';

const CATEGORIES = [
  { value: 'dsa', label: 'Data Structures & Algorithms' },
  { value: 'web', label: 'Web Development' },
  { value: 'mobile', label: 'Mobile Development' },
  { value: 'devops', label: 'DevOps & Cloud' },
  { value: 'ai', label: 'AI & Machine Learning' },
  { value: 'database', label: 'Databases' },
  { value: 'security', label: 'Cybersecurity' },
  { value: 'general', label: 'General Programming' },
];

export default function ArticleCreator() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');
  const dispatch = useAppDispatch();
  const { articles } = useAppSelector((state) => state.articles);
  
  const existingArticle = editId ? articles.find(a => a.id === editId) : null;

  const [title, setTitle] = useState(existingArticle?.title || '');
  const [slug, setSlug] = useState(existingArticle?.slug || '');
  const [excerpt, setExcerpt] = useState(existingArticle?.excerpt || '');
  const [category, setCategory] = useState(existingArticle?.categoryPath[0] || '');
  const [tags, setTags] = useState<string[]>(existingArticle?.tags || []);
  const [newTag, setNewTag] = useState('');
  const [featuredImage, setFeaturedImage] = useState(existingArticle?.featuredImage || '');
  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>(
    existingArticle?.contentBlocks || []
  );
  const [seoSettings, setSeoSettings] = useState<SeoSettings>(
    existingArticle?.seo || {
      metaTitle: '',
      metaDescription: '',
      keywords: [],
      ogImage: '',
      canonicalUrl: '',
    }
  );
  const [scheduledDate, setScheduledDate] = useState<string | undefined>(
    existingArticle?.scheduledPublishDate
  );
  const [attachments, setAttachments] = useState<Attachment[]>(existingArticle?.attachments || []);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('content');

  const generateSlug = () => {
    const generatedSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    setSlug(generatedSlug);
  };

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleSave = async (status: WorkflowStatus = 'draft') => {
    if (!title.trim()) {
      toast.error('Title is required');
      return;
    }

    setIsSaving(true);
    try {
      const articleData: Article = {
        id: existingArticle?.id || `article-${Date.now()}`,
        title,
        slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        content: '', // Legacy field for backward compatibility
        contentBlocks,
        excerpt,
        author: 'Current User',
        categoryPath: category ? [category] : [],
        tags,
        status,
        featuredImage,
        attachments,
        seo: seoSettings,
        scheduledPublishDate: scheduledDate,
        createdAt: existingArticle?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      if (existingArticle) {
        dispatch(updateArticle(articleData));
        toast.success('Article updated successfully');
      } else {
        dispatch(addArticle(articleData));
        toast.success('Article created successfully');
      }
      
      navigate('/articles');
    } catch (error) {
      toast.error('Failed to save article');
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpload = (files: File[]) => {
    const newAttachments: Attachment[] = files.map((file) => ({
      id: `attachment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: file.name,
      url: URL.createObjectURL(file),
      size: file.size,
      type: file.type,
      uploadedAt: new Date().toISOString(),
    }));
    setAttachments([...attachments, ...newAttachments]);
  };

  const handleRemoveAttachment = (id: string) => {
    setAttachments(attachments.filter((a) => a.id !== id));
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/articles')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-semibold text-foreground">
                {existingArticle ? 'Edit Article' : 'Create Article'}
              </h1>
              <p className="text-sm text-muted-foreground">
                Build rich content with code blocks, images, and more
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => toast.info('Preview coming soon')}>
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
            <Button variant="outline" onClick={() => handleSave('draft')} disabled={isSaving}>
              <Save className="w-4 h-4 mr-2" />
              Save Draft
            </Button>
            <Button onClick={() => handleSave('submitted')} disabled={isSaving}>
              <Send className="w-4 h-4 mr-2" />
              Submit for Review
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-12 gap-6">
          {/* Editor Area */}
          <div className="col-span-12 lg:col-span-8">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="content" className="gap-2">
                  <FileText className="w-4 h-4" />
                  Content
                </TabsTrigger>
                <TabsTrigger value="seo" className="gap-2">
                  <Search className="w-4 h-4" />
                  SEO
                </TabsTrigger>
                <TabsTrigger value="schedule" className="gap-2">
                  <Calendar className="w-4 h-4" />
                  Schedule
                </TabsTrigger>
                <TabsTrigger value="attachments" className="gap-2">
                  <Paperclip className="w-4 h-4" />
                  Attachments
                </TabsTrigger>
              </TabsList>

              <TabsContent value="content" className="space-y-6">
                {/* Title & Slug */}
                <Card>
                  <CardContent className="pt-6 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Article Title</Label>
                      <Input
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter a compelling title..."
                        className="text-lg"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="slug">URL Slug</Label>
                        <Button variant="ghost" size="sm" onClick={generateSlug}>
                          <Sparkles className="w-3 h-3 mr-1" />
                          Generate
                        </Button>
                      </div>
                      <Input
                        id="slug"
                        value={slug}
                        onChange={(e) => setSlug(e.target.value)}
                        placeholder="article-url-slug"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="excerpt">Excerpt</Label>
                      <Textarea
                        id="excerpt"
                        value={excerpt}
                        onChange={(e) => setExcerpt(e.target.value)}
                        placeholder="Brief summary of the article..."
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Rich Content Editor */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Code className="w-5 h-5" />
                      Article Content
                    </CardTitle>
                    <CardDescription>
                      Add paragraphs, code blocks, images, lists, and more
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <RichContentEditor blocks={contentBlocks} onChange={setContentBlocks} />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="seo">
                <Card>
                  <CardContent className="pt-6">
                    <SeoSettingsPanel
                      seo={seoSettings}
                      onChange={setSeoSettings}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="schedule">
                <Card>
                  <CardContent className="pt-6">
                    <PublishScheduler
                      scheduledDate={scheduledDate}
                      onChange={setScheduledDate}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="attachments">
                <Card>
                  <CardContent className="pt-6">
                    <AttachmentUploader
                      attachments={attachments}
                      onUpload={handleUpload}
                      onRemove={handleRemoveAttachment}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="col-span-12 lg:col-span-4 space-y-6">
            {/* Category */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Category</CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border">
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Tags */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Tags</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add tag..."
                    onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                  />
                  <Button size="icon" onClick={handleAddTag}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="gap-1">
                      {tag}
                      <button onClick={() => handleRemoveTag(tag)}>
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Featured Image */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Image className="w-4 h-4" />
                  Featured Image
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Input
                  value={featuredImage}
                  onChange={(e) => setFeaturedImage(e.target.value)}
                  placeholder="Enter image URL..."
                />
                {featuredImage && (
                  <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
                    <img
                      src={featuredImage}
                      alt="Featured"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Content Blocks</span>
                    <span className="font-medium">{contentBlocks.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Code Blocks</span>
                    <span className="font-medium">
                      {contentBlocks.filter((b) => b.type === 'code').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Attachments</span>
                    <span className="font-medium">{attachments.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tags</span>
                    <span className="font-medium">{tags.length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}