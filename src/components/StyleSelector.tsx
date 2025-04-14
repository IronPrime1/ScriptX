
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface StyleSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const styleOptions = [
  { value: "default", label: "Default" },
  { value: "funny", label: "Funny" },
  { value: "serious", label: "Serious" },
  { value: "concise", label: "Concise" },
  { value: "emotional", label: "Emotional" },
  { value: "educational", label: "Educational" },
];

const StyleSelector = ({ value, onChange }: StyleSelectorProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="style" className="text-sm font-medium">
        Tone/Style Preference
      </Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full focus:ring-2 focus:ring-primary">
          <SelectValue placeholder="Select a style" />
        </SelectTrigger>
        <SelectContent>
          {styleOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default StyleSelector;
