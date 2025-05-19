"use client";

import { PostListPaginated } from "./PostListPaginated";
import { Input } from "@/components/ui/input";
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
      <PostListPaginated titleSearch={titleSearch} listClassName="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" className="space-y-8" />
    </div>
  );
}
