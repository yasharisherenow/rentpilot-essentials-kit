
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { CreditCard, Download, ExternalLink, Calendar, DollarSign } from 'lucide-react';

interface SubscriptionData {
  subscribed: boolean;
  subscription_tier: string | null;
  subscription_end: string | null;
  current_period_start: string | null;
  current_period_end: string | null;
  billing_cycle: string;
}

const BillingManagement = () => {
  const { user } = useAuth();
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadSubscriptionData();
    }
  }, [user]);

  const loadSubscriptionData = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('subscribers')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setSubscriptionData({
          subscribed: data.subscribed,
          subscription_tier: data.subscription_tier,
          subscription_end: data.subscription_end,
          current_period_start: data.current_period_start,
          current_period_end: data.current_period_end,
          billing_cycle: data.billing_cycle || 'monthly',
        });
      }
    } catch (error) {
      console.error('Error loading subscription data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleManageBilling = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('customer-portal', {
        headers: {
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        },
      });

      if (error) throw error;

      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Error opening customer portal:', error);
      toast({
        title: "Error",
        description: "Failed to open billing portal",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getPlanDisplayName = (tier: string | null) => {
    if (!tier) return 'Free Plan';
    switch (tier.toLowerCase()) {
      case 'basic':
        return '5 Units Plan';
      case 'premium':
        return '10 Units Plan';
      case 'enterprise':
        return 'Enterprise Plan';
      default:
        return tier;
    }
  };

  const getPlanPrice = (tier: string | null) => {
    if (!tier) return '$0';
    switch (tier.toLowerCase()) {
      case 'basic':
        return '$29';
      case 'premium':
        return '$59';
      case 'enterprise':
        return '$199';
      default:
        return 'Custom';
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-gradient-to-br from-slate-800/60 to-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl shadow-xl">
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-yellow-400 mx-auto"></div>
          <p className="text-slate-400 mt-2">Loading billing information...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Current Plan */}
      <Card className="bg-gradient-to-br from-slate-800/60 to-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl shadow-xl">
        <CardHeader>
          <CardTitle className="text-lg text-white flex items-center gap-2">
            <CreditCard size={20} className="text-yellow-400" />
            Current Plan
          </CardTitle>
          <CardDescription className="text-slate-400">
            Your subscription details and billing information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-white">
                {getPlanDisplayName(subscriptionData?.subscription_tier)}
              </h3>
              <p className="text-slate-400">
                {subscriptionData?.subscribed ? 'Active Subscription' : 'Free Plan'}
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-white">
                {getPlanPrice(subscriptionData?.subscription_tier)}
              </div>
              <p className="text-sm text-slate-400">
                /{subscriptionData?.billing_cycle || 'month'}
              </p>
            </div>
          </div>

          {subscriptionData?.subscribed && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-700/50">
              <div className="space-y-2">
                <Label className="text-slate-400 text-sm">Current Period</Label>
                <div className="flex items-center gap-2 text-white">
                  <Calendar size={16} />
                  <span>{formatDate(subscriptionData.current_period_start)} - {formatDate(subscriptionData.current_period_end)}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-slate-400 text-sm">Next Renewal</Label>
                <div className="flex items-center gap-2 text-white">
                  <DollarSign size={16} />
                  <span>{formatDate(subscriptionData.current_period_end)}</span>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            {subscriptionData?.subscribed ? (
              <Button 
                onClick={handleManageBilling}
                className="flex-1 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-slate-900 font-semibold"
              >
                <ExternalLink size={16} className="mr-2" />
                Manage Billing
              </Button>
            ) : (
              <Button 
                className="flex-1 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-slate-900 font-semibold"
              >
                <CreditCard size={16} className="mr-2" />
                Upgrade Plan
              </Button>
            )}
            
            <Button 
              variant="outline" 
              className="bg-slate-700/50 border-slate-600/50 text-slate-300 hover:bg-slate-600/50 hover:text-white"
            >
              <Download size={16} className="mr-2" />
              Invoices
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Available Plans */}
      <Card className="bg-gradient-to-br from-slate-800/60 to-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl shadow-xl">
        <CardHeader>
          <CardTitle className="text-lg text-white">Available Plans</CardTitle>
          <CardDescription className="text-slate-400">
            Choose the plan that fits your property portfolio
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Free Plan */}
            <div className="p-4 rounded-xl border border-slate-700/50 bg-slate-800/30">
              <div className="text-center">
                <h3 className="font-semibold text-white">Free</h3>
                <div className="text-2xl font-bold text-white mt-2">$0</div>
                <p className="text-slate-400 text-sm">Up to 2 properties</p>
              </div>
              <ul className="mt-4 space-y-2 text-sm text-slate-300">
                <li>• Basic property management</li>
                <li>• Application tracking</li>
                <li>• Email support</li>
              </ul>
              {!subscriptionData?.subscribed && (
                <Badge className="w-full justify-center mt-4 bg-green-500/20 text-green-400 border-green-500/50">
                  Current Plan
                </Badge>
              )}
            </div>

            {/* Basic Plan */}
            <div className="p-4 rounded-xl border border-slate-700/50 bg-slate-800/30">
              <div className="text-center">
                <h3 className="font-semibold text-white">5 Units</h3>
                <div className="text-2xl font-bold text-white mt-2">$29</div>
                <p className="text-slate-400 text-sm">Up to 5 properties</p>
              </div>
              <ul className="mt-4 space-y-2 text-sm text-slate-300">
                <li>• Everything in Free</li>
                <li>• Lease management</li>
                <li>• Payment tracking</li>
                <li>• Priority support</li>
              </ul>
              {subscriptionData?.subscription_tier === 'Basic' ? (
                <Badge className="w-full justify-center mt-4 bg-green-500/20 text-green-400 border-green-500/50">
                  Current Plan
                </Badge>
              ) : (
                <Button className="w-full mt-4 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-slate-900 font-semibold">
                  Upgrade
                </Button>
              )}
            </div>

            {/* Premium Plan */}
            <div className="p-4 rounded-xl border border-slate-700/50 bg-slate-800/30">
              <div className="text-center">
                <h3 className="font-semibold text-white">10 Units</h3>
                <div className="text-2xl font-bold text-white mt-2">$59</div>
                <p className="text-slate-400 text-sm">Up to 10 properties</p>
              </div>
              <ul className="mt-4 space-y-2 text-sm text-slate-300">
                <li>• Everything in 5 Units</li>
                <li>• Advanced analytics</li>
                <li>• Maintenance tracking</li>
                <li>• Phone support</li>
              </ul>
              {subscriptionData?.subscription_tier === 'Premium' ? (
                <Badge className="w-full justify-center mt-4 bg-green-500/20 text-green-400 border-green-500/50">
                  Current Plan
                </Badge>
              ) : (
                <Button className="w-full mt-4 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-slate-900 font-semibold">
                  Upgrade
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const Label = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <label className={className}>{children}</label>
);

export default BillingManagement;
