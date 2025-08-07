'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Plus, Sparkles, Wand2 } from 'lucide-react'
import Link from 'next/link'

export function CreateStoryButton() {
  return (
    <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
      <CardContent className="p-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-white/20 p-3 rounded-xl group-hover:scale-110 transition-transform duration-300">
              <Wand2 className="h-8 w-8" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Create a New Magical Story</h3>
              <p className="text-white/90 mb-4">
                Turn your child into the hero of their own personalized adventure!
              </p>
              <div className="flex items-center space-x-4 text-sm text-white/80">
                <div className="flex items-center">
                  <Sparkles className="h-4 w-4 mr-1" />
                  <span>AI-Powered</span>
                </div>
                <div className="flex items-center">
                  <span>•</span>
                </div>
                <div>Educational Themes</div>
                <div className="flex items-center">
                  <span>•</span>
                </div>
                <div>Child-Safe Content</div>
              </div>
            </div>
          </div>
          
          <Link href="/create">
            <Button 
              size="lg" 
              className="bg-white text-purple-600 hover:bg-gray-50 rounded-full px-8 py-4 font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Plus className="h-5 w-5 mr-2" />
              Start Creating
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
