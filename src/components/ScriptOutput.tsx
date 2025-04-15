import { useState, useEffect } from 'react';
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
  const [editableScript, setEditableScript] = useState(script);

  useEffect(() => {
    setEditableScript(script); // Update local state if parent sends a new script
  }, [script]);

  const handleCopy = () => {
    navigator.clipboard.writeText(editableScript);
    toast({
      title: "Copied!",
      description: "Script copied to clipboard",
      duration: 3000,
    });
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([editableScript], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `your-script-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-2">
      <Card className="border border-border shadow-sm">
        <div className="flex items-center justify-between p-3 border-b border-border font-inter font-bold">
        <h1>Your Script</h1>
        </div>
        <CardContent className="p-4 pb-6">
          <textarea
            className="w-full h-[448px] resize-none whitespace-pre-wrap font-normal text-sm leading-relaxed bg-transparent focus:outline-none"
            value={editableScript}
            onChange={(e) => setEditableScript(e.target.value)}
          />
        </CardContent>
      </Card>
      <div className="flex gap-2 justify-between items-center">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="flex items-center gap-1 w-full"
          >
            <Copy className="h-4 w-4" />
            Copy
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onRegenerate}
            disabled={isRegenerating}
            className="flex items-center gap-1 w-full"
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
            className="flex items-center gap-1 w-full"
          >
            <Download className="h-4 w-4" />
            Download
          </Button>
        </div>
    </div>
  );
};

export default ScriptOutput;
