
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
import { useState } from 'react';
import { Input } from '@/components/ui/input';

type Document = {
  id: string;
  name: string;
  type: 'pdf' | 'image' | 'other';
  size: number;
  property_title?: string;
  category: 'lease' | 'receipt' | 'inspection' | 'other';
  uploaded_at: string;
  url: string;
};

type DocumentManagerProps = {
  documents: Document[];
  onUpload: (files: FileList, propertyId?: string) => void;
  onDelete: (documentId: string) => void;
  onPreview: (documentId: string) => void;
  onDownload: (documentId: string) => void;
  storageUsed: number; // in MB
  storageLimit: number; // in MB
};

const DocumentManager = ({ 
  documents, 
  onUpload, 
  onDelete, 
  onPreview, 
  onDownload,
  storageUsed,
  storageLimit
}: DocumentManagerProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'lease' | 'receipt' | 'inspection' | 'other'>('all');

  const getFileIcon = (type: Document['type']) => {
    switch (type) {
      case 'pdf':
        return <FileText className="text-red-500" size={20} />;
      case 'image':
        return <ImageIcon className="text-blue-500" size={20} />;
      default:
        return <FileText className="text-gray-500" size={20} />;
    }
  };

  const getCategoryBadge = (category: Document['category']) => {
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
                         (doc.property_title?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
    const matchesCategory = categoryFilter === 'all' || doc.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const storagePercentage = (storageUsed / storageLimit) * 100;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      onUpload(files);
    }
  };

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
          />
          <label htmlFor="file-upload">
            <Button className="bg-[#0C6E5F] hover:bg-[#0C6E5F]/90" asChild>
              <span className="flex items-center gap-2 cursor-pointer">
                <Upload size={16} />
                Upload Documents
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
                  {getFileIcon(document.type)}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate">{document.name}</h4>
                    <p className="text-xs text-gray-500">{formatFileSize(document.size)}</p>
                  </div>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onPreview(document.id)}
                    className="p-1 h-auto"
                  >
                    <Eye size={12} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDownload(document.id)}
                    className="p-1 h-auto"
                  >
                    <Download size={12} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(document.id)}
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
                
                {document.property_title && (
                  <div className="flex items-center gap-1 text-xs text-gray-600">
                    <FolderOpen size={10} />
                    <span className="truncate">{document.property_title}</span>
                  </div>
                )}
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
                <Button variant="outline" className="cursor-pointer">
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
