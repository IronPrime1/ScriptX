
// YouTube video ID extraction regex
const VIDEO_ID_REGEX = (/(?:youtube\.com\/(?:shorts\/|(?:[^\/\n\s]+\/\S+\/)?(?:v|embed|watch)(?:\?v=|\/|=))|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
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
