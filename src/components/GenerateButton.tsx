
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface GenerateButtonProps {
  onClick: () => void;
  isLoading: boolean;
  disabled: boolean;
}

const GenerateButton = ({ onClick, isLoading, disabled }: GenerateButtonProps) => {
  return (
    <Button
      onClick={onClick}
      disabled={isLoading || disabled}
      className="w-full font-semibold bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-all"
      size="lg"
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : (
        "Generate My Version"
      )}
    </Button>
  );
};

export default GenerateButton;
