'use client';

import { Button } from '@/components/ui/button';
import { useGenerateDemoData, useDeleteDemoData } from '@/lib/hooks/use-demo-data';
import { Loader2 } from 'lucide-react';
import { PostListPaginated } from '@/features/posts/components/PostListPaginated';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

export default function AdminDashboard() {
  const { mutate: generateDemoData, isPending: isGenerating } = useGenerateDemoData();
  const { mutate: deleteDemoData, isPending: isDeleting } = useDeleteDemoData();
  const [titleSearch, setTitleSearch] = useState('');

  return (
    <div className="max-w-7xl mx-auto py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="mt-4 flex space-x-4">
          <Button
            onClick={() => generateDemoData(10)}
            disabled={isGenerating || isDeleting}
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                Generating...
              </>
            ) : (
              'Generate Demo Data'
            )}
          </Button>
          <Button
            onClick={() => deleteDemoData()}
            disabled={isGenerating || isDeleting}
            variant="destructive"
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                Deleting...
              </>
            ) : (
              'Delete Demo Data'
            )}
          </Button>
        </div>
        <Input placeholder="Search" value={titleSearch} onChange={(e) => setTitleSearch(e.target.value)} className="my-4 max-w-md mx-auto" />
        <PostListPaginated titleSearch={titleSearch} listClassName="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" className="" />
      </div>
    </div>
  );
} 