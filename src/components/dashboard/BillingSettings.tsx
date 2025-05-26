
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
  DollarSign,
  Zap
} from 'lucide-react';
import { useState } from 'react';

type BillingInfo = {
  currentPlan: 'starter' | 'professional' | 'enterprise';
  billingCycle: 'monthly' | 'yearly';
  nextBillingDate: string;
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

const BillingSettings = ({ 
  billingInfo, 
  onUpdatePaymentMethod, 
  onViewInvoices, 
  onUpgradePlan,
  onCancelSubscription
}: BillingSettingsProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const planConfig = {
    starter: {
      name: 'Starter',
      price: { monthly: 29, yearly: 290 },
      color: 'bg-blue-50 border-blue-200',
      textColor: 'text-blue-700',
      icon: <Zap className="text-blue-600" size={20} />,
      features: ['Up to 5 properties', 'Basic applications', '1GB storage', 'Email support']
    },
    professional: {
      name: 'Professional',
      price: { monthly: 79, yearly: 790 },
      color: 'bg-[#0C6E5F]/10 border-[#0C6E5F]/20',
      textColor: 'text-[#0C6E5F]',
      icon: <Crown className="text-[#0C6E5F]" size={20} />,
      features: ['Up to 25 properties', 'Advanced applications', '10GB storage', 'Priority support', 'Document manager']
    },
    enterprise: {
      name: 'Enterprise',
      price: { monthly: 199, yearly: 1990 },
      color: 'bg-purple-50 border-purple-200',
      textColor: 'text-purple-700',
      icon: <Crown className="text-purple-600" size={20} />,
      features: ['Unlimited properties', 'Full feature access', 'Unlimited storage', '24/7 support', 'Custom integrations']
    }
  };

  const currentPlanConfig = planConfig[billingInfo.currentPlan];
  const currentPrice = currentPlanConfig.price[billingInfo.billingCycle];

  const getUsagePercentage = (used: number, limit: number) => {
    return limit === -1 ? 0 : (used / limit) * 100;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const handleUpgrade = async (plan: string) => {
    setIsLoading(true);
    try {
      await onUpgradePlan(plan);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Billing & Subscription</h2>
          <p className="text-gray-600">Manage your subscription and billing information</p>
        </div>
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
                  ${currentPrice}/{billingInfo.billingCycle === 'yearly' ? 'year' : 'month'}
                  {billingInfo.billingCycle === 'yearly' && (
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
                  {billingInfo.currentUsage.properties}/{billingInfo.planLimits.properties === -1 ? '∞' : billingInfo.planLimits.properties}
                </span>
              </div>
              <Progress 
                value={getUsagePercentage(billingInfo.currentUsage.properties, billingInfo.planLimits.properties)} 
                className="h-2" 
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Applications</span>
                <span className="text-sm text-gray-600">
                  {billingInfo.currentUsage.applications}/{billingInfo.planLimits.applications === -1 ? '∞' : billingInfo.planLimits.applications}
                </span>
              </div>
              <Progress 
                value={getUsagePercentage(billingInfo.currentUsage.applications, billingInfo.planLimits.applications)} 
                className="h-2" 
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Storage</span>
                <span className="text-sm text-gray-600">
                  {(billingInfo.currentUsage.storage / 1024).toFixed(1)}GB/{billingInfo.planLimits.storage === -1 ? '∞' : (billingInfo.planLimits.storage / 1024).toFixed(0)}GB
                </span>
              </div>
              <Progress 
                value={getUsagePercentage(billingInfo.currentUsage.storage, billingInfo.planLimits.storage)} 
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
            {billingInfo.paymentMethod ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded text-white text-xs flex items-center justify-center font-bold">
                      {billingInfo.paymentMethod.brand.toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium">•••• •••• •••• {billingInfo.paymentMethod.last4}</p>
                      <p className="text-sm text-gray-500">
                        Expires {billingInfo.paymentMethod.expiryMonth}/{billingInfo.paymentMethod.expiryYear}
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={onUpdatePaymentMethod}>
                    Update
                  </Button>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar size={14} />
                  <span>Next billing date: {formatDate(billingInfo.nextBillingDate)}</span>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <AlertTriangle size={32} className="mx-auto text-amber-500 mb-2" />
                <p className="text-sm text-gray-600 mb-3">No payment method on file</p>
                <Button onClick={onUpdatePaymentMethod} className="bg-[#0C6E5F] hover:bg-[#0C6E5F]/90">
                  Add Payment Method
                </Button>
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
              <Button variant="outline" onClick={onViewInvoices} className="w-full">
                View All Invoices
              </Button>
              <div className="text-center">
                <p className="text-sm text-gray-500">Download receipts and manage billing history</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upgrade Options */}
      {billingInfo.currentPlan !== 'enterprise' && (
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle>Upgrade Your Plan</CardTitle>
            <p className="text-gray-600">Get more features and higher limits</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(planConfig).map(([key, plan]) => {
                if (key === billingInfo.currentPlan) return null;
                
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
                      disabled={isLoading}
                      className="w-full bg-[#0C6E5F] hover:bg-[#0C6E5F]/90"
                    >
                      Upgrade to {plan.name}
                    </Button>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Danger Zone */}
      <Card className="border-red-200 shadow-md">
        <CardHeader>
          <CardTitle className="text-red-700">Danger Zone</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-red-700">Cancel Subscription</h4>
              <p className="text-sm text-gray-600">Permanently cancel your subscription and lose access to all features</p>
            </div>
            <Button variant="outline" onClick={onCancelSubscription} className="border-red-300 text-red-700 hover:bg-red-50">
              Cancel Subscription
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BillingSettings;
