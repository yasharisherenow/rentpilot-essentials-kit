import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export type DocumentCategory = 'lease' | 'receipt' | 'inspection' | 'other';

export interface Document {
  id: string;
  name: string;
  original_name: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  category: DocumentCategory;
  property_id?: string;
  uploaded_at: string;
  updated_at: string;
}

export const documentService = {
  async uploadDocument(
    file: File, 
    category: DocumentCategory, 
    propertyId?: string
  ): Promise<Document | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Create file path with user ID folder structure
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      // Upload file to storage
      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Save document metadata to database
      const { data, error } = await supabase
        .from('documents')
        .insert({
          user_id: user.id,
          name: file.name.replace(/\.[^/.]+$/, ''), // Remove extension for display
          original_name: file.name,
          file_path: filePath,
          file_size: file.size,
          mime_type: file.type,
          category,
          property_id: propertyId
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Document uploaded successfully",
      });

      // Type cast the result to ensure proper types
      return {
        id: data.id,
        name: data.name,
        original_name: data.original_name,
        file_path: data.file_path,
        file_size: data.file_size,
        mime_type: data.mime_type,
        category: data.category as DocumentCategory,
        property_id: data.property_id,
        uploaded_at: data.uploaded_at,
        updated_at: data.updated_at
      };
    } catch (error) {
      console.error('Error uploading document:', error);
      toast({
        title: "Error",
        description: "Failed to upload document",
        variant: "destructive",
      });
      return null;
    }
  },

  async getDocuments(): Promise<Document[]> {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .order('uploaded_at', { ascending: false });

      if (error) throw error;
      
      // Type cast the database results to ensure proper types
      return (data || []).map(item => ({
        id: item.id,
        name: item.name,
        original_name: item.original_name,
        file_path: item.file_path,
        file_size: item.file_size,
        mime_type: item.mime_type,
        category: item.category as DocumentCategory,
        property_id: item.property_id,
        uploaded_at: item.uploaded_at,
        updated_at: item.updated_at
      }));
    } catch (error) {
      console.error('Error fetching documents:', error);
      return [];
    }
  },

  async deleteDocument(id: string): Promise<boolean> {
    try {
      // First get the document to find the file path
      const { data: document, error: fetchError } = await supabase
        .from('documents')
        .select('file_path')
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('documents')
        .remove([document.file_path]);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from('documents')
        .delete()
        .eq('id', id);

      if (dbError) throw dbError;

      toast({
        title: "Success",
        description: "Document deleted successfully",
      });

      return true;
    } catch (error) {
      console.error('Error deleting document:', error);
      toast({
        title: "Error",
        description: "Failed to delete document",
        variant: "destructive",
      });
      return false;
    }
  },

  async getDocumentUrl(filePath: string): Promise<string | null> {
    try {
      const { data } = await supabase.storage
        .from('documents')
        .createSignedUrl(filePath, 3600); // 1 hour expiry

      return data?.signedUrl || null;
    } catch (error) {
      console.error('Error getting document URL:', error);
      return null;
    }
  },

  async getStorageUsage(): Promise<number> {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('file_size');

      if (error) throw error;

      const totalBytes = data?.reduce((sum, doc) => sum + doc.file_size, 0) || 0;
      return Math.round(totalBytes / (1024 * 1024)); // Convert to MB
    } catch (error) {
      console.error('Error calculating storage usage:', error);
      return 0;
    }
  }
};
