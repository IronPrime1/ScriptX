
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface UserScriptInputProps {
  value: string;
  onChange: (value: string) => void;
}

const UserScriptInput = ({ value, onChange }: UserScriptInputProps) => {
  return (
    <div className="space-y-2 font-inter font-light">
      <Label htmlFor="user-script" className="text-sm font-medium font-inter">
        Your Script (Optional)
      </Label>
      <Textarea
        id="user-script"
        placeholder="Paste your previous video script to match your style..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-36 sm:min-h-36 focus:ring-2 focus:ring-primary"
      />
    </div>
  );
};

export default UserScriptInput;
