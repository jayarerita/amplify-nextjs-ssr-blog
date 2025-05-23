'use client';

import { useEffect, useState } from 'react';
import { PostCoverImage } from '@/features/posts/components/PostCoverImage';
import { X } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { getUrl } from 'aws-amplify/storage';

interface ImagePreviewProps {
  imageFile?: File | null;
  imageKey?: string | null;
  altText?: string | null;
  onCancel?: () => void;
}

function PostCoverImageClient({ imageKey, altText }: { imageKey: string, altText: string }) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchImageUrl() {
      try {
        const { url } = await getUrl({ path: imageKey });
        setImageUrl(url.toString());
      } catch (err) {
        console.error('Error getting image URL:', err);
        setError(err as Error);
      }
    }
    fetchImageUrl();
  }, [imageKey]);

  if (error) {
    return <div className="bg-muted h-full w-full flex items-center justify-center">Image failed to load</div>;
  }

  if (!imageUrl) {
    return <div className="bg-muted h-full w-full animate-pulse" />;
  }

  return (
    <div className="relative w-full h-auto overflow-hidden">
      <img
        src={imageUrl}
        alt={altText}
        className="w-full h-auto rounded-lg mb-4"
      />
    </div>
  );
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
          <PostCoverImageClient imageKey={imageKey} altText={altText || 'Current image'} />
        ) : null}
      </div>
    </div>
  );
} 