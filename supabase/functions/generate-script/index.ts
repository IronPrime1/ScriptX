
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

serve(async (req) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
  };

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders
    });
  }

  try {
    // Parse request body
    const { videoUrl, userScript, style } = await req.json();
    
    if (!videoUrl || typeof videoUrl !== 'string') {
      throw new Error('videoUrl is missing or invalid');
    }

    // Extract video ID from the YouTube URL
    const videoId = videoUrl.match(/(?:[?&]v=|youtu.be\/)([a-zA-Z0-9_-]{11})/);
    if (!videoId) {
      throw new Error('Invalid YouTube URL');
    }

    // Fetch the transcript using RapidAPI
    try {
      const rapidApiKey = Deno.env.get('RAPID_API_KEY');
      
      const transcriptUrl = `https://youtube-transcript3.p.rapidapi.com/api/transcript?videoId=${videoId[1]}`;
      const options = {
        method: 'GET',
        headers: {
          'x-rapidapi-key': rapidApiKey,
          'x-rapidapi-host': 'youtube-transcript3.p.rapidapi.com'
        }
      };

      console.log(`Fetching transcript for video ID: ${videoId[1]}`);
      const transcriptResponse = await fetch(transcriptUrl, options);
      
      if (!transcriptResponse.ok) {
        const errorText = await transcriptResponse.text();
        console.error(`RapidAPI error (${transcriptResponse.status}):`, errorText);
        throw new Error(`Error fetching transcript: ${transcriptResponse.status} ${transcriptResponse.statusText}`);
      }
      
      const transcriptData = await transcriptResponse.json();
      
      if (!transcriptData || !transcriptData.transcript) {
        throw new Error('No transcript data available for this video');
      }
      
      const transcript = transcriptData.transcript;
      
      // Create the prompt for script generation
      const prompt = userScript 
      ? `You are a world-class YouTube scriptwriting assistant. Below is the transcript of a viral video and a sample of the user's past scripting style. Your task is to *reconstruct* the viral video transcript to match the exact voice, rhythm, narrative flow, and storytelling flair of the user's script.

      Your rewrite should not just mimic tone—it should feel like the user authored it. Integrate captivating hooks, emotional arcs, story-based persuasion, and retention-focused pacing. Maximize viewer interest by building curiosity, crafting satisfying "aha" moments, and layering in puzzle-piece storytelling logic. Your goal is to create an engaging, human-centered YouTube script that educates *and* entertains.

      Here is the viral transcript: ${transcript}

      Here is the user's previous script: ${userScript}`

        : `You are a world-class YouTube scriptwriting assistant. Below is the transcript of a viral video. Your task is to transform this into a YouTube-native script that is emotionally engaging, visually expressive, and structured to maximize viewer retention.

      Use story-first writing, compelling hooks (from ad copy to cliffhangers), and conversational transitions. If the original content is purely educational, reshape it into a story that subtly teaches one core idea. Prioritize viewer curiosity, satisfaction, and a sense of progress throughout. Your output should feel dynamic, authentic, and ready to film for a ${style || 'default'} tone.`;


      // Get the Groq API key from environment variables
      const groqApiKey = Deno.env.get('GROQ_API_KEY');
      if (!groqApiKey) {
        throw new Error('GROQ_API_KEY is not set in environment variables');
      }

      // Call the Groq API
      const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
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

      // Check if Groq API response is ok
      if (!groqResponse.ok) {
        const errorText = await groqResponse.text();
        console.error(`Groq API error (${groqResponse.status}):`, errorText);
        throw new Error(`Groq API error: ${groqResponse.status} ${groqResponse.statusText}`);
      }

      // Parse the Groq API response
      const completion = await groqResponse.json();
      const generatedScript = completion.choices?.[0]?.message?.content || '';

      // Return the generated script
      return new Response(
        JSON.stringify({ script: generatedScript }),
        {
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json'
          }
        }
      );
    } catch (transcriptError) {
      console.error('Transcript API error:', transcriptError);
      throw new Error(`Failed to get transcript: ${transcriptError.message}`);
    }
  } catch (error) {
    console.error('Script generation error:', error);
    
    // Return a proper error response
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  }
});
