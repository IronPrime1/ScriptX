
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import YouTubeUrlInput from '@/components/YouTubeUrlInput';
import UserScriptInput from '@/components/UserScriptInput';
import StyleSelector from '@/components/StyleSelector';
import GenerateButton from '@/components/GenerateButton';
import ScriptOutput from '@/components/ScriptOutput';
import { validateYouTubeUrl } from '@/services/youtubeService';
import { generateScript } from '@/services/scriptService';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/components/ui/use-toast';
import  HeaderSection  from '@/components/HeaderSection';
import UserUrlInput from '@/components/UserUrlInput';
import { useAnalytics } from '@/hooks/useAnalytics';
import FeedbackForm from '@/components/Feedback';
import Navbar from '@/components/Navbar';
import ContactForm from '@/components/Contact';
import DisplayAd from '@/components/Ads/DisplayAd';

const Index = () => {

  // Form state
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [userUrl, setUserUrl] = useState('');
  const [userScript, setUserScript] = useState('');
  const [style, setStyle] = useState('default');
  const [urlError, setUrlError] = useState<string | null>(null);
  const { logEvent } = useAnalytics();
  
  // Processing state
  const [isLoading, setIsLoading] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  
  // Output state
  const [generatedScript, setGeneratedScript] = useState<string | null>(null);
  
  const { toast } = useToast();
  
  const handleGenerate = async () => {

    logEvent("form_submission", {
      event_category: "engagement",
      event_label: "script_generation_form",
    });

    // Validate YouTube URL
    const error = validateYouTubeUrl(youtubeUrl);
    setUrlError(error);
    
    if (error) return;
    
    try {
      setIsLoading(true);
      
      // Generate script directly using the video URL
      const script = await generateScript(youtubeUrl, userScript, userUrl, style);
      
      setGeneratedScript(script);
      toast({
        title: "Success!",
        description: "Your script has been generated",
        duration: 3000,
      });

      logEvent("script_generated", {
        event_category: "conversion",
        event_label: "successful_script_generation",
      });
    } catch (error) {
      console.error('Error generating script:', error);
      setUrlError('Failed to generate script. Please try again.');
      toast({
        title: "Error",
        description: "Failed to generate script. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleRegenerate = async () => {
    if (!generatedScript) return;
    
    try {
      setIsRegenerating(true);
      
      // Generate script again with the same parameters
      const script = await generateScript(youtubeUrl, userScript, style);
      
      setGeneratedScript(script);
      toast({
        title: "Success!",
        description: "Your script has been regenerated",
        duration: 3000,
      });
    } catch (error) {
      console.error('Error regenerating script:', error);
      toast({
        title: "Error",
        description: "Failed to regenerate script. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsRegenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-accent to-background mt-12">
      <Navbar />
      <div className="container max-w-5xl mx-auto py-12 px-6 sm:px-6 pt-12 pb-4">
      <HeaderSection />
        <div className="grid gap-8 md:grid-cols-12 max-w-5xl mx-auto">
          {/* Input Form */}
          <div className={`space-y-8 ${generatedScript ? 'md:col-span-6' : 'md:col-span-8 md:col-start-3'}`}>
          <Card className="border border-border shadow-md w-full max-w-lg mx-auto" id="try-now">
            <CardContent className="p-4 sm:p-4 space-y-4 pb-4 sm:pb-4">
              <YouTubeUrlInput value={youtubeUrl} onChange={setYoutubeUrl} error={urlError} />
              <div className="flex flex-col p-3 sm:p-3 mb-0 border rounded-md gap-2 border-gray-300 shadow-sm">
                <UserScriptInput value={userScript} onChange={setUserScript} />
                <div className="flex items-center justify-center w-full my-1">
                  <div className="bg-gray-200 h-px flex-grow"></div>
                  <p className="text-center text-sm sm:text-md font-medium px-2">Or</p>
                  <div className="bg-gray-200 h-px flex-grow"></div>
                </div>
                <UserUrlInput value={userUrl} onChange={setUserUrl} error={urlError} />
              </div>

              <StyleSelector value={style} onChange={setStyle} />

              <GenerateButton
                onClick={handleGenerate}
                isLoading={isLoading}
                disabled={!youtubeUrl.trim()}
                className="w-full"
                buttonName={userScript || userUrl ? "Generate My Version" : "Rewrite Video Script"}
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

        <div>
        <DisplayAd />
        </div>

        {/* How It Works Section */}
        <div className="mt-10 sm:mt-8 font-inter" id="how-it-works">
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
                  Optionally paste your previous script or previous video URL and select a style
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
                  Get a personalized script in your unique style or a rewritten script
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div className="pt-6 flex flex-col sm:flex-row gap-6" id="feedback">
        <FeedbackForm />
        <ContactForm />
        </div>
        
      </div>
      <Toaster />
      <footer className="mt-4 text-center text-sm text-muted-foreground border-t py-4 border-gray-300">
          <p>© 2025 ScriptX. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Index;
