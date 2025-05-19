import React, { useState, useEffect } from 'react'
import { cn } from '@/lib/utils';
import { getUrl } from 'aws-amplify/storage';

interface PostImageProps extends React.HTMLAttributes<HTMLImageElement> {
  imageKey: string;
  alt?: string | null;
  className?: string;
}

export function PostImage({ imageKey, alt, className }: PostImageProps) {
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

<img 
  src={imageUrl} 
  alt={alt || 'Cover image'} 
  className={cn("h-full w-full object-cover", className)}
/>
  )
}

