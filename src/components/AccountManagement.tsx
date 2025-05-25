
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useAccountManagement } from '@/hooks/useAccountManagement';
import SubscriptionInfo from './account/SubscriptionInfo';
import AccountForm from './account/AccountForm';
import DeleteAccountSection from './account/DeleteAccountSection';

const AccountManagement = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { profile } = useAuth();
  const { isLoading, isDeleting, handleUpdateAccount, handleDeleteAccount } = useAccountManagement();

  const onSubmit = async (data: any) => {
    const success = await handleUpdateAccount(data);
    if (success) {
      setIsOpen(false);
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
          <SubscriptionInfo 
            subscriptionPlan={(profile as any)?.subscription_plan}
            accountCreatedAt={(profile as any)?.account_created_at}
          />

          <AccountForm 
            profile={profile}
            onSubmit={onSubmit}
            isLoading={isLoading}
          />

          <DeleteAccountSection 
            onDeleteAccount={handleDeleteAccount}
            isDeleting={isDeleting}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AccountManagement;
