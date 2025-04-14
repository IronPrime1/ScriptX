
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, RotateCcw, Download } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface ScriptOutputProps {
  script: string;
  onRegenerate: () => void;
  isRegenerating: boolean;
}

const ScriptOutput = ({ script, onRegenerate, isRegenerating }: ScriptOutputProps) => {
  const { toast } = useToast();
  
  const handleCopy = () => {
    navigator.clipboard.writeText(script);
    toast({
      title: "Copied!",
      description: "Script copied to clipboard",
      duration: 3000,
    });
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([script], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `your-script-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Your Generated Script</h3>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="flex items-center gap-1"
          >
            <Copy className="h-4 w-4" />
            Copy
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onRegenerate}
            disabled={isRegenerating}
            className="flex items-center gap-1"
          >
            {isRegenerating ? (
              <RotateCcw className="h-4 w-4 animate-spin" />
            ) : (
              <RotateCcw className="h-4 w-4" />
            )}
            Regenerate
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
            className="flex items-center gap-1"
          >
            <Download className="h-4 w-4" />
            Download
          </Button>
        </div>
      </div>
      <Card className="border border-border shadow-sm">
        <CardContent className="p-4">
          <div className="whitespace-pre-wrap font-normal text-sm leading-relaxed max-h-96 overflow-y-auto">
            {script}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ScriptOutput;
