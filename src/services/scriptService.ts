
/**
 * Generate a styled script using the Supabase Edge Function
 * @param videoUrl The YouTube video URL
 * @param userScript The user's previous script (optional)
 * @param userUrl The user's previous video URL (optional)
 * @param style The style/tone preference
 * @returns Promise with the generated script
 */
export const generateScript = async (
  videoUrl: string,
  userScript: string = "",
  userUrl: string = "",
  style: string = "default"
): Promise<string> => {
  try {
    console.log('Sending request to generate script for:', videoUrl);
    
    const response = await fetch('https://lsfawnrryhsezfjayesz.supabase.co/functions/v1/generate-script', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({
        videoUrl,
        userScript,
        userUrl,
        style
      })
    });

    // Check if response is ok
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Edge function error response:', errorText);
      throw new Error(`Script generation failed: ${response.status} ${response.statusText}`);
    }

    // Parse the JSON response
    try {
      const data = await response.json();
      
      if (data.error) {
        console.error('Script generation error from function:', data.error);
        throw new Error(data.error);
      }

      return data.script;
    } catch (parseError) {
      console.error('Failed to parse response as JSON:', parseError);
      throw new Error('Invalid response from server');
    }
  } catch (error) {
    console.error('Error generating script:', error);
    throw error;
  }
};
