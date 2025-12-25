import { useState, useRef, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { RichContentEditor } from '@/components/articles/RichContentEditor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Save,
  Send,
  ArrowLeft,
  BookOpen,
  Loader2,
  Image as ImageIcon,
  MessageSquare,
} from 'lucide-react';
import { ContentBlock } from '@/types/content';
import { 
  useCreateCms, 
  useUpdateCms, 
  useUploadCmsBody, 
  useUploadCmsThumbnail, 
  useCmsById, 
  useSubmitCmsForReview,
  useDownloadCmsBody 
} from '@/api/hooks/useCms';
import { useCategories } from '@/api/hooks/useCategories';
import { cmsService } from '@/api/services/cmsService';

/**
 * Convert content blocks to HTML string
 */
function contentBlocksToHtml(blocks: ContentBlock[]): string {
  return blocks.map(block => {
    switch (block.type) {
      case 'heading1':
        return `<h1>${escapeHtml(block.content)}</h1>`;
      case 'heading2':
        return `<h2>${escapeHtml(block.content)}</h2>`;
      case 'heading3':
        return `<h3>${escapeHtml(block.content)}</h3>`;
      case 'paragraph':
        return `<p>${escapeHtml(block.content)}</p>`;
      case 'quote':
        return `<blockquote>${escapeHtml(block.content)}</blockquote>`;
      case 'code':
        return `<pre><code class="language-${block.codeData?.language || 'plaintext'}">${escapeHtml(block.codeData?.code || '')}</code></pre>`;
      case 'image':
        return `<figure><img src="${block.imageUrl || ''}" alt="${escapeHtml(block.imageAlt || '')}" />${block.imageAlt ? `<figcaption>${escapeHtml(block.imageAlt)}</figcaption>` : ''}</figure>`;
      case 'list':
        return `<ul>${block.listItems?.map(item => `<li>${escapeHtml(item)}</li>`).join('') || ''}</ul>`;
      case 'ordered-list':
        return `<ol>${block.listItems?.map(item => `<li>${escapeHtml(item)}</li>`).join('') || ''}</ol>`;
      case 'divider':
        return '<hr />';
      default:
        return '';
    }
  }).join('\n');
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export default function CourseCreator() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');
  const thumbnailInputRef = useRef<HTMLInputElement>(null);

  // API hooks
  const createCms = useCreateCms();
  const updateCms = useUpdateCms();
  const uploadBody = useUploadCmsBody();
  const uploadThumbnail = useUploadCmsThumbnail();
  const submitForReview = useSubmitCmsForReview();
  const { data: categoriesData, isLoading: categoriesLoading } = useCategories();
  const { data: existingCms, isLoading: cmsLoading } = useCmsById(editId ? parseInt(editId) : 0, !!editId);
  const { data: existingBody } = useDownloadCmsBody(editId ? parseInt(editId) : 0, !!editId && !!existingCms?.bodyLocation);

  const categories = categoriesData || [];

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>([]);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  // Load existing data if editing
  useEffect(() => {
    if (existingCms && !isDataLoaded) {
      setTitle(existingCms.title || '');
      setDescription(existingCms.description || '');
      setCategoryId(existingCms.categoryId?.toString() || '');
      
      // Load thumbnail preview if exists
      if (existingCms.thumbnailLocation) {
        setThumbnailPreview(cmsService.getThumbnailUrl(existingCms.id));
      }
      
      setIsDataLoaded(true);
    }
  }, [existingCms, isDataLoaded]);

  // Parse existing body HTML into content blocks (basic parsing)
  useEffect(() => {
    if (existingBody && isDataLoaded && contentBlocks.length === 0) {
      // For now, we'll just show the HTML - a full parser would be needed for complete round-trip
      console.log('Existing body loaded:', existingBody.substring(0, 100));
    }
  }, [existingBody, isDataLoaded, contentBlocks.length]);

  const handleThumbnailSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setThumbnailFile(file);
      setThumbnailPreview(URL.createObjectURL(file));
    } else {
      toast.error('Please select an image file');
    }
  };

  const handleSave = async (submitForReviewAfter = false) => {
    if (!categoryId) {
      toast.error('Please select a category');
      return;
    }

    setIsSaving(true);
    try {
      let cmsId: number;

      // Create or update CMS record
      if (editId) {
        cmsId = parseInt(editId);
        await updateCms.mutateAsync({
          id: cmsId,
          data: {
            type: 'COURSE',
            categoryId: parseInt(categoryId),
            title: title || undefined,
            description: description || undefined,
          },
        });
      } else {
        const response = await createCms.mutateAsync({
          type: 'COURSE',
          categoryId: parseInt(categoryId),
          title: title || undefined,
          description: description || undefined,
        });
        cmsId = response.id;
      }

      // Generate HTML from content blocks and upload body
      if (contentBlocks.length > 0) {
        const htmlContent = contentBlocksToHtml(contentBlocks);
        await uploadBody.mutateAsync({ id: cmsId, content: htmlContent });
      }

      // Upload thumbnail if selected
      if (thumbnailFile) {
        await uploadThumbnail.mutateAsync({ id: cmsId, file: thumbnailFile });
      }

      // Submit for review if requested
      if (submitForReviewAfter) {
        await submitForReview.mutateAsync({ id: cmsId });
        toast.success('Course submitted for review');
      } else {
        toast.success(editId ? 'Course updated' : 'Course saved as draft');
      }

      navigate('/courses');
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Failed to save course');
    } finally {
      setIsSaving(false);
    }
  };

  const isLoading = editId && cmsLoading;

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-border">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/courses')} className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {editId ? 'Edit Course' : 'Create Course'}
              </h1>
              <p className="text-sm text-muted-foreground">
                Add title, description, category and content
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSave(false)}
              disabled={isSaving || isLoading}
              className="flex-1 sm:flex-none gap-2"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Draft
            </Button>
            <Button
              size="sm"
              onClick={() => handleSave(true)}
              disabled={isSaving || isLoading}
              className="flex-1 sm:flex-none gap-2"
            >
              <Send className="w-4 h-4" />
              Submit for Review
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-60 w-full" />
          </div>
        ) : (
          /* Main Content */
          <div className="grid grid-cols-12 gap-6">
            {/* Editor Area */}
            <div className="col-span-12 lg:col-span-8 space-y-6">
              {/* Basic Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    Course Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Enter course title..."
                      className="text-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Brief description of the course..."
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Category *</Label>
                    {categoriesLoading ? (
                      <Skeleton className="h-10 w-full" />
                    ) : (
                      <Select value={categoryId} onValueChange={setCategoryId}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent className="bg-background border z-50">
                          {categories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id.toString()}>
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Content Editor */}
              <Card>
                <CardHeader>
                  <CardTitle>Content</CardTitle>
                </CardHeader>
                <CardContent>
                  <RichContentEditor
                    blocks={contentBlocks}
                    onChange={setContentBlocks}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="col-span-12 lg:col-span-4 space-y-6">
              {/* Reviewer Comment - shown when editing and has comment */}
              {existingCms?.reviewerComment && (
                <Card className="border-amber-500/50 bg-amber-500/5">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-amber-600">
                      <MessageSquare className="w-5 h-5" />
                      Reviewer Feedback
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-2">
                      From: {existingCms.reviewerName || 'Reviewer'}
                    </p>
                    <p className="text-sm">{existingCms.reviewerComment}</p>
                  </CardContent>
                </Card>
              )}

              {/* Status Badge */}
              {existingCms && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Badge variant={
                      existingCms.status === 'PUBLISHED' ? 'default' :
                      existingCms.status === 'REVIEW' ? 'secondary' : 'outline'
                    }>
                      {existingCms.status}
                    </Badge>
                  </CardContent>
                </Card>
              )}

              {/* Thumbnail */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ImageIcon className="w-5 h-5" />
                    Thumbnail
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <input
                    ref={thumbnailInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleThumbnailSelect}
                  />
                  {thumbnailPreview ? (
                    <div className="relative">
                      <img
                        src={thumbnailPreview}
                        alt="Thumbnail preview"
                        className="w-full aspect-video object-cover rounded-lg"
                      />
                      <Button
                        variant="secondary"
                        size="sm"
                        className="absolute bottom-2 right-2"
                        onClick={() => thumbnailInputRef.current?.click()}
                      >
                        Change
                      </Button>
                    </div>
                  ) : (
                    <div
                      className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors"
                      onClick={() => thumbnailInputRef.current?.click()}
                    >
                      <ImageIcon className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">Click to upload thumbnail</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Content Blocks</span>
                    <span className="font-medium">{contentBlocks.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Category</span>
                    <span className="font-medium">
                      {categories.find(c => c.id.toString() === categoryId)?.name || 'Not selected'}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
