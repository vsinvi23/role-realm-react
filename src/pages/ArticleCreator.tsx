import { useState, useCallback, useEffect, useRef } from 'react';
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
import { Separator } from '@/components/ui/separator';
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
  Image as ImageIcon,
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
  CheckCircle2,
  AlertCircle,
  Camera,
} from 'lucide-react';
import { Article, SeoSettings, Attachment, WorkflowStatus, ContentBlock } from '@/types/content';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addArticle, updateArticle } from '@/store/slices/articleSlice';
import { useCreateCms, useUploadCmsContent, useUploadCmsThumbnail } from '@/api/hooks/useCms';
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

const getFileTypeLabel = (type: string) => {
  if (type.startsWith('image/')) return 'Image';
  if (type.startsWith('video/')) return 'Video';
  if (type.includes('pdf')) return 'PDF';
  if (type.includes('word') || type.includes('document')) return 'Document';
  if (type.includes('sheet') || type.includes('excel')) return 'Spreadsheet';
  if (type.includes('presentation') || type.includes('powerpoint')) return 'Presentation';
  return 'File';
};

export default function ArticleCreator() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');
  const dispatch = useAppDispatch();
  const { articles } = useAppSelector((state) => state.articles);
  const { user } = useAuth();
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  
  // API hooks
  const createCms = useCreateCms();
  const uploadContent = useUploadCmsContent();
  const uploadThumbnail = useUploadCmsThumbnail();
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
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
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
  const [thumbnailUploading, setThumbnailUploading] = useState(false);

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
    toast.success('Slug generated!');
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
  }, [cmsId]);

  const handleThumbnailUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file for thumbnail');
      return;
    }

    setThumbnailUploading(true);
    setThumbnailFile(file);
    const previewUrl = URL.createObjectURL(file);
    setFeaturedImage(previewUrl);

    try {
      if (cmsId) {
        await uploadThumbnail.mutateAsync({ id: cmsId, file });
        toast.success('Thumbnail uploaded successfully');
      }
    } catch (error) {
      toast.error('Failed to upload thumbnail');
    } finally {
      setThumbnailUploading(false);
    }
  };

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
    toast.success('File removed');
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
      let currentCmsId = cmsId;
      
      // Create CMS record via API if not exists
      if (!currentCmsId && !existingArticle) {
        const cmsResponse = await createCms.mutateAsync({
          type: 'ARTICLE',
          categoryId: parseInt(category),
          createdBy: user?.id || 1,
        });
        currentCmsId = cmsResponse.id;
        setCmsId(currentCmsId);
      }

      // Upload thumbnail if pending
      if (thumbnailFile && currentCmsId) {
        await uploadThumbnail.mutateAsync({ id: currentCmsId, file: thumbnailFile });
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

  const imageAttachments = attachments.filter(a => a.type.startsWith('image/'));
  const videoAttachments = attachments.filter(a => a.type.startsWith('video/'));
  const documentAttachments = attachments.filter(a => !a.type.startsWith('image/') && !a.type.startsWith('video/'));

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-border">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/articles')} className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <div>
              <h1 className="text-2xl font-bold text-foreground tracking-tight">
                {existingArticle ? 'Edit Article' : 'Create New Article'}
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                Build rich content with code blocks, images, videos, and more
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button variant="outline" size="sm" onClick={() => setShowPreview(true)} className="flex-1 sm:flex-none gap-2">
              <Eye className="w-4 h-4" />
              Preview
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleSave('draft')} disabled={isSaving} className="flex-1 sm:flex-none gap-2">
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Draft
            </Button>
            <Button size="sm" onClick={() => handleSave('submitted')} disabled={isSaving} className="flex-1 sm:flex-none gap-2 bg-primary hover:bg-primary/90">
              <Send className="w-4 h-4" />
              Submit for Review
            </Button>
          </div>
        </div>

        {/* Status Indicator */}
        {cmsId && (
          <div className="flex items-center gap-2 px-3 py-2 bg-green-500/10 border border-green-500/20 rounded-lg text-sm">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            <span className="text-green-700 dark:text-green-400">Content saved to server (ID: {cmsId})</span>
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-12 gap-6">
          {/* Editor Area */}
          <div className="col-span-12 lg:col-span-8">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4 w-full justify-start bg-muted/50 p-1">
                <TabsTrigger value="content" className="gap-2 data-[state=active]:bg-background">
                  <FileText className="w-4 h-4" />
                  Content
                </TabsTrigger>
                <TabsTrigger value="media" className="gap-2 data-[state=active]:bg-background">
                  <Paperclip className="w-4 h-4" />
                  Media & Files
                  {attachments.length > 0 && (
                    <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                      {attachments.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="seo" className="gap-2 data-[state=active]:bg-background">
                  <Search className="w-4 h-4" />
                  SEO
                </TabsTrigger>
                <TabsTrigger value="schedule" className="gap-2 data-[state=active]:bg-background">
                  <Calendar className="w-4 h-4" />
                  Schedule
                </TabsTrigger>
              </TabsList>

              <TabsContent value="content" className="space-y-6 mt-0">
                {/* Title & Slug */}
                <Card className="border-border/50 shadow-sm">
                  <CardContent className="pt-6 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title" className="text-sm font-medium">
                        Article Title <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter a compelling title..."
                        className="text-lg h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="slug" className="text-sm font-medium">URL Slug</Label>
                        <Button variant="ghost" size="sm" onClick={generateSlug} className="h-7 text-xs gap-1">
                          <Sparkles className="w-3 h-3" />
                          Auto-generate
                        </Button>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">/articles/</span>
                        <Input
                          id="slug"
                          value={slug}
                          onChange={(e) => setSlug(e.target.value)}
                          placeholder="article-url-slug"
                          className="flex-1"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="excerpt" className="text-sm font-medium">Excerpt / Summary</Label>
                      <Textarea
                        id="excerpt"
                        value={excerpt}
                        onChange={(e) => setExcerpt(e.target.value)}
                        placeholder="Brief summary of the article (displayed in previews)..."
                        rows={3}
                        className="resize-none"
                      />
                      <p className="text-xs text-muted-foreground">{excerpt.length}/300 characters recommended</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Rich Content Editor */}
                <Card className="border-border/50 shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Code className="w-5 h-5 text-primary" />
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

              <TabsContent value="media" className="space-y-6 mt-0">
                <Card className="border-border/50 shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Upload className="w-5 h-5 text-primary" />
                      Upload Media & Documents
                    </CardTitle>
                    <CardDescription>
                      Drag and drop or click to upload images, videos, PDFs, and documents (max 50MB each)
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Drop Zone */}
                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      className={cn(
                        'relative border-2 border-dashed rounded-xl p-10 text-center transition-all cursor-pointer group',
                        isDragging 
                          ? 'border-primary bg-primary/5 scale-[1.01]' 
                          : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/30'
                      )}
                    >
                      <input
                        type="file"
                        multiple
                        onChange={(e) => e.target.files && handleFileUpload(Array.from(e.target.files))}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        accept="image/*,video/*,application/pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                      />
                      <div className="pointer-events-none">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Upload className="w-8 h-8 text-primary" />
                        </div>
                        <p className="text-lg font-medium mb-1">
                          Drop files here or click to upload
                        </p>
                        <p className="text-sm text-muted-foreground mb-4">
                          Supports images, videos, PDFs, Word, Excel, and PowerPoint files
                        </p>
                        <div className="flex flex-wrap gap-2 justify-center">
                          {['JPG', 'PNG', 'GIF', 'MP4', 'PDF', 'DOC', 'XLSX', 'PPTX'].map((format) => (
                            <Badge key={format} variant="outline" className="text-xs">
                              {format}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Upload Progress */}
                    {Object.entries(uploadProgress).length > 0 && (
                      <div className="space-y-3">
                        <p className="text-sm font-medium flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Uploading files...
                        </p>
                        {Object.entries(uploadProgress).map(([name, progress]) => (
                          <div key={name} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate mb-1">{name.split('-')[0]}</p>
                              <Progress value={progress} className="h-2" />
                            </div>
                            <span className="text-sm font-medium text-primary">{progress}%</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Uploaded Files by Category */}
                    {attachments.length > 0 && (
                      <div className="space-y-6">
                        {/* Images */}
                        {imageAttachments.length > 0 && (
                          <div className="space-y-3">
                            <p className="text-sm font-medium flex items-center gap-2">
                              <FileImage className="w-4 h-4 text-blue-500" />
                              Images ({imageAttachments.length})
                            </p>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                              {imageAttachments.map((attachment) => (
                                <div
                                  key={attachment.id}
                                  className="relative group rounded-lg overflow-hidden bg-muted aspect-video"
                                >
                                  <img src={attachment.url} alt={attachment.name} className="w-full h-full object-cover" />
                                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <Button
                                      variant="secondary"
                                      size="icon"
                                      className="h-8 w-8"
                                      onClick={() => window.open(attachment.url, '_blank')}
                                    >
                                      <Download className="w-4 h-4" />
                                    </Button>
                                    <Button
                                      variant="destructive"
                                      size="icon"
                                      className="h-8 w-8"
                                      onClick={() => handleRemoveAttachment(attachment.id)}
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </div>
                                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                                    <p className="text-xs text-white truncate">{attachment.name}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Videos */}
                        {videoAttachments.length > 0 && (
                          <div className="space-y-3">
                            <p className="text-sm font-medium flex items-center gap-2">
                              <Video className="w-4 h-4 text-purple-500" />
                              Videos ({videoAttachments.length})
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {videoAttachments.map((attachment) => (
                                <div
                                  key={attachment.id}
                                  className="flex items-center gap-3 p-3 bg-card border border-border rounded-lg group hover:shadow-md transition-shadow"
                                >
                                  <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-purple-500/20 to-purple-500/10 flex items-center justify-center flex-shrink-0">
                                    <Video className="w-6 h-6 text-purple-500" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">{attachment.name}</p>
                                    <p className="text-xs text-muted-foreground">
                                      {formatFileSize(attachment.size)}
                                    </p>
                                  </div>
                                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => window.open(attachment.url, '_blank')}>
                                      <Download className="w-4 h-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleRemoveAttachment(attachment.id)}>
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Documents */}
                        {documentAttachments.length > 0 && (
                          <div className="space-y-3">
                            <p className="text-sm font-medium flex items-center gap-2">
                              <FileText className="w-4 h-4 text-orange-500" />
                              Documents ({documentAttachments.length})
                            </p>
                            <div className="space-y-2">
                              {documentAttachments.map((attachment) => {
                                const Icon = getFileIcon(attachment.type);
                                return (
                                  <div
                                    key={attachment.id}
                                    className="flex items-center gap-3 p-3 bg-card border border-border rounded-lg group hover:shadow-md transition-shadow"
                                  >
                                    <div className="w-10 h-10 rounded bg-muted flex items-center justify-center flex-shrink-0">
                                      <Icon className="w-5 h-5 text-muted-foreground" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-medium truncate">{attachment.name}</p>
                                      <p className="text-xs text-muted-foreground">
                                        {formatFileSize(attachment.size)} • {getFileTypeLabel(attachment.type)}
                                      </p>
                                    </div>
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => window.open(attachment.url, '_blank')}>
                                        <Download className="w-4 h-4" />
                                      </Button>
                                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleRemoveAttachment(attachment.id)}>
                                        <Trash2 className="w-4 h-4" />
                                      </Button>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {attachments.length === 0 && Object.entries(uploadProgress).length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        <AlertCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>No files uploaded yet</p>
                        <p className="text-sm">Upload images, videos, or documents to enhance your article</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="seo" className="mt-0">
                <Card className="border-border/50 shadow-sm">
                  <CardContent className="pt-6">
                    <SeoSettingsPanel
                      seo={seoSettings}
                      onChange={setSeoSettings}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="schedule" className="mt-0">
                <Card className="border-border/50 shadow-sm">
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
            {/* Featured Image / Thumbnail */}
            <Card className="border-border/50 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Camera className="w-4 h-4 text-primary" />
                  Featured Image
                </CardTitle>
                <CardDescription className="text-xs">
                  Upload a thumbnail for your article
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <input
                  ref={thumbnailInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && handleThumbnailUpload(e.target.files[0])}
                  className="hidden"
                />
                
                {featuredImage ? (
                  <div className="relative aspect-video bg-muted rounded-lg overflow-hidden group">
                    <img
                      src={featuredImage}
                      alt="Featured"
                      className="w-full h-full object-cover"
                    />
                    {thumbnailUploading && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <Loader2 className="w-8 h-8 animate-spin text-white" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => thumbnailInputRef.current?.click()}
                      >
                        Change
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          setFeaturedImage('');
                          setThumbnailFile(null);
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => thumbnailInputRef.current?.click()}
                    className="w-full aspect-video border-2 border-dashed border-muted-foreground/25 rounded-lg flex flex-col items-center justify-center hover:border-primary/50 hover:bg-muted/30 transition-colors"
                  >
                    <ImageIcon className="w-8 h-8 text-muted-foreground mb-2" />
                    <span className="text-sm text-muted-foreground">Click to upload thumbnail</span>
                    <span className="text-xs text-muted-foreground mt-1">Recommended: 1200x630px</span>
                  </button>
                )}
              </CardContent>
            </Card>

            {/* Category */}
            <Card className="border-border/50 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">
                  Category <span className="text-destructive">*</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {categoriesLoading ? (
                  <Skeleton className="h-10 w-full" />
                ) : (
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
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
            <Card className="border-border/50 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Assign to Group
                </CardTitle>
                <CardDescription className="text-xs">
                  Restrict access to specific user group
                </CardDescription>
              </CardHeader>
              <CardContent>
                {groupsLoading ? (
                  <Skeleton className="h-10 w-full" />
                ) : (
                  <Select value={selectedGroup} onValueChange={setSelectedGroup}>
                    <SelectTrigger>
                      <SelectValue placeholder="Public (no restriction)" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border">
                      <SelectItem value="public">Public (no restriction)</SelectItem>
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
            <Card className="border-border/50 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Tags</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add a tag..."
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                    className="flex-1"
                  />
                  <Button size="icon" onClick={handleAddTag} disabled={!newTag.trim()}>
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

            {/* Quick Stats */}
            <Card className="border-border/50 shadow-sm bg-muted/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Content Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Content Blocks</span>
                    <Badge variant="outline">{contentBlocks.length}</Badge>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Code Blocks</span>
                    <Badge variant="outline">{contentBlocks.filter((b) => b.type === 'code').length}</Badge>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Images</span>
                    <Badge variant="outline">{imageAttachments.length}</Badge>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Videos</span>
                    <Badge variant="outline">{videoAttachments.length}</Badge>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Documents</span>
                    <Badge variant="outline">{documentAttachments.length}</Badge>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Tags</span>
                    <Badge variant="outline">{tags.length}</Badge>
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
