'use client';

import BlogPostUpdateForm from "@/ui-components/BlogPostUpdateForm";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/clients/amplify-client";

export default function PostUpdate() {
  // get the slug from the url
  const { slug } = useParams();
  // Fetch the post data
  const { data: post, isLoading, error } = useQuery({
    queryKey: ['post', slug],
    queryFn: async () => {
      const response = await client.models.BlogPost.get({ slug: slug as string });
      if (response.errors) {
        throw new Error(response.errors[0].message);
      }
      return response.data;
    }
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading post</div>;
  if (post) {
    return <BlogPostUpdateForm {...post} />;
  }
}
