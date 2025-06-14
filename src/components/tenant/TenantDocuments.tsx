import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  FileText, 
  Upload, 
  Download, 
  Trash2, 
  File,
  Image,
  FileSpreadsheet,
  HardDrive
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';
import { documentService, Document as DocumentType, DocumentCategory } from '@/services/documentService';

const TenantDocuments = () => {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<DocumentType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<DocumentCategory>('other');
  const [storageUsage, setStorageUsage] = useState(0);

  useEffect(() => {
    if (user) {
      fetchDocuments();
      fetchStorageUsage();
    }
  }, [user]);

  const fetchDocuments = async () => {
    try {
      const docs = await documentService.getDocuments();
      setDocuments(docs);
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStorageUsage = async () => {
    try {
      const usage = await documentService.getStorageUsage();
      setStorageUsage(usage);
    } catch (error) {
      console.error('Error fetching storage usage:', error);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select a file smaller than 10MB",
          variant: "destructive",
        });
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    try {
      const documentResult = await documentService.uploadDocument(
        selectedFile,
        selectedCategory
      );

      if (documentResult) {
        setDocuments(prev => [documentResult, ...prev]);
        setSelectedFile(null);
        setSelectedCategory('other');
        fetchStorageUsage();
        
        // Reset file input - using globalThis to access the DOM document
        const fileInput = globalThis.document.getElementById('file-input') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
      }
    } catch (error) {
      console.error('Error uploading document:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownload = async (document: DocumentType) => {
    try {
      const url = await documentService.getDocumentUrl(document.file_path);
      if (url) {
        window.open(url, '_blank');
      } else {
        toast({
          title: "Error",
          description: "Could not generate download link",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error downloading document:', error);
      toast({
        title: "Error",
        description: "Failed to download document",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (document: DocumentType) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      const success = await documentService.deleteDocument(document.id);
      if (success) {
        setDocuments(prev => prev.filter(doc => doc.id !== document.id));
        fetchStorageUsage();
      }
    }
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return <Image size={20} className="text-blue-400" />;
    if (mimeType.includes('pdf')) return <FileText size={20} className="text-red-400" />;
    if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) return <FileSpreadsheet size={20} className="text-green-400" />;
    return <File size={20} className="text-slate-400" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getCategoryColor = (category: DocumentCategory) => {
    switch (category) {
      case 'lease': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      case 'receipt': return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'inspection': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/50';
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-yellow-400"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Storage Usage */}
      <Card className="bg-gradient-to-br from-slate-800/60 to-slate-900/80 border-slate-700/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <HardDrive size={20} className="text-yellow-400" />
            Storage Usage
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Used: {storageUsage} MB</span>
            <span className="text-slate-400">Limit: 100 MB</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2 mt-2">
            <div 
              className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min((storageUsage / 100) * 100, 100)}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Upload Section */}
      <Card className="bg-gradient-to-br from-slate-800/60 to-slate-900/80 border-slate-700/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Upload size={20} className="text-yellow-400" />
            Upload Document
          </CardTitle>
          <CardDescription className="text-slate-400">
            Upload rental documents, receipts, or other important files
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="file-input" className="text-slate-300">Select File</Label>
            <Input
              id="file-input"
              type="file"
              onChange={handleFileSelect}
              className="bg-slate-700/50 border-slate-600 text-white"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.xlsx,.xls"
            />
          </div>

          <div>
            <Label className="text-slate-300">Category</Label>
            <Select value={selectedCategory} onValueChange={(value: DocumentCategory) => setSelectedCategory(value)}>
              <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                <SelectItem value="lease">Lease Documents</SelectItem>
                <SelectItem value="receipt">Receipts</SelectItem>
                <SelectItem value="inspection">Inspection Reports</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {selectedFile && (
            <div className="p-3 bg-slate-700/30 rounded-lg">
              <p className="text-white font-medium">{selectedFile.name}</p>
              <p className="text-slate-400 text-sm">{formatFileSize(selectedFile.size)}</p>
            </div>
          )}

          <Button
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
            className="bg-yellow-500 hover:bg-yellow-600 text-black"
          >
            {isUploading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-black mr-2"></div>
                Uploading...
              </>
            ) : (
              <>
                <Upload size={16} className="mr-2" />
                Upload Document
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Documents List */}
      <Card className="bg-gradient-to-br from-slate-800/60 to-slate-900/80 border-slate-700/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <FileText size={20} className="text-yellow-400" />
            My Documents ({documents.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {documents.length === 0 ? (
            <div className="text-center py-8">
              <FileText size={48} className="mx-auto mb-4 text-slate-600" />
              <p className="text-slate-400">No documents uploaded yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {documents.map((document) => (
                <div
                  key={document.id}
                  className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {getFileIcon(document.mime_type)}
                    <div>
                      <p className="font-medium text-white">{document.name}</p>
                      <div className="flex items-center gap-2 text-sm text-slate-400">
                        <Badge className={getCategoryColor(document.category)}>
                          {document.category}
                        </Badge>
                        <span>{formatFileSize(document.file_size)}</span>
                        <span>{new Date(document.uploaded_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownload(document)}
                      className="border-slate-600 text-slate-300 hover:bg-slate-700/50"
                    >
                      <Download size={14} />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(document)}
                      className="border-red-600 text-red-400 hover:bg-red-500/10"
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TenantDocuments;
