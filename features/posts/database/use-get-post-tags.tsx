import { client } from "@/lib/clients/amplify-client.client";
import { useQuery } from "@tanstack/react-query";

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