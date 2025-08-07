import { Card, CardContent } from '@/components/ui/card'
import { Palette, BookOpen, Video, Shield, Sparkles, Users } from 'lucide-react'

const features = [
  {
    icon: Palette,
    title: 'Photo to Cartoon Magic',
    description: 'Transform your child\'s photo into a beautiful cartoon character that stars in every story.',
    color: 'from-purple-500 to-purple-600'
  },
  {
    icon: BookOpen,
    title: 'AI Story Generation',
    description: 'Create personalized, educational stories tailored to your child\'s age and interests.',
    color: 'from-pink-500 to-pink-600'
  },
  {
    icon: Video,
    title: 'Animated Videos',
    description: 'Export your stories as narrated videos with beautiful animations and background music.',
    color: 'from-blue-500 to-blue-600'
  },
  {
    icon: Shield,
    title: 'Child-Safe Content',
    description: 'All content is filtered for age-appropriateness and promotes positive values.',
    color: 'from-green-500 to-green-600'
  },
  {
    icon: Sparkles,
    title: 'Educational Themes',
    description: 'Stories focus on friendship, courage, problem-solving, and other important life lessons.',
    color: 'from-yellow-500 to-yellow-600'
  },
  {
    icon: Users,
    title: 'Family Sharing',
    description: 'Safely share your child\'s stories with grandparents and family members.',
    color: 'from-indigo-500 to-indigo-600'
  }
]

export function Features() {
  return (
    <section id="features" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Everything You Need to Create{' '}
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Magical Stories
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our AI-powered platform makes it easy for parents to create personalized, educational stories that children will treasure forever.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 group">
              <CardContent className="p-8 text-center">
                <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${feature.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
