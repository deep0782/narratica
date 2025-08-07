import { Card, CardContent } from '@/components/ui/card'
import { Star } from 'lucide-react'
import Image from 'next/image'

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Mother of 2',
    image: '/happy-mother-profile.png',
    rating: 5,
    text: "My kids absolutely love seeing themselves as cartoon characters in their own adventures! Emma's dragon story has become our favorite bedtime read."
  },
  {
    name: 'Michael Chen',
    role: 'Father & Teacher',
    image: '/smiling-father-profile.png',
    rating: 5,
    text: "As an educator, I appreciate how the stories teach valuable lessons about friendship and courage. The AI creates age-appropriate content that's both fun and educational."
  },
  {
    name: 'Lisa Rodriguez',
    role: 'Grandmother',
    image: '/kind-grandmother-profile.png',
    rating: 5,
    text: "I live far from my grandchildren, but now I can create personalized stories for them and share the magic across the miles. They feel so special being the heroes!"
  },
  {
    name: 'David Thompson',
    role: 'Single Dad',
    image: '/caring-father-profile.png',
    rating: 5,
    text: "Creating stories together has become our special bonding time. My son helps me describe the adventures, and seeing his face light up when he sees himself in the story is priceless."
  }
]

export function Testimonials() {
  return (
    <section className="py-20 bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Loved by Families{' '}
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Everywhere
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See what parents, grandparents, and educators are saying about creating magical stories with their children.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Image
                    src={testimonial.image || "/placeholder.svg"}
                    alt={testimonial.name}
                    width={60}
                    height={60}
                    className="rounded-full mr-4"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
                
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <p className="text-gray-700 leading-relaxed">"{testimonial.text}"</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
