
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  CreditCard, 
  Download, 
  Crown, 
  Check,
  AlertTriangle,
  Calendar,
  Zap,
  RefreshCw
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useSubscription } from '@/hooks/useSubscription';
import { useToast } from '@/hooks/use-toast';

type BillingInfo = {
  currentPlan: 'starter' | 'professional' | 'enterprise' | 'free';
  billingCycle: 'monthly' | 'yearly';
  nextBillingDate?: string;
  currentUsage: {
    properties: number;
    applications: number;
    storage: number; // in MB
  };
  planLimits: {
    properties: number;
    applications: number;
    storage: number; // in MB
  };
  paymentMethod?: {
    type: 'card';
    last4: string;
    brand: string;
    expiryMonth: number;
    expiryYear: number;
  };
};

type BillingSettingsProps = {
  billingInfo: BillingInfo;
  onUpdatePaymentMethod: () => void;
  onViewInvoices: () => void;
  onUpgradePlan: (plan: string) => void;
  onCancelSubscription: () => void;
};

// Mock data for demonstration - in real app this would come from your backend
const mockBillingInfo: BillingInfo = {
  currentPlan: 'starter',
  billingCycle: 'monthly',
  nextBillingDate: '2024-02-15',
  currentUsage: {
    properties: 3,
    applications: 12,
    storage: 256
  },
  planLimits: {
    properties: 5,
    applications: 50,
    storage: 1024
  }
};

