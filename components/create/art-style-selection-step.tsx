'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Palette, Sparkles } from 'lucide-react'
import Image from 'next/image'
import type { StoryFormData } from '@/app/create/page'

interface ArtStyleSelectionStepProps {
  formData: StoryFormData
  updateFormData: (updates: Partial<StoryFormData>) => void
  onNext: () => void
  onPrev: () => void
}

const ART_STYLES = [
  {
    id: 'watercolor',
    name: 'Watercolor',
    description: 'Soft, dreamy illustrations with flowing colors',
    preview: '/placeholder.svg',
    colorPalette: 'Soft pastels',
    mood: 'Gentle and calming'
  },
  {
    id: 'cartoon',
    name: 'Cartoon',
    description: 'Fun, colorful cartoon-style illustrations',
    preview: '/placeholder.svg',
    colorPalette: 'Bright and vibrant',
    mood: 'Playful and energetic'
  },
  {
    id: 'storybook',
    name: 'Classic Storybook',
    description: 'Traditional storybook illustration style',
    preview: '/placeholder.svg',
    colorPalette: 'Warm earth tones',
    mood: 'Timeless and cozy'
  },
  {
    id: 'digital-art',
    name: 'Digital Art',
    description: 'Modern digital illustrations with rich details',
    preview: '/placeholder.svg',
    colorPalette: 'Rich and saturated',
    mood: 'Contemporary and detailed'
  },
  {
    id: 'pencil-sketch',
    name: 'Pencil Sketch',
    description: 'Hand-drawn pencil illustrations with charm',
    preview: '/placeholder.svg',
    colorPalette: 'Monochrome with highlights',
    mood: 'Artistic and intimate'
  },
  {
    id: 'fantasy',
    name: 'Fantasy Art',
    description: 'Magical, fantastical illustration style',
    preview: '/placeholder.svg',
    colorPalette: 'Mystical purples and golds',
    mood: 'Magical and enchanting'
  }
]

export function ArtStyleSelectionStep({ formData, updateFormData, onNext, onPrev }: ArtStyleSelectionStepProps) {
  const handleStyleSelect = (style: typeof ART_STYLES[0]) => {
    updateFormData({
      artStyle: style.name,
      art_style: style.name,
      colorPalette: style.colorPalette,
      illustrationStyle: style.mood
    })
  }

  const selectedStyle = ART_STYLES.find(style => style.name === formData.artStyle)
  const canProceed = formData.artStyle !== ''

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-gray-900">Choose Your Art Style</h2>
        <p className="text-gray-600">
          Select the visual style that will bring your story to life
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {ART_STYLES.map((style) => (
          <Card
            key={style.id}
            className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
              formData.artStyle === style.name
                ? 'ring-2 ring-purple-500 bg-purple-50'
                : 'hover:shadow-md'
            }`}
            onClick={() => handleStyleSelect(style)}
          >
            <CardHeader className="pb-3">
              <div className="aspect-video relative bg-gray-100 rounded-lg overflow-hidden mb-3">
                <Image
                  src={style.preview || "/placeholder.svg"}
                  alt={style.name}
                  fill
                  className="object-cover"
                />
                {formData.artStyle === style.name && (
                  <div className="absolute inset-0 bg-purple-500 bg-opacity-20 flex items-center justify-center">
                    <div className="bg-white rounded-full p-2">
                      <Sparkles className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                )}
              </div>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-purple-600" />
                {style.name}
              </CardTitle>
              <CardDescription>{style.description}</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Color Palette:</span>
                  <Badge variant="secondary" className="text-xs">
                    {style.colorPalette}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Mood:</span>
                  <Badge variant="outline" className="text-xs">
                    {style.mood}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedStyle && (
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-600" />
              Selected Style: {selectedStyle.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Style</h4>
                <p className="text-gray-700">{selectedStyle.description}</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Color Palette</h4>
                <p className="text-gray-700">{selectedStyle.colorPalette}</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Mood</h4>
                <p className="text-gray-700">{selectedStyle.mood}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrev}>
          Back to Story Input
        </Button>
        <Button 
          onClick={onNext}
          disabled={!canProceed}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
        >
          Continue to Characters
        </Button>
      </div>
    </div>
  )
}
