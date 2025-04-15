
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface UserUrlInputProps {
  value: string;
  onChange: (value: string) => void;
  error: string | null;
}

const UserUrlInput = ({ value, onChange, error }: UserUrlInputProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="user-url" className="text-sm font-medium font-inter">
      Your Video URL (Optional)
      </Label>
      <Input
        id="user-url"
        placeholder="https://www.youtube.com/watch?v=..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`focus:ring-2 focus:ring-primary ${error ? 'border-destructive' : ''}`}
      />
      {error && <p className="text-destructive text-sm">{error}</p>}
    </div>
  );
};

export default UserUrlInput;
