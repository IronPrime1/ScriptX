import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
serve(async (req)=>{
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
  };
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders
    });
  }
  try {
    const { videoUrl, userScript, style } = await req.json();
    if (!videoUrl || typeof videoUrl !== 'string') {
      throw new Error('videoUrl is missing or invalid');
    }
    // Extract video ID from the YouTube URL
    const videoId = videoUrl.match(/(?:[?&]v=|youtu.be\/)([a-zA-Z0-9_-]{11})/);
    if (!videoId) {
      throw new Error('Invalid YouTube URL');
    }
    // Fetch the transcript from your Flask server
    const transcriptResponse = await fetch(`https://youtube-api-phi-nine.vercel.app/get_transcript?video_id=${videoId[1]}`);
    if (!transcriptResponse.ok) {
      throw new Error(`Error fetching transcript: ${transcriptResponse.statusText}`);
    }
    const transcriptData = await transcriptResponse.json();
    const transcript = transcriptData.transcript;
    if (!transcript || typeof transcript !== 'string') {
      throw new Error('Transcript is missing or invalid');
    }
    // Create the prompt for script generation
    const prompt = userScript ? `You are a YouTube scriptwriting assistant. This is the transcript of a viral YouTube video: ${transcript} This is a previous script from the user: ${userScript} Rewrite the viral video's transcript in the same style, tone, and structure as the user's script. Keep it engaging and aligned with the user's voice.` : `You are a YouTube scriptwriting assistant. This is the transcript of a viral YouTube video: ${transcript} Rewrite the script in a highly engaging, YouTube-friendly style for a ${style || 'default'} tone. Make it suitable for an average creator to present. Feel free to add hooks, transitions, and expressive language.`;
    const groqApiKey = Deno.env.get('GROQ_API_KEY');
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      })
    });
    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status} ${response.statusText}`);
    }
    const completion = await response.json();
    const generatedScript = completion.choices?.[0]?.message?.content || '';
    return new Response(JSON.stringify({
      script: generatedScript
    }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Script generation error:', error);
    return new Response(JSON.stringify({
      error: error.message
    }), {
      status: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  }
});
