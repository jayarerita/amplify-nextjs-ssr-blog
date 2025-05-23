import { client } from "@/lib/clients/amplify-client.client";
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { Schema } from "@/amplify/data/resource";

type Post = Schema["Post"]["type"];
type UseGetPostOptions = Omit<UseQueryOptions<Post, Error>, 'queryKey' | 'queryFn'>;

async function getPost(slug: string): Promise<Post> {
  const { data, errors } = await client.models.Post.listPostBySlug({ slug });
  if (errors) throw new Error(errors[0]?.message || "Failed to fetch post");
  if (!data || data.length === 0) throw new Error("Post not found");
  return data[0];
}

export function useGetPost(slug: string, options?: UseGetPostOptions) {
  return useQuery<Post, Error>({
    queryKey: ['post', slug],
    queryFn: () => getPost(slug),
    ...options,
  });
}