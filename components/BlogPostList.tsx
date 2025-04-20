"use client";

import { useGetBlogPostsInfinite } from '@/lib/hooks/use-get-blog-posts';
import React from 'react';
import { BlogCard } from './BlogCard';

export function BlogPostList() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status, error, isFetching } = useGetBlogPostsInfinite();

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
                        title={post.title}
                        excerpt={post.excerpt ?? ''}
                        publishedAt={post.publishedAt ?? ''}
                        slug={post.slug}
                        coverImageKey={post.coverImageKey ?? ''}
                        author={{
                          displayName: post.owner,
                          avatar: '', // TODO: Add author avatar from UserProfile
                          role: '', // TODO: Add author role from UserProfile
                        }}
                      />
          ))}
        </React.Fragment>
      ))}
      <div>
        <button
          onClick={() => fetchNextPage()}
          disabled={!hasNextPage || isFetchingNextPage}
        >
          {isFetchingNextPage
            ? 'Loading more...'
            : hasNextPage
              ? 'Load More'
              : 'Nothing more to load'}
        </button>
      </div>
      <div>{isFetching && !isFetchingNextPage ? 'Fetching...' : null}</div>
    </>
  )
} 