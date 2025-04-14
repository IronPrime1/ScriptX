
// YouTube video ID extraction regex
const VIDEO_ID_REGEX = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;

/**
 * Extract YouTube video ID from URL
 * @param url The YouTube URL
 * @returns The video ID if valid, null otherwise
 */
export const extractVideoId = (url: string): string | null => {
  const match = url.match(VIDEO_ID_REGEX);
  return match ? match[1] : null;
};

/**
 * Validate a YouTube URL
 * @param url The URL to validate
 * @returns An error message if invalid, null if valid
 */
export const validateYouTubeUrl = (url: string): string | null => {
  if (!url.trim()) {
    return "YouTube URL is required";
  }
  
  const videoId = extractVideoId(url);
  if (!videoId) {
    return "Invalid YouTube URL";
  }
  
  return null;
};

/**
 * Mock function to fetch transcript - in a real app, this would call a server function
 * @param videoId The YouTube video ID
 * @returns Promise with mocked transcript
 */
export const fetchTranscript = async (videoId: string): Promise<string> => {
  // This is a placeholder. In a real implementation, this would call a backend API
  // that would use a library like youtube-transcript-api to fetch the actual transcript.
  console.log(`Fetching transcript for video ID: ${videoId}`);
  
  // For demo purposes, we'll simulate an API call with a delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  return "This is a mock transcript. In a real implementation, this would be the actual transcript from the YouTube video.";
};
