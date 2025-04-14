
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import YouTubeUrlInput from '@/components/YouTubeUrlInput';
import UserScriptInput from '@/components/UserScriptInput';
import StyleSelector from '@/components/StyleSelector';
import GenerateButton from '@/components/GenerateButton';
import ScriptOutput from '@/components/ScriptOutput';
import { validateYouTubeUrl, fetchTranscript, extractVideoId } from '@/services/youtubeService';
import { generateScript } from '@/services/scriptService';
import { Toaster } from '@/components/ui/toaster';

const Index = () => {
  // Form state
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [userScript, setUserScript] = useState('');
  const [style, setStyle] = useState('default');
  const [urlError, setUrlError] = useState<string | null>(null);
  
  // Processing state
  const [isLoading, setIsLoading] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  
  // Output state
  const [generatedScript, setGeneratedScript] = useState<string | null>(null);
  
  const handleGenerate = async () => {
    // Validate YouTube URL
    const error = validateYouTubeUrl(youtubeUrl);
    setUrlError(error);
    
    if (error) return;
    
    try {
      setIsLoading(true);
      const videoId = extractVideoId(youtubeUrl)!;
      
      // Fetch transcript
      const transcript = await fetchTranscript(videoId);
      
      // Generate script
      const script = await generateScript(transcript, userScript, style);
      
      setGeneratedScript(script);
    } catch (error) {
      console.error('Error generating script:', error);
      setUrlError('Failed to generate script. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleRegenerate = async () => {
    if (!generatedScript) return;
    
    try {
      setIsRegenerating(true);
      const videoId = extractVideoId(youtubeUrl)!;
      
      // Fetch transcript
      const transcript = await fetchTranscript(videoId);
      
      // Generate script
      const script = await generateScript(transcript, userScript, style);
      
      setGeneratedScript(script);
    } catch (error) {
      console.error('Error regenerating script:', error);
    } finally {
      setIsRegenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-accent to-background">
      <div className="container max-w-5xl mx-auto py-12 px-4 sm:px-6">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary mb-2">YT Script Styler</h1>
          <p className="text-lg text-muted-foreground">
            Transform viral YouTube content into your personal script style
          </p>
        </header>
        
        <div className="grid gap-8 md:grid-cols-12">
          {/* Input Form */}
          <div className={`space-y-8 ${generatedScript ? 'md:col-span-6' : 'md:col-span-8 md:col-start-3'}`}>
            <Card className="border border-border shadow-md">
              <CardContent className="p-6 space-y-6">
                <YouTubeUrlInput 
                  value={youtubeUrl} 
                  onChange={setYoutubeUrl} 
                  error={urlError} 
                />
                
                <UserScriptInput 
                  value={userScript} 
                  onChange={setUserScript} 
                />
                
                <StyleSelector 
                  value={style} 
                  onChange={setStyle} 
                />
                
                <GenerateButton 
                  onClick={handleGenerate} 
                  isLoading={isLoading} 
                  disabled={!youtubeUrl.trim()}
                />
              </CardContent>
            </Card>
          </div>
          
          {/* Output */}
          {generatedScript && (
            <div className="md:col-span-6">
              <ScriptOutput 
                script={generatedScript} 
                onRegenerate={handleRegenerate} 
                isRegenerating={isRegenerating} 
              />
            </div>
          )}
        </div>

        {/* How It Works Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-semibold text-center mb-6">How It Works</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="border border-border shadow-sm">
              <CardContent className="p-6 text-center">
                <div className="h-12 w-12 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-primary font-bold text-lg">1</span>
                </div>
                <h3 className="font-semibold mb-2">Paste YouTube URL</h3>
                <p className="text-sm text-muted-foreground">
                  Add the URL of a viral YouTube video you want to rewrite
                </p>
              </CardContent>
            </Card>
            
            <Card className="border border-border shadow-sm">
              <CardContent className="p-6 text-center">
                <div className="h-12 w-12 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-primary font-bold text-lg">2</span>
                </div>
                <h3 className="font-semibold mb-2">Add Your Style</h3>
                <p className="text-sm text-muted-foreground">
                  Optionally paste your previous script and select a tone
                </p>
              </CardContent>
            </Card>
            
            <Card className="border border-border shadow-sm">
              <CardContent className="p-6 text-center">
                <div className="h-12 w-12 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-primary font-bold text-lg">3</span>
                </div>
                <h3 className="font-semibold mb-2">Get Your Script</h3>
                <p className="text-sm text-muted-foreground">
                  Receive a personalized script in your unique style and tone
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Footer */}
        <footer className="mt-16 text-center text-sm text-muted-foreground">
          <p>YT Script Styler — Transform content while maintaining your authentic voice</p>
        </footer>
      </div>
      <Toaster />
    </div>
  );
};

export default Index;
