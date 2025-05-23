
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto py-16 px-4">
        <div className="text-center mb-16 animate-fade-up">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-rentpilot-600 to-indigo-600 bg-clip-text text-transparent">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Choose the plan that fits your portfolio size. All plans come with a 14-day free trial and no setup fees.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3 max-w-7xl mx-auto mb-16">
          {plans.map((plan, index) => (
            <Card 
              key={index} 
              className={`flex flex-col relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl animate-fade-up group ${
                plan.popular 
                  ? 'border-rentpilot-600 shadow-xl ring-2 ring-rentpilot-200' 
                  : 'border-gray-200 hover:border-rentpilot-300'
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {plan.popular && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rentpilot-600 to-indigo-600"></div>
              )}
              {plan.popular && (
                <span className="absolute top-4 right-4 bg-gradient-to-r from-rentpilot-600 to-indigo-600 text-white text-xs font-bold py-1 px-3 rounded-full shadow-lg">
                  MOST POPULAR
                </span>
              )}
              <CardHeader className="pb-8 pt-8">
                <div className="flex items-center justify-between mb-2">
                  <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                  <span className="text-sm font-medium text-rentpilot-600 bg-rentpilot-50 px-2 py-1 rounded-full">
                    {plan.units}
                  </span>
                </div>
                <div className="mt-4">
                  <span className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    {plan.price}
                  </span>
                  <span className="text-gray-500 ml-2">{plan.billingPeriod}</span>
                </div>
                <CardDescription className="mt-3 text-base leading-relaxed">
                  {plan.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-4">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start group/item">
                      <CheckIcon className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5 transition-transform group-hover/item:scale-110" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="pt-8">
                <Button
                  className={`w-full transition-all duration-300 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-rentpilot-600 to-indigo-600 hover:from-rentpilot-700 hover:to-indigo-700 shadow-lg hover:shadow-xl'
                      : 'hover:bg-rentpilot-50 hover:border-rentpilot-300'
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
          <Card className="bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-dashed border-gray-300 hover:border-rentpilot-400 transition-all duration-300">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-rentpilot-100 rounded-full flex items-center justify-center mb-4">
                <Calculator className="h-6 w-6 text-rentpilot-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">Enterprise Calculator</CardTitle>
              <CardDescription className="text-lg">
                Calculate your custom pricing for 11+ units at $1.60 per unit
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="units" className="text-sm font-medium text-gray-700">
                  Number of Properties/Units
                </Label>
                <Input
                  id="units"
                  type="number"
                  min="11"
                  value={enterpriseUnits}
                  onChange={(e) => setEnterpriseUnits(Math.max(11, parseInt(e.target.value) || 11))}
                  className="text-lg font-semibold text-center border-2 focus:border-rentpilot-500"
                />
              </div>
              <div className="text-center p-6 bg-white rounded-lg border-2 border-rentpilot-200">
                <div className="text-3xl font-bold text-rentpilot-600 mb-2">
                  ${calculateEnterprisePrice(enterpriseUnits).toFixed(2)}
                </div>
                <div className="text-sm text-gray-600">per month</div>
                <div className="text-xs text-gray-500 mt-1">
                  ${(calculateEnterprisePrice(enterpriseUnits) / enterpriseUnits).toFixed(2)} per unit
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full bg-gradient-to-r from-rentpilot-600 to-indigo-600 hover:from-rentpilot-700 hover:to-indigo-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
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
          <h2 className="text-3xl font-bold mb-8 text-gray-900">Frequently Asked Questions</h2>
          <div className="grid gap-8 md:grid-cols-2 text-left">
            <div className="p-6 bg-white rounded-xl border border-gray-200 hover:border-rentpilot-300 hover:shadow-lg transition-all duration-300">
              <h3 className="text-lg font-semibold mb-3 text-gray-900">Can I switch plans later?</h3>
              <p className="text-gray-600 leading-relaxed">
                Yes, you can upgrade or downgrade your plan at any time. Changes will take effect on your next billing cycle, and we'll prorate any differences.
              </p>
            </div>
            <div className="p-6 bg-white rounded-xl border border-gray-200 hover:border-rentpilot-300 hover:shadow-lg transition-all duration-300">
              <h3 className="text-lg font-semibold mb-3 text-gray-900">Is there a long-term contract?</h3>
              <p className="text-gray-600 leading-relaxed">
                No, all plans are month-to-month and you can cancel at any time without penalty. Your data remains accessible for 30 days after cancellation.
              </p>
            </div>
            <div className="p-6 bg-white rounded-xl border border-gray-200 hover:border-rentpilot-300 hover:shadow-lg transition-all duration-300">
              <h3 className="text-lg font-semibold mb-3 text-gray-900">What payment methods do you accept?</h3>
              <p className="text-gray-600 leading-relaxed">
                We accept all major credit cards including Visa, Mastercard, American Express, and Discover. Enterprise customers can also pay by ACH transfer.
              </p>
            </div>
            <div className="p-6 bg-white rounded-xl border border-gray-200 hover:border-rentpilot-300 hover:shadow-lg transition-all duration-300">
              <h3 className="text-lg font-semibold mb-3 text-gray-900">How secure is my data?</h3>
              <p className="text-gray-600 leading-relaxed">
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
