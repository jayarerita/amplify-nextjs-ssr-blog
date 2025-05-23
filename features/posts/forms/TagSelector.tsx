'use client';

import { useState, useRef } from 'react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { X, Plus } from 'lucide-react';
import { useGetTags } from '@/features/posts/database/use-get-tags';
import { FormTag } from '@/features/posts/types/types';

interface TagSelectorProps {
  selectedTags: FormTag[];
  setSelectedTags: (tags: FormTag[]) => void;
  disabled?: boolean;
}

export function TagSelector({ selectedTags, setSelectedTags, disabled }: TagSelectorProps) {
  const [input, setInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { data, isLoading } = useGetTags({ search: input });

  // Flatten paginated tag results
  const suggestions: FormTag[] = data?.pages?.flatMap((page: any) => page.data || []) || [];
  // Filter out already selected tags
  const filteredSuggestions = suggestions.filter(
    (tag) => !selectedTags.some((t) => t.name.toLowerCase() === tag.name.toLowerCase())
  );

  const handleAddTag = (tag: FormTag) => {
    setSelectedTags([...selectedTags, tag]);
    setInput('');
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const handleCreateTag = () => {
    if (!input.trim()) return;
    setSelectedTags([...selectedTags, { name: input.trim(), isNew: true }]);
    setInput('');
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const handleRemoveTag = (index: number) => {
    setSelectedTags(selectedTags.filter((_, i) => i !== index));
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-2">
        {selectedTags.map((tag, idx) => (
          <Badge key={tag.id || tag.name} variant="outline" className="flex items-center gap-1">
            {tag.name}
            <button
              type="button"
              className="ml-1 text-xs text-muted-foreground hover:text-destructive"
              onClick={() => handleRemoveTag(idx)}
              aria-label={`Remove tag ${tag.name}`}
              disabled={disabled}
            >
              <X className="w-3 h-3" />
            </button>
          </Badge>
        ))}
      </div>
      <div className="relative">
        <Input
          ref={inputRef}
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
          placeholder="Add or create a tag..."
          disabled={disabled}
        />
        {showSuggestions && (input.length > 0 || filteredSuggestions.length > 0) && (
          <div className="absolute z-10 mt-1 w-full bg-popover border rounded shadow-lg max-h-48 overflow-y-auto">
            {isLoading && <div className="p-2 text-xs text-muted-foreground">Loading...</div>}
            {filteredSuggestions.map((tag) => (
              <button
                key={tag.id || tag.name}
                type="button"
                className="block w-full text-left px-3 py-2 hover:bg-accent"
                onMouseDown={() => handleAddTag({ id: tag.id, name: tag.name })}
              >
                {tag.name}
              </button>
            ))}
            {input.length > 0 && !filteredSuggestions.some(t => t.name.toLowerCase() === input.toLowerCase()) && (
              <button
                type="button"
                className="block w-full text-left px-3 py-2 hover:bg-accent text-primary"
                onMouseDown={handleCreateTag}
              >
                <Plus className="inline w-4 h-4 mr-1" />Create "{input}"
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 