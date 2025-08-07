'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Users, Plus, Edit3, Save, X, RefreshCw, Sparkles, User } from 'lucide-react'
import { extractCharacters } from '@/lib/ai-services'
import type { Character } from '@/app/create/page'

interface CharacterManagementStepProps {
  characters: Character[]
  storyDescription: string
  onCharactersUpdate: (characters: Character[]) => void
}

const CHARACTER_TRAITS = [
  'brave', 'kind', 'curious', 'funny', 'smart', 'helpful', 'creative', 'adventurous',
  'caring', 'energetic', 'thoughtful', 'determined', 'gentle', 'playful', 'wise', 'loyal'
]

const HAIR_COLORS = ['brown', 'blonde', 'black', 'red', 'gray', 'white', 'colorful']
const CLOTHING_STYLES = ['casual', 'formal', 'adventure gear', 'magical robes', 'superhero costume', 'princess dress', 'knight armor']

export function CharacterManagementStep({ 
  characters, 
  storyDescription, 
  onCharactersUpdate 
}: CharacterManagementStepProps) {
  const [isExtracting, setIsExtracting] = useState(false)
  const [editingCharacter, setEditingCharacter] = useState<string | null>(null)
  const [newCharacter, setNewCharacter] = useState<Partial<Character>>({
    name: '',
    description: '',
    traits: [],
    relationships: [],
    appearance: {}
  })
  const [showAddForm, setShowAddForm] = useState(false)

  // Auto-extract characters when component mounts
  useEffect(() => {
    if (storyDescription && characters.length === 0) {
      handleExtractCharacters()
    }
  }, [storyDescription])

  const handleExtractCharacters = async () => {
    if (!storyDescription.trim()) return

    setIsExtracting(true)
    try {
      const extractedCharacters = await extractCharacters(storyDescription)
      const formattedCharacters: Character[] = extractedCharacters.map((char, index) => ({
        id: `char-${Date.now()}-${index}`,
        name: char.name,
        description: char.description,
        traits: char.traits,
        relationships: char.relationships,
        appearance: {
          hairColor: HAIR_COLORS[Math.floor(Math.random() * HAIR_COLORS.length)],
          clothing: CLOTHING_STYLES[Math.floor(Math.random() * CLOTHING_STYLES.length)]
        }
      }))
      onCharactersUpdate(formattedCharacters)
    } catch (error) {
      console.error('Error extracting characters:', error)
    } finally {
      setIsExtracting(false)
    }
  }

  const handleAddCharacter = () => {
    if (!newCharacter.name?.trim()) return

    const character: Character = {
      id: `char-${Date.now()}`,
      name: newCharacter.name,
      description: newCharacter.description || '',
      traits: newCharacter.traits || [],
      relationships: newCharacter.relationships || [],
      appearance: newCharacter.appearance || {}
    }

    onCharactersUpdate([...characters, character])
    setNewCharacter({ name: '', description: '', traits: [], relationships: [], appearance: {} })
    setShowAddForm(false)
  }

  const handleUpdateCharacter = (id: string, updates: Partial<Character>) => {
    const updatedCharacters = characters.map(char =>
      char.id === id ? { ...char, ...updates } : char
    )
    onCharactersUpdate(updatedCharacters)
  }

  const handleDeleteCharacter = (id: string) => {
    onCharactersUpdate(characters.filter(char => char.id !== id))
  }

  const handleRegenerateImage = (id: string) => {
    // Mock image regeneration
    const character = characters.find(c => c.id === id)
    if (character) {
      handleUpdateCharacter(id, {
        imageUrl: `/placeholder.svg?height=200&width=200&text=${character.name}+v${Date.now()}`
      })
    }
  }

  const toggleTrait = (characterId: string, trait: string) => {
    const character = characters.find(c => c.id === characterId)
    if (!character) return

    const updatedTraits = character.traits.includes(trait)
      ? character.traits.filter(t => t !== trait)
      : [...character.traits, trait]

    handleUpdateCharacter(characterId, { traits: updatedTraits })
  }

  const toggleNewCharacterTrait = (trait: string) => {
    const currentTraits = newCharacter.traits || []
    const updatedTraits = currentTraits.includes(trait)
      ? currentTraits.filter(t => t !== trait)
      : [...currentTraits, trait]

    setNewCharacter(prev => ({ ...prev, traits: updatedTraits }))
  }

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h3 className="text-3xl font-bold text-gray-900 mb-2">
          👥 Meet Your Story Characters 👥
        </h3>
        <p className="text-lg text-gray-600">
          Let's bring your characters to life with personalities and appearances
        </p>
      </div>

      {/* Character Extraction */}
      {characters.length === 0 && (
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardContent className="p-6 text-center">
            <Sparkles className="h-12 w-12 text-blue-500 mx-auto mb-4" />
            <h4 className="text-xl font-semibold text-gray-900 mb-2">
              Let AI Find Your Characters
            </h4>
            <p className="text-gray-600 mb-4">
              Our AI will analyze your story and automatically identify the main characters
            </p>
            <Button
              onClick={handleExtractCharacters}
              disabled={isExtracting || !storyDescription.trim()}
              size="lg"
              className="bg-blue-500 hover:bg-blue-600"
            >
              {isExtracting ? (
                <>
                  <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                  Finding Characters...
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5 mr-2" />
                  Extract Characters from Story
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Character List */}
      {characters.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h4 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
              <Users className="h-6 w-6 text-purple-500" />
              <span>Story Characters ({characters.length})</span>
            </h4>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={handleExtractCharacters}
                disabled={isExtracting}
                size="sm"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Re-extract
              </Button>
              <Button
                onClick={() => setShowAddForm(true)}
                size="sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Character
              </Button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {characters.map((character) => (
              <Card key={character.id} className="relative">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="bg-purple-100 p-2 rounded-full">
                        <User className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{character.name}</CardTitle>
                        {character.age && (
                          <Badge variant="outline" className="mt-1">
                            Age: {character.age}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingCharacter(
                          editingCharacter === character.id ? null : character.id
                        )}
                      >
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteCharacter(character.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Character Image */}
                  <div className="text-center">
                    <img
                      src={character.imageUrl || `/placeholder.svg?height=150&width=150&text=${character.name}`}
                      alt={character.name}
                      className="w-32 h-32 mx-auto rounded-full object-cover border-4 border-purple-200"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRegenerateImage(character.id)}
                      className="mt-2"
                    >
                      <RefreshCw className="h-3 w-3 mr-1" />
                      New Image
                    </Button>
                  </div>

                  {editingCharacter === character.id ? (
                    <div className="space-y-4">
                      <div>
                        <Label>Character Name</Label>
                        <Input
                          value={character.name}
                          onChange={(e) => handleUpdateCharacter(character.id, { name: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>Description</Label>
                        <Textarea
                          value={character.description}
                          onChange={(e) => handleUpdateCharacter(character.id, { description: e.target.value })}
                          rows={3}
                        />
                      </div>
                      <div>
                        <Label>Character Traits</Label>
                        <div className="grid grid-cols-3 gap-2 mt-2">
                          {CHARACTER_TRAITS.map((trait) => (
                            <Button
                              key={trait}
                              type="button"
                              variant={character.traits.includes(trait) ? "default" : "outline"}
                              size="sm"
                              onClick={() => toggleTrait(character.id, trait)}
                              className="text-xs"
                            >
                              {trait}
                            </Button>
                          ))}
                        </div>
                      </div>
                      <Button
                        onClick={() => setEditingCharacter(null)}
                        size="sm"
                        className="w-full"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-600">{character.description}</p>
                      </div>
                      
                      {character.traits.length > 0 && (
                        <div>
                          <Label className="text-sm font-medium">Traits</Label>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {character.traits.map((trait) => (
                              <Badge key={trait} variant="secondary" className="text-xs">
                                {trait}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {character.appearance && (
                        <div>
                          <Label className="text-sm font-medium">Appearance</Label>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {character.appearance.hairColor && (
                              <Badge variant="outline" className="text-xs">
                                {character.appearance.hairColor} hair
                              </Badge>
                            )}
                            {character.appearance.clothing && (
                              <Badge variant="outline" className="text-xs">
                                {character.appearance.clothing}
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}

                      {character.relationships.length > 0 && (
                        <div>
                          <Label className="text-sm font-medium">Relationships</Label>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {character.relationships.map((rel) => (
                              <Badge key={rel} variant="outline" className="text-xs">
                                {rel}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Add New Character Form */}
      {showAddForm && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-green-900">
              <Plus className="h-5 w-5" />
              <span>Add New Character</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Character Name</Label>
              <Input
                value={newCharacter.name || ''}
                onChange={(e) => setNewCharacter(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter character name..."
              />
            </div>
            
            <div>
              <Label>Description</Label>
              <Textarea
                value={newCharacter.description || ''}
                onChange={(e) => setNewCharacter(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe this character..."
                rows={3}
              />
            </div>

            <div>
              <Label>Character Traits</Label>
              <div className="grid grid-cols-4 gap-2 mt-2">
                {CHARACTER_TRAITS.map((trait) => (
                  <Button
                    key={trait}
                    type="button"
                    variant={(newCharacter.traits || []).includes(trait) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleNewCharacterTrait(trait)}
                    className="text-xs"
                  >
                    {trait}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex space-x-2">
              <Button
                onClick={handleAddCharacter}
                disabled={!newCharacter.name?.trim()}
                className="flex-1"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Character
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowAddForm(false)
                  setNewCharacter({ name: '', description: '', traits: [], relationships: [], appearance: {} })
                }}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Character Consistency Alert */}
      {characters.length > 0 && (
        <Alert className="border-blue-200 bg-blue-50">
          <Users className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <strong>Character Consistency:</strong> These characters will appear consistently throughout all scenes in your story. 
            You can edit their appearance and traits to match your vision perfectly.
          </AlertDescription>
        </Alert>
      )}

      {/* Summary */}
      {characters.length > 0 && (
        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-purple-900">
                  {characters.length} Character{characters.length !== 1 ? 's' : ''} Ready
                </p>
                <p className="text-sm text-purple-700">
                  Your characters are ready for scene creation!
                </p>
              </div>
              <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                Ready for Scenes!
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
