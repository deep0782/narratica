"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Film,
  Plus,
  Edit,
  Trash2,
  ArrowUp,
  ArrowDown,
  Wand2,
  Sparkles,
  ImageIcon,
  RefreshCw,
  AlertCircle,
} from "lucide-react"
import { useWizard, useCanProceed } from "@/contexts/wizard-context"
import type { Scene } from "@/app/create/page"

interface SceneManagementStepProps {
  onNext: () => void
  onPrev: () => void
}

const SCENE_MOODS = [
  "Happy",
  "Exciting",
  "Mysterious",
  "Peaceful",
  "Adventurous",
  "Magical",
  "Suspenseful",
  "Heartwarming",
  "Dramatic",
  "Playful",
]

export function SceneManagementStep({ onNext, onPrev }: SceneManagementStepProps) {
  const {
    state: { formData },
    updateForm,
  } = useWizard()
  const canProceed = useCanProceed()
  const [isAddingScene, setIsAddingScene] = useState(false)
  const [editingScene, setEditingScene] = useState<string | null>(null)
  const [newScene, setNewScene] = useState<Partial<Scene & { imageUrl?: string }>>({
    title: "",
    description: "",
    setting: "",
    mood: "Happy",
    keyEvents: [],
    characters: [],
    narration: "",
    imagePrompt: "",
    imageUrl: "",
  })
  const [generatingImage, setGeneratingImage] = useState<string | null>(null)
  const [imageError, setImageError] = useState<string | null>(null)

  const generateSceneImage = async (sceneId?: string) => {
    const scene = sceneId
      ? formData.scenes?.find((s) => s.id === sceneId) || formData.generatedScenes?.find((s) => s.id === sceneId)
      : newScene

    if (!scene?.title || !scene?.description) {
      setImageError("Please provide scene title and description first")
      return
    }

    const targetId = sceneId || "new"
    setGeneratingImage(targetId)
    setImageError(null)

    try {
      const prompt =
        scene.imagePrompt ||
        `Children's book illustration, ${scene.setting || ""} scene with ${scene.mood?.toLowerCase() || "happy"} mood. ${scene.description}. Whimsical and colorful, cartoon style, bright colors, storybook art`

      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          steps: 30,
          guidance_scale: 7.5,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate image")
      }

      const data = await response.json()
      const imageUrl = `data:image/png;base64,${data.imageUrl}`

      if (sceneId) {
        // Update existing scene
        const scenes = [...(formData.scenes || []), ...(formData.generatedScenes || [])]
        const updatedScenes = scenes.map((s) => (s.id === sceneId ? { ...s, imageUrl } : s))

        const regularScenes = updatedScenes.filter((s) => formData.scenes?.some((fs) => fs.id === s.id))
        const generatedScenes = updatedScenes.filter((s) => formData.generatedScenes?.some((gs) => gs.id === s.id))

        updateForm({
          scenes: regularScenes.length > 0 ? regularScenes : undefined,
          generatedScenes: generatedScenes.length > 0 ? generatedScenes : undefined,
        })
      } else {
        // Update new scene being created
        setNewScene((prev) => ({ ...prev, imageUrl }))
      }
    } catch (error) {
      console.error("Error generating scene image:", error)
      setImageError("Failed to generate scene image. Please try again.")
    } finally {
      setGeneratingImage(null)
    }
  }

  const handleAddScene = () => {
    if (newScene.title && newScene.description) {
      const scene: Scene & { imageUrl?: string } = {
        id: `scene-${Date.now()}`,
        title: newScene.title,
        description: newScene.description || "",
        setting: newScene.setting || "",
        mood: newScene.mood || "Happy",
        keyEvents: newScene.keyEvents || [],
        characters: newScene.characters || [],
        imagePrompt:
          newScene.imagePrompt ||
          `Children's book illustration, ${newScene.setting || ""} scene with ${newScene.mood?.toLowerCase() || "happy"} mood. ${newScene.description}`,
        narration: newScene.narration || newScene.description || "",
        order: (formData.scenes?.length || 0) + 1,
        imageUrl: newScene.imageUrl,
      }

      updateForm({
        scenes: [...(formData.scenes || []), scene],
      })

      setNewScene({
        title: "",
        description: "",
        setting: "",
        mood: "Happy",
        keyEvents: [],
        characters: [],
        narration: "",
      })
      setIsAddingScene(false)
    }
  }

  const handleEditScene = (sceneId: string) => {
    const scene = formData.scenes?.find((s) => s.id === sceneId)
    if (scene) {
      setNewScene(scene)
      setEditingScene(sceneId)
      setIsAddingScene(true)
    }
  }

  const handleUpdateScene = () => {
    if (editingScene && newScene.title && newScene.description) {
      const updatedScenes =
        formData.scenes?.map((scene) =>
          scene.id === editingScene
            ? {
                ...scene,
                title: newScene.title!,
                description: newScene.description!,
                setting: newScene.setting || "",
                mood: newScene.mood || "Happy",
                keyEvents: newScene.keyEvents || [],
                characters: newScene.characters || [],
                narration: newScene.narration || newScene.description || "",
              }
            : scene,
        ) || []

      updateForm({ scenes: updatedScenes })
      setNewScene({
        title: "",
        description: "",
        setting: "",
        mood: "Happy",
        keyEvents: [],
        characters: [],
        narration: "",
      })
      setIsAddingScene(false)
      setEditingScene(null)
    }
  }

  const handleDeleteScene = (sceneId: string) => {
    const updatedScenes = formData.scenes?.filter((scene) => scene.id !== sceneId) || []
    // Reorder remaining scenes
    const reorderedScenes = updatedScenes.map((scene, index) => ({
      ...scene,
      order: index + 1,
    }))
    updateForm({ scenes: reorderedScenes })
  }

  const handleMoveScene = (sceneId: string, direction: "up" | "down") => {
    const scenes = formData.scenes || []
    const sceneIndex = scenes.findIndex((s) => s.id === sceneId)

    if (sceneIndex === -1) return

    const newIndex = direction === "up" ? sceneIndex - 1 : sceneIndex + 1

    if (newIndex < 0 || newIndex >= scenes.length) return

    const newScenes = [...scenes]
    const [movedScene] = newScenes.splice(sceneIndex, 1)
    newScenes.splice(newIndex, 0, movedScene)

    // Update order numbers
    const reorderedScenes = newScenes.map((scene, index) => ({
      ...scene,
      order: index + 1,
    }))

    updateForm({ scenes: reorderedScenes })
  }

  const handleGenerateScenes = () => {
    // Mock AI scene generation
    const generatedScenes: Scene[] = [
      {
        id: `generated-${Date.now()}-1`,
        title: "The Beginning",
        description: "Our story starts in a familiar place where adventure awaits",
        setting: "Home/Starting location",
        mood: "Peaceful",
        keyEvents: ["Introduction", "Call to adventure"],
        characters: [],
        imagePrompt: "Peaceful home setting with adventure beginning",
        narration: "Once upon a time, in a cozy little house, our adventure was about to begin...",
        order: 1,
      },
      {
        id: `generated-${Date.now()}-2`,
        title: "The Challenge",
        description: "A problem or challenge appears that needs to be solved",
        setting: "Adventure location",
        mood: "Exciting",
        keyEvents: ["Problem introduced", "Decision to help"],
        characters: [],
        imagePrompt: "Exciting adventure location with challenge",
        narration: "Suddenly, a challenge appeared that would test our hero's courage and kindness...",
        order: 2,
      },
      {
        id: `generated-${Date.now()}-3`,
        title: "The Resolution",
        description: "The challenge is overcome through wisdom and friendship",
        setting: "Resolution location",
        mood: "Heartwarming",
        keyEvents: ["Problem solved", "Lesson learned"],
        characters: [],
        imagePrompt: "Heartwarming resolution scene",
        narration: "With kindness and determination, our hero found the perfect solution...",
        order: 3,
      },
    ]

    updateForm({
      generatedScenes: generatedScenes,
    })
  }

  const allScenes = [...(formData.scenes || []), ...(formData.generatedScenes || [])].sort((a, b) => a.order - b.order)
  const hasProceed = allScenes.length > 0

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-gray-900">Organize Your Scenes</h2>
        <p className="text-gray-600">Structure your story by adding scenes or let AI generate them for you</p>
      </div>

      {/* AI Scene Generation */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wand2 className="h-5 w-5 text-green-600" />
            AI Scene Generation
          </CardTitle>
          <CardDescription>Let AI create a story structure based on your description and characters</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleGenerateScenes} className="bg-green-600 hover:bg-green-700">
            <Sparkles className="h-4 w-4 mr-2" />
            Generate Story Scenes
          </Button>
        </CardContent>
      </Card>

      {/* Scene List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Film className="h-5 w-5" />
            Your Scenes ({allScenes.length})
          </h3>
          <Button onClick={() => setIsAddingScene(true)} className="bg-purple-600 hover:bg-purple-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Scene
          </Button>
        </div>

        <div className="space-y-6">
          {allScenes.map((scene, index) => (
            <Card key={scene.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
              <div className="flex">
                {/* Scene Image - Left Side */}
                <div className="w-80 h-64 relative group flex-shrink-0">
                  {(scene as any).imageUrl ? (
                    <img
                      src={(scene as any).imageUrl || "/placeholder.svg"}
                      alt={scene.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      {generatingImage === scene.id ? (
                        <RefreshCw className="h-12 w-12 text-gray-400 animate-spin" />
                      ) : (
                        <ImageIcon className="h-12 w-12 text-gray-400" />
                      )}
                    </div>
                  )}

                  {/* Action Buttons - Visible on Image Hover */}
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-1">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleMoveScene(scene.id, "up")}
                      disabled={index === 0}
                      className="bg-white/90 hover:bg-white shadow-sm"
                    >
                      <ArrowUp className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleMoveScene(scene.id, "down")}
                      disabled={index === allScenes.length - 1}
                      className="bg-white/90 hover:bg-white shadow-sm"
                    >
                      <ArrowDown className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => generateSceneImage(scene.id)}
                      disabled={generatingImage === scene.id}
                      className="bg-white/90 hover:bg-white shadow-sm"
                    >
                      <RefreshCw className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleEditScene(scene.id)}
                      className="bg-white/90 hover:bg-white shadow-sm"
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleDeleteScene(scene.id)}
                      className="bg-red-50/90 hover:bg-red-100 text-red-600 shadow-sm"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                {/* Scene Content - Right Side */}
                <div className="flex-1 p-6">
                  <div className="space-y-4">
                    {/* Header with badges */}
                    <div className="flex items-start justify-between">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            Scene {scene.order}
                          </Badge>
                          <Badge variant="secondary" className="bg-purple-50 text-purple-700">
                            {scene.mood}
                          </Badge>
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">{scene.title}</h3>
                          <p className="text-gray-600 leading-relaxed">{scene.description}</p>
                        </div>
                      </div>
                    </div>

                    {/* Scene Details */}
                    <div className="space-y-3">
                      {scene.setting && (
                        <div>
                          <span className="text-sm font-medium text-gray-700">Setting: </span>
                          <span className="text-sm text-gray-600">{scene.setting}</span>
                        </div>
                      )}

                      {scene.narration && scene.narration !== scene.description && (
                        <div>
                          <span className="text-sm font-medium text-gray-700">Narration: </span>
                          <p className="text-sm text-gray-600 mt-1 italic">"{scene.narration}"</p>
                        </div>
                      )}

                      {scene.keyEvents && scene.keyEvents.length > 0 && (
                        <div>
                          <span className="text-sm font-medium text-gray-700 block mb-2">Key Events:</span>
                          <div className="flex flex-wrap gap-1">
                            {scene.keyEvents.map((event, eventIndex) => (
                              <Badge key={eventIndex} variant="outline" className="text-xs bg-gray-50">
                                {event}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {allScenes.length === 0 && (
          <Card className="border-dashed border-2 border-gray-300">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Film className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Scenes Yet</h3>
              <p className="text-gray-600 text-center mb-4">
                Add scenes manually or use AI to generate a story structure
              </p>
              <Button onClick={() => setIsAddingScene(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Scene
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Add/Edit Scene Form */}
      {isAddingScene && (
        <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
          <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
            <CardTitle>{editingScene ? "Edit Scene" : "Add New Scene"}</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="flex gap-6">
              {/* Form Fields - Left Side */}
              <div className="flex-1 space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="scene-title">Scene Title</Label>
                    <Input
                      id="scene-title"
                      value={newScene.title || ""}
                      onChange={(e) => setNewScene({ ...newScene, title: e.target.value })}
                      placeholder="Enter scene title"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="scene-mood">Mood</Label>
                    <Select value={newScene.mood} onValueChange={(value) => setNewScene({ ...newScene, mood: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {SCENE_MOODS.map((mood) => (
                          <SelectItem key={mood} value={mood}>
                            {mood}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="scene-description">Scene Description</Label>
                  <Textarea
                    id="scene-description"
                    value={newScene.description || ""}
                    onChange={(e) => setNewScene({ ...newScene, description: e.target.value })}
                    placeholder="Describe what happens in this scene"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="scene-setting">Setting (Optional)</Label>
                  <Input
                    id="scene-setting"
                    value={newScene.setting || ""}
                    onChange={(e) => setNewScene({ ...newScene, setting: e.target.value })}
                    placeholder="Where does this scene take place?"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="scene-narration">Narration Text (Optional)</Label>
                  <Textarea
                    id="scene-narration"
                    value={newScene.narration || ""}
                    onChange={(e) => setNewScene({ ...newScene, narration: e.target.value })}
                    placeholder="The actual text that will be read in this scene"
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="scene-image-prompt">Image Generation Prompt (Optional)</Label>
                  <Textarea
                    id="scene-image-prompt"
                    value={newScene.imagePrompt || ""}
                    onChange={(e) => setNewScene({ ...newScene, imagePrompt: e.target.value })}
                    placeholder="Customize the prompt for image generation"
                    rows={2}
                  />
                </div>
              </div>

              {/* Preview - Right Side */}
              <div className="w-80 space-y-3">
                <Label>Scene Preview</Label>
                <div className="w-full h-64 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center">
                  {newScene.imageUrl ? (
                    <img
                      src={newScene.imageUrl || "/placeholder.svg"}
                      alt={newScene.title || "Scene"}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : generatingImage === "new" ? (
                    <div className="text-center">
                      <RefreshCw className="h-12 w-12 text-gray-400 animate-spin mx-auto mb-3" />
                      <p className="text-sm text-gray-500">Generating scene image...</p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-sm text-gray-500">No image yet</p>
                    </div>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => generateSceneImage()}
                  disabled={!newScene.title || !newScene.description || generatingImage === "new"}
                  className="w-full"
                >
                  {generatingImage === "new" ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Generate Image
                    </>
                  )}
                </Button>
              </div>
            </div>

            {imageError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{imageError}</AlertDescription>
              </Alert>
            )}

            <div className="flex gap-2 pt-4 border-t">
              <Button
                onClick={editingScene ? handleUpdateScene : handleAddScene}
                disabled={!newScene.title || !newScene.description}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                {editingScene ? "Update Scene" : "Add Scene"}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsAddingScene(false)
                  setEditingScene(null)
                  setNewScene({
                    title: "",
                    description: "",
                    setting: "",
                    mood: "Happy",
                    keyEvents: [],
                    characters: [],
                    narration: "",
                  })
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
          Back to Characters
        </Button>
        <Button
          onClick={onNext}
          disabled={!canProceed}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
        >
          Continue to Review
        </Button>
      </div>
    </div>
  )
}
