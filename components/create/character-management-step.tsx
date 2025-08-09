"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Users, Plus, Edit, Trash2, Sparkles, Wand2, ImageIcon, RefreshCw, AlertCircle } from "lucide-react"
import { useWizard, useCanProceed } from "@/contexts/wizard-context"
import type { Character } from "@/app/create/page"

interface CharacterManagementStepProps {
  onNext: () => void
  onPrev: () => void
}

export function CharacterManagementStep({ onNext, onPrev }: CharacterManagementStepProps) {
  const {
    state: { formData },
    updateForm,
  } = useWizard()
  const canProceed = useCanProceed()
  const [isAddingCharacter, setIsAddingCharacter] = useState(false)
  const [editingCharacter, setEditingCharacter] = useState<string | null>(null)
  const [generatingImage, setGeneratingImage] = useState<string | null>(null)
  const [imageError, setImageError] = useState<string | null>(null)
  const [newCharacter, setNewCharacter] = useState<Partial<Character & { imageUrl?: string }>>({
    name: "",
    description: "",
    appearance: "",
    role: "supporting",
    imageUrl: "",
  })

  useEffect(() => {
    // Auto-generate images for characters that don't have them
    const generateMissingImages = async () => {
      const charactersNeedingImages = allCharacters.filter(
        (char) => !(char as any).imageUrl && char.name && char.description,
      )

      for (const character of charactersNeedingImages) {
        await generateCharacterImage(character.id)
        // Add a small delay between generations to avoid overwhelming the API
        await new Promise((resolve) => setTimeout(resolve, 1000))
      }
    }

    if (allCharacters.length > 0) {
      generateMissingImages()
    }
  }, []) // Empty dependency array to run only on mount

  const generateCharacterImage = async (characterId?: string) => {
    const character = characterId ? formData.characters?.find((c) => c.id === characterId) : newCharacter

    const artStyle = formData.artStyle || "cartoon"
    const colorPalette = formData.colorPalette || "friendly and colorful"
    const illustrationStyle = formData.illustrationStyle || "friendly and colorful"
    const educationalTheme = formData.educational_theme || "adventure and friendship"

    if (!character?.name || !character?.description) {
      setImageError("Please provide character name and description first")
      return
    }

    const targetId = characterId || "new"
    setGeneratingImage(targetId)
    setImageError(null)

    try {
      // Create detailed prompt for character image generation
      const prompt = `Create a ${artStyle} style illustration of ${character.name}, ${character.description}. ${character.appearance ? `Appearance: ${character.appearance}.` : ""} ${illustrationStyle} style, ${colorPalette} colors, ${educationalTheme} theme, safe for children, storybook character art, high quality, detailed`

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

      if (characterId) {
        // Update existing character
        const updatedCharacters =
          formData.characters?.map((char) => (char.id === characterId ? { ...char, imageUrl } : char)) || []
        updateForm({ characters: updatedCharacters })
      } else {
        // Update new character being created
        setNewCharacter((prev) => ({ ...prev, imageUrl }))
      }
    } catch (error) {
      console.error("Error generating character image:", error)
      setImageError("Failed to generate character image. Please try again.")
    } finally {
      setGeneratingImage(null)
    }
  }

  const handleAddCharacter = () => {
    if (newCharacter.name && newCharacter.description) {
      const character: Character & { imageUrl?: string } = {
        id: `char-${Date.now()}`,
        name: newCharacter.name,
        description: newCharacter.description || "",
        appearance: newCharacter.appearance || "",
        role: newCharacter.role as "main" | "supporting" | "minor",
        isChildCharacter: false,
        imageUrl: newCharacter.imageUrl,
      }

      updateForm({
        characters: [...(formData.characters || []), character],
      })

      setNewCharacter({ name: "", description: "", appearance: "", role: "supporting", imageUrl: "" })
      setIsAddingCharacter(false)
    }
  }

  const handleEditCharacter = (characterId: string) => {
    const character =
      formData.characters?.find((c) => c.id === characterId) ||
      (formData as any).extractedCharacters?.find((c: Character) => c.id === characterId)
    if (character) {
      setNewCharacter({
        name: character.name,
        description: character.description,
        appearance: character.appearance || "",
        role: character.role,
        imageUrl: (character as any).imageUrl || "",
        isChildCharacter: character.isChildCharacter,
      })
      setEditingCharacter(characterId)
      setIsAddingCharacter(true)
    }
  }

  const handleUpdateCharacter = () => {
    if (editingCharacter && newCharacter.name && newCharacter.description) {
      // Find if the character is in regular characters or extracted characters
      const isInRegularCharacters = formData.characters?.some((c) => c.id === editingCharacter)

      if (isInRegularCharacters) {
        const updatedCharacters =
          formData.characters?.map((char) =>
            char.id === editingCharacter
              ? {
                  ...char,
                  name: newCharacter.name!,
                  description: newCharacter.description!,
                  appearance: newCharacter.appearance || "",
                  role: newCharacter.role as "main" | "supporting" | "minor",
                  imageUrl: newCharacter.imageUrl,
                  isChildCharacter: newCharacter.isChildCharacter || false,
                }
              : char,
          ) || []
        updateForm({ characters: updatedCharacters })
      } else {
        // Handle extracted characters
        const updatedExtractedCharacters =
          (formData as any).extractedCharacters?.map((char: Character) =>
            char.id === editingCharacter
              ? {
                  ...char,
                  name: newCharacter.name!,
                  description: newCharacter.description!,
                  appearance: newCharacter.appearance || "",
                  role: newCharacter.role as "main" | "supporting" | "minor",
                  imageUrl: newCharacter.imageUrl,
                  isChildCharacter: newCharacter.isChildCharacter || false,
                }
              : char,
          ) || []
        updateForm({
          formData: {
            ...formData,
            extractedCharacters: updatedExtractedCharacters,
          },
        } as any) // Type assertion needed until StoryFormData type is updated
      }

      // Reset form state
      setNewCharacter({ name: "", description: "", appearance: "", role: "supporting", imageUrl: "" })
      setIsAddingCharacter(false)
      setEditingCharacter(null)
      setImageError(null)
    }
  }

  const handleDeleteCharacter = (characterId: string) => {
    const updatedCharacters = formData.characters?.filter((char) => char.id !== characterId) || []
    updateForm({ characters: updatedCharacters })
  }

  const handleExtractCharacters = () => {
    // Mock AI character extraction
    const extractedCharacters: Character[] = [
      {
        id: `extracted-${Date.now()}-1`,
        name: "Hero",
        description: "The brave main character of our story",
        appearance: "Curious and adventurous",
        role: "main",
        isChildCharacter: true,
      },
      {
        id: `extracted-${Date.now()}-2`,
        name: "Wise Owl",
        description: "A helpful guide who provides wisdom and advice",
        appearance: "Large brown owl with golden eyes",
        role: "supporting",
        isChildCharacter: false,
      },
    ]
    updateForm({
      formData: {
        ...formData,
        extractedCharacters: extractedCharacters,
      },
    } as any) // Type assertion needed until StoryFormData type is updated
  }

  const allCharacters = [...(formData.characters || []), ...((formData as any).extractedCharacters || [])]
  const hasCharacters = allCharacters.length > 0

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-gray-900">Manage Your Characters</h2>
        <p className="text-gray-600">Add characters to your story and generate their visual representations</p>
      </div>

      {/* Error Alert */}
      {imageError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{imageError}</AlertDescription>
        </Alert>
      )}

      {/* AI Character Extraction */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wand2 className="h-5 w-5 text-blue-600" />
            AI Character Detection
          </CardTitle>
          <CardDescription>Let AI analyze your story description and suggest characters</CardDescription>
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
          <Button onClick={() => setIsAddingCharacter(true)} className="bg-green-600 hover:bg-green-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Character
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {allCharacters.map((character) => {
            const characterWithImage = character as Character & { imageUrl?: string }
            const isGenerating = generatingImage === character.id

            return (
              <Card key={character.id} className="relative">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{character.name}</CardTitle>
                      <div className="flex gap-2 mt-1">
                        <Badge variant={character.role === "main" ? "default" : "secondary"}>{character.role}</Badge>
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
                        onClick={() => generateCharacterImage(character.id)}
                        disabled={isGenerating}
                        title="Generate character image"
                      >
                        {isGenerating ? (
                          <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                          <ImageIcon className="h-4 w-4" />
                        )}
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleEditCharacter(character.id)}>
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
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <p className="text-gray-700 text-sm mb-2">{character.description}</p>
                      {character.appearance && (
                        <p className="text-gray-600 text-xs">
                          <strong>Appearance:</strong> {character.appearance}
                        </p>
                      )}
                    </div>
                    {/* Character Image */}
                    <div className="w-20 h-20 flex-shrink-0">
                      {characterWithImage.imageUrl ? (
                        <img
                          src={characterWithImage.imageUrl || "/placeholder.svg"}
                          alt={character.name}
                          className="w-full h-full object-cover rounded-lg border-2 border-gray-200"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                          {isGenerating ? (
                            <RefreshCw className="h-6 w-6 text-gray-400 animate-spin" />
                          ) : (
                            <ImageIcon className="h-6 w-6 text-gray-400" />
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
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
            <CardTitle>{editingCharacter ? "Edit Character" : "Add New Character"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-6">
              {/* Form Fields */}
              <div className="flex-1 space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="char-name">Character Name</Label>
                    <Input
                      id="char-name"
                      value={newCharacter.name || ""}
                      onChange={(e) => setNewCharacter({ ...newCharacter, name: e.target.value })}
                      placeholder="Enter character name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="char-role">Role</Label>
                    <Select
                      value={newCharacter.role}
                      onValueChange={(value) =>
                        setNewCharacter({ ...newCharacter, role: value as "main" | "supporting" | "minor" })
                      }
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
                    value={newCharacter.description || ""}
                    onChange={(e) => setNewCharacter({ ...newCharacter, description: e.target.value })}
                    placeholder="Describe the character's personality, background, and role in the story"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="char-appearance">Appearance (Optional)</Label>
                  <Input
                    id="char-appearance"
                    value={newCharacter.appearance || ""}
                    onChange={(e) => setNewCharacter({ ...newCharacter, appearance: e.target.value })}
                    placeholder="Describe how the character looks"
                  />
                </div>
              </div>

              {/* Character Image Preview */}
              <div className="w-48 space-y-3">
                <Label>Character Preview</Label>
                <div className="w-full h-48 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center">
                  {newCharacter.imageUrl ? (
                    <img
                      src={newCharacter.imageUrl || "/placeholder.svg"}
                      alt={newCharacter.name || "Character"}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : generatingImage === "new" ? (
                    <div className="text-center">
                      <RefreshCw className="h-8 w-8 text-gray-400 animate-spin mx-auto mb-2" />
                      <p className="text-sm text-gray-500">Generating...</p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <ImageIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">No image yet</p>
                    </div>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => generateCharacterImage()}
                  disabled={!newCharacter.name || !newCharacter.description || generatingImage === "new"}
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

            <div className="flex gap-2">
              <Button
                onClick={editingCharacter ? handleUpdateCharacter : handleAddCharacter}
                disabled={!newCharacter.name || !newCharacter.description}
              >
                {editingCharacter ? "Update Character" : "Add Character"}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsAddingCharacter(false)
                  setEditingCharacter(null)
                  setNewCharacter({ name: "", description: "", appearance: "", role: "supporting", imageUrl: "" })
                  setImageError(null)
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
