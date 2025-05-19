'use client';

import { PostForm } from '@/features/posts/forms/EditPost';
import { useGetPost } from '@/features/posts/database/use-get-post';
import { useParams } from 'next/navigation';

export default function PostEditPage() {
  const params = useParams();
  const slug = params.slug as string;

  
  const { data: post, isLoading } = useGetPost(slug);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!post) {
    return <div>Post not found</div>;
  }

  // if (post.owner !== user.username) {
  //   return <div>You are not authorized to edit this post</div>;
  // }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Edit Blog Post</h1>
      <PostForm mode="edit" post={post} />
    </div>
  );
} 