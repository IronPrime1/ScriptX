
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface YouTubeUrlInputProps {
  value: string;
  onChange: (value: string) => void;
  error: string | null;
}

const YouTubeUrlInput = ({ value, onChange, error }: YouTubeUrlInputProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="youtube-url" className="text-sm font-medium">
        YouTube Video URL
      </Label>
      <Input
        id="youtube-url"
        placeholder="https://www.youtube.com/watch?v=..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`focus:ring-2 focus:ring-primary ${error ? 'border-destructive' : ''}`}
      />
      {error && <p className="text-destructive text-sm">{error}</p>}
    </div>
  );
};

export default YouTubeUrlInput;
