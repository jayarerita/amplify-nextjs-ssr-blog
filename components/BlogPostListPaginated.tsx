'use client';

import { useGetBlogPostsPaginated } from "@/lib/hooks/use-get-blog-posts";
import { BlogCard } from "./BlogCard";
import { Button } from "@/components/ui/button";
import React from "react";
import { cn } from "@/lib/utils";

export function BlogPostListPaginated({ titleSearch, listClassName, className }: { titleSearch: string, listClassName: string, className: string }) {
  
  const { 
    data, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage, 
    status, 
    error, 
    isFetching 
  } = useGetBlogPostsPaginated({ titleSearch });

  if (status === 'pending') return <div>Loading posts...</div>;
  if (status === 'error') return <div>Error: {error.message}</div>;

  return (
    <div className={cn({className})}>
      <div  className={cn(listClassName)}>

      {data?.pages.map((page) => (
        <React.Fragment key={page.nextToken}>
          {page.data.map((post) => (
            <BlogCard key={post.slug} post={post} />
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