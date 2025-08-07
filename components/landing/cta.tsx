import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkles } from 'lucide-react'
import Link from 'next/link'

export function CTA() {
  return (
    <section className="py-20 bg-gradient-to-r from-purple-600 to-pink-600 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-white/10 rounded-full"></div>
        <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-white/10 rounded-full"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 mb-8">
            <Sparkles className="h-5 w-5 text-white mr-2" />
            <span className="text-white font-medium">Start your family's storytelling journey today</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Ready to Make Your Child the Hero of Their Own Story?
          </h2>
          
          <p className="text-xl text-white/90 mb-10 leading-relaxed">
            Join thousands of families creating magical, personalized stories that strengthen bonds and spark imagination. Start free and watch your child's face light up!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 rounded-full px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                Create Your First Story
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="#features">
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-purple-600 rounded-full px-8 py-4 text-lg font-semibold transition-all duration-300">
                Learn More
              </Button>
            </Link>
          </div>

          <div className="mt-12 flex items-center justify-center space-x-8 text-white/80 text-sm">
            <span>✓ Free to start</span>
            <span>✓ Child-safe content</span>
            <span>✓ No credit card required</span>
          </div>
        </div>
      </div>
    </section>
  )
}
