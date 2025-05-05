import { client } from "@/lib/clients/amplify-client";
import { useInfiniteQuery } from '@tanstack/react-query';

const getBlogPosts = async ({ pageParam }: { pageParam?: string }) => {
  try {
    const { data, errors, nextToken } = await client.models.BlogPost.list({ 
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

export function useGetBlogPostsInfinite() {
  return useInfiniteQuery({
    queryKey: ['blogPosts'],
    queryFn: getBlogPosts,
    getNextPageParam: (lastPage) => lastPage.nextToken,
    initialPageParam: undefined,
  });
}


const getBlogPostsPaginated = async ({ queryKey, pageParam }: { queryKey: string[], pageParam?: string }) => {
  try {
    const titleSearch = queryKey[1];
    const { data, errors, nextToken } = await client.models.BlogPost.list({ 
      limit: 5,
      nextToken: pageParam,
      filter: {
        title: {
          contains: titleSearch
        }
      }
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

export const useGetBlogPostsPaginated = ({ titleSearch }: { titleSearch: string }) => {
  return useInfiniteQuery({
    queryKey: ['blogPostsPaginated', titleSearch],
    queryFn: getBlogPostsPaginated,
    getNextPageParam: (lastPage) => lastPage.nextToken,
    initialPageParam: undefined,
    staleTime: 60*60*1000, // 1 hour
  });
}

// async function queryPosts (key, sort, page = 1) {
//   // key === 'infinite-posts'
//   // sort will always be there from the query-key
//   // page information won't be there on the first request
//   // which is why is has a defualt value of 1, but it will be
//   // there on subsequent requests
//   const res = await axios.get(`/posts?sort=${sort}&page=${page}`)

//   return {
//     items: res.data,
//     page,
//   }
// }

// const queryInfo = useInfiniteQuery(['infinite-posts', sort], queryPosts, {
//   getFetchMore: ({ items, page }) => {
//     if (items.length) {
//       return page + 1 // This will be sent as the LAST parameter to your query function
//     }

//     return false
//   },
// })