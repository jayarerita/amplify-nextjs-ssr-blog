'use client';

import { BlogPostForm } from '@/features/posts/forms/EditPost';
import { useGetBlogPost } from '@/features/posts/database/use-get-post';
import { useParams } from 'next/navigation';

export default function BlogPostPage() {
  const params = useParams();
  const mode = params.mode as 'create' | 'edit';
  const slug = params.slug as string | undefined;
  
  const { data: post, isLoading } = useGetBlogPost(slug ?? '', {
    enabled: mode === 'edit' && !!slug
  });

  if (mode === 'edit' && isLoading) {
    return <div>Loading...</div>;
  }

  if (mode === 'edit' && !post) {
    return <div>Post not found</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">
        {mode === 'edit' ? 'Edit Blog Post' : 'Create New Blog Post'}
      </h1>
      <BlogPostForm mode={mode} post={post} />
    </div>
  );
} 