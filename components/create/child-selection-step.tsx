'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Plus, User, Star, Heart } from 'lucide-react'
import { useWizard, useCanProceed } from '@/contexts/wizard-context'
import type { Child } from '@/lib/supabase'

interface ChildSelectionStepProps {
  children: Child[]
  onNext: () => void
  onPrev: () => void
}

const AGE_GROUPS = [
  { value: 'toddlers', label: 'Toddlers (2-4 years)', description: 'Simple stories with basic concepts' },
  { value: 'elementary', label: 'Elementary (5-10 years)', description: 'Adventure stories with learning themes' },
  { value: 'preteens', label: 'Preteens (11-13 years)', description: 'Complex narratives with deeper lessons' }
]

const ACTIVITY_OPTIONS = [
  'reading', 'drawing', 'playing outside', 'building blocks', 'adventure games',
  'music', 'dancing', 'sports', 'cooking', 'gardening', 'puzzles', 'crafts'
]

const TRAIT_OPTIONS = [
  'brave', 'curious', 'kind', 'adventurous', 'creative', 'helpful',
  'funny', 'smart', 'caring', 'energetic', 'thoughtful', 'determined'
]

export function ChildSelectionStep({
  children,
  selectedChild,
  newChildData,
  onChildSelect,
  onNewChildData
}: ChildSelectionStepProps) {
  const [showNewChildForm, setShowNewChildForm] = useState(false)
  const [newChild, setNewChild] = useState({
    name: '',
    age_group: 'elementary' as const,
    favorite_activities: [] as string[],
    character_traits: [] as string[]
  })

  const handleNewChildSubmit = () => {
    if (newChild.name.trim()) {
      onNewChildData(newChild)
      setShowNewChildForm(false)
    }
  }

  const toggleActivity = (activity: string) => {
    setNewChild(prev => ({
      ...prev,
      favorite_activities: prev.favorite_activities.includes(activity)
        ? prev.favorite_activities.filter(a => a !== activity)
        : [...prev.favorite_activities, activity]
    }))
  }

  const toggleTrait = (trait: string) => {
    setNewChild(prev => ({
      ...prev,
      character_traits: prev.character_traits.includes(trait)
        ? prev.character_traits.filter(t => t !== trait)
        : [...prev.character_traits, trait]
    }))
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Who will be the star of this story?
        </h3>
        <p className="text-gray-600">
          Select an existing child profile or create a new one
        </p>
      </div>

      {/* Existing Children */}
      {children.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-gray-900">Your Children</h4>
          <div className="grid md:grid-cols-2 gap-4">
            {children.map((child) => (
              <Card 
                key={child.id}
                className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                  selectedChild?.id === child.id 
                    ? 'ring-2 ring-purple-500 bg-purple-50' 
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => onChildSelect(child)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center space-x-2">
                      <div className="bg-purple-100 p-2 rounded-full">
                        <User className="h-5 w-5 text-purple-600" />
                      </div>
                      <span>{child.name}</span>
                    </CardTitle>
                    {selectedChild?.id === child.id && (
                      <div className="bg-purple-500 text-white p-1 rounded-full">
                        <Star className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Age Group</p>
                    <Badge variant="secondary">
                      {AGE_GROUPS.find(ag => ag.value === child.age_group)?.label}
                    </Badge>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Favorite Activities</p>
                    <div className="flex flex-wrap gap-1">
                      {child.favorite_activities.slice(0, 3).map((activity) => (
                        <Badge key={activity} variant="outline" className="text-xs">
                          {activity}
                        </Badge>
                      ))}
                      {child.favorite_activities.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{child.favorite_activities.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Character Traits</p>
                    <div className="flex flex-wrap gap-1">
                      {child.character_traits.slice(0, 3).map((trait) => (
                        <Badge key={trait} variant="outline" className="text-xs">
                          {trait}
                        </Badge>
                      ))}
                      {child.character_traits.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{child.character_traits.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Add New Child */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-semibold text-gray-900">Add New Child</h4>
          {!showNewChildForm && (
            <Button 
              onClick={() => setShowNewChildForm(true)}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Create New Profile</span>
            </Button>
          )}
        </div>

        {(showNewChildForm || newChildData) && (
          <Card className={newChildData ? 'ring-2 ring-purple-500 bg-purple-50' : ''}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Heart className="h-5 w-5 text-pink-500" />
                <span>New Child Profile</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="child-name">Child's Name</Label>
                <Input
                  id="child-name"
                  value={newChild.name}
                  onChange={(e) => setNewChild(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter your child's name"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="age-group">Age Group</Label>
                <Select 
                  value={newChild.age_group} 
                  onValueChange={(value: 'toddlers' | 'elementary' | 'preteens') => 
                    setNewChild(prev => ({ ...prev, age_group: value }))
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {AGE_GROUPS.map((group) => (
                      <SelectItem key={group.value} value={group.value}>
                        <div>
                          <div className="font-medium">{group.label}</div>
                          <div className="text-sm text-gray-500">{group.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Favorite Activities</Label>
                <p className="text-sm text-gray-600 mb-2">Select activities your child enjoys</p>
                <div className="grid grid-cols-3 gap-2">
                  {ACTIVITY_OPTIONS.map((activity) => (
                    <Button
                      key={activity}
                      type="button"
                      variant={newChild.favorite_activities.includes(activity) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleActivity(activity)}
                      className="justify-start text-sm"
                    >
                      {activity}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <Label>Character Traits</Label>
                <p className="text-sm text-gray-600 mb-2">Choose traits that describe your child</p>
                <div className="grid grid-cols-3 gap-2">
                  {TRAIT_OPTIONS.map((trait) => (
                    <Button
                      key={trait}
                      type="button"
                      variant={newChild.character_traits.includes(trait) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleTrait(trait)}
                      className="justify-start text-sm"
                    >
                      {trait}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="flex space-x-2 pt-4">
                <Button onClick={handleNewChildSubmit} disabled={!newChild.name.trim()}>
                  Save Child Profile
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setShowNewChildForm(false)
                    setNewChild({
                      name: '',
                      age_group: 'elementary',
                      favorite_activities: [],
                      character_traits: []
                    })
                  }}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
