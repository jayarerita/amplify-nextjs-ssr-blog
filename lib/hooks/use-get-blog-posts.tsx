import { client } from "@/lib/clients/amplify-client";
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';

export function useGetBlogPost(slug: string) {
  return useQuery({
    queryKey: ['blogPost', slug],
    queryFn: async () => {
      const { data, errors } = await client.models.BlogPost.get(
        { slug },
        { authMode: "identityPool" }
      );

      if (errors) {
        console.error("Failed to fetch blog post", errors);
        throw new Error(errors[0]?.message || "Failed to fetch blog post");
      }
      
      if (!data) {
        throw new Error("Bowel movement not found");
      }
      
      return data;
    },
    enabled: !!slug,
  });
}

const getBlogPosts = async ({ pageParam }: { pageParam?: string }) => {
  const { data, errors, nextToken } = await client.models.BlogPost.list({ 
    authMode: "identityPool", 
    nextToken: pageParam 
  });
  return { data, errors, nextToken };
}

export function useGetBlogPostsInfinite() {
  return useInfiniteQuery({
    queryKey: ['blogPosts'],
    queryFn: getBlogPosts,
    getNextPageParam: (lastPage) => lastPage.nextToken,
    initialPageParam: undefined,
  });
}
