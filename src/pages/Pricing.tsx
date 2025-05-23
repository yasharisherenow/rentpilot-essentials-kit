
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

const PricingPage = () => {
  const plans = [
    {
      name: 'Basic',
      price: '$9.99',
      billingPeriod: 'per month',
      description: 'Perfect for small landlords with 1-2 properties',
      features: [
        'Manage up to 2 properties',
        'Digital tenant applications',
        'Basic lease documents',
        'Email support'
      ],
      cta: 'Start Free Trial',
      popular: false
    },
    {
      name: 'Professional',
      price: '$24.99',
      billingPeriod: 'per month',
      description: 'For landlords managing multiple properties',
      features: [
        'Manage up to 10 properties',
        'Digital tenant applications',
        'Advanced lease documents',
        'Tenant screening',
        'Payment reminders',
        'Priority email support',
        '24/7 phone support'
      ],
      cta: 'Start Free Trial',
      popular: true
    },
    {
      name: 'Enterprise',
      price: '$49.99',
      billingPeriod: 'per month',
      description: 'For property management companies',
      features: [
        'Unlimited properties',
        'All Professional features',
        'Custom document templates',
        'API access',
        'Team accounts',
        'Advanced analytics',
        'Dedicated account manager'
      ],
      cta: 'Contact Us',
      popular: false
    }
  ];

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Choose the plan that fits your needs. All plans come with a 14-day free trial.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
        {plans.map((plan, index) => (
          <Card 
            key={index} 
            className={`flex flex-col ${
              plan.popular 
                ? 'border-rentpilot-600 shadow-lg relative' 
                : 'border-gray-200'
            }`}
          >
            {plan.popular && (
              <span className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-rentpilot-600 text-white text-xs font-bold py-1 px-4 rounded-full">
                MOST POPULAR
              </span>
            )}
            <CardHeader>
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <div className="mt-4">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-gray-500 ml-2">{plan.billingPeriod}</span>
              </div>
              <CardDescription className="mt-2">
                {plan.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <ul className="space-y-3">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <CheckIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                className={`w-full ${
                  plan.popular
                    ? 'bg-rentpilot-600 hover:bg-rentpilot-700'
                    : ''
                }`}
                variant={plan.popular ? 'default' : 'outline'}
                asChild
              >
                <Link to="/auth">{plan.cta}</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-16 text-center max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
        <div className="space-y-6 text-left">
          <div>
            <h3 className="text-lg font-medium mb-2">Can I switch plans later?</h3>
            <p className="text-gray-600">
              Yes, you can upgrade or downgrade your plan at any time. Changes will take effect on your next billing cycle.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2">Is there a long-term contract?</h3>
            <p className="text-gray-600">
              No, all plans are month-to-month and you can cancel at any time without penalty.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2">What payment methods do you accept?</h3>
            <p className="text-gray-600">
              We accept all major credit cards including Visa, Mastercard, American Express, and Discover.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2">How secure is my data?</h3>
            <p className="text-gray-600">
              Your data is protected with bank-level security and encryption. We never share your information with third parties without your consent.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
