"use client";

import { useGetBlogPostsInfinite } from '@/lib/hooks/use-get-blog-posts';
import React, { useEffect, useRef } from 'react';
import { BlogCard } from './BlogCard';
import { Skeleton } from './ui/skeleton';
import { Card } from './ui/card';
import { CircleSlash } from 'lucide-react';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';

export function BlogPostListInfiniteScroll() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status, error, isFetching } = useGetBlogPostsInfinite();
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  return status === 'pending' ? (
    <p>Loading...</p>
  ) : status === 'error' ? (
    <p>Error: {error.message}</p>
  ) : (
    <>
      {data.pages.map((group, i) => (
        <React.Fragment key={i}>
          {group.data.map((post) => (
            <BlogCard
              key={post.slug}
              post={post}
            />
          ))}
        </React.Fragment>
      ))}
      <div ref={loadMoreRef}>
        {isFetchingNextPage ? (

          <Card className="space-y-3 h-[32rem] border rounded-lg">
            <Skeleton className="h-2 w-[60%] mx-auto" />
            <Skeleton className="h-2 w-[30%] mx-auto" />
            <Skeleton className="h-2 w-[45%] mx-auto" />
          </Card>
        ) : !hasNextPage ? (
          <Card className="text-center border-dashed h-[32rem]">
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <CircleSlash className="h-6 w-6" />
              <p>You've reached the end of the list</p>
              <Button variant="outline" onClick={() => router.push('/#top-of-list')}>Back to the top</Button>
            </div>
          </Card>
        ) : null}
      </div>
      {isFetching && !isFetchingNextPage ? (
        <div className="text-center text-sm text-muted-foreground mt-4">
          Refreshing posts...
        </div>
      ) : null}
    </>
  );
} 