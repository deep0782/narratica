'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Palette, Sparkles, Image, Brush } from 'lucide-react'
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
    name: 'Watercolor Dreams',
    description: 'Soft, flowing watercolor illustrations with gentle colors',
    preview: '/placeholder.svg?height=200&width=300&text=Watercolor+Style',
    prompt: 'watercolor painting style, soft brushstrokes, gentle colors, dreamy atmosphere'
  },
  {
    id: 'cartoon',
    name: 'Cartoon Adventure',
    description: 'Bright, bold cartoon-style illustrations perfect for young readers',
    preview: '/placeholder.svg?height=200&width=300&text=Cartoon+Style',
    prompt: 'cartoon illustration style, bright colors, bold outlines, playful characters'
  },
  {
    id: 'digital-art',
    name: 'Digital Magic',
    description: 'Modern digital art with vibrant colors and magical effects',
    preview: '/placeholder.svg?height=200&width=300&text=Digital+Art+Style',
    prompt: 'digital art style, vibrant colors, magical effects, modern illustration'
  },
  {
    id: 'storybook',
    name: 'Classic Storybook',
    description: 'Traditional storybook illustrations with warm, cozy feelings',
    preview: '/placeholder.svg?height=200&width=300&text=Storybook+Style',
    prompt: 'classic storybook illustration, warm colors, cozy atmosphere, traditional art'
  },
  {
    id: 'minimalist',
    name: 'Simple & Clean',
    description: 'Clean, minimalist style focusing on characters and story',
    preview: '/placeholder.svg?height=200&width=300&text=Minimalist+Style',
    prompt: 'minimalist illustration style, clean lines, simple shapes, focus on characters'
  },
  {
    id: 'fantasy',
    name: 'Fantasy Realm',
    description: 'Magical fantasy illustrations with enchanted elements',
    preview: '/placeholder.svg?height=200&width=300&text=Fantasy+Style',
    prompt: 'fantasy illustration style, magical elements, enchanted atmosphere, mystical colors'
  }
]

const COLOR_PALETTES = [
  {
    id: 'warm',
    name: 'Warm & Cozy',
    colors: ['#FF6B6B', '#FFE66D', '#FF8E53', '#C7CEEA'],
    description: 'Warm oranges, yellows, and soft pinks'
  },
  {
    id: 'cool',
    name: 'Cool & Calm',
    colors: ['#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'],
    description: 'Cool blues, greens, and gentle yellows'
  },
  {
    id: 'pastel',
    name: 'Pastel Dreams',
    colors: ['#FFB3BA', '#BAFFC9', '#BAE1FF', '#FFFFBA'],
    description: 'Soft pastel colors for a dreamy feel'
  },
  {
    id: 'vibrant',
    name: 'Bright & Bold',
    colors: ['#FF3366', '#33FF66', '#3366FF', '#FFFF33'],
    description: 'Bold, energetic colors that pop'
  },
  {
    id: 'earth',
    name: 'Natural Earth',
    colors: ['#8B4513', '#228B22', '#4682B4', '#DAA520'],
    description: 'Natural earth tones and forest colors'
  },
  {
    id: 'magical',
    name: 'Magical Rainbow',
    colors: ['#9B59B6', '#E74C3C', '#F39C12', '#2ECC71'],
    description: 'Magical purples, pinks, and rainbow hues'
  }
]

export function ArtStyleSelectionStep({ formData, updateFormData, onNext, onPrev }: ArtStyleSelectionStepProps) {
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [isGeneratingPreview, setIsGeneratingPreview] = useState(false)

  const handleStyleSelect = (styleId: string) => {
    const style = ART_STYLES.find(s => s.id === styleId)
    updateFormData({ 
      artStyle: styleId,
      illustrationStyle: style?.prompt || ''
    })
  }

  const handlePaletteSelect = (paletteId: string) => {
    updateFormData({ colorPalette: paletteId })
  }

  const generatePreview = async () => {
    if (!formData.artStyle || !formData.storyDescription) return

    setIsGeneratingPreview(true)
    try {
      const selectedStyle = ART_STYLES.find(s => s.id === formData.artStyle)
      const selectedPalette = COLOR_PALETTES.find(p => p.id === formData.colorPalette)
      
      const prompt = `${selectedStyle?.prompt || ''}, ${formData.storyDescription.slice(0, 100)}, ${selectedPalette?.description || ''}`

      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt,
          steps: 4,
          guidance_scale: 1.0
        })
      })

      if (response.ok) {
        const data = await response.json()
        setPreviewImage(data.imageUrl)
      } else {
        console.error('Failed to generate preview')
      }
    } catch (error) {
      console.error('Preview generation error:', error)
    } finally {
      setIsGeneratingPreview(false)
    }
  }

  const canProceed = formData.artStyle && formData.colorPalette

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-gray-900">Choose Your Art Style</h2>
        <p className="text-gray-600">
          Select the visual style that will bring your story to life
        </p>
      </div>

      {/* Art Styles */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Brush className="h-5 w-5 text-purple-600" />
          <h3 className="text-xl font-semibold text-gray-900">Illustration Style</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ART_STYLES.map((style) => (
            <Card
              key={style.id}
              className={`cursor-pointer transition-all hover:shadow-lg ${
                formData.artStyle === style.id
                  ? 'ring-2 ring-purple-500 bg-purple-50'
                  : 'hover:shadow-md'
              }`}
              onClick={() => handleStyleSelect(style.id)}
            >
              <div className="aspect-video bg-gradient-to-br from-purple-100 to-pink-100 rounded-t-lg flex items-center justify-center">
                <Image className="h-12 w-12 text-purple-400" />
              </div>
              <CardContent className="p-4">
                <h4 className="font-semibold text-gray-900 mb-2">{style.name}</h4>
                <p className="text-sm text-gray-600 mb-3">{style.description}</p>
                {formData.artStyle === style.id && (
                  <Badge className="bg-purple-100 text-purple-700">Selected</Badge>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Color Palettes */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Palette className="h-5 w-5 text-purple-600" />
          <h3 className="text-xl font-semibold text-gray-900">Color Palette</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {COLOR_PALETTES.map((palette) => (
            <Card
              key={palette.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                formData.colorPalette === palette.id
                  ? 'ring-2 ring-purple-500 bg-purple-50'
                  : ''
              }`}
              onClick={() => handlePaletteSelect(palette.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="flex space-x-1">
                    {palette.colors.map((color, index) => (
                      <div
                        key={index}
                        className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{palette.name}</h4>
                  </div>
                  {formData.colorPalette === palette.id && (
                    <Badge className="bg-purple-100 text-purple-700">Selected</Badge>
                  )}
                </div>
                <p className="text-xs text-gray-600">{palette.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Preview Generation */}
      {canProceed && (
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-blue-600" />
              Preview Your Style
            </CardTitle>
            <CardDescription>
              Generate a preview image to see how your story will look
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={generatePreview}
              disabled={isGeneratingPreview || !formData.storyDescription}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isGeneratingPreview ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Generating Preview...
                </>
              ) : (
                <>
                  <Image className="h-4 w-4 mr-2" />
                  Generate Style Preview
                </>
              )}
            </Button>
            
            {previewImage && (
              <div className="mt-4">
                <h4 className="font-medium text-gray-900 mb-2">Preview:</h4>
                <img
                  src={previewImage || "/placeholder.svg"}
                  alt="Style preview"
                  className="w-full max-w-md h-48 object-cover rounded-lg border-2 border-purple-200"
                />
              </div>
            )}
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
