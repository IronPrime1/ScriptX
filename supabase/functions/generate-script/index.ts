import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
// Util: Extract video transcript using YouTube caption base URL
async function fetchTranscript(videoId) {
  const res = await fetch(`https://yt.lemnoslife.com/videos?part=player&videoId=${videoId}`);
  const data = await res.json();
  const captionsUrl = data?.items?.[0]?.player?.captions?.playerCaptionsTracklistRenderer?.captionTracks?.[0]?.baseUrl;
  if (!captionsUrl) throw new Error('Transcript not available for this video.');
  const transcriptRes = await fetch(captionsUrl + '&fmt=json3');
  const transcriptJson = await transcriptRes.json();
  const transcriptText = transcriptJson.events.map((e)=>e.segs?.map((s)=>s.utf8).join('') || '').join(' ').trim();
  return transcriptText;
}
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
    const videoIdMatch = videoUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    if (!videoIdMatch) throw new Error('Invalid YouTube URL');
    const videoId = videoIdMatch[1];
    const transcriptText = await fetchTranscript(videoId);
    const prompt = userScript ? `You are a YouTube scriptwriting assistant.

This is the transcript of a viral YouTube video:
${transcriptText}

This is a previous script from the user:
${userScript}

Rewrite the viral video's transcript in the same style, tone, and structure as the user's script. Keep it engaging and aligned with the user's voice.` : `You are a YouTube scriptwriting assistant.

This is the transcript of a viral YouTube video:
${transcriptText}

Rewrite the script in a highly engaging, YouTube-friendly style for a ${style || 'default'} tone. Make it suitable for an average creator to present. Feel free to add hooks, transitions, and expressive language.`;
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
