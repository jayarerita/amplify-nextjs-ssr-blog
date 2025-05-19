'use client';

import { NewsletterCard } from '@/features/newsletter/components/NewsletterCard';



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
