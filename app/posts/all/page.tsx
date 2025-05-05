import { BlogPostListInfiniteScroll } from "@/components/BlogPostListInfiniteScroll";

export default function AllPostsPage() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <BlogPostListInfiniteScroll />
    </div>
  );
}