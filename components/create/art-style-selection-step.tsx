'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Palette, Sparkles, AlertCircle } from 'lucide-react'
import Image from 'next/image'

import { useChatContext } from '@/contexts/chat-context'
import { useWizard, useCanProceed } from '@/contexts/wizard-context'
import { ChatService, createSystemMessage, createUserMessage } from '@/lib/chat-service'
import { markdownToJson } from '@/lib/utils'

interface ArtStyleSelectionStepProps {
  onNext: () => void
  onPrev: () => void
}

const ART_STYLES = [
  {
    id: 'watercolor',
    name: 'Watercolor',
    description: 'Soft, dreamy illustrations with flowing colors',
    preview: '/placeholder.svg',
    colorPalette: 'Soft pastels',
    mood: 'Gentle and calming'
  },
  {
    id: 'cartoon',
    name: 'Cartoon',
    description: 'Fun, colorful cartoon-style illustrations',
    preview: '/placeholder.svg',
    colorPalette: 'Bright and vibrant',
    mood: 'Playful and energetic'
  },
  {
    id: 'storybook',
    name: 'Classic Storybook',
    description: 'Traditional storybook illustration style',
    preview: '/placeholder.svg',
    colorPalette: 'Warm earth tones',
    mood: 'Timeless and cozy'
  },
  {
    id: 'digital-art',
    name: 'Digital Art',
    description: 'Modern digital illustrations with rich details',
    preview: '/placeholder.svg',
    colorPalette: 'Rich and saturated',
    mood: 'Contemporary and detailed'
  },
  {
    id: 'pencil-sketch',
    name: 'Pencil Sketch',
    description: 'Hand-drawn pencil illustrations with charm',
    preview: '/placeholder.svg',
    colorPalette: 'Monochrome with highlights',
    mood: 'Artistic and intimate'
  },
  {
    id: 'fantasy',
    name: 'Fantasy Art',
    description: 'Magical, fantastical illustration style',
    preview: '/placeholder.svg',
    colorPalette: 'Mystical purples and golds',
    mood: 'Magical and enchanting'
  }
]

