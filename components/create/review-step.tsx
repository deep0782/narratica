'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { StoryFormData } from '@/app/create/page'
import { Edit, User, Palette, Users, Film, BookOpen, Settings, Sparkles } from 'lucide-react'

interface ReviewStepProps {
  formData: StoryFormData
  onGenerate: () => void
  onPrev: () => void
  onEdit: (stepIndex: number) => void
}

export function ReviewStep({ formData, onGenerate, onPrev, onEdit }: ReviewStepProps) {
  const isComplete = formData.child_name && formData.story_input && formData.art_style

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-gray-900">Review Your Story</h2>
        <p className="text-gray-600">
          Review all the details before we create your personalized story
        </p>
      </div>

      <div className="grid gap-6">
        {/* Child Profile */}
        <Card className="border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex items-center space-x-2">
              <User className="w-5 h-5 text-purple-600" />
              <CardTitle className="text-lg">Child Profile</CardTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(0)}
              className="text-purple-600 hover:text-purple-700"
            >
              <Edit className="w-4 h-4 mr-1" />
              Edit
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <span className="font-medium">Name:</span> {formData.child_name || 'Not specified'}
            </div>
            <div>
              <span className="font-medium">Age:</span> {formData.child_age} years old
            </div>
            <div>
              <span className="font-medium">Interests:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {formData.child_interests && formData.child_interests.length > 0 ? (
                  formData.child_interests.map((interest, index) => (
                    <Badge key={index} variant="secondary" className="bg-purple-100 text-purple-700">
                      {interest}
                    </Badge>
                  ))
                ) : (
                  <span className="text-gray-500">None specified</span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Story Input */}
        <Card className="border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              <CardTitle className="text-lg">Story Input</CardTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(1)}
              className="text-blue-600 hover:text-blue-700"
            >
              <Edit className="w-4 h-4 mr-1" />
              Edit
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <span className="font-medium">Story Ideas:</span>
              <p className="mt-1 text-gray-700 bg-gray-50 p-3 rounded-lg">
                {formData.story_input || 'No story input provided'}
              </p>
            </div>
            {formData.story_description && (
              <div>
                <span className="font-medium">Description:</span>
                <p className="mt-1 text-gray-700">{formData.story_description}</p>
              </div>
            )}
            {formData.specific_elements && formData.specific_elements.length > 0 && (
              <div>
                <span className="font-medium">Specific Elements:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {formData.specific_elements.map((element, index) => (
                    <Badge key={index} variant="outline" className="border-blue-200 text-blue-700">
                      {element}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Art Style */}
        <Card className="border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex items-center space-x-2">
              <Palette className="w-5 h-5 text-green-600" />
              <CardTitle className="text-lg">Art Style</CardTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(2)}
              className="text-green-600 hover:text-green-700"
            >
              <Edit className="w-4 h-4 mr-1" />
              Edit
            </Button>
          </CardHeader>
          <CardContent>
            <Badge variant="secondary" className="bg-green-100 text-green-700 text-base px-3 py-1">
              {formData.art_style || 'Not selected'}
            </Badge>
          </CardContent>
        </Card>

        {/* Characters */}
        <Card className="border-orange-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-orange-600" />
              <CardTitle className="text-lg">Characters</CardTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(3)}
              className="text-orange-600 hover:text-orange-700"
            >
              <Edit className="w-4 h-4 mr-1" />
              Edit
            </Button>
          </CardHeader>
          <CardContent>
            {formData.characters && formData.characters.length > 0 ? (
              <div className="space-y-2">
                {formData.characters.map((character, index) => (
                  <div key={character.id} className="flex items-center justify-between p-2 bg-orange-50 rounded-lg">
                    <div>
                      <span className="font-medium">{character.name}</span>
                      <span className="text-sm text-gray-600 ml-2">({character.role})</span>
                      {character.isMainCharacter && (
                        <Badge variant="secondary" className="ml-2 bg-orange-200 text-orange-800 text-xs">
                          Main Character
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No characters added yet</p>
            )}
          </CardContent>
        </Card>

        {/* Scenes */}
        <Card className="border-pink-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex items-center space-x-2">
              <Film className="w-5 h-5 text-pink-600" />
              <CardTitle className="text-lg">Scenes</CardTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(4)}
              className="text-pink-600 hover:text-pink-700"
            >
              <Edit className="w-4 h-4 mr-1" />
              Edit
            </Button>
          </CardHeader>
          <CardContent>
            {formData.scenes && formData.scenes.length > 0 ? (
              <div className="space-y-2">
                {formData.scenes
                  .sort((a, b) => a.order - b.order)
                  .map((scene, index) => (
                    <div key={scene.id} className="flex items-center justify-between p-2 bg-pink-50 rounded-lg">
                      <div>
                        <span className="font-medium">Scene {index + 1}: {scene.title}</span>
                        <p className="text-sm text-gray-600 mt-1">{scene.description}</p>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-gray-500">No scenes added yet</p>
            )}
          </CardContent>
        </Card>

        {/* Story Details & Preferences */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-indigo-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center space-x-2">
                <BookOpen className="w-5 h-5 text-indigo-600" />
                <CardTitle className="text-lg">Story Details</CardTitle>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(5)}
                className="text-indigo-600 hover:text-indigo-700"
              >
                <Edit className="w-4 h-4 mr-1" />
                Edit
              </Button>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <span className="font-medium">Title:</span> {formData.title || 'Auto-generated'}
              </div>
              <div>
                <span className="font-medium">Genre:</span> {formData.genre || 'Not specified'}
              </div>
              <div>
                <span className="font-medium">Theme:</span> {formData.theme || 'Not specified'}
              </div>
              {formData.educational_theme && (
                <div>
                  <span className="font-medium">Educational Theme:</span> {formData.educational_theme}
                </div>
              )}
              {formData.moral_lesson && (
                <div>
                  <span className="font-medium">Moral Lesson:</span> {formData.moral_lesson}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-teal-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center space-x-2">
                <Settings className="w-5 h-5 text-teal-600" />
                <CardTitle className="text-lg">Preferences</CardTitle>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(6)}
                className="text-teal-600 hover:text-teal-700"
              >
                <Edit className="w-4 h-4 mr-1" />
                Edit
              </Button>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <span className="font-medium">Length:</span> {formData.length}
              </div>
              <div>
                <span className="font-medium">Reading Level:</span> {formData.reading_level}
              </div>
              <div>
                <span className="font-medium">Language:</span> {formData.language}
              </div>
              <div>
                <span className="font-medium">Include Moral:</span> {formData.include_moral ? 'Yes' : 'No'}
              </div>
              <div>
                <span className="font-medium">Interactive Elements:</span> {formData.interactive_elements ? 'Yes' : 'No'}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Separator />

      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={onPrev}
          className="border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          Previous
        </Button>

        <div className="text-center">
          {!isComplete && (
            <p className="text-sm text-amber-600 mb-2">
              Please complete required fields before generating
            </p>
          )}
          <Button
            onClick={onGenerate}
            disabled={!isComplete}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 text-lg font-semibold"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Generate My Story
          </Button>
        </div>
      </div>
    </div>
  )
}
