import { useState, useCallback, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { RichContentEditor } from '@/components/articles/RichContentEditor';
import { SeoSettingsPanel } from '@/components/articles/SeoSettingsPanel';
import { PublishScheduler } from '@/components/articles/PublishScheduler';
import { ContentPreviewModal } from '@/components/shared/ContentPreviewModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
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
  Upload,
  File,
  Video,
  FileImage,
  Loader2,
  Download,
  Trash2,
  Users,
} from 'lucide-react';
import { Article, SeoSettings, Attachment, WorkflowStatus, ContentBlock } from '@/types/content';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addArticle, updateArticle } from '@/store/slices/articleSlice';
import { useCreateCms, useUploadCmsContent } from '@/api/hooks/useCms';
import { useCategories } from '@/api/hooks/useCategories';
import { useGroups } from '@/api/hooks/useGroups';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const getFileIcon = (type: string) => {
  if (type.startsWith('image/')) return FileImage;
  if (type.startsWith('video/')) return Video;
  if (type.includes('pdf') || type.includes('document')) return FileText;
  return File;
};

export default function ArticleCreator() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');
  const dispatch = useAppDispatch();
  const { articles } = useAppSelector((state) => state.articles);
  const { user } = useAuth();
  
  // API hooks
  const createCms = useCreateCms();
  const uploadContent = useUploadCmsContent();
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const { groups, fetchGroups, isLoading: groupsLoading } = useGroups();
  
  const existingArticle = editId ? articles.find(a => a.id === editId) : null;

  const [title, setTitle] = useState(existingArticle?.title || '');
  const [slug, setSlug] = useState(existingArticle?.slug || '');
  const [excerpt, setExcerpt] = useState(existingArticle?.excerpt || '');
  const [category, setCategory] = useState(existingArticle?.categoryPath[0] || '');
  const [selectedGroup, setSelectedGroup] = useState('');
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
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [cmsId, setCmsId] = useState<number | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  // Fetch groups on mount
  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

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

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    handleFileUpload(files);
  }, []);

  const handleFileUpload = async (files: File[]) => {
    const maxSize = 50 * 1024 * 1024; // 50MB
    
    for (const file of files) {
      if (file.size > maxSize) {
        toast.error(`${file.name} exceeds 50MB limit`);
        continue;
      }

      const fileId = `${file.name}-${Date.now()}`;
      setUploadProgress(prev => ({ ...prev, [fileId]: 0 }));

      try {
        // Simulate progress while uploading
        const progressInterval = setInterval(() => {
          setUploadProgress(prev => {
            const current = prev[fileId] || 0;
            if (current >= 90) return prev;
            return { ...prev, [fileId]: current + 10 };
          });
        }, 200);

        // If we have a CMS ID, upload to API
        if (cmsId) {
          await uploadContent.mutateAsync({ id: cmsId, file });
        }

        clearInterval(progressInterval);
        setUploadProgress(prev => ({ ...prev, [fileId]: 100 }));

        // Add to local attachments
        const newAttachment: Attachment = {
          id: fileId,
          name: file.name,
          url: URL.createObjectURL(file),
          size: file.size,
          type: file.type,
          uploadedAt: new Date().toISOString(),
        };
        setAttachments(prev => [...prev, newAttachment]);

        // If it's an image and no featured image, set it
        if (file.type.startsWith('image/') && !featuredImage) {
          setFeaturedImage(newAttachment.url);
        }

        setTimeout(() => {
          setUploadProgress(prev => {
            const { [fileId]: _, ...rest } = prev;
            return rest;
          });
        }, 500);

        toast.success(`${file.name} uploaded successfully`);
      } catch (error) {
        setUploadProgress(prev => {
          const { [fileId]: _, ...rest } = prev;
          return rest;
        });
        toast.error(`Failed to upload ${file.name}`);
      }
    }
  };

  const handleRemoveAttachment = (id: string) => {
    setAttachments(attachments.filter((a) => a.id !== id));
  };

  const handleSave = async (status: WorkflowStatus = 'draft') => {
    if (!title.trim()) {
      toast.error('Title is required');
      return;
    }
    if (!category) {
      toast.error('Please select a category');
      return;
    }

    setIsSaving(true);
    try {
      // Create CMS record via API if not exists
      if (!cmsId && !existingArticle) {
        const cmsResponse = await createCms.mutateAsync({
          type: 'ARTICLE',
          categoryId: parseInt(category),
          createdBy: user?.id || 1,
        });
        setCmsId(cmsResponse.id);
      }

      const articleData: Article = {
        id: existingArticle?.id || `article-${Date.now()}`,
        title,
        slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        content: '',
        contentBlocks,
        excerpt,
        author: user?.name || 'Current User',
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

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
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
                Build rich content with code blocks, images, videos, and more
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button variant="outline" onClick={() => setShowPreview(true)} className="flex-1 sm:flex-none">
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
            <Button variant="outline" onClick={() => handleSave('draft')} disabled={isSaving} className="flex-1 sm:flex-none">
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save Draft'}
            </Button>
            <Button onClick={() => handleSave('submitted')} disabled={isSaving} className="flex-1 sm:flex-none">
              <Send className="w-4 h-4 mr-2" />
              Submit
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-12 gap-6">
          {/* Editor Area */}
          <div className="col-span-12 lg:col-span-8">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4 flex-wrap">
                <TabsTrigger value="content" className="gap-2">
                  <FileText className="w-4 h-4" />
                  Content
                </TabsTrigger>
                <TabsTrigger value="media" className="gap-2">
                  <Paperclip className="w-4 h-4" />
                  Media & Files
                </TabsTrigger>
                <TabsTrigger value="seo" className="gap-2">
                  <Search className="w-4 h-4" />
                  SEO
                </TabsTrigger>
                <TabsTrigger value="schedule" className="gap-2">
                  <Calendar className="w-4 h-4" />
                  Schedule
                </TabsTrigger>
              </TabsList>

              <TabsContent value="content" className="space-y-6">
                {/* Title & Slug */}
                <Card>
                  <CardContent className="pt-6 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Article Title *</Label>
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

              <TabsContent value="media" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Upload className="w-5 h-5" />
                      Upload Media & Documents
                    </CardTitle>
                    <CardDescription>
                      Drag and drop or click to upload images, videos, PDFs, and documents (max 50MB each)
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Drop Zone */}
                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      className={cn(
                        'border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer',
                        isDragging 
                          ? 'border-primary bg-primary/5 scale-[1.02]' 
                          : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50'
                      )}
                    >
                      <input
                        type="file"
                        multiple
                        onChange={(e) => e.target.files && handleFileUpload(Array.from(e.target.files))}
                        className="hidden"
                        id="file-upload"
                        accept="image/*,video/*,application/pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                      />
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                          <Upload className="w-8 h-8 text-primary" />
                        </div>
                        <p className="text-lg font-medium mb-1">
                          Drop files here or click to upload
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Supports images, videos, PDFs, Word, Excel, and PowerPoint files
                        </p>
                      </label>
                    </div>

                    {/* Supported formats */}
                    <div className="flex flex-wrap gap-2 justify-center">
                      {['JPG', 'PNG', 'GIF', 'MP4', 'PDF', 'DOC', 'XLSX', 'PPTX'].map((format) => (
                        <Badge key={format} variant="outline" className="text-xs">
                          {format}
                        </Badge>
                      ))}
                    </div>

                    {/* Upload Progress */}
                    {Object.entries(uploadProgress).length > 0 && (
                      <div className="space-y-3">
                        <p className="text-sm font-medium">Uploading...</p>
                        {Object.entries(uploadProgress).map(([name, progress]) => (
                          <div key={name} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                            <Loader2 className="w-5 h-5 animate-spin text-primary" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{name.split('-')[0]}</p>
                              <Progress value={progress} className="h-1.5 mt-1" />
                            </div>
                            <span className="text-xs text-muted-foreground">{progress}%</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Uploaded Files */}
                    {attachments.length > 0 && (
                      <div className="space-y-3">
                        <p className="text-sm font-medium flex items-center gap-2">
                          <Paperclip className="w-4 h-4" />
                          Uploaded Files ({attachments.length})
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {attachments.map((attachment) => {
                            const Icon = getFileIcon(attachment.type);
                            const isImage = attachment.type.startsWith('image/');
                            return (
                              <div
                                key={attachment.id}
                                className="flex items-center gap-3 p-3 bg-card border border-border rounded-lg group hover:shadow-sm transition-shadow"
                              >
                                {isImage ? (
                                  <div className="w-12 h-12 rounded bg-muted overflow-hidden flex-shrink-0">
                                    <img src={attachment.url} alt={attachment.name} className="w-full h-full object-cover" />
                                  </div>
                                ) : (
                                  <div className="w-12 h-12 rounded bg-muted flex items-center justify-center flex-shrink-0">
                                    <Icon className="w-6 h-6 text-muted-foreground" />
                                  </div>
                                )}
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium truncate">{attachment.name}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {formatFileSize(attachment.size)}
                                  </p>
                                </div>
                                <div className="flex gap-1">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => window.open(attachment.url, '_blank')}
                                  >
                                    <Download className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive"
                                    onClick={() => handleRemoveAttachment(attachment.id)}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
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
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="col-span-12 lg:col-span-4 space-y-6">
            {/* Category */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Category *</CardTitle>
              </CardHeader>
              <CardContent>
                {categoriesLoading ? (
                  <Skeleton className="h-10 w-full" />
                ) : (
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border">
                      {categories?.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id.toString()}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </CardContent>
            </Card>

            {/* User Group */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Assign to Group
                </CardTitle>
              </CardHeader>
              <CardContent>
                {groupsLoading ? (
                  <Skeleton className="h-10 w-full" />
                ) : (
                  <Select value={selectedGroup} onValueChange={setSelectedGroup}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select user group (optional)" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border">
                      {groups.map((group) => (
                        <SelectItem key={group.id} value={group.id}>
                          {group.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
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
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  />
                  <Button size="icon" onClick={handleAddTag}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="gap-1 pr-1">
                        {tag}
                        <button 
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-1 hover:bg-muted rounded-full p-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
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
                  placeholder="Enter image URL or upload in Media tab..."
                />
                {featuredImage && (
                  <div className="relative aspect-video bg-muted rounded-lg overflow-hidden group">
                    <img
                      src={featuredImage}
                      alt="Featured"
                      className="w-full h-full object-cover"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => setFeaturedImage('')}
                    >
                      <X className="w-4 h-4" />
                    </Button>
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
                    <span className="text-muted-foreground">Media Files</span>
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

        {/* Preview Modal */}
        <ContentPreviewModal
          open={showPreview}
          onOpenChange={setShowPreview}
          type="article"
          content={{
            id: existingArticle?.id || 'preview',
            title,
            slug,
            content: '',
            contentBlocks,
            excerpt,
            categoryPath: category ? [category] : [],
            author: user?.name || 'Current User',
            status: 'draft',
            seo: seoSettings,
            featuredImage,
            attachments,
            tags,
            scheduledPublishDate: scheduledDate,
            createdAt: existingArticle?.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }}
        />
      </div>
    </DashboardLayout>
  );
}
