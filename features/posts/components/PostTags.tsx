import { Badge } from '@/components/ui/badge';
import { client } from '@/lib/clients/amplify-client';
import { useQuery } from '@tanstack/react-query';
import { Schema } from '@/amplify/data/resource';

export function useGetPostTags(postId: string) {
  return useQuery({
    queryKey: ['postTags', postId],
    queryFn: async () => {
      // Fetch BlogTag relations for this post
      const { data: postTags, errors } = await client.models.PostTag.list({
        filter: { postId: { eq: postId } },
      });
      if (errors) throw new Error(errors[0]?.message || 'Failed to fetch blog tags');
      if (!postTags || postTags.length === 0) return [];
      // Fetch Tag details for each BlogTag
      const tagPromises = postTags.map(async (postTag) => {
        if (!postTag?.tagId) return null;
        const { data: tag, errors: tagErrors } = await client.models.Tag.get({ id: postTag.tagId });
        if (tagErrors) return null;
        return tag;
      });
      const tags = await Promise.all(tagPromises);
      return tags.filter(Boolean);
    },
    enabled: !!postId,
  });
}

export function PostTags({ post }: { post: Schema["Post"]["type"] }) {
  const { data: tags, isLoading, error } = useGetPostTags(post.id);

  if (isLoading) return <div className="text-xs text-muted-foreground">Loading tags...</div>;
  if (error) return <div className="text-xs text-destructive">Failed to load tags</div>;
  if (!tags || tags.length === 0) return null;

  return (
    <div className="flex gap-2 flex-wrap">
      {tags.map((tag: any) => (
        <Badge key={tag.id} variant={tag.isDemo ? 'secondary' : 'outline'} className="text-xs">
          {tag.name}
        </Badge>
      ))}
    </div>
  );
} 