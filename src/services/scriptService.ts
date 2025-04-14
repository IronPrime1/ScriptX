
/**
 * Generate a styled script using the Supabase Edge Function
 * @param videoUrl The YouTube video URL
 * @param userScript The user's previous script (optional)
 * @param style The style/tone preference
 * @returns Promise with the generated script
 */
export const generateScript = async (
  videoUrl: string,
  userScript: string = "",
  style: string = "default"
): Promise<string> => {
  try {
    const response = await fetch('https://yozqkhxpxodolcrbtbtg.supabase.co/functions/v1/generate-script', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY, // or your Supabase anon key
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`, // sometimes needed
      },
      body: JSON.stringify({
        videoUrl,
        userScript,
        style
      })
    });

    if (!response.ok) {
      throw new Error('Script generation failed');
    }

    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error);
    }

    return data.script;
  } catch (error) {
    console.error('Error generating script:', error);
    throw error;
  }
};
