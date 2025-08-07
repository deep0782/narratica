import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Check, Star } from 'lucide-react'
import Link from 'next/link'

const plans = [
  {
    name: 'Try It Out',
    price: 'Free',
    period: 'forever',
    description: 'Perfect for trying our magical story creation',
    features: [
      '2 stories per month',
      'Up to 5 scenes per story',
      '1 child character per story',
      'Basic art styles (3 options)',
      'PDF export only',
      'Stories expire after 30 days'
    ],
    cta: 'Start Free',
    popular: false,
    color: 'border-gray-200'
  },
  {
    name: 'Family Storyteller',
    price: '₹599',
    period: 'per month',
    description: 'Ideal for regular family storytelling',
    features: [
      '15 stories per month',
      'Up to 12 scenes per story',
      'Up to 3 children per story',
      'All art styles available',
      'PDF & video export',
      'No story expiration',
      'Remove watermarks',
      'Priority generation',
      'Email support'
    ],
    cta: 'Start Creating',
    popular: true,
    color: 'border-purple-500'
  },
  {
    name: 'Creative Family',
    price: '₹999',
    period: 'per month',
    description: 'For families who love unlimited creativity',
    features: [
      'Unlimited stories',
      'Up to 20 scenes per story',
      'Unlimited children characters',
      'Custom art style requests',
      'Advanced video features',
      'Commercial usage rights',
      'Batch story generation',
      'Phone support',
      'Early access to features'
    ],
    cta: 'Go Unlimited',
    popular: false,
    color: 'border-pink-500'
  }
]

export function Pricing() {
  return (
    <section id="pricing" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Choose Your{' '}
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Storytelling Plan
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Start free and upgrade as your family's storytelling needs grow. All plans include child-safe content and educational themes.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card key={index} className={`relative ${plan.color} ${plan.popular ? 'ring-2 ring-purple-500 shadow-2xl scale-105' : 'shadow-lg'} transition-all duration-300 hover:shadow-xl`}>
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center">
                    <Star className="h-4 w-4 mr-1" />
                    Most Popular
                  </div>
                </div>
              )}
              
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</CardTitle>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  {plan.price !== 'Free' && <span className="text-gray-600 ml-2">{plan.period}</span>}
                </div>
                <p className="text-gray-600">{plan.description}</p>
              </CardHeader>
              
              <CardContent className="pt-0">
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Link href="/auth/signup" className="block">
                  <Button 
                    className={`w-full py-3 text-lg font-semibold rounded-full ${
                      plan.popular 
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white' 
                        : 'bg-gray-900 hover:bg-gray-800 text-white'
                    }`}
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">All plans include:</p>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500">
            <span>✓ Child-safe content filtering</span>
            <span>✓ Educational story themes</span>
            <span>✓ COPPA compliant</span>
            <span>✓ Secure photo handling</span>
            <span>✓ Family sharing options</span>
          </div>
        </div>
      </div>
    </section>
  )
}
