'use client';

import Link from 'next/link';
import { Button } from '@aws-amplify/ui-react';
import { BlogPostList } from '@/components/BlogPostList';

export default function AdminDashboard() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <div className="mt-4 flex space-x-4">
          <Button
            as={Link}
            href="/admin/posts/new"
            variation="link"
          >
            Create New Post
          </Button>
          <Button
            as={Link}
            href="/admin/upload"
            variation="link"
          >
            Upload Markdown
          </Button>
        </div>
      </div>
      <BlogPostList />
    </div>
  );
} 