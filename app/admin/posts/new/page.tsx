'use client';

import { CreateBlogPostForm } from '@/components/forms/CreateBlogPost';

export default function NewPost() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8">Create New Post</h1>
      <CreateBlogPostForm />
    </div>
  );
} 