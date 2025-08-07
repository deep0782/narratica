'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Star, Palette, Sparkles } from 'lucide-react'

interface ArtStyleSelectionStepProps {
  selectedStyle: string
  onStyleSelect: (style: string) => void
  childName: string
}

const ART_STYLES = [
  {
    id: 'disney-style',
    name: 'Disney Style',
    description: 'Classic Disney animation with expressive characters and magical worlds',
    features: ['Expressive characters', 'Magical atmosphere', 'Vibrant colors'],
    popular: true,
    preview: '/placeholder_image.png'
  },
  {
    id: 'pixar-style',
    name: 'Pixar Style',
    description: '3D animated style with detailed textures and realistic lighting',
    features: ['3D animation', 'Detailed textures', 'Realistic lighting'],
    popular: true,
    preview: '/placeholder_image.png'
  },
  {
    id: 'watercolor',
    name: 'Watercolor',
    description: 'Soft, dreamy watercolor paintings with gentle brush strokes',
    features: ['Soft textures', 'Dreamy atmosphere', 'Artistic feel'],
    popular: false,
    preview: '/placeholder_image.png'
  },
  {
    id: 'cartoon',
    name: 'Cartoon',
    description: 'Fun, colorful cartoon style perfect for young children',
    features: ['Bold colors', 'Simple shapes', 'Child-friendly'],
    popular: true,
    preview: '/placeholder_image.png'
  },
  {
    id: 'storybook',
    name: 'Classic Storybook',
    description: 'Traditional storybook illustrations with detailed line art',
    features: ['Detailed illustrations', 'Classic feel', 'Timeless style'],
    popular: false,
    preview: '/placeholder_image.png'
  },
  {
    id: 'manga',
    name: 'Manga Style',
    description: 'Japanese manga-inspired art with expressive characters',
    features: ['Expressive eyes', 'Dynamic poses', 'Unique style'],
    popular: false,
    preview: '/placeholder_image.png'
  },
  {
    id: 'minimalist',
    name: 'Minimalist',
    description: 'Clean, simple illustrations focusing on essential elements',
    features: ['Clean design', 'Simple shapes', 'Focus on story'],
    popular: false,
    preview: '/placeholder_image.png'
  },
  {
    id: 'fantasy',
    name: 'Fantasy Art',
    description: 'Detailed fantasy illustrations with magical creatures and worlds',
    features: ['Magical elements', 'Detailed worlds', 'Fantasy creatures'],
    popular: false,
    preview: '/placeholder_image.png'
  }
]

export function ArtStyleSelectionStep({ selectedStyle, onStyleSelect, childName }: ArtStyleSelectionStepProps) {
  const [hoveredStyle, setHoveredStyle] = useState<string | null>(null)

  const popularStyles = ART_STYLES.filter(style => style.popular)
  const otherStyles = ART_STYLES.filter(style => !style.popular)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Choose the perfect art style for {childName}'s story
        </h3>
        <p className="text-gray-600">
          Select the visual style that will bring your story to life
        </p>
      </div>

      {/* Most Popular Section */}
      <div>
        <div className="flex items-center space-x-2 mb-6">
          <Star className="h-5 w-5 text-yellow-500" />
          <h4 className="text-xl font-semibold text-gray-900">Most Popular</h4>
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            Recommended
          </Badge>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularStyles.map((style) => (
            <Card
              key={style.id}
              className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                selectedStyle === style.id
                  ? 'ring-2 ring-purple-500 shadow-lg'
                  : 'hover:shadow-md'
              }`}
              onClick={() => onStyleSelect(style.id)}
              onMouseEnter={() => setHoveredStyle(style.id)}
              onMouseLeave={() => setHoveredStyle(null)}
            >
              <div className="relative">
                <div className="aspect-video bg-gradient-to-br from-purple-100 to-pink-100 rounded-t-lg flex items-center justify-center overflow-hidden">
                  <img
                    src={style.preview || "/placeholder.svg"}
                    alt={`${style.name} preview`}
                    className="w-full h-full object-cover"
                  />
                  {selectedStyle === style.id && (
                    <div className="absolute inset-0 bg-purple-500 bg-opacity-20 flex items-center justify-center">
                      <div className="bg-white rounded-full p-2">
                        <Sparkles className="h-6 w-6 text-purple-600" />
                      </div>
                    </div>
                  )}
                </div>
                {style.popular && (
                  <Badge className="absolute top-2 right-2 bg-yellow-500 text-white">
                    <Star className="h-3 w-3 mr-1" />
                    Popular
                  </Badge>
                )}
              </div>
              
              <CardContent className="p-4">
                <h5 className="font-semibold text-lg mb-2">{style.name}</h5>
                <p className="text-gray-600 text-sm mb-3">{style.description}</p>
                
                <div className="space-y-2">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Features:</p>
                  <div className="flex flex-wrap gap-1">
                    {style.features.map((feature) => (
                      <Badge key={feature} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Other Styles Section */}
      <div>
        <div className="flex items-center space-x-2 mb-6">
          <Palette className="h-5 w-5 text-purple-500" />
          <h4 className="text-xl font-semibold text-gray-900">More Art Styles</h4>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {otherStyles.map((style) => (
            <Card
              key={style.id}
              className={`cursor-pointer transition-all duration-300 hover:shadow-md ${
                selectedStyle === style.id
                  ? 'ring-2 ring-purple-500 shadow-lg'
                  : ''
              }`}
              onClick={() => onStyleSelect(style.id)}
            >
              <div className="relative">
                <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-t-lg flex items-center justify-center overflow-hidden">
                  <img
                    src={style.preview || "/placeholder.svg"}
                    alt={`${style.name} preview`}
                    className="w-full h-full object-cover"
                  />
                  {selectedStyle === style.id && (
                    <div className="absolute inset-0 bg-purple-500 bg-opacity-20 flex items-center justify-center">
                      <div className="bg-white rounded-full p-1">
                        <Sparkles className="h-4 w-4 text-purple-600" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <CardContent className="p-3">
                <h5 className="font-semibold text-sm mb-1">{style.name}</h5>
                <p className="text-gray-600 text-xs mb-2">{style.description}</p>
                
                <div className="flex flex-wrap gap-1">
                  {style.features.slice(0, 2).map((feature) => (
                    <Badge key={feature} variant="outline" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                  {style.features.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{style.features.length - 2} more
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Preview Section */}
      {selectedStyle && (
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-purple-900">
              <Sparkles className="h-5 w-5" />
              <span>Style Preview</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white rounded-lg border-2 border-purple-200 flex items-center justify-center">
                <img
                  src={ART_STYLES.find(s => s.id === selectedStyle)?.preview || "/placeholder.svg"}
                  alt="Selected style"
                  className="w-full h-full object-cover rounded-md"
                />
              </div>
              <div>
                <p className="font-medium text-purple-900">
                  {ART_STYLES.find(s => s.id === selectedStyle)?.name}
                </p>
                <p className="text-sm text-purple-700">
                  Perfect choice! This style will make {childName}'s story truly magical.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
