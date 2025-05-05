'use client';

import { useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useDebounce } from '@/lib/hooks/use-debounce';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { NewsletterCard } from '../components/NewsletterCard';



export default function PostsPage() {


  return (
    <div className="max-w-7xl mx-auto py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">


        <div className="space-y-8">
          <NewsletterCard />
          {/* Add more sidebar components here */}
        </div>
      </div>
    </div>
  );
}
