import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Upload, 
  FileText, 
  Image as ImageIcon, 
  Download, 
  Trash2, 
  Eye,
  FolderOpen,
  HardDrive,
  Plus,
  Search
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { documentService, Document, DocumentCategory } from '@/services/documentService';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';

type DocumentManagerProps = {
  onDocumentUploaded?: () => void;
};

const DocumentManager = ({ onDocumentUploaded }: DocumentManagerProps) => {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | DocumentCategory>('all');
  const [storageUsed, setStorageUsed] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const storageLimit = 10240; // 10GB in MB

  useEffect(() => {
    if (user) {
      loadDocuments();
      loadStorageUsage();
    }
  }, [user]);

  const loadDocuments = async () => {
    try {
      setIsLoading(true);
      const docs = await documentService.getDocuments();
      setDocuments(docs);
    } catch (error) {
      console.error('Error loading documents:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadStorageUsage = async () => {
    try {
      const usage = await documentService.getStorageUsage();
      setStorageUsed(usage);
    } catch (error) {
      console.error('Error loading storage usage:', error);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setUploading(true);
    
    try {
      for (const file of Array.from(files)) {
        // Basic file validation
        if (file.size > 50 * 1024 * 1024) { // 50MB limit per file
          toast({
            title: "File too large",
            description: `${file.name} exceeds 50MB limit`,
            variant: "destructive",
          });
          continue;
        }

        // Determine category based on file type
        let category: DocumentCategory = 'other';
        if (file.type.includes('pdf') && file.name.toLowerCase().includes('lease')) {
          category = 'lease';
        } else if (file.name.toLowerCase().includes('receipt')) {
          category = 'receipt';
        } else if (file.name.toLowerCase().includes('inspection')) {
          category = 'inspection';
        }

        await documentService.uploadDocument(file, category);
      }

      await loadDocuments();
      await loadStorageUsage();
      onDocumentUploaded?.();
    } catch (error) {
      console.error('Error uploading files:', error);
    } finally {
      setUploading(false);
      // Reset file input
      e.target.value = '';
    }
  };

  const handleDelete = async (documentId: string) => {
    const success = await documentService.deleteDocument(documentId);
    if (success) {
      await loadDocuments();
      await loadStorageUsage();
    }
  };

  const handlePreview = async (document: Document) => {
    try {
      const url = await documentService.getDocumentUrl(document.file_path);
      if (url) {
        window.open(url, '_blank');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to preview document",
        variant: "destructive",
      });
    }
  };

  const handleDownload = async (document: Document) => {
    try {
      const url = await documentService.getDocumentUrl(document.file_path);
      if (url) {
        const link = document.createElement('a');
        link.href = url;
        link.download = document.original_name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download document",
        variant: "destructive",
      });
    }
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.includes('pdf')) {
      return <FileText className="text-red-500" size={20} />;
    } else if (mimeType.includes('image')) {
      return <ImageIcon className="text-blue-500" size={20} />;
    }
    return <FileText className="text-gray-500" size={20} />;
  };

  const getCategoryBadge = (category: DocumentCategory) => {
    const categoryConfig = {
      lease: { color: 'bg-green-100 text-green-700', label: 'Lease' },
      receipt: { color: 'bg-blue-100 text-blue-700', label: 'Receipt' },
      inspection: { color: 'bg-purple-100 text-purple-700', label: 'Inspection' },
      other: { color: 'bg-gray-100 text-gray-700', label: 'Other' },
    };
    
    const config = categoryConfig[category];
    return (
      <Badge className={`${config.color} border-0 text-xs`}>
        {config.label}
      </Badge>
    );
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.original_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || doc.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const storagePercentage = (storageUsed / storageLimit) * 100;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Document Manager</h2>
          <p className="text-gray-600">Store and organize all your property documents</p>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="file"
            id="file-upload"
            multiple
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
            onChange={handleFileUpload}
            className="hidden"
            disabled={uploading}
          />
          <label htmlFor="file-upload">
            <Button 
              className="bg-[#0C6E5F] hover:bg-[#0C6E5F]/90" 
              asChild
              disabled={uploading}
            >
              <span className="flex items-center gap-2 cursor-pointer">
                <Upload size={16} />
                {uploading ? 'Uploading...' : 'Upload Documents'}
              </span>
            </Button>
          </label>
        </div>
      </div>

      {/* Storage Usage */}
      <Card className="border-0 shadow-md">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <HardDrive size={16} className="text-gray-400" />
              <span className="text-sm font-medium">Storage Usage</span>
            </div>
            <span className="text-sm text-gray-600">
              {storageUsed.toFixed(1)} MB of {storageLimit} MB used
            </span>
          </div>
          <Progress value={storagePercentage} className="h-2" />
          {storagePercentage > 80 && (
            <p className="text-xs text-amber-600 mt-1">
              Storage is {storagePercentage.toFixed(0)}% full. Consider upgrading your plan.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Filters and Search */}
      <Card className="border-0 shadow-md">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="all">All Categories</option>
                <option value="lease">Leases</option>
                <option value="receipt">Receipts</option>
                <option value="inspection">Inspections</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocuments.map(document => (
          <Card key={document.id} className="group hover:shadow-lg transition-all duration-200 border-0 shadow-md">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  {getFileIcon(document.mime_type)}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate">{document.name}</h4>
                    <p className="text-xs text-gray-500">{formatFileSize(document.file_size)}</p>
                  </div>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handlePreview(document)}
                    className="p-1 h-auto"
                  >
                    <Eye size={12} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDownload(document)}
                    className="p-1 h-auto"
                  >
                    <Download size={12} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(document.id)}
                    className="p-1 h-auto text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={12} />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  {getCategoryBadge(document.category)}
                  <span className="text-xs text-gray-500">{formatDate(document.uploaded_at)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredDocuments.length === 0 && (
        <Card className="border-2 border-dashed border-gray-200 rounded-2xl">
          <CardContent className="text-center py-12">
            <Upload size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Documents Found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || categoryFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'Upload your first document to get started'
              }
            </p>
            {!searchTerm && categoryFilter === 'all' && (
              <label htmlFor="file-upload">
                <Button variant="outline" className="cursor-pointer" disabled={uploading}>
                  <Plus size={16} className="mr-2" />
                  Upload Documents
                </Button>
              </label>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DocumentManager;
