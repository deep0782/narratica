'use client'

import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkles, Heart } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50 pt-20 pb-16">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-purple-200">
              <Sparkles className="h-4 w-4 text-purple-500 mr-2" />
              <span className="text-sm font-medium text-purple-700">Turn your child into a storybook hero!</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Create Magical{' '}
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                AI Stories
              </span>{' '}
              for Your Children
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Transform your child's photo into a cartoon character and watch them become the hero of personalized, educational stories. No artistic skills required!
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
              <Link href="/auth/signup">
                <Button size="lg" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-full px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                  Start Creating Stories
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="#how-it-works">
                <Button size="lg" variant="outline" className="rounded-full px-8 py-4 text-lg font-semibold border-2 border-purple-300 text-purple-600 hover:bg-purple-50">
                  See How It Works
                </Button>
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="flex items-center justify-center lg:justify-start space-x-6 text-sm text-gray-500">
              <div className="flex items-center">
                <Heart className="h-4 w-4 text-red-400 mr-1" />
                <span>Child-Safe Content</span>
              </div>
              <div className="flex items-center">
                <Sparkles className="h-4 w-4 text-yellow-400 mr-1" />
                <span>Educational Stories</span>
              </div>
              <div>
                <span>COPPA Compliant</span>
              </div>
            </div>
          </div>

          {/* Right Column - Visual */}
          <div className="relative">
            <div className="relative bg-white rounded-3xl shadow-2xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-500">
              <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl p-6">
                <Image
                  src="/magical-storybook-scene.png"
                  alt="Sample storybook with cartoon child character"
                  width={350}
                  height={400}
                  className="rounded-xl shadow-lg"
                />
              </div>
              <div className="mt-4 text-center">
                <h3 className="font-bold text-gray-800 text-lg">{"Emma's Magical Adventure"}</h3>
                <p className="text-gray-600 text-sm">A personalized story about courage and friendship</p>
              </div>
            </div>

            {/* Floating elements */}
            <div className="absolute -top-4 -left-4 bg-yellow-400 rounded-full p-3 shadow-lg animate-bounce">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div className="absolute -bottom-4 -right-4 bg-pink-400 rounded-full p-3 shadow-lg animate-pulse">
              <Heart className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
