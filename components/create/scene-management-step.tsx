'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Film, Plus, Edit3, Trash2, Wand2, RefreshCw, ChevronUp, ChevronDown, Users, ImageIcon } from 'lucide-react'
import { generateScenes } from '@/lib/ai-services'
import type { Scene, Character } from '@/app/create/page'

interface SceneManagementStepProps {
  scenes: Scene[]
  characters: Character[]
  storyDescription: string
  onScenesUpdate: (scenes: Scene[]) => void
}

export function SceneManagementStep({ 
  scenes, 
  characters, 
  storyDescription, 
  onScenesUpdate 
}: SceneManagementStepProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [editingScene, setEditingScene] = useState<string | null>(null)
  const [newScene, setNewScene] = useState<Partial<Scene>>({
    title: '',
    description: '',
    characters: []
  })

  useEffect(() => {
    if (scenes.length === 0 && storyDescription.length > 50 && characters.length > 0) {
      handleGenerateScenes()
    }
  }, [storyDescription, characters])

  const handleGenerateScenes = async () => {
    if (!storyDescription.trim() || characters.length === 0) return
    
    setIsGenerating(true)
    try {
      const generatedScenes = await generateScenes(storyDescription, characters, 8)
      const newScenes: Scene[] = generatedScenes.map((scene, index) => ({
        id: `scene-${Date.now()}-${index}`,
        title: scene.title,
        description: scene.description,
        characters: scene.characters,
        imageUrl: '/placeholder_image.png',
        order: index + 1
      }))
      onScenesUpdate([...scenes, ...newScenes])
    } catch (error) {
      console.error('Scene generation failed:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleAddScene = () => {
    if (!newScene.title?.trim()) return

    const scene: Scene = {
      id: `scene-${Date.now()}`,
      title: newScene.title,
      description: newScene.description || '',
      characters: newScene.characters || [],
      imageUrl: '/placeholder_image.png',
      order: scenes.length + 1
    }

    onScenesUpdate([...scenes, scene])
    setNewScene({
      title: '',
      description: '',
      characters: []
    })
  }

  const handleUpdateScene = (id: string, updates: Partial<Scene>) => {
    const updatedScenes = scenes.map(scene =>
      scene.id === id ? { ...scene, ...updates } : scene
    )
    onScenesUpdate(updatedScenes)
  }

  const handleDeleteScene = (id: string) => {
    const filteredScenes = scenes.filter(scene => scene.id !== id)
    // Reorder remaining scenes
    const reorderedScenes = filteredScenes.map((scene, index) => ({
      ...scene,
      order: index + 1
    }))
    onScenesUpdate(reorderedScenes)
  }

  const handleMoveScene = (id: string, direction: 'up' | 'down') => {
    const sceneIndex = scenes.findIndex(scene => scene.id === id)
    if (sceneIndex === -1) return

    const newScenes = [...scenes]
    const targetIndex = direction === 'up' ? sceneIndex - 1 : sceneIndex + 1

    if (targetIndex < 0 || targetIndex >= scenes.length) return

    // Swap scenes
    [newScenes[sceneIndex], newScenes[targetIndex]] = [newScenes[targetIndex], newScenes[sceneIndex]]
    
    // Update order numbers
    const reorderedScenes = newScenes.map((scene, index) => ({
      ...scene,
      order: index + 1
    }))

    onScenesUpdate(reorderedScenes)
  }

  const handleRegenerateImage = (id: string) => {
    // In production, this would call an image generation API
    handleUpdateScene(id, { 
      imageUrl: `/placeholder_image.png?t=${Date.now()}` 
    })
  }

  const toggleCharacterInScene = (sceneId: string, characterName: string) => {
    const scene = scenes.find(s => s.id === sceneId)
    if (!scene) return

    const newCharacters = scene.characters.includes(characterName)
      ? scene.characters.filter(c => c !== characterName)
      : [...scene.characters, characterName]

    handleUpdateScene(sceneId, { characters: newCharacters })
  }

  const sortedScenes = [...scenes].sort((a, b) => a.order - b.order)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Organize your story scenes
        </h3>
        <p className="text-gray-600">
          AI has broken down your story into scenes. You can edit, reorder, or add new ones!
        </p>
      </div>

      {/* Generate Scenes Button */}
      {scenes.length === 0 && (
        <div className="text-center">
          <Button
            onClick={handleGenerateScenes}
            disabled={isGenerating || !storyDescription.trim() || characters.length === 0}
            size="lg"
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Creating Scenes...
              </>
            ) : (
              <>
                <Wand2 className="h-5 w-5 mr-2" />
                Generate Story Scenes
              </>
            )}
          </Button>
          {characters.length === 0 && (
            <p className="text-sm text-gray-500 mt-2">
              Please add characters first to generate scenes
            </p>
          )}
        </div>
      )}

      {/* Scenes List */}
      {sortedScenes.length > 0 && (
        <div className="space-y-4">
          {sortedScenes.map((scene, index) => (
            <Card key={scene.id} className="overflow-hidden">
              <div className="flex">
                {/* Scene Image */}
                <div className="w-48 flex-shrink-0 relative">
                  <div className="aspect-video bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                    <img
                      src={scene.imageUrl || "/placeholder.svg"}
                      alt={scene.title}
                      className="w-full h-full object-cover"
                    />
                    <Button
                      variant="secondary"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => handleRegenerateImage(scene.id)}
                    >
                      <RefreshCw className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="absolute top-2 left-2 bg-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                    {scene.order}
                  </div>
                </div>

                {/* Scene Content */}
                <div className="flex-1 p-4">
                  {editingScene === scene.id ? (
                    <div className="space-y-4">
                      <Input
                        value={scene.title}
                        onChange={(e) => handleUpdateScene(scene.id, { title: e.target.value })}
                        placeholder="Scene title"
                      />
                      <Textarea
                        value={scene.description}
                        onChange={(e) => handleUpdateScene(scene.id, { description: e.target.value })}
                        placeholder="Scene description"
                        rows={3}
                      />
                      
                      {/* Character Selection */}
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">
                          Characters in this scene:
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {characters.map((character) => (
                            <Badge
                              key={character.name}
                              variant={scene.characters.includes(character.name) ? "default" : "outline"}
                              className="cursor-pointer"
                              onClick={() => toggleCharacterInScene(scene.id, character.name)}
                            >
                              {character.name}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          onClick={() => setEditingScene(null)}
                        >
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingScene(null)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-lg">{scene.title}</h4>
                        <div className="flex items-center space-x-1">
                          {/* Move buttons */}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleMoveScene(scene.id, 'up')}
                            disabled={index === 0}
                          >
                            <ChevronUp className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleMoveScene(scene.id, 'down')}
                            disabled={index === sortedScenes.length - 1}
                          >
                            <ChevronDown className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingScene(scene.id)}
                          >
                            <Edit3 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteScene(scene.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <p className="text-gray-600 text-sm">{scene.description}</p>

                      {/* Characters in scene */}
                      {scene.characters.length > 0 && (
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4 text-gray-400" />
                          <div className="flex flex-wrap gap-1">
                            {scene.characters.map((characterName) => (
                              <Badge key={characterName} variant="secondary" className="text-xs">
                                {characterName}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add New Scene */}
      <Card className="border-dashed border-2 border-gray-300">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-gray-600">
            <Plus className="h-5 w-5" />
            <span>Add New Scene</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Scene title"
            value={newScene.title || ''}
            onChange={(e) => setNewScene({ ...newScene, title: e.target.value })}
          />
          <Textarea
            placeholder="Describe what happens in this scene..."
            value={newScene.description || ''}
            onChange={(e) => setNewScene({ ...newScene, description: e.target.value })}
            rows={3}
          />
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Characters in this scene:
            </label>
            <div className="flex flex-wrap gap-2">
              {characters.map((character) => (
                <Badge
                  key={character.name}
                  variant={newScene.characters?.includes(character.name) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => {
                    const currentChars = newScene.characters || []
                    const newChars = currentChars.includes(character.name)
                      ? currentChars.filter(c => c !== character.name)
                      : [...currentChars, character.name]
                    setNewScene({ ...newScene, characters: newChars })
                  }}
                >
                  {character.name}
                </Badge>
              ))}
            </div>
          </div>
          <Button
            onClick={handleAddScene}
            disabled={!newScene.title?.trim()}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Scene
          </Button>
        </CardContent>
      </Card>

      {/* Re-generate Button */}
      {scenes.length > 0 && (
        <div className="text-center">
          <Button
            variant="outline"
            onClick={handleGenerateScenes}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                Generating More Scenes...
              </>
            ) : (
              <>
                <Wand2 className="h-4 w-4 mr-2" />
                Generate More Scenes
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  )
}
