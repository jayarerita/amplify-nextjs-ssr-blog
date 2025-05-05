import { client } from "@/lib/clients/amplify-client";
import { useQuery } from '@tanstack/react-query';

export function useGetBlogPost(slug: string) {
  return useQuery({
    queryKey: ['blogPost', slug],
    queryFn: async () => {
      const { data, errors } = await client.models.BlogPost.get(
        { slug },
      );

      if (errors) {
        console.error("Failed to fetch blog post", errors);
        throw new Error(errors[0]?.message || "Failed to fetch blog post");
      }
      
      if (!data) {
        throw new Error("Blog post not found");
      }
      
      return data;
    },
    enabled: !!slug,
  });
}