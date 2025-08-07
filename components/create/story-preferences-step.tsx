'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Palette, BookOpen, Clock, GraduationCap } from 'lucide-react'
import type { StoryFormData } from '@/app/create/page'

interface StoryPreferencesStepProps {
  formData: StoryFormData
  onUpdate: (updates: Partial<StoryFormData>) => void
}

const EDUCATIONAL_THEMES = [
  { value: 'friendship', label: 'Friendship & Kindness', icon: '🤝', description: 'Stories about making friends and being kind' },
  { value: 'courage', label: 'Courage & Bravery', icon: '🦁', description: 'Adventures that teach facing fears' },
  { value: 'honesty', label: 'Honesty & Truth', icon: '💎', description: 'Learning the importance of telling the truth' },
  { value: 'responsibility', label: 'Responsibility', icon: '🎯', description: 'Stories about taking care of duties' },
  { value: 'empathy', label: 'Empathy & Understanding', icon: '❤️', description: 'Learning to understand others\' feelings' },
  { value: 'perseverance', label: 'Perseverance', icon: '🏔️', description: 'Never giving up on your dreams' },
  { value: 'creativity', label: 'Creativity & Imagination', icon: '🎨', description: 'Exploring artistic and creative thinking' },
  { value: 'nature', label: 'Nature & Environment', icon: '🌱', description: 'Learning about the natural world' }
]

const ART_STYLES = [
  { value: 'disney-style', label: 'Disney Style', preview: '🏰', description: 'Classic animated movie style with vibrant colors' },
  { value: 'pixar-style', label: 'Pixar Style', preview: '🎬', description: 'Modern 3D animation style' },
  { value: 'watercolor', label: 'Watercolor', preview: '🎨', description: 'Soft, dreamy watercolor illustrations' },
  { value: 'cartoon', label: 'Cartoon', preview: '😊', description: 'Fun, colorful cartoon illustrations' },
  { value: 'storybook', label: 'Classic Storybook', preview: '📚', description: 'Traditional children\'s book illustrations' },
  { value: 'manga', label: 'Manga Style', preview: '🌸', description: 'Japanese comic book style' }
]

const STORY_LENGTHS = [
  { value: 'short', label: 'Short Story', pages: '4-6 pages', time: '5-10 min read', icon: Clock },
  { value: 'medium', label: 'Medium Story', pages: '8-12 pages', time: '10-15 min read', icon: BookOpen },
  { value: 'long', label: 'Long Story', pages: '14-20 pages', time: '15-25 min read', icon: GraduationCap }
]

export function StoryPreferencesStep({ formData, onUpdate }: StoryPreferencesStepProps) {
  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Let's set up your story preferences
        </h3>
        <p className="text-gray-600">
          Choose the theme, style, and length that's perfect for your child
        </p>
      </div>

      {/* Age Group Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <GraduationCap className="h-5 w-5 text-blue-500" />
            <span>Target Age Group</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select 
            value={formData.target_age_group} 
            onValueChange={(value: 'toddlers' | 'elementary' | 'preteens') => 
              onUpdate({ target_age_group: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select age group" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="toddlers">
                <div>
                  <div className="font-medium">Toddlers (2-4 years)</div>
                  <div className="text-sm text-gray-500">Simple stories with basic concepts</div>
                </div>
              </SelectItem>
              <SelectItem value="elementary">
                <div>
                  <div className="font-medium">Elementary (5-10 years)</div>
                  <div className="text-sm text-gray-500">Adventure stories with learning themes</div>
                </div>
              </SelectItem>
              <SelectItem value="preteens">
                <div>
                  <div className="font-medium">Preteens (11-13 years)</div>
                  <div className="text-sm text-gray-500">Complex narratives with deeper lessons</div>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Educational Theme */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BookOpen className="h-5 w-5 text-green-500" />
            <span>Educational Theme</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-3">
            {EDUCATIONAL_THEMES.map((theme) => (
              <Button
                key={theme.value}
                type="button"
                variant={formData.educational_theme === theme.value ? "default" : "outline"}
                onClick={() => onUpdate({ educational_theme: theme.value })}
                className="h-auto p-4 justify-start text-left"
              >
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">{theme.icon}</span>
                  <div>
                    <div className="font-medium">{theme.label}</div>
                    <div className="text-sm opacity-70 mt-1">{theme.description}</div>
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Art Style */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Palette className="h-5 w-5 text-purple-500" />
            <span>Art Style</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {ART_STYLES.map((style) => (
              <Button
                key={style.value}
                type="button"
                variant={formData.art_style === style.value ? "default" : "outline"}
                onClick={() => onUpdate({ art_style: style.value })}
                className="h-auto p-4 justify-start text-left"
              >
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">{style.preview}</span>
                  <div>
                    <div className="font-medium">{style.label}</div>
                    <div className="text-sm opacity-70 mt-1">{style.description}</div>
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Story Length */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-orange-500" />
            <span>Story Length</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {STORY_LENGTHS.map((length) => {
              const IconComponent = length.icon
              return (
                <Button
                  key={length.value}
                  type="button"
                  variant={formData.story_length === length.value ? "default" : "outline"}
                  onClick={() => onUpdate({ story_length: length.value as 'short' | 'medium' | 'long' })}
                  className="h-auto p-4 flex-col space-y-2"
                >
                  <IconComponent className="h-8 w-8" />
                  <div className="text-center">
                    <div className="font-medium">{length.label}</div>
                    <div className="text-sm opacity-70">{length.pages}</div>
                    <div className="text-xs opacity-60">{length.time}</div>
                  </div>
                </Button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Selection Summary */}
      {(formData.educational_theme || formData.art_style) && (
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-900">Your Story Preferences</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {formData.target_age_group && (
                <Badge variant="secondary">
                  {formData.target_age_group.charAt(0).toUpperCase() + formData.target_age_group.slice(1)}
                </Badge>
              )}
              {formData.educational_theme && (
                <Badge variant="secondary">
                  {EDUCATIONAL_THEMES.find(t => t.value === formData.educational_theme)?.label}
                </Badge>
              )}
              {formData.art_style && (
                <Badge variant="secondary">
                  {ART_STYLES.find(s => s.value === formData.art_style)?.label}
                </Badge>
              )}
              {formData.story_length && (
                <Badge variant="secondary">
                  {STORY_LENGTHS.find(l => l.value === formData.story_length)?.label}
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
