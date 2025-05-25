
import { Badge } from '@/components/ui/badge';

interface SubscriptionInfoProps {
  subscriptionPlan?: string;
  accountCreatedAt?: string;
}

const SubscriptionInfo = ({ subscriptionPlan, accountCreatedAt }: SubscriptionInfoProps) => {
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

  return (
    <div className="space-y-2">
      <h3 className="font-medium">Current Subscription</h3>
      {getSubscriptionBadge(subscriptionPlan || 'free')}
      {accountCreatedAt && (
        <p className="text-sm text-gray-500">
          Member since {new Date(accountCreatedAt).toLocaleDateString()}
        </p>
      )}
    </div>
  );
};

export default SubscriptionInfo;
