import { Navigation } from '../components/Navigation';
import { Check } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';

export default function Membership() {
  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      features: [
        'Access to all communities',
        'Join up to 5 communities',
        'Basic profile',
        'Community discussions'
      ]
    },
    {
      name: 'Pro',
      price: '$19',
      period: 'per month',
      popular: true,
      features: [
        'Everything in Free',
        'Join unlimited communities',
        'Premium profile badge',
        'Priority support',
        'Exclusive events access',
        'Advanced analytics'
      ]
    },
    {
      name: 'Creator',
      price: '$49',
      period: 'per month',
      features: [
        'Everything in Pro',
        'Create unlimited communities',
        'Creator dashboard',
        'Revenue sharing',
        'Marketing tools',
        'Dedicated account manager'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navigation />
      
      <div className="pt-32 pb-24 px-6 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4" data-testid="membership-title">
              Choose Your Plan
            </h1>
            <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
              Select the perfect plan for your transformation journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8" data-testid="membership-plans">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative bg-zinc-900 border rounded-3xl p-8 ${
                  plan.popular ? 'border-blue-500' : 'border-zinc-800'
                }`}
                data-testid={`plan-${plan.name.toLowerCase()}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </div>
                )}
                
                <div className="mb-6">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-zinc-400">/{plan.period}</span>
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <Check className="text-blue-400 flex-shrink-0 mt-0.5" size={20} />
                      <span className="text-zinc-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link to="/login">
                  <Button
                    className={`w-full rounded-full h-12 transition-all ${
                      plan.popular
                        ? 'bg-primary text-white hover:bg-primary/90 shadow-[0_0_20px_rgba(59,130,246,0.3)]'
                        : 'bg-zinc-800 text-white hover:bg-zinc-700'
                    }`}
                    data-testid={`select-plan-${plan.name.toLowerCase()}`}
                  >
                    Get Started
                  </Button>
                </Link>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <p className="text-zinc-400">
              Payment integration coming soon. All plans currently available for free during beta.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
