import { NextResponse } from 'next/server'

const TOGETHER_API_KEY = process.env.TOGETHER_API_KEY
const MODEL = 'black-forest-labs/FLUX.1-schnell'

export async function POST(request: Request) {
  if (!TOGETHER_API_KEY) {
    return NextResponse.json(
      { error: 'Together API key not configured' },
      { status: 500 }
    )
  }

  try {
    const { prompt, steps = 30, guidance_scale = 7.5 } = await request.json()

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      )
    }

    const response = await fetch('https://api.together.xyz/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${TOGETHER_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: MODEL,
        prompt: prompt,
        n: 1,
        steps: steps,
        guidance_scale: guidance_scale
      })
    })

    if (!response.ok) {
      const error = await response.json()
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

    // The API returns base64 encoded image
    return NextResponse.json({ 
      imageUrl: data.data[0].b64_json,
      type: data.data[0].type
    })
  } catch (error) {
    console.error('Image generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate image' },
      { status: 500 }
    )
  }
}
