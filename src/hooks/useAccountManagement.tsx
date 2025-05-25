
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';

type AccountFormData = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
};

export const useAccountManagement = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { user, profile, signOut } = useAuth();

  const handleUpdateAccount = async (data: AccountFormData) => {
    if (!user) return;

    setIsLoading(true);
    try {
      // Update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          first_name: data.first_name,
          last_name: data.last_name,
          phone: data.phone,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (profileError) throw profileError;

      // Update auth email if changed
      if (data.email !== profile?.email) {
        const { error: emailError } = await supabase.auth.updateUser({
          email: data.email
        });

        if (emailError) throw emailError;

        toast({
          title: "Email Update",
          description: "Please check your new email for a confirmation link",
        });
      }

      toast({
        title: "Success",
        description: "Account updated successfully",
      });

      return true;
    } catch (error: any) {
      console.error('Error updating account:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update account",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;

    setIsDeleting(true);
    try {
      // Delete user's data first (due to foreign key constraints)
      const { data: userLeases } = await supabase
        .from('leases')
        .select('id')
        .eq('landlord_id', user.id);

      if (userLeases && userLeases.length > 0) {
        const leaseIds = userLeases.map(lease => lease.id);
        await supabase.from('lease_tenants').delete().in('lease_id', leaseIds);
      }
      
      await supabase.from('leases').delete().eq('landlord_id', user.id);
      await supabase.from('applications').delete().eq('tenant_id', user.id);
      await supabase.from('properties').delete().eq('landlord_id', user.id);
      await supabase.from('profiles').delete().eq('id', user.id);

      // Delete auth user - Note: This requires admin privileges in production
      // In a real app, this would be handled by a server-side function
      toast({
        title: "Account Deletion",
        description: "Your account data has been deleted. Please contact support to complete account deletion.",
      });

      signOut();
    } catch (error: any) {
      console.error('Error deleting account:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete account",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    isLoading,
    isDeleting,
    handleUpdateAccount,
    handleDeleteAccount,
  };
};
