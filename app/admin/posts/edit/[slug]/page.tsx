'use client';

import { useParams, useRouter } from 'next/navigation';
import { useGetBlogPost } from '@/lib/hooks/use-get-blog-post';
import { Skeleton } from '@/components/ui/skeleton';
import { EditBlogPostForm } from '@/components/forms/EditBlogPost';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function EditBlogPostPage() {
  const { slug } = useParams();
  const router = useRouter();
  const { data: post, isLoading, error } = useGetBlogPost(slug as string);

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <Skeleton className="h-12 w-64 mb-8" />
        <div className="space-y-6">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error?.message || 'Failed to load blog post'}
          </AlertDescription>
        </Alert>
        <Button onClick={() => router.push('/admin')}>Return to Admin Dashboard</Button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Edit Blog Post</h1>
      <EditBlogPostForm post={post} />
    </div>
  );
} 