import { NextResponse } from 'next/server'

const TOGETHER_API_KEY = process.env.TOGETHER_API_KEY
const MODEL = 'black-forest-labs/FLUX.1-schnell-Free'

export async function POST(request: Request) {
  if (!TOGETHER_API_KEY) {
    return NextResponse.json(
      { error: 'Together API key not configured' },
      { status: 500 }
    )
  }

  try {
    const { prompt, steps = 4, guidance_scale = 1.0 } = await request.json()

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      )
    }

    // Enhance prompt for children's book illustrations
    const enhancedPrompt = `Children's book illustration, whimsical and colorful, ${prompt}, cartoon style, bright colors, friendly characters, safe for children, storybook art`

    const response = await fetch('https://api.together.xyz/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${TOGETHER_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: MODEL,
        prompt: enhancedPrompt,
        n: 1,
        steps: steps,
        guidance_scale: guidance_scale,
        width: 1024,
        height: 768
      })
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('Together API error:', error)
      return NextResponse.json(
        { error: error.message || 'Failed to generate image' },
        { status: response.status }
      )
    }

    const data = await response.json()
    
    if (!data.data || !data.data[0]) {
      return NextResponse.json(
        { error: 'No image data received' },
        { status: 500 }
      )
    }

    // Return the base64 image data
    return NextResponse.json({ 
      imageUrl: data.data[0].b64_json,
      prompt: enhancedPrompt
    })
  } catch (error) {
    console.error('Image generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate image' },
      { status: 500 }
    )
  }
}