export function ArtStyleSelectionStep({ onNext, onPrev }: ArtStyleSelectionStepProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { state: { formData }, updateForm } = useWizard();
  const { setSession, setCurrentSession } = useChatContext();
  const canProceed = useCanProceed();

  const handleStyleSelect = (style: typeof ART_STYLES[0]) => {
    updateForm({
      artStyle: style.name,
      colorPalette: style.colorPalette,
      illustrationStyle: style.mood
    })
  }

  const generateStoryOutline = async () => {
    setIsLoading(true);
    setError(null);

    const messages = [
      createSystemMessage(`
## **Creative Writing Exercise Prompt**

You are an expert in writing engaging and imaginative **children's storybooks**. Your task is to create a full story suitable for a picture book and provide a corresponding **text-to-image prompt** for each page that visually illustrates the narrative.

The story should be **short, engaging, and appropriate for young readers**. Each page will include a brief text and a vivid image prompt that captures the essence of the scene.
## **Steps to Create the Story**
### 1. **Gathering Story Details**
Before starting the story, you need to gather specific details to ensure the narrative and illustrations are cohesive and engaging. Use the following questions to collect all necessary information:

#### 📖 **Story Theme**
* *“What is the main theme or moral of the story?”*
  *(e.g., friendship, bravery, kindness, adventure, etc.)*

#### 📖 **Story Characters**
Identify the main characters and their roles in the story and generate a full visual description for each character. 

### **Character Image Prompts**
Add more characteristic appearance to the character description to make it more vivid and engaging.The description should be able to be used as a text-to-image prompt for generating illustrations. Use frontview pose and full body description for the character on a white background.

---
### 2. **Creating the Story**
Once you have gathered all the necessary details, you can start crafting the story. Each page should include:
* A short, engaging text appropriate for young readers.
* A vivid, descriptive image prompt tied to the scene along with the character and appearance to make the image consistence throughout the story.
* The narrative should be structured to allow for illustrations that enhance the storytelling experience.
* The story should be divided into manageable sections or pages, each with its own text and image prompt.
* The text should be simple and clear, using language that is accessible to young readers.
* Each page should have a clear focus, whether it's introducing a character, describing a setting, or advancing the plot.
* The story should have a beginning, middle, and end, with a clear narrative arc.
* The text should be engaging and imaginative, sparking the reader's imagination and encouraging them to visualize the scenes.
* The story should be suitable for a picture book format, with each page designed to be visually appealing and easy to read.
* Based on the age group, the text should be age-appropriate, using simple vocabulary and short sentences for younger readers, while still being engaging for older children.
* The text should be minimum 50 words and maximum 100 words per page to ensure it is concise and engaging.
<!-- Style
Fun, colorful cartoon-style illustrations

Color Palette
Bright and vibrant

Mood
Playful and energetic -->
---
### 3. **Visual Elements**
To ensure the illustrations are visually appealing and consistent, gather the following details:
#### 🎨 **Image Style**
* *“What style of illustration is preferred for the images?”*
  *(e.g., 2D cartoon, watercolor, semi-realistic, etc.)*
#### 🖼️ **Image Prompt**
* *“What is the specific scene or moment to illustrate?”*
  *(e.g., a dragon flying over a castle, a child planting a tree, etc.)*
#### 🎨 **Animation Style**
* *“What animation style should be used for the illustrations?”*
  *(e.g., 2D semi-realistic cartoon, 3D animated, hand-drawn, etc.)*
#### 📐 **Image Aspect Ratio**
* *“What aspect ratio is required for the illustrations?”*
  *(e.g., 3:2, 16:9, 1:1, portrait, etc.)*
#### 🎨 **Color Palette**
* *“What color palette is preferred for the illustrations?”*
  * Bright and vibrant colors, with a focus on pastel shades for a whimsical feel.
  * Soft, muted tones for a more serene and calming effect.
  * Bold and contrasting colors for a more dynamic and energetic look.
  * Natural and earthy tones for a more realistic and grounded feel.
  * Monochromatic or limited color palette for a more minimalist and modern aesthetic.
### 4. ** Number of Pages**
* *“How many pages should the story have?”*
  *(e.g., 8 pages, 12 pages, etc.)*
---
### 5. **Finalizing the Story**
Once you have gathered all the necessary details, compile them into a structured format. Ensure that the story flows logically and that each page has a clear focus. Review the text and image prompts to ensure they are engaging, age-appropriate, and visually appealing.
---
## ✅ **Once All Details Are Collected, Format the Output Like This:**
## **Story Title**: [Insert Story Title Here]
## **Story Theme**: [Insert Story Theme Here]
## **Story Characters**:
### Character 1
**name**: [Character Name]
**description**: [Full visual description of the character, including appearance, clothing, and any unique features.]
**image_prompt**: [Insert image prompt for the character here, describing the scene and characters in detail.]
 
## **Story Text and Image Prompts**:
### Page 1
**Title**:[Insert the title of the scene as per the story]
**Description**: [Insert text for page 1 here, ensuring it is engaging and appropriate for young readers.]
**Image Prompt**: [Insert image prompt for page 1 here, describing the scene and characters in detail.]
**Characters**: [Insert characters present in the scene here.]
**Narration**: [Insert narration for page 1 here, ensuring it is engaging and appropriate for young readers.]
**Setting**: [Insert setting for page 1 here, describing the environment and atmosphere.]
**Mood*: [Insert mood for page 1 here, describing the mood of the scene]
**Key Events**: [Insert key for page 1 here, describing the key events happening in the scene]

### **Example Output**

## **Story Text and Image Prompts**:
## **Story Title**: The Brave Little Squirrel
## **Story Theme**: Bravery and Friendship
## **Story Characters**:
### Character 1
**name**: Squeaky
**description**: A small, fluffy gray squirrel with big, bright eyes and a bushy tail. He wears a tiny red bandana around his neck and has a playful, adventurous spirit.
**image_prompt**: A small, fluffy gray squirrel with big, bright eyes and a bushy tail. He wears a tiny red bandana around his neck and is standing on a tree branch, looking out over the forest with excitement.

## **Story Text and Image Prompts**:
### Page 1
**Title**: The Brave Little Squirrel
**Description**: In a lush, green forest, lived a brave little squirrel named Squeaky. He loved to explore and make new friends. One sunny morning, Squeaky decided to venture deeper into the woods than ever before.
**Image Prompt**: A vibrant forest scene with tall trees, colorful flowers, and a small, fluffy gray squirrel wearing a red bandana. The sun shines through the leaves, creating a warm and inviting atmosphere.
**Characters**: Squeaky
**Narration**: In a lush, green forest, lived a brave little squirrel named Squeaky. He loved to explore and make new friends. One sunny morning, Squeaky decided to venture deeper into the woods than ever before.
**Setting**: Home/Starting location
**Mood**: Peaceful
**Key Events**: Introduction, Call to adventure

## ⚠️ **Behavior Guidelines**

1. **Be Creative**: Use your imagination to create a unique and engaging story that captivates young readers.
2. **Be Descriptive**: Provide vivid descriptions in both the text and image prompts to enhance the storytelling experience.
3. **Be Consistent**: Ensure that the characters and settings are visually consistent throughout the story.
4. **Be Age-Appropriate**: Tailor the language and themes to be suitable for young readers, ensuring the story is easy to understand and engaging.
5. **Be Positive**: Focus on positive themes and messages that encourage kindness, bravery, and friendship.
6. **Be Engaging**: Use language and imagery to keep the story compelling and enticing to readers.
7. **Be Respectful**: Avoid using language or imagery that could be interpreted as offensive or disrespectful.
8. **Be Creative**: Use your imagination to create a unique and engaging story that captivates young readers.
9. **Be Descriptive**: Provide vivid descriptions in both the text and image prompts to enhance the storytelling experience.
10. **Be Consistent**: Ensure that the characters and settings are visually consistent throughout the story.
11. **Be Age-Appropriate**: Tailor the language and themes to be suitable for young readers, ensuring the story is easy to understand and engaging.
`),
      createUserMessage(`${formData.storyDescription}
        - Art Style: ${formData.artStyle}
        - Color Palette: ${formData.colorPalette}
        - Mood: ${formData.illustrationStyle}
        - Story Theme: ${formData.educational_theme || 'adventure and friendship'}
        The story should be complete within 3 pages. Add more narrative to the story minimum 200 words. Each page should have a text and image prompt.`)
    ];

    try {
      const chatService = ChatService.getInstance();
      const result = await chatService.createChatCompletion(messages, {
        sessionPrefix: 'story_outline'
      });

      if (!result.success) {
        throw new Error(result.error || 'Failed to generate story outline');
      }

      console.log(markdownToJson(result.message || ''))

      // Store the chat session in context
      const sessionId = result.sessionId;
      const session = chatService.getChatSession(sessionId);
      
      if (session) {
        setSession(sessionId, session.messages);
        setCurrentSession(sessionId);

        
        // Store the session ID in form data for reference
        updateForm({
          sessionId: sessionId,
          characters: markdownToJson(result.message || '').characters.map(char => ({
            id: crypto.randomUUID(),
            name: (char as any).name,
            description: (char as any).description,
            role: 'main', // Default role since it's not specified in the parsed data
            appearance: (char as any).prompt, // Using the prompt as appearance since it contains visual description

          })),
          autoGeneratedTitle: markdownToJson(result.message || '').title,
          scenes: markdownToJson(result.message || '').pages.map((scene, index) => ({
            id: crypto.randomUUID(),
            title: scene.title,
            description: scene.description,
            setting: scene.setting,
            mood: scene.mood,
            keyEvents: scene.key_events.split(','),
            characters: scene.characters,
            narration: scene.narration,
            imagePrompt: scene.image_prompt,
            order: index+1,
          })),



        });
      }

      return true;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to generate story outline');
      return false;
    } finally {
      setIsLoading(false);
    }
  }

  const handleNext = async () => {
    const success = await generateStoryOutline();
    if (success) {
      onNext();
    }
  }

  const selectedStyle = ART_STYLES.find(style => style.name === formData.artStyle)
  const hasProceed = formData.artStyle !== ''

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-gray-900">Choose Your Art Style</h2>
        <p className="text-gray-600">
          Select the visual style that will bring your story to life
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {ART_STYLES.map((style) => (
          <Card
            key={style.id}
            className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
              formData.artStyle === style.name
                ? 'ring-2 ring-purple-500 bg-purple-50'
                : 'hover:shadow-md'
            }`}
            onClick={() => handleStyleSelect(style)}
          >
            <CardHeader className="pb-3">
              <div className="aspect-video relative bg-gray-100 rounded-lg overflow-hidden mb-3">
                <Image
                  src={style.preview || "/placeholder.svg"}
                  alt={style.name}
                  fill
                  className="object-cover"
                />
                {formData.artStyle === style.name && (
                  <div className="absolute inset-0 bg-purple-500 bg-opacity-20 flex items-center justify-center">
                    <div className="bg-white rounded-full p-2">
                      <Sparkles className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                )}
              </div>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-purple-600" />
                {style.name}
              </CardTitle>
              <CardDescription>{style.description}</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Color Palette:</span>
                  <Badge variant="secondary" className="text-xs">
                    {style.colorPalette}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Mood:</span>
                  <Badge variant="outline" className="text-xs">
                    {style.mood}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedStyle && (
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-600" />
              Selected Style: {selectedStyle.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Style</h4>
                <p className="text-gray-700">{selectedStyle.description}</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Color Palette</h4>
                <p className="text-gray-700">{selectedStyle.colorPalette}</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Mood</h4>
                <p className="text-gray-700">{selectedStyle.mood}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrev}>
          Back to Story Input
        </Button>
        <Button 
          onClick={handleNext}
          disabled={!canProceed || isLoading}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            'Continue to Characters'
          )}
        </Button>
      </div>
    </div>
  )
}
