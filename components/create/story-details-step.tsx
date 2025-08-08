'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { PenTool, Lightbulb, MapPin, Star, Plus, X } from 'lucide-react'
import { useWizard, useCanProceed } from '@/contexts/wizard-context'

interface StoryDetailsStepProps {
  onNext: () => void
  onPrev: () => void
}

const SETTING_OPTIONS = [
  'Magical Forest', 'Underwater Kingdom', 'Space Adventure', 'Medieval Castle',
  'Modern City', 'Farm Countryside', 'Desert Oasis', 'Mountain Village',
  'Pirate Ship', 'Fairy Garden', 'Dinosaur Land', 'Robot City'
]

const ELEMENT_SUGGESTIONS = [
  'Talking Animals', 'Magic Powers', 'Treasure Hunt', 'Flying Adventure',
  'Time Travel', 'Invisible Friend', 'Secret Door', 'Magical Creature',
  'Super Powers', 'Mystery to Solve', 'Lost Pet', 'New Friend'
]

export function StoryDetailsStep({ onNext, onPrev }: StoryDetailsStepProps) {
  const { state: { formData }, updateForm } = useWizard()
  const canProceed = useCanProceed()
  const [newElement, setNewElement] = useState('')

  const addSpecificElement = (element: string) => {
    if (element && !formData.specific_elements.includes(element)) {
      updateForm({
        specific_elements: [...formData.specific_elements, element]
      })
    }
    setNewElement('')
  }

  const removeSpecificElement = (element: string) => {
    updateForm({
      specific_elements: formData.specific_elements.filter(e => e !== element)
    })
  }

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Tell us about your story idea
        </h3>
        <p className="text-gray-600">
          Describe what kind of adventure you'd like to create for your child
        </p>
      </div>

      {/* Story Description */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <PenTool className="h-5 w-5 text-blue-500" />
            <span>Story Description</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="story-description">
              Describe the story you'd like to create
            </Label>
            <p className="text-sm text-gray-600 mb-2">
              Tell us about the adventure, the challenges, or the lesson you want your child to learn
            </p>
            <Textarea
              id="story-description"
              value={formData.story_description}
              onChange={(e) => updateForm({ story_description: e.target.value })}
              placeholder="Example: I want a story where my child goes on a magical adventure to help a lost dragon find its way home, learning about friendship and helping others along the way..."
              className="min-h-[120px]"
            />
            <div className="text-sm text-gray-500 mt-1">
              {formData.story_description.length}/500 characters
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Character Role */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Star className="h-5 w-5 text-yellow-500" />
            <span>Character Role</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label>How should your child appear in the story?</Label>
            <Select 
              value={formData.character_role} 
              onValueChange={(value: 'protagonist' | 'supporting' | 'narrator') => 
                updateForm({ character_role: value })
              }
            >
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="protagonist">
                  <div>
                    <div className="font-medium">Main Hero</div>
                    <div className="text-sm text-gray-500">Your child is the main character driving the story</div>
                  </div>
                </SelectItem>
                <SelectItem value="supporting">
                  <div>
                    <div className="font-medium">Supporting Character</div>
                    <div className="text-sm text-gray-500">Your child helps the main character on their journey</div>
                  </div>
                </SelectItem>
                <SelectItem value="narrator">
                  <div>
                    <div className="font-medium">Story Narrator</div>
                    <div className="text-sm text-gray-500">Your child tells the story as it unfolds</div>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Setting Preference */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="h-5 w-5 text-green-500" />
            <span>Story Setting (Optional)</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label>Where would you like the story to take place?</Label>
            <Select 
              value={formData.setting_preference || 'ai-choice'} 
              onValueChange={(value) => updateForm({ 
                setting_preference: value === 'ai-choice' ? undefined : value 
              })}
            >
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Let AI choose the perfect setting" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ai-choice">Let AI choose the perfect setting</SelectItem>
                {SETTING_OPTIONS.map((setting) => (
                  <SelectItem key={setting} value={setting}>
                    {setting}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Specific Elements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Lightbulb className="h-5 w-5 text-purple-500" />
            <span>Story Elements (Optional)</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Add specific elements you'd like in the story</Label>
            <p className="text-sm text-gray-600 mb-3">
              Choose from suggestions or add your own ideas
            </p>
            
            {/* Current Elements */}
            {formData.specific_elements.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {formData.specific_elements.map((element) => (
                  <Badge key={element} variant="secondary" className="flex items-center space-x-1">
                    <span>{element}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 hover:bg-transparent"
                      onClick={() => removeSpecificElement(element)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            )}

            {/* Add Custom Element */}
            <div className="flex space-x-2 mb-4">
              <Input
                value={newElement}
                onChange={(e) => setNewElement(e.target.value)}
                placeholder="Add your own element..."
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    addSpecificElement(newElement)
                  }
                }}
              />
              <Button
                type="button"
                onClick={() => addSpecificElement(newElement)}
                disabled={!newElement.trim()}
                size="sm"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* Suggested Elements */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Suggestions:</p>
              <div className="flex flex-wrap gap-2">
                {ELEMENT_SUGGESTIONS.filter(suggestion => 
                  !formData.specific_elements.includes(suggestion)
                ).map((suggestion) => (
                  <Button
                    key={suggestion}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addSpecificElement(suggestion)}
                    className="text-sm"
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Moral Lesson */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Star className="h-5 w-5 text-orange-500" />
            <span>Moral Lesson (Optional)</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="moral-lesson">
              What lesson would you like your child to learn?
            </Label>
            <Input
              id="moral-lesson"
              value={formData.moral_lesson || ''}
              onChange={(e) => updateForm({ moral_lesson: e.target.value || undefined })}
              placeholder="Example: The importance of helping others, being brave when scared, etc."
              className="mt-2"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
