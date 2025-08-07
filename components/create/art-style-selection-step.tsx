'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Palette, Star, Eye } from 'lucide-react'

interface ArtStyleSelectionStepProps {
  selectedStyle: string
  onStyleSelect: (style: string) => void
  childName: string
}

const ART_STYLES = [
  {
    id: 'disney-style',
    name: 'Disney Style',
    description: 'Classic animated movie style with vibrant colors and expressive characters',
    preview: '/placeholder.svg?height=200&width=300&text=Disney+Style',
    popular: true,
    features: ['Vibrant colors', 'Expressive faces', 'Classic animation feel']
  },
  {
    id: 'pixar-style',
    name: 'Pixar 3D',
    description: 'Modern 3D animation style with detailed textures and lighting',
    preview: '/placeholder.svg?height=200&width=300&text=Pixar+3D',
    popular: true,
    features: ['3D rendered', 'Realistic lighting', 'Detailed textures']
  },
  {
    id: 'watercolor',
    name: 'Watercolor',
    description: 'Soft, dreamy watercolor illustrations with gentle brush strokes',
    preview: '/placeholder.svg?height=200&width=300&text=Watercolor',
    popular: false,
    features: ['Soft edges', 'Dreamy atmosphere', 'Artistic brush strokes']
  },
  {
    id: 'cartoon',
    name: 'Cartoon',
    description: 'Fun, colorful cartoon illustrations with bold outlines',
    preview: '/placeholder.svg?height=200&width=300&text=Cartoon',
    popular: true,
    features: ['Bold outlines', 'Bright colors', 'Playful style']
  },
  {
    id: 'storybook',
    name: 'Classic Storybook',
    description: 'Traditional children\'s book illustrations with timeless charm',
    preview: '/placeholder.svg?height=200&width=300&text=Storybook',
    popular: false,
    features: ['Timeless style', 'Detailed illustrations', 'Classic charm']
  },
  {
    id: 'manga',
    name: 'Manga Style',
    description: 'Age-appropriate Japanese comic book style with expressive characters',
    preview: '/placeholder.svg?height=200&width=300&text=Manga+Style',
    popular: false,
    features: ['Expressive eyes', 'Dynamic poses', 'Japanese art style']
  },
  {
    id: 'paper-craft',
    name: 'Paper Craft',
    description: 'Charming paper craft style with layered textures and shadows',
    preview: '/placeholder.svg?height=200&width=300&text=Paper+Craft',
    popular: false,
    features: ['Layered textures', 'Craft aesthetic', 'Unique shadows']
  },
  {
    id: 'hand-drawn',
    name: 'Hand-drawn Sketch',
    description: 'Artistic hand-drawn sketches with pencil and ink details',
    preview: '/placeholder.svg?height=200&width=300&text=Hand+Drawn',
    popular: false,
    features: ['Pencil textures', 'Artistic lines', 'Sketch aesthetic']
  }
]

export function ArtStyleSelectionStep({ selectedStyle, onStyleSelect, childName }: ArtStyleSelectionStepProps) {
  const [previewStyle, setPreviewStyle] = useState<string | null>(null)

  const popularStyles = ART_STYLES.filter(style => style.popular)
  const otherStyles = ART_STYLES.filter(style => !style.popular)

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h3 className="text-3xl font-bold text-gray-900 mb-2">
          🎨 Choose Your Art Style 🎨
        </h3>
        <p className="text-lg text-gray-600">
          Pick the perfect visual style for {childName}'s adventure
        </p>
      </div>

      {/* Most Popular Styles */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Star className="h-5 w-5 text-yellow-500" />
          <h4 className="text-xl font-semibold text-gray-900">Most Popular</h4>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularStyles.map((style) => (
            <Card
              key={style.id}
              className={`cursor-pointer transition-all duration-300 hover:shadow-xl ${
                selectedStyle === style.id
                  ? 'ring-2 ring-purple-500 bg-purple-50 shadow-lg'
                  : 'hover:shadow-lg hover:bg-gray-50'
              }`}
              onClick={() => onStyleSelect(style.id)}
            >
              <CardHeader className="pb-2">
                <div className="relative">
                  <img
                    src={style.preview || "/placeholder.svg"}
                    alt={`${style.name} preview`}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  {style.popular && (
                    <Badge className="absolute top-2 right-2 bg-yellow-500 text-white">
                      <Star className="h-3 w-3 mr-1" />
                      Popular
                    </Badge>
                  )}
                  {selectedStyle === style.id && (
                    <div className="absolute inset-0 bg-purple-500 bg-opacity-20 rounded-lg flex items-center justify-center">
                      <div className="bg-purple-500 text-white p-2 rounded-full">
                        <Eye className="h-6 w-6" />
                      </div>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <CardTitle className="text-lg">{style.name}</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">{style.description}</p>
                </div>
                <div className="flex flex-wrap gap-1">
                  {style.features.map((feature) => (
                    <Badge key={feature} variant="outline" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>
                <Button
                  variant={selectedStyle === style.id ? "default" : "outline"}
                  className="w-full"
                  onClick={(e) => {
                    e.stopPropagation()
                    onStyleSelect(style.id)
                  }}
                >
                  {selectedStyle === style.id ? 'Selected' : 'Choose This Style'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Other Styles */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Palette className="h-5 w-5 text-purple-500" />
          <h4 className="text-xl font-semibold text-gray-900">More Art Styles</h4>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {otherStyles.map((style) => (
            <Card
              key={style.id}
              className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                selectedStyle === style.id
                  ? 'ring-2 ring-purple-500 bg-purple-50'
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => onStyleSelect(style.id)}
            >
              <CardHeader className="pb-2">
                <div className="relative">
                  <img
                    src={style.preview || "/placeholder.svg"}
                    alt={`${style.name} preview`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  {selectedStyle === style.id && (
                    <div className="absolute inset-0 bg-purple-500 bg-opacity-20 rounded-lg flex items-center justify-center">
                      <div className="bg-purple-500 text-white p-1 rounded-full">
                        <Eye className="h-4 w-4" />
                      </div>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <CardTitle className="text-base">{style.name}</CardTitle>
                <p className="text-xs text-gray-600">{style.description}</p>
                <Button
                  variant={selectedStyle === style.id ? "default" : "outline"}
                  size="sm"
                  className="w-full"
                  onClick={(e) => {
                    e.stopPropagation()
                    onStyleSelect(style.id)
                  }}
                >
                  {selectedStyle === style.id ? 'Selected' : 'Choose'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Style Preview with Child Character */}
      {selectedStyle && (
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-purple-900">
              <Eye className="h-6 w-6" />
              <span>Preview: {childName} in {ART_STYLES.find(s => s.id === selectedStyle)?.name}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center p-8 bg-white rounded-lg border">
              <img
                src={`/placeholder_image.png?height=300&width=400&text=${childName}+in+${selectedStyle}`}
                alt={`${childName} in ${selectedStyle} style`}
                className="max-w-full h-auto rounded-lg shadow-lg"
              />
            </div>
            <p className="text-center text-purple-700 mt-4">
              This is how {childName} will appear in your story!
            </p>
          </CardContent>
        </Card>
      )}

      {/* Selection Summary */}
      {selectedStyle && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-blue-900">
                  Selected Style: {ART_STYLES.find(s => s.id === selectedStyle)?.name}
                </p>
                <p className="text-sm text-blue-700">
                  {ART_STYLES.find(s => s.id === selectedStyle)?.description}
                </p>
              </div>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                Ready for Characters!
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
