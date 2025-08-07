'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { User, BookOpen, Palette, Clock, MapPin, Lightbulb, Star, Wand2, Sparkles } from 'lucide-react'
import type { StoryFormData } from '@/app/create/page'
import type { ParentProfile } from '@/lib/supabase'

interface ReviewStepProps {
  formData: StoryFormData
  profile: ParentProfile | null
  onGenerate: () => void
}

const EDUCATIONAL_THEMES = {
  'friendship': 'Friendship & Kindness',
  'courage': 'Courage & Bravery',
  'honesty': 'Honesty & Truth',
  'responsibility': 'Responsibility',
  'empathy': 'Empathy & Understanding',
  'perseverance': 'Perseverance',
  'creativity': 'Creativity & Imagination',
  'nature': 'Nature & Environment'
}

const ART_STYLES = {
  'disney-style': 'Disney Style',
  'pixar-style': 'Pixar Style',
  'watercolor': 'Watercolor',
  'cartoon': 'Cartoon',
  'storybook': 'Classic Storybook',
  'manga': 'Manga Style'
}

const STORY_LENGTHS = {
  'short': 'Short Story (4-6 pages)',
  'medium': 'Medium Story (8-12 pages)',
  'long': 'Long Story (14-20 pages)'
}

const CHARACTER_ROLES = {
  'protagonist': 'Main Hero',
  'supporting': 'Supporting Character',
  'narrator': 'Story Narrator'
}

export function ReviewStep({ formData, profile, onGenerate }: ReviewStepProps) {
  const childName = formData.selectedChild?.name || formData.newChildData?.name || 'Your child'
  
  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Ready to create your magical story?
        </h3>
        <p className="text-gray-600">
          Review your story details and let our AI create a personalized adventure for {childName}
        </p>
      </div>

      {/* Story Preview Card */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-purple-900">
            <Wand2 className="h-6 w-6" />
            <span>Your Story Preview</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Child Information */}
          <div className="flex items-start space-x-4 p-4 bg-white rounded-lg border">
            <div className="bg-purple-100 p-3 rounded-full">
              <User className="h-6 w-6 text-purple-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 mb-2">Story Star</h4>
              <div className="space-y-2">
                <p className="font-medium text-lg">{childName}</p>
                {formData.selectedChild && (
                  <>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">
                        {formData.selectedChild.age_group.charAt(0).toUpperCase() + formData.selectedChild.age_group.slice(1)}
                      </Badge>
                      <Badge variant="outline">
                        {CHARACTER_ROLES[formData.character_role]}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Favorite Activities:</p>
                      <div className="flex flex-wrap gap-1">
                        {formData.selectedChild.favorite_activities.map((activity) => (
                          <Badge key={activity} variant="secondary" className="text-xs">
                            {activity}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Character Traits:</p>
                      <div className="flex flex-wrap gap-1">
                        {formData.selectedChild.character_traits.map((trait) => (
                          <Badge key={trait} variant="secondary" className="text-xs">
                            {trait}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </>
                )}
                {formData.newChildData && (
                  <>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">
                        {formData.newChildData.age_group.charAt(0).toUpperCase() + formData.newChildData.age_group.slice(1)}
                      </Badge>
                      <Badge variant="outline">
                        {CHARACTER_ROLES[formData.character_role]}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Favorite Activities:</p>
                      <div className="flex flex-wrap gap-1">
                        {formData.newChildData.favorite_activities.map((activity) => (
                          <Badge key={activity} variant="secondary" className="text-xs">
                            {activity}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Character Traits:</p>
                      <div className="flex flex-wrap gap-1">
                        {formData.newChildData.character_traits.map((trait) => (
                          <Badge key={trait} variant="secondary" className="text-xs">
                            {trait}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Story Details */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <BookOpen className="h-5 w-5 text-green-500 mt-1" />
                <div>
                  <p className="font-medium text-gray-900">Educational Theme</p>
                  <p className="text-gray-600">{EDUCATIONAL_THEMES[formData.educational_theme as keyof typeof EDUCATIONAL_THEMES]}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Palette className="h-5 w-5 text-purple-500 mt-1" />
                <div>
                  <p className="font-medium text-gray-900">Art Style</p>
                  <p className="text-gray-600">{ART_STYLES[formData.art_style as keyof typeof ART_STYLES]}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Clock className="h-5 w-5 text-orange-500 mt-1" />
                <div>
                  <p className="font-medium text-gray-900">Story Length</p>
                  <p className="text-gray-600">{STORY_LENGTHS[formData.story_length]}</p>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              {formData.setting_preference && (
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-green-500 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900">Setting</p>
                    <p className="text-gray-600">{formData.setting_preference}</p>
                  </div>
                </div>
              )}

              {formData.moral_lesson && (
                <div className="flex items-start space-x-3">
                  <Star className="h-5 w-5 text-yellow-500 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900">Moral Lesson</p>
                    <p className="text-gray-600">{formData.moral_lesson}</p>
                  </div>
                </div>
              )}

              {formData.specific_elements.length > 0 && (
                <div className="flex items-start space-x-3">
                  <Lightbulb className="h-5 w-5 text-purple-500 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900">Story Elements</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {formData.specific_elements.map((element) => (
                        <Badge key={element} variant="outline" className="text-xs">
                          {element}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Story Description */}
          <div className="p-4 bg-white rounded-lg border">
            <h4 className="font-semibold text-gray-900 mb-2">Story Description</h4>
            <p className="text-gray-700 leading-relaxed">{formData.story_description}</p>
          </div>
        </CardContent>
      </Card>

      {/* Usage Information */}
      {profile && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-blue-900">Subscription: {profile.subscription_tier.toUpperCase()}</p>
                <p className="text-sm text-blue-700">This will count as 1 story creation towards your monthly limit</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-blue-600">Estimated generation time</p>
                <p className="font-medium text-blue-900">2-3 minutes</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Generate Button */}
      <div className="text-center">
        <Button 
          onClick={onGenerate}
          size="lg"
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-12 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <Sparkles className="h-6 w-6 mr-3" />
          Create My Magical Story
        </Button>
        <p className="text-sm text-gray-600 mt-3">
          Our AI will craft a personalized story just for {childName}
        </p>
      </div>
    </div>
  )
}
