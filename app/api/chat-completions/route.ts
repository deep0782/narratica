import { NextResponse } from 'next/server'


const TOGETHER_API_KEY = process.env.TOGETHER_API_KEY
const MODEL = 'meta-llama/Llama-3.3-70B-Instruct-Turbo-Free'

interface ChatMessage {
  role: string;
  content: string;
}

interface ChatCompletionRequest {
  messages: ChatMessage[];
  maxTokens?: number;
  temperature?: number;
}

export async function POST(request: Request) {
  if (!TOGETHER_API_KEY) {
    return NextResponse.json(
      { error: 'Together API key not configured' },
      { status: 500 }
    )
  }

  try {
    const { messages, maxTokens = 1000, temperature = 0.7 } = await request.json() as ChatCompletionRequest

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Messages array is required and must not be empty' },
        { status: 400 }
      )
    }

    // Validate message format
    const isValidMessages = messages.every(msg => 
      typeof msg === 'object' && 
      'role' in msg && 
      'content' in msg &&
      typeof msg.role === 'string' &&
      typeof msg.content === 'string'
    )

    if (!isValidMessages) {
      return NextResponse.json(
        { error: 'Invalid message format. Each message must have role and content strings' },
        { status: 400 }
      )
    }

    const response = await fetch('https://api.together.xyz/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${TOGETHER_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: MODEL,
        messages,
        max_tokens: maxTokens,
        temperature
      })
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('Together API error:', error)
      return NextResponse.json(
        { error: error.message || 'Failed to generate chat completion' },
        { status: response.status }
      )
    }

    const data = await response.json()
    
    if (!data.choices?.[0]?.message) {
      return NextResponse.json(
        { error: 'No completion data received' },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      id: data.id,
      created: data.created,
      message: data.choices[0].message,
      usage: data.usage
    })
  } catch (error) {
    console.error('Chat completion error:', error)
    return NextResponse.json(
      { error: 'Failed to generate chat completion' },
      { status: 500 }
    )
  }
}
