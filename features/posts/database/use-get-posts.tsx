import { client } from "@/lib/clients/amplify-client";
import { useInfiniteQuery } from '@tanstack/react-query';

const getPosts = async ({ pageParam }: { pageParam?: string }) => {
  try {
    const { data, errors, nextToken } = await client.models.Post.list({ 
      limit: 5,
      nextToken: pageParam 
  });
  if (errors) {
    console.error("Failed to fetch blog posts", errors);
    throw new Error(errors[0]?.message || "Failed to fetch blog posts");
  }
  return { data, errors, nextToken };
  } catch (error) {
    console.error("Failed to fetch blog posts", error);
    throw new Error(error as string);
  }
}

export function useGetPostsInfinite() {
  return useInfiniteQuery({
    queryKey: ['posts'],
    queryFn: getPosts,
    getNextPageParam: (lastPage) => lastPage.nextToken,
    initialPageParam: undefined,
  });
}


const getPostsPaginated = async ({ queryKey, pageParam }: { queryKey: string[], pageParam?: string }) => {
  try {
    const titleSearch = queryKey[1];
    const { data, errors, nextToken } = await client.models.Post.list({ 
      limit: 5,
      nextToken: pageParam,
      filter: {
        title: {
          contains: titleSearch
        }
      }
    });
  if (errors) {
    console.error("Failed to fetch posts", errors);
    throw new Error(errors[0]?.message || "Failed to fetch posts");
  }
  return { data, errors, nextToken };
  } catch (error) {
    console.error("Failed to fetch posts", error);
    throw new Error(error as string);
  }
}

export const useGetPostsPaginated = ({ titleSearch }: { titleSearch: string }) => {
  return useInfiniteQuery({
    queryKey: ['postsPaginated', titleSearch],
    queryFn: getPostsPaginated,
    getNextPageParam: (lastPage) => lastPage.nextToken,
    initialPageParam: undefined,
    staleTime: 60*60*1000, // 1 hour
  });
}