
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';
import { User, Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';

type AccountFormData = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
};

const AccountManagement = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { user, profile, signOut } = useAuth();

  const form = useForm<AccountFormData>({
    defaultValues: {
      first_name: profile?.first_name || '',
      last_name: profile?.last_name || '',
      email: profile?.email || '',
      phone: profile?.phone || '',
    },
  });

  const getSubscriptionBadge = (plan: string) => {
    switch (plan) {
      case 'pro':
        return <Badge className="bg-blue-500">Pro Plan</Badge>;
      case 'premium':
        return <Badge className="bg-purple-500">Premium Plan</Badge>;
      default:
        return <Badge variant="outline">Free Plan</Badge>;
    }
  };

  const onSubmit = async (data: AccountFormData) => {
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

      setIsOpen(false);
    } catch (error: any) {
      console.error('Error updating account:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update account",
        variant: "destructive",
      });
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

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">
          <User className="mr-2" size={16} />
          Manage Account
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Account Management</DialogTitle>
          <DialogDescription>
            Update your account information and manage your subscription
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Subscription Info */}
          <div className="space-y-2">
            <h3 className="font-medium">Current Subscription</h3>
            {getSubscriptionBadge((profile as any)?.subscription_plan || 'free')}
            {(profile as any)?.account_created_at && (
              <p className="text-sm text-gray-500">
                Member since {new Date((profile as any).account_created_at).toLocaleDateString()}
              </p>
            )}
          </div>

          {/* Account Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="first_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="last_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="john@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="(555) 123-4567" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isLoading} className="w-full bg-rentpilot-600 hover:bg-rentpilot-700">
                {isLoading ? 'Updating...' : 'Update Account'}
              </Button>
            </form>
          </Form>

          {/* Danger Zone */}
          <div className="border-t pt-6">
            <h3 className="font-medium text-red-600 mb-2">Danger Zone</h3>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full">
                  <Trash2 className="mr-2" size={16} />
                  Delete Account
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your account,
                    all your properties, leases, and remove all associated data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteAccount}
                    disabled={isDeleting}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    {isDeleting ? 'Deleting...' : 'Yes, delete my account'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AccountManagement;
