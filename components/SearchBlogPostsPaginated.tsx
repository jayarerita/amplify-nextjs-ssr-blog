"use client";

import { BlogPostListPaginated } from "./BlogPostListPaginated";
import { Input } from "./ui/input";
import { useState } from "react";

export function SearchBlogPostsPaginated() {
  const [titleSearch, setTitleSearch] = useState("");
  return (
    <div className="flex flex-col gap-4">
      <Input
        placeholder="Search"
        onChange={(e) => {
          setTitleSearch(e.target.value);
        }}
      />
      <div id="top-of-list"></div>
      <BlogPostListPaginated titleSearch={titleSearch} listClassName="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" className="space-y-8" />
    </div>
  );
}
