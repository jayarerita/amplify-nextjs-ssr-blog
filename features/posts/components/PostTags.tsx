'use client'

import { Badge } from '@/components/ui/badge';
import { useGetPostTags } from '@/features/posts/database/use-get-post-tags';
import Link from 'next/link';

export function PostTags({ postId }: { postId: string }) {
  const { data: tags, isLoading, error } = useGetPostTags(postId);

  if (isLoading) return <div className="text-xs text-muted-foreground">Loading tags...</div>;
  if (error) return <div className="text-xs text-destructive">Failed to load tags</div>;
  if (!tags || tags.length === 0) return null;

  return (
    <div className="flex gap-2 flex-wrap">
      {tags.map((tag: any) => (
        <Link key={tag.id} href={`/posts/tag/${tag.name}`} passHref legacyBehavior>
          <Badge variant={tag.isDemo ? 'secondary' : 'outline'} className="text-xs">
            {tag.name}
          </Badge>
        </Link>
      ))}
    </div>
  );
} 