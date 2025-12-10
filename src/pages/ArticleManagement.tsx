import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ArticleEditor } from '@/components/articles/ArticleEditor';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { mockArticles } from '@/data/mockContent';
import { Article } from '@/types/content';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Plus, Pencil, Eye, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

export default function ArticleManagement() {
  const [articles] = useState(mockArticles);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredArticles = articles.filter(a => 
    a.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (selectedArticle) {
    return (
      <DashboardLayout>
        <Button variant="ghost" onClick={() => setSelectedArticle(null)} className="mb-4">← Back to Articles</Button>
        <ArticleEditor article={selectedArticle} onSave={() => setSelectedArticle(null)} onWorkflowAction={() => {}} />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Article Management</h1>
            <p className="text-muted-foreground">Create, edit, and publish articles with SEO optimization.</p>
          </div>
          <Button><Plus className="w-4 h-4 mr-2" />Create Article</Button>
        </div>

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search articles..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9" />
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Updated</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredArticles.map(article => (
                  <TableRow key={article.id}>
                    <TableCell className="font-medium">{article.title}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{article.categoryPath.join(' / ')}</TableCell>
                    <TableCell>{article.author}</TableCell>
                    <TableCell><StatusBadge status={article.status} size="sm" /></TableCell>
                    <TableCell className="text-sm text-muted-foreground">{format(new Date(article.updatedAt), 'PP')}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSelectedArticle(article)}><Pencil className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8"><Eye className="w-4 h-4" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