const BillingSettings = ({ 
  billingInfo = mockBillingInfo, 
  onUpdatePaymentMethod = () => {}, 
  onViewInvoices = () => {}, 
  onUpgradePlan = () => {},
  onCancelSubscription = () => {}
}: Partial<BillingSettingsProps>) => {
  const [isLoading, setIsLoading] = useState(false);
  const { subscriptionData, loading, checkSubscription, createCheckoutSession, openCustomerPortal } = useSubscription();
  const { toast } = useToast();

  const planConfig = {
    free: {
      name: 'Free',
      price: { monthly: 0, yearly: 0 },
      color: 'bg-gray-50 border-gray-200',
      textColor: 'text-gray-700',
      icon: <Zap className="text-gray-600" size={20} />,
      features: ['Up to 2 properties', 'Basic applications', '500MB storage', 'Email support'],
      priceId: null
    },
    starter: {
      name: 'Starter',
      price: { monthly: 29, yearly: 290 },
      color: 'bg-blue-50 border-blue-200',
      textColor: 'text-blue-700',
      icon: <Zap className="text-blue-600" size={20} />,
      features: ['Up to 5 properties', 'Basic applications', '1GB storage', 'Email support'],
      priceId: 'price_1OtGJzLkdIwHu7ixmNJhJgzx' // Replace with your actual Stripe price ID
    },
    professional: {
      name: 'Professional',
      price: { monthly: 79, yearly: 790 },
      color: 'bg-[#0C6E5F]/10 border-[#0C6E5F]/20',
      textColor: 'text-[#0C6E5F]',
      icon: <Crown className="text-[#0C6E5F]" size={20} />,
      features: ['Up to 25 properties', 'Advanced applications', '10GB storage', 'Priority support', 'Document manager'],
      priceId: 'price_1OtGK0LkdIwHu7ixOzTk5hm2' // Replace with your actual Stripe price ID
    },
    enterprise: {
      name: 'Enterprise',
      price: { monthly: 199, yearly: 1990 },
      color: 'bg-purple-50 border-purple-200',
      textColor: 'text-purple-700',
      icon: <Crown className="text-purple-600" size={20} />,
      features: ['Unlimited properties', 'Full feature access', 'Unlimited storage', '24/7 support', 'Custom integrations'],
      priceId: 'price_1OtGK1LkdIwHu7ixvJgH5mzP' // Replace with your actual Stripe price ID
    }
  };

  const currentPlan = subscriptionData.subscribed && subscriptionData.subscription_tier 
    ? subscriptionData.subscription_tier as keyof typeof planConfig
    : 'free';
  const currentPlanConfig = planConfig[currentPlan];
  const currentPrice = currentPlanConfig.price[billingInfo?.billingCycle || 'monthly'];

  const getUsagePercentage = (used: number, limit: number) => {
    return limit === -1 ? 0 : (used / limit) * 100;
  };

  const formatDate = (dateString?: string) => {
    return dateString ? new Date(dateString).toLocaleDateString() : 'N/A';
  };

  const handleUpgrade = async (planKey: string) => {
    const plan = planConfig[planKey as keyof typeof planConfig];
    if (!plan.priceId) {
      toast({
        title: "Error",
        description: "Price ID not configured for this plan",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await createCheckoutSession(plan.priceId, plan.name);
    } finally {
      setIsLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    if (!subscriptionData.subscribed) {
      toast({
        title: "No Active Subscription",
        description: "You need an active subscription to access the customer portal",
        variant: "destructive",
      });
      return;
    }
    await openCustomerPortal();
  };

  useEffect(() => {
    // Check subscription status when component mounts
    checkSubscription();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Billing & Subscription</h2>
          <p className="text-gray-600">Manage your subscription and billing information</p>
        </div>
        <Button 
          onClick={checkSubscription} 
          disabled={loading}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh Status
        </Button>
      </div>

      {/* Current Plan */}
      <Card className={`border-2 ${currentPlanConfig.color} shadow-md`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {currentPlanConfig.icon}
              <div>
                <CardTitle className={`text-lg ${currentPlanConfig.textColor}`}>
                  {currentPlanConfig.name} Plan
                </CardTitle>
                <p className="text-sm text-gray-600">
                  ${currentPrice}/{(billingInfo?.billingCycle || 'monthly') === 'yearly' ? 'year' : 'month'}
                  {(billingInfo?.billingCycle || 'monthly') === 'yearly' && currentPrice > 0 && (
                    <Badge className="ml-2 bg-green-100 text-green-700 border-0">
                      Save 17%
                    </Badge>
                  )}
                </p>
              </div>
            </div>
            <Badge className={`${currentPlanConfig.textColor} bg-transparent border-current`}>
              Current Plan
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Properties</span>
                <span className="text-sm text-gray-600">
                  {billingInfo?.currentUsage.properties || 0}/{billingInfo?.planLimits.properties === -1 ? '∞' : billingInfo?.planLimits.properties || 0}
                </span>
              </div>
              <Progress 
                value={getUsagePercentage(billingInfo?.currentUsage.properties || 0, billingInfo?.planLimits.properties || 0)} 
                className="h-2" 
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Applications</span>
                <span className="text-sm text-gray-600">
                  {billingInfo?.currentUsage.applications || 0}/{billingInfo?.planLimits.applications === -1 ? '∞' : billingInfo?.planLimits.applications || 0}
                </span>
              </div>
              <Progress 
                value={getUsagePercentage(billingInfo?.currentUsage.applications || 0, billingInfo?.planLimits.applications || 0)} 
                className="h-2" 
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Storage</span>
                <span className="text-sm text-gray-600">
                  {((billingInfo?.currentUsage.storage || 0) / 1024).toFixed(1)}GB/{(billingInfo?.planLimits.storage || 0) === -1 ? '∞' : ((billingInfo?.planLimits.storage || 0) / 1024).toFixed(0)}GB
                </span>
              </div>
              <Progress 
                value={getUsagePercentage(billingInfo?.currentUsage.storage || 0, billingInfo?.planLimits.storage || 0)} 
                className="h-2" 
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Method & Billing */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard size={20} />
              Payment Method
            </CardTitle>
          </CardHeader>
          <CardContent>
            {subscriptionData.subscribed ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar size={14} />
                  <span>Next billing date: {formatDate(subscriptionData.subscription_end)}</span>
                </div>
                <Button onClick={handleManageSubscription} className="w-full bg-[#0C6E5F] hover:bg-[#0C6E5F]/90">
                  Manage Subscription
                </Button>
              </div>
            ) : (
              <div className="text-center py-4">
                <AlertTriangle size={32} className="mx-auto text-amber-500 mb-2" />
                <p className="text-sm text-gray-600 mb-3">No active subscription</p>
                <p className="text-xs text-gray-500">Subscribe to a plan to manage payment methods</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download size={20} />
              Billing History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button variant="outline" onClick={handleManageSubscription} className="w-full">
                View All Invoices
              </Button>
              <div className="text-center">
                <p className="text-sm text-gray-500">Access billing history through the customer portal</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upgrade Options */}
      {currentPlan !== 'enterprise' && (
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle>Upgrade Your Plan</CardTitle>
            <p className="text-gray-600">Get more features and higher limits</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(planConfig).map(([key, plan]) => {
                if (key === currentPlan || key === 'free') return null;
                
                return (
                  <div key={key} className={`p-4 rounded-lg border-2 ${plan.color}`}>
                    <div className="flex items-center gap-2 mb-3">
                      {plan.icon}
                      <h3 className={`font-semibold ${plan.textColor}`}>{plan.name}</h3>
                    </div>
                    <div className="mb-3">
                      <span className="text-2xl font-bold">${plan.price.monthly}</span>
                      <span className="text-gray-600">/month</span>
                    </div>
                    <ul className="space-y-1 mb-4">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm">
                          <Check size={14} className="text-green-500" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      onClick={() => handleUpgrade(key)}
                      disabled={isLoading || loading}
                      className="w-full bg-[#0C6E5F] hover:bg-[#0C6E5F]/90"
                    >
                      {isLoading || loading ? 'Loading...' : `Upgrade to ${plan.name}`}
                    </Button>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Danger Zone */}
      {subscriptionData.subscribed && (
        <Card className="border-red-200 shadow-md">
          <CardHeader>
            <CardTitle className="text-red-700">Danger Zone</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-red-700">Cancel Subscription</h4>
                <p className="text-sm text-gray-600">Manage your subscription through the customer portal</p>
              </div>
              <Button variant="outline" onClick={handleManageSubscription} className="border-red-300 text-red-700 hover:bg-red-50">
                Manage Subscription
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BillingSettings;
