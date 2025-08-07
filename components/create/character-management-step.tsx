'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Users, Plus, Edit3, Trash2, Wand2, RefreshCw, User, Sparkles, Heart } from 'lucide-react'
import { extractCharacters } from '@/lib/ai-services'
import type { Character } from '@/app/create/page'

interface CharacterManagementStepProps {
  characters: Character[]
  storyDescription: string
  onCharactersUpdate: (characters: Character[]) => void
}

const CHARACTER_TRAITS = [
  'brave', 'kind', 'funny', 'smart', 'creative', 'helpful', 'curious', 'adventurous',
  'gentle', 'loyal', 'cheerful', 'wise', 'magical', 'strong', 'caring', 'playful'
]

const HAIR_COLORS = ['brown', 'blonde', 'black', 'red', 'gray', 'white', 'colorful']
const CLOTHING_OPTIONS = ['casual', 'formal', 'magical robes', 'adventure gear', 'royal attire', 'simple clothes']

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

  useEffect(() => {
    if (characters.length === 0 && storyDescription.length > 50) {
      handleExtractCharacters()
    }
  }, [storyDescription])

  const handleExtractCharacters = async () => {
    if (!storyDescription.trim()) return
    
    setIsExtracting(true)
    try {
      const extractedChars = await extractCharacters(storyDescription)
      const newCharacters: Character[] = extractedChars.map((char, index) => ({
        id: `char-${Date.now()}-${index}`,
        name: char.name,
        description: char.description,
        traits: char.traits,
        relationships: char.relationships,
        imageUrl: '/placeholder_image.png',
        appearance: {
          hairColor: HAIR_COLORS[Math.floor(Math.random() * HAIR_COLORS.length)],
          clothing: CLOTHING_OPTIONS[Math.floor(Math.random() * CLOTHING_OPTIONS.length)],
          physicalTraits: []
        }
      }))
      onCharactersUpdate([...characters, ...newCharacters])
    } catch (error) {
      console.error('Character extraction failed:', error)
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
      imageUrl: '/placeholder_image.png',
      appearance: newCharacter.appearance || {}
    }

    onCharactersUpdate([...characters, character])
    setNewCharacter({
      name: '',
      description: '',
      traits: [],
      relationships: [],
      appearance: {}
    })
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
    // In production, this would call an image generation API
    handleUpdateCharacter(id, { 
      imageUrl: `/placeholder_image.png?t=${Date.now()}` 
    })
  }

  const toggleTrait = (characterId: string, trait: string) => {
    const character = characters.find(c => c.id === characterId)
    if (!character) return

    const newTraits = character.traits.includes(trait)
      ? character.traits.filter(t => t !== trait)
      : [...character.traits, trait]

    handleUpdateCharacter(characterId, { traits: newTraits })
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Meet your story characters
        </h3>
        <p className="text-gray-600">
          AI has found characters in your story. You can edit them or add new ones!
        </p>
      </div>

      {/* Extract Characters Button */}
      {characters.length === 0 && (
        <div className="text-center">
          <Button
            onClick={handleExtractCharacters}
            disabled={isExtracting || !storyDescription.trim()}
            size="lg"
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            {isExtracting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Finding Characters...
              </>
            ) : (
              <>
                <Wand2 className="h-5 w-5 mr-2" />
                Find Characters in Story
              </>
            )}
          </Button>
        </div>
      )}

      {/* Characters Grid */}
      {characters.length > 0 && (
        <div className="grid md:grid-cols-2 gap-6">
          {characters.map((character) => (
            <Card key={character.id} className="overflow-hidden">
              <div className="relative">
                <div className="aspect-video bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                  <img
                    src={character.imageUrl || "/placeholder.svg"}
                    alt={character.name}
                    className="w-full h-full object-cover"
                  />
                  <Button
                    variant="secondary"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => handleRegenerateImage(character.id)}
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <CardContent className="p-4">
                {editingCharacter === character.id ? (
                  <div className="space-y-4">
                    <Input
                      value={character.name}
                      onChange={(e) => handleUpdateCharacter(character.id, { name: e.target.value })}
                      placeholder="Character name"
                    />
                    <Textarea
                      value={character.description}
                      onChange={(e) => handleUpdateCharacter(character.id, { description: e.target.value })}
                      placeholder="Character description"
                      rows={3}
                    />
                    
                    {/* Appearance */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs">Hair Color</Label>
                        <select
                          value={character.appearance.hairColor || ''}
                          onChange={(e) => handleUpdateCharacter(character.id, {
                            appearance: { ...character.appearance, hairColor: e.target.value }
                          })}
                          className="w-full p-2 border rounded text-sm"
                        >
                          <option value="">Select...</option>
                          {HAIR_COLORS.map(color => (
                            <option key={color} value={color}>{color}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <Label className="text-xs">Clothing</Label>
                        <select
                          value={character.appearance.clothing || ''}
                          onChange={(e) => handleUpdateCharacter(character.id, {
                            appearance: { ...character.appearance, clothing: e.target.value }
                          })}
                          className="w-full p-2 border rounded text-sm"
                        >
                          <option value="">Select...</option>
                          {CLOTHING_OPTIONS.map(clothing => (
                            <option key={clothing} value={clothing}>{clothing}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        onClick={() => setEditingCharacter(null)}
                      >
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingCharacter(null)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-lg">{character.name}</h4>
                      <div className="flex space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingCharacter(character.id)}
                        >
                          <Edit3 className="h-4 w-4" />
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

                    <p className="text-gray-600 text-sm">{character.description}</p>

                    {/* Character Traits */}
                    <div>
                      <Label className="text-xs font-medium text-gray-500 mb-2 block">
                        Character Traits
                      </Label>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {character.traits.map((trait) => (
                          <Badge
                            key={trait}
                            variant="secondary"
                            className="text-xs cursor-pointer hover:bg-red-100"
                            onClick={() => toggleTrait(character.id, trait)}
                          >
                            {trait} ×
                          </Badge>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {CHARACTER_TRAITS
                          .filter(trait => !character.traits.includes(trait))
                          .slice(0, 4)
                          .map((trait) => (
                            <Badge
                              key={trait}
                              variant="outline"
                              className="text-xs cursor-pointer hover:bg-purple-50"
                              onClick={() => toggleTrait(character.id, trait)}
                            >
                              + {trait}
                            </Badge>
                          ))}
                      </div>
                    </div>

                    {/* Appearance */}
                    {(character.appearance.hairColor || character.appearance.clothing) && (
                      <div className="flex space-x-2">
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
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add New Character */}
      <Card className="border-dashed border-2 border-gray-300">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-gray-600">
            <Plus className="h-5 w-5" />
            <span>Add New Character</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Input
              placeholder="Character name"
              value={newCharacter.name || ''}
              onChange={(e) => setNewCharacter({ ...newCharacter, name: e.target.value })}
            />
            <Input
              placeholder="Age (optional)"
              value={newCharacter.age || ''}
              onChange={(e) => setNewCharacter({ ...newCharacter, age: e.target.value })}
            />
          </div>
          <Textarea
            placeholder="Describe this character..."
            value={newCharacter.description || ''}
            onChange={(e) => setNewCharacter({ ...newCharacter, description: e.target.value })}
            rows={2}
          />
          <Button
            onClick={handleAddCharacter}
            disabled={!newCharacter.name?.trim()}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Character
          </Button>
        </CardContent>
      </Card>

      {/* Re-extract Button */}
      {characters.length > 0 && (
        <div className="text-center">
          <Button
            variant="outline"
            onClick={handleExtractCharacters}
            disabled={isExtracting}
          >
            {isExtracting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                Finding More Characters...
              </>
            ) : (
              <>
                <Wand2 className="h-4 w-4 mr-2" />
                Find More Characters
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  )
}
