'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Film, Plus, Edit3, Save, X, RefreshCw, Sparkles, ChevronUp, ChevronDown, Eye, Users } from 'lucide-react'
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
  const [showAddForm, setShowAddForm] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)

  // Auto-generate scenes when component mounts
  useEffect(() => {
    if (storyDescription && characters.length > 0 && scenes.length === 0) {
      handleGenerateScenes()
    }
  }, [storyDescription, characters])

  const handleGenerateScenes = async () => {
    if (!storyDescription.trim() || characters.length === 0) return

    setIsGenerating(true)
    try {
      const generatedScenes = await generateScenes(storyDescription, characters, 8)
      const formattedScenes: Scene[] = generatedScenes.map((scene, index) => ({
        id: `scene-${Date.now()}-${index}`,
        title: scene.title,
        description: scene.description,
        characters: scene.characters,
        order: index + 1,
        imageUrl: `/placeholder.svg?height=200&width=300&text=Scene+${index + 1}`
      }))
      onScenesUpdate(formattedScenes)
    } catch (error) {
      console.error('Error generating scenes:', error)
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
      order: scenes.length + 1,
      imageUrl: `/placeholder.svg?height=200&width=300&text=${newScene.title}`
    }

    onScenesUpdate([...scenes, scene])
    setNewScene({ title: '', description: '', characters: [] })
    setShowAddForm(false)
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

  const handleRegenerateSceneImage = (id: string) => {
    const scene = scenes.find(s => s.id === id)
    if (scene) {
      handleUpdateScene(id, {
        imageUrl: `/placeholder.svg?height=200&width=300&text=${scene.title}+v${Date.now()}`
      })
    }
  }

  const toggleCharacterInScene = (sceneId: string, characterName: string) => {
    const scene = scenes.find(s => s.id === sceneId)
    if (!scene) return

    const updatedCharacters = scene.characters.includes(characterName)
      ? scene.characters.filter(name => name !== characterName)
      : [...scene.characters, characterName]

    handleUpdateScene(sceneId, { characters: updatedCharacters })
  }

  const sortedScenes = [...scenes].sort((a, b) => a.order - b.order)

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h3 className="text-3xl font-bold text-gray-900 mb-2">
          🎬 Organize Your Story Scenes 🎬
        </h3>
        <p className="text-lg text-gray-600">
          Break down your story into magical scenes that flow perfectly together
        </p>
      </div>

      {/* Scene Generation */}
      {scenes.length === 0 && (
        <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
          <CardContent className="p-6 text-center">
            <Film className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h4 className="text-xl font-semibold text-gray-900 mb-2">
              Let AI Create Your Scenes
            </h4>
            <p className="text-gray-600 mb-4">
              Our AI will break down your story into perfectly paced scenes with your characters
            </p>
            <Button
              onClick={handleGenerateScenes}
              disabled={isGenerating || !storyDescription.trim() || characters.length === 0}
              size="lg"
              className="bg-green-500 hover:bg-green-600"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                  Creating Scenes...
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5 mr-2" />
                  Generate Story Scenes
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Scene Management Controls */}
      {scenes.length > 0 && (
        <div className="flex items-center justify-between">
          <h4 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
            <Film className="h-6 w-6 text-green-500" />
            <span>Story Scenes ({scenes.length})</span>
          </h4>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => setPreviewMode(!previewMode)}
              size="sm"
            >
              <Eye className="h-4 w-4 mr-2" />
              {previewMode ? 'Edit Mode' : 'Preview Mode'}
            </Button>
            <Button
              variant="outline"
              onClick={handleGenerateScenes}
              disabled={isGenerating}
              size="sm"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Regenerate
            </Button>
            <Button
              onClick={() => setShowAddForm(true)}
              size="sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Scene
            </Button>
          </div>
        </div>
      )}

      {/* Scene List */}
      {scenes.length > 0 && (
        <div className="space-y-4">
          {sortedScenes.map((scene, index) => (
            <Card key={scene.id} className="relative">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="bg-green-100 p-2 rounded-full">
                      <span className="text-green-600 font-bold text-sm">
                        {scene.order}
                      </span>
                    </div>
                    <div>
                      <CardTitle className="text-lg">{scene.title}</CardTitle>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          Scene {scene.order}
                        </Badge>
                        {scene.characters.length > 0 && (
                          <Badge variant="secondary" className="text-xs">
                            {scene.characters.length} character{scene.characters.length !== 1 ? 's' : ''}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {!previewMode && (
                    <div className="flex items-center space-x-1">
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
                        disabled={index === scenes.length - 1}
                      >
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingScene(
                          editingScene === scene.id ? null : scene.id
                        )}
                      >
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteScene(scene.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Scene Image */}
                  <div className="text-center">
                    <img
                      src={scene.imageUrl || `/placeholder.svg?height=150&width=200&text=Scene+${scene.order}`}
                      alt={scene.title}
                      className="w-full h-32 object-cover rounded-lg border"
                    />
                    {!previewMode && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRegenerateSceneImage(scene.id)}
                        className="mt-2"
                      >
                        <RefreshCw className="h-3 w-3 mr-1" />
                        New Image
                      </Button>
                    )}
                  </div>

                  {/* Scene Content */}
                  <div className="space-y-3">
                    {editingScene === scene.id && !previewMode ? (
                      <div className="space-y-3">
                        <div>
                          <Label>Scene Title</Label>
                          <Input
                            value={scene.title}
                            onChange={(e) => handleUpdateScene(scene.id, { title: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label>Scene Description</Label>
                          <Textarea
                            value={scene.description}
                            onChange={(e) => handleUpdateScene(scene.id, { description: e.target.value })}
                            rows={3}
                          />
                        </div>
                        <Button
                          onClick={() => setEditingScene(null)}
                          size="sm"
                        >
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {scene.description}
                        </p>
                        
                        {/* Characters in Scene */}
                        {!previewMode ? (
                          <div>
                            <Label className="text-sm font-medium">Characters in this scene</Label>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {characters.map((character) => (
                                <Button
                                  key={character.name}
                                  type="button"
                                  variant={scene.characters.includes(character.name) ? "default" : "outline"}
                                  size="sm"
                                  onClick={() => toggleCharacterInScene(scene.id, character.name)}
                                  className="text-xs"
                                >
                                  {character.name}
                                </Button>
                              ))}
                            </div>
                          </div>
                        ) : (
                          scene.characters.length > 0 && (
                            <div>
                              <Label className="text-sm font-medium">Characters</Label>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {scene.characters.map((characterName) => (
                                  <Badge key={characterName} variant="secondary" className="text-xs">
                                    {characterName}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add New Scene Form */}
      {showAddForm && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-blue-900">
              <Plus className="h-5 w-5" />
              <span>Add New Scene</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Scene Title</Label>
              <Input
                value={newScene.title || ''}
                onChange={(e) => setNewScene(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter scene title..."
              />
            </div>
            
            <div>
              <Label>Scene Description</Label>
              <Textarea
                value={newScene.description || ''}
                onChange={(e) => setNewScene(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe what happens in this scene..."
                rows={3}
              />
            </div>

            <div>
              <Label>Characters in Scene</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {characters.map((character) => (
                  <Button
                    key={character.name}
                    type="button"
                    variant={(newScene.characters || []).includes(character.name) ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      const currentChars = newScene.characters || []
                      const updatedChars = currentChars.includes(character.name)
                        ? currentChars.filter(name => name !== character.name)
                        : [...currentChars, character.name]
                      setNewScene(prev => ({ ...prev, characters: updatedChars }))
                    }}
                    className="text-xs"
                  >
                    {character.name}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex space-x-2">
              <Button
                onClick={handleAddScene}
                disabled={!newScene.title?.trim()}
                className="flex-1"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Scene
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowAddForm(false)
                  setNewScene({ title: '', description: '', characters: [] })
                }}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Scene Flow Alert */}
      {scenes.length > 0 && (
        <Alert className="border-green-200 bg-green-50">
          <Film className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            <strong>Scene Flow:</strong> Your scenes are ordered to create a smooth story flow. 
            Use the up/down arrows to reorder scenes, and ensure characters appear consistently throughout the story.
          </AlertDescription>
        </Alert>
      )}

      {/* Summary */}
      {scenes.length > 0 && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-green-900">
                  {scenes.length} Scene{scenes.length !== 1 ? 's' : ''} Ready
                </p>
                <p className="text-sm text-green-700">
                  Your story structure is complete and ready for generation!
                </p>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Ready to Generate!
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
