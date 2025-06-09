
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import { useSubscription } from '@/hooks/useSubscription';
import { CreditCard, ExternalLink, RefreshCw } from 'lucide-react';

const SubscriptionManagement = () => {
  const { profile } = useAuth();
  const { subscriptionData, loading, checkSubscription, openCustomerPortal } = useSubscription();

  const handleRefreshSubscription = async () => {
    await checkSubscription();
  };

  const handleManageBilling = async () => {
    await openCustomerPortal();
  };

  const getStatusBadge = () => {
    if (subscriptionData.subscribed) {
      return <Badge className="bg-green-600/20 text-green-400 border-green-600/50">Active</Badge>;
    }
    return <Badge variant="outline" className="border-slate-600/50 text-slate-400">Free Plan</Badge>;
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      {/* Current Plan */}
      <Card className="bg-gradient-to-br from-slate-800/60 to-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl shadow-xl">
        <CardHeader>
          <CardTitle className="text-lg text-white flex items-center gap-2">
            <CreditCard size={20} className="text-yellow-400" />
            Current Subscription
          </CardTitle>
          <CardDescription className="text-slate-400">
            View and manage your subscription details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-300 font-medium">Plan Status</p>
              <div className="flex items-center gap-2 mt-1">
                {getStatusBadge()}
                {subscriptionData.subscription_tier && (
                  <span className="text-sm text-slate-400">
                    {subscriptionData.subscription_tier} Plan
                  </span>
                )}
              </div>
            </div>
            <Button 
              onClick={handleRefreshSubscription}
              disabled={loading}
              variant="outline"
              size="sm"
              className="border-slate-600/50 text-slate-300 hover:bg-slate-700/50"
            >
              <RefreshCw size={14} className="mr-1" />
              Refresh
            </Button>
          </div>

          {subscriptionData.subscribed && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-700/50">
              <div>
                <p className="text-slate-400 text-sm">Current Period Start</p>
                <p className="text-slate-300">{formatDate(subscriptionData.current_period_start)}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Current Period End</p>
                <p className="text-slate-300">{formatDate(subscriptionData.current_period_end)}</p>
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-slate-700/50">
            <Button 
              onClick={handleManageBilling}
              disabled={loading}
              className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-slate-900 font-semibold"
            >
              <ExternalLink size={16} className="mr-2" />
              {subscriptionData.subscribed ? 'Manage Billing' : 'Upgrade Plan'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Account Information */}
      <Card className="bg-gradient-to-br from-slate-800/60 to-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl shadow-xl">
        <CardHeader>
          <CardTitle className="text-lg text-white">Account Information</CardTitle>
          <CardDescription className="text-slate-400">
            Basic account details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-slate-400 text-sm">Account Created</p>
              <p className="text-slate-300">{formatDate(profile?.created_at || null)}</p>
            </div>
            <div>
              <p className="text-slate-400 text-sm">Account Type</p>
              <p className="text-slate-300 capitalize">{profile?.role || 'Landlord'}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubscriptionManagement;
