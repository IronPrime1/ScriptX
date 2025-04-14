
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { YouTubeTranscript } from 'youtube-transcript-api'
import Groq from 'groq-sdk'

serve(async (req) => {
  // Handle CORS
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  }

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders,
    })
  }

  try {
    // Parse the incoming request body
    const { videoUrl, userScript, style } = await req.json()

    // Extract video ID
    const videoIdMatch = videoUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)
    if (!videoIdMatch) {
      throw new Error('Invalid YouTube URL')
    }
    const videoId = videoIdMatch[1]

    // Fetch transcript
    const transcript = await YouTubeTranscript.getTranscript(videoId)
    const transcriptText = transcript.map(entry => entry.text).join(' ')

    // Initialize Groq client
    const groq = new Groq({ apiKey: Deno.env.get('GROQ_API_KEY') })

    // Prepare prompt based on user input
    const prompt = userScript 
      ? `You are a YouTube scriptwriting assistant.

This is the transcript of a viral YouTube video:
${transcriptText}

This is a previous script from the user:
${userScript}

Rewrite the viral video's transcript in the same style, tone, and structure as the user's script. Keep it engaging and aligned with the user's voice.`
      : `You are a YouTube scriptwriting assistant.

This is the transcript of a viral YouTube video:
${transcriptText}

Rewrite the script in a highly engaging, YouTube-friendly style for a ${style || 'default'} tone. Make it suitable for an average creator to present. Feel free to add hooks, transitions, and expressive language.`

    // Generate script using Groq
    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama3-8b-8192'
    })

    // Extract the generated script
    const generatedScript = chatCompletion.choices[0]?.message?.content || ''

    // Return the generated script
    return new Response(JSON.stringify({ script: generatedScript }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
    })

  } catch (error) {
    console.error('Script generation error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
    })
  }
})
