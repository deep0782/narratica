'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Users, Plus, Edit, Trash2, Sparkles, Wand2 } from 'lucide-react'
import type { StoryFormData, Character } from '@/app/create/page'

interface CharacterManagementStepProps {
  formData: StoryFormData
  updateFormData: (updates: Partial<StoryFormData>) => void
  onNext: () => void
  onPrev: () => void
}

export function CharacterManagementStep({ formData, updateFormData, onNext, onPrev }: CharacterManagementStepProps) {
  const [isAddingCharacter, setIsAddingCharacter] = useState(false)
  const [editingCharacter, setEditingCharacter] = useState<string | null>(null)
  const [newCharacter, setNewCharacter] = useState<Partial<Character>>({
    name: '',
    description: '',
    appearance: '',
    role: 'supporting'
  })

  const handleAddCharacter = () => {
    if (newCharacter.name && newCharacter.description) {
      const character: Character = {
        id: `char-${Date.now()}`,
        name: newCharacter.name,
        description: newCharacter.description || '',
        appearance: newCharacter.appearance || '',
        role: newCharacter.role as 'main' | 'supporting' | 'minor',
        isChildCharacter: false
      }

      updateFormData({
        characters: [...(formData.characters || []), character]
      })

      setNewCharacter({ name: '', description: '', appearance: '', role: 'supporting' })
      setIsAddingCharacter(false)
    }
  }

  const handleEditCharacter = (characterId: string) => {
    const character = formData.characters?.find(c => c.id === characterId)
    if (character) {
      setNewCharacter(character)
      setEditingCharacter(characterId)
      setIsAddingCharacter(true)
    }
  }

  const handleUpdateCharacter = () => {
    if (editingCharacter && newCharacter.name && newCharacter.description) {
      const updatedCharacters = formData.characters?.map(char =>
        char.id === editingCharacter
          ? {
              ...char,
              name: newCharacter.name!,
              description: newCharacter.description!,
              appearance: newCharacter.appearance || '',
              role: newCharacter.role as 'main' | 'supporting' | 'minor'
            }
          : char
      ) || []

      updateFormData({ characters: updatedCharacters })
      setNewCharacter({ name: '', description: '', appearance: '', role: 'supporting' })
      setIsAddingCharacter(false)
      setEditingCharacter(null)
    }
  }

  const handleDeleteCharacter = (characterId: string) => {
    const updatedCharacters = formData.characters?.filter(char => char.id !== characterId) || []
    updateFormData({ characters: updatedCharacters })
  }

  const handleExtractCharacters = () => {
    // Mock AI character extraction
    const extractedCharacters: Character[] = [
      {
        id: `extracted-${Date.now()}-1`,
        name: formData.child_name || 'Hero',
        description: 'The brave main character of our story',
        appearance: 'Curious and adventurous',
        role: 'main',
        isChildCharacter: true
      },
      {
        id: `extracted-${Date.now()}-2`,
        name: 'Wise Owl',
        description: 'A helpful guide who provides wisdom and advice',
        appearance: 'Large brown owl with golden eyes',
        role: 'supporting',
        isChildCharacter: false
      }
    ]

    updateFormData({
      extractedCharacters: extractedCharacters
    })
  }

  const allCharacters = [...(formData.characters || []), ...(formData.extractedCharacters || [])]
  const canProceed = allCharacters.length > 0

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-gray-900">Manage Your Characters</h2>
        <p className="text-gray-600">
          Add characters to your story or let AI extract them from your description
        </p>
      </div>

      {/* AI Character Extraction */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wand2 className="h-5 w-5 text-blue-600" />
            AI Character Detection
          </CardTitle>
          <CardDescription>
            Let AI analyze your story description and suggest characters
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleExtractCharacters} className="bg-blue-600 hover:bg-blue-700">
            <Sparkles className="h-4 w-4 mr-2" />
            Extract Characters from Story
          </Button>
        </CardContent>
      </Card>

      {/* Character List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Users className="h-5 w-5" />
            Your Characters ({allCharacters.length})
          </h3>
          <Button
            onClick={() => setIsAddingCharacter(true)}
            className="bg-green-600 hover:bg-green-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Character
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {allCharacters.map((character) => (
            <Card key={character.id} className="relative">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{character.name}</CardTitle>
                    <div className="flex gap-2 mt-1">
                      <Badge variant={character.role === 'main' ? 'default' : 'secondary'}>
                        {character.role}
                      </Badge>
                      {character.isChildCharacter && (
                        <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                          Child Character
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditCharacter(character.id)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteCharacter(character.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-gray-700 text-sm mb-2">{character.description}</p>
                {character.appearance && (
                  <p className="text-gray-600 text-xs">
                    <strong>Appearance:</strong> {character.appearance}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {allCharacters.length === 0 && (
          <Card className="border-dashed border-2 border-gray-300">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Users className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Characters Yet</h3>
              <p className="text-gray-600 text-center mb-4">
                Add characters manually or use AI to extract them from your story description
              </p>
              <Button onClick={() => setIsAddingCharacter(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Character
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Add/Edit Character Form */}
      {isAddingCharacter && (
        <Card className="border-purple-200 bg-purple-50">
          <CardHeader>
            <CardTitle>
              {editingCharacter ? 'Edit Character' : 'Add New Character'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="char-name">Character Name</Label>
                <Input
                  id="char-name"
                  value={newCharacter.name || ''}
                  onChange={(e) => setNewCharacter({ ...newCharacter, name: e.target.value })}
                  placeholder="Enter character name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="char-role">Role</Label>
                <Select
                  value={newCharacter.role}
                  onValueChange={(value) => setNewCharacter({ ...newCharacter, role: value as 'main' | 'supporting' | 'minor' })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="main">Main Character</SelectItem>
                    <SelectItem value="supporting">Supporting Character</SelectItem>
                    <SelectItem value="minor">Minor Character</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="char-description">Description</Label>
              <Textarea
                id="char-description"
                value={newCharacter.description || ''}
                onChange={(e) => setNewCharacter({ ...newCharacter, description: e.target.value })}
                placeholder="Describe the character's personality, background, and role in the story"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="char-appearance">Appearance (Optional)</Label>
              <Input
                id="char-appearance"
                value={newCharacter.appearance || ''}
                onChange={(e) => setNewCharacter({ ...newCharacter, appearance: e.target.value })}
                placeholder="Describe how the character looks"
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={editingCharacter ? handleUpdateCharacter : handleAddCharacter}
                disabled={!newCharacter.name || !newCharacter.description}
              >
                {editingCharacter ? 'Update Character' : 'Add Character'}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsAddingCharacter(false)
                  setEditingCharacter(null)
                  setNewCharacter({ name: '', description: '', appearance: '', role: 'supporting' })
                }}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrev}>
          Back to Art Style
        </Button>
        <Button 
          onClick={onNext}
          disabled={!canProceed}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
        >
          Continue to Scenes
        </Button>
      </div>
    </div>
  )
}
