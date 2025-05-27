
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckIcon, Calculator } from 'lucide-react';
import { Link } from 'react-router-dom';

const PricingPage = () => {
  const [enterpriseUnits, setEnterpriseUnits] = useState(11);

  const calculateEnterprisePrice = (units: number) => {
    if (units <= 10) return 19.99;
    return units * 1.60;
  };

  const plans = [
    {
      name: 'Starter',
      price: '$9.99',
      billingPeriod: 'per month',
      description: 'Perfect for small landlords with up to 5 properties',
      features: [
        'Manage up to 5 properties',
        'Digital tenant applications',
        'Basic lease documents',
        'Email support',
        'Property listing management'
      ],
      cta: 'Start Free Trial',
      popular: false,
      units: '5 units'
    },
    {
      name: 'Professional',
      price: '$19.99',
      billingPeriod: 'per month',
      description: 'For landlords managing multiple properties',
      features: [
        'Manage up to 10 properties',
        'Digital tenant applications',
        'Advanced lease documents',
        'Tenant screening tools',
        'Payment reminders',
        'Priority email support',
        '24/7 phone support',
        'Analytics dashboard'
      ],
      cta: 'Start Free Trial',
      popular: true,
      units: '10 units'
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      billingPeriod: 'pricing',
      description: 'For property management companies',
      features: [
        'Unlimited properties',
        'All Professional features',
        'Custom document templates',
        'API access',
        'Team accounts',
        'Advanced analytics',
        'Dedicated account manager',
        'White-label options'
      ],
      cta: 'Contact Us',
      popular: false,
      units: '11+ units'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-950 to-black" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,213,0,0.05),transparent_50%)]" />
      </div>

      <div className="relative z-10 container mx-auto py-16 px-4">
        <div className="text-center mb-16 animate-fade-up">
          <h1 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-white via-yellow-200 to-yellow-400 bg-clip-text text-transparent drop-shadow-2xl">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Choose the plan that fits your portfolio size. All plans come with a 14-day free trial and no setup fees.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3 max-w-7xl mx-auto mb-16">
          {plans.map((plan, index) => (
            <Card 
              key={index} 
              className={`flex flex-col relative overflow-hidden transition-all duration-500 hover:scale-105 hover:shadow-2xl animate-fade-up group bg-gradient-to-br from-slate-800/50 to-slate-900/80 backdrop-blur-sm border ${
                plan.popular 
                  ? 'border-yellow-500/50 shadow-xl shadow-yellow-500/20' 
                  : 'border-slate-700/50 hover:border-yellow-500/30'
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
              {plan.popular && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-500 to-yellow-600"></div>
              )}
              {plan.popular && (
                <span className="absolute top-4 right-4 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black text-xs font-bold py-1 px-3 rounded-full shadow-lg shadow-yellow-500/30">
                  MOST POPULAR
                </span>
              )}
              <CardHeader className="pb-8 pt-8 relative z-10">
                <div className="flex items-center justify-between mb-2">
                  <CardTitle className="text-2xl font-bold text-white">{plan.name}</CardTitle>
                  <span className="text-sm font-medium text-yellow-400 bg-yellow-500/20 px-2 py-1 rounded-full border border-yellow-500/30">
                    {plan.units}
                  </span>
                </div>
                <div className="mt-4">
                  <span className="text-4xl font-bold bg-gradient-to-r from-white to-yellow-200 bg-clip-text text-transparent">
                    {plan.price}
                  </span>
                  <span className="text-slate-400 ml-2">{plan.billingPeriod}</span>
                </div>
                <CardDescription className="mt-3 text-base leading-relaxed text-slate-300">
                  {plan.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow relative z-10">
                <ul className="space-y-4">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start group/item">
                      <CheckIcon className="h-5 w-5 text-yellow-400 mr-3 flex-shrink-0 mt-0.5 transition-transform group-hover/item:scale-110 drop-shadow-lg" />
                      <span className="text-slate-200">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="pt-8 relative z-10">
                <Button
                  className={`w-full transition-all duration-300 font-semibold ${
                    plan.popular
                      ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black shadow-lg shadow-yellow-500/30 hover:shadow-yellow-500/50 hover:scale-105'
                      : 'bg-slate-800/50 border-slate-600 text-white hover:bg-yellow-500/10 hover:border-yellow-500/50 hover:text-yellow-400'
                  }`}
                  variant={plan.popular ? 'default' : 'outline'}
                  asChild
                  size="lg"
                >
                  <Link to="/auth" className="font-semibold">
                    {plan.cta}
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Enterprise Calculator */}
        <div className="max-w-2xl mx-auto mb-16 animate-fade-up" style={{ animationDelay: '0.4s' }}>
          <Card className="bg-gradient-to-br from-slate-800/60 to-slate-900/80 backdrop-blur-sm border-2 border-dashed border-slate-600 hover:border-yellow-500/50 transition-all duration-500 hover:shadow-xl hover:shadow-yellow-500/10">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-yellow-500/30">
                <Calculator className="h-6 w-6 text-black" />
              </div>
              <CardTitle className="text-2xl font-bold text-white">Enterprise Calculator</CardTitle>
              <CardDescription className="text-lg text-slate-300">
                Calculate your custom pricing for 11+ units at $1.60 per unit
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="units" className="text-sm font-medium text-slate-300">
                  Number of Properties/Units
                </Label>
                <Input
                  id="units"
                  type="number"
                  min="11"
                  value={enterpriseUnits}
                  onChange={(e) => setEnterpriseUnits(Math.max(11, parseInt(e.target.value) || 11))}
                  className="text-lg font-semibold text-center border-2 bg-slate-800/50 border-slate-600 focus:border-yellow-500 text-white"
                />
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-slate-700/50 to-slate-800/50 rounded-lg border-2 border-yellow-500/30 shadow-lg shadow-yellow-500/10">
                <div className="text-3xl font-bold text-yellow-400 mb-2 text-glow">
                  ${calculateEnterprisePrice(enterpriseUnits).toFixed(2)}
                </div>
                <div className="text-sm text-slate-300">per month</div>
                <div className="text-xs text-slate-400 mt-1">
                  ${(calculateEnterprisePrice(enterpriseUnits) / enterpriseUnits).toFixed(2)} per unit
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black font-semibold shadow-lg shadow-yellow-500/30 hover:shadow-yellow-500/50 transition-all duration-300 hover:scale-105"
                asChild
                size="lg"
              >
                <Link to="/contact">Get Enterprise Quote</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* FAQ Section */}
        <div className="mt-20 text-center max-w-4xl mx-auto animate-fade-up" style={{ animationDelay: '0.5s' }}>
          <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-white to-yellow-200 bg-clip-text text-transparent">Frequently Asked Questions</h2>
          <div className="grid gap-8 md:grid-cols-2 text-left">
            <div className="p-6 bg-gradient-to-br from-slate-800/60 to-slate-900/80 backdrop-blur-sm rounded-xl border border-slate-700/50 hover:border-yellow-500/30 hover:shadow-lg hover:shadow-yellow-500/10 transition-all duration-300">
              <h3 className="text-lg font-semibold mb-3 text-white">Can I switch plans later?</h3>
              <p className="text-slate-300 leading-relaxed">
                Yes, you can upgrade or downgrade your plan at any time. Changes will take effect on your next billing cycle, and we'll prorate any differences.
              </p>
            </div>
            <div className="p-6 bg-gradient-to-br from-slate-800/60 to-slate-900/80 backdrop-blur-sm rounded-xl border border-slate-700/50 hover:border-yellow-500/30 hover:shadow-lg hover:shadow-yellow-500/10 transition-all duration-300">
              <h3 className="text-lg font-semibold mb-3 text-white">Is there a long-term contract?</h3>
              <p className="text-slate-300 leading-relaxed">
                No, all plans are month-to-month and you can cancel at any time without penalty. Your data remains accessible for 30 days after cancellation.
              </p>
            </div>
            <div className="p-6 bg-gradient-to-br from-slate-800/60 to-slate-900/80 backdrop-blur-sm rounded-xl border border-slate-700/50 hover:border-yellow-500/30 hover:shadow-lg hover:shadow-yellow-500/10 transition-all duration-300">
              <h3 className="text-lg font-semibold mb-3 text-white">What payment methods do you accept?</h3>
              <p className="text-slate-300 leading-relaxed">
                We accept all major credit cards including Visa, Mastercard, American Express, and Discover. Enterprise customers can also pay by ACH transfer.
              </p>
            </div>
            <div className="p-6 bg-gradient-to-br from-slate-800/60 to-slate-900/80 backdrop-blur-sm rounded-xl border border-slate-700/50 hover:border-yellow-500/30 hover:shadow-lg hover:shadow-yellow-500/10 transition-all duration-300">
              <h3 className="text-lg font-semibold mb-3 text-white">How secure is my data?</h3>
              <p className="text-slate-300 leading-relaxed">
                Your data is protected with bank-level security and encryption. We're SOC 2 compliant and never share your information with third parties without consent.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
