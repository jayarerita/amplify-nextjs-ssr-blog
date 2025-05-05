import { useEffect, useState } from 'react';
import { BlogPostImage } from './BlogPostImage';
import { X } from 'lucide-react';
import { Button } from './ui/button';

interface ImagePreviewProps {
  imageFile?: File | null;
  imageKey?: string | null;
  altText?: string | null;
  onCancel?: () => void;
}

export function ImagePreview({ imageFile, imageKey, altText, onCancel }: ImagePreviewProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (imageFile) {
      const url = URL.createObjectURL(imageFile);
      setPreviewUrl(url);
      
      // Cleanup the URL when component unmounts or image changes
      return () => {
        URL.revokeObjectURL(url);
      };
    } else {
      setPreviewUrl(null);
    }
  }, [imageFile]);

  if (!imageFile && !imageKey) {
    return null;
  }

  return (
    <div className="mt-2 relative">
      <p className="text-sm text-muted-foreground mb-2">
        {imageFile ? 'Image preview:' : 'Current image:'}
      </p>
      <div className="aspect-[16/9] w-full max-w-md overflow-hidden border border-border rounded-md relative group">
        {previewUrl ? (
          <>
            <img 
              src={previewUrl} 
              alt={altText || 'Preview'} 
              className="h-full w-full object-cover"
            />
            {onCancel && (
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={onCancel}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        ) : imageKey ? (
          <BlogPostImage imageKey={imageKey} alt={altText || 'Current image'} />
        ) : null}
      </div>
    </div>
  );
} 