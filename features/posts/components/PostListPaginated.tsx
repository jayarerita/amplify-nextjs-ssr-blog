'use client';

import { useGetPostsPaginated } from "@/features/posts/database/use-get-posts";
import { PostCard } from "./PostCard";
import { Button } from "@/components/ui/button";
import React from "react";
import { cn } from "@/lib/utils";

export function PostListPaginated({ titleSearch, listClassName, className }: { titleSearch: string, listClassName: string, className: string }) {
  
  const { 
    data, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage, 
    status, 
    error, 
    isFetching 
  } = useGetPostsPaginated({ titleSearch });

  if (status === 'pending') return <div>Loading posts...</div>;
  if (status === 'error') return <div>Error: {error.message}</div>;

  return (
    <div className={cn({className})}>
      <div  className={cn(listClassName)}>

      {data?.pages.map((page) => (
        <React.Fragment key={page.nextToken}>
          {page.data.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </React.Fragment>
      ))}
      </div>
      
      {hasNextPage && (
        <div className="flex justify-center mt-8">
          <Button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            variant="outline"
            size="lg"
          >
            {isFetchingNextPage ? 'Loading more...' : 'Load More Posts'}
          </Button>
        </div>
      )}

      {!hasNextPage && data?.pages.length > 0 && (
        <p className="text-center text-muted-foreground mt-8">
          No more posts to load.
        </p>
      )}
    </div>
  );
}