import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"

interface BlogCardProps {
  title: string;
  excerpt: string;
  publishedAt: string;
  slug: string;
  coverImageKey?: string;
  author?: {
    displayName: string;
    avatar?: string;
    role?: string;
  };
}

export function BlogCard({
  title,
  excerpt,
  publishedAt,
  slug,
  coverImageKey,
  author,
}: BlogCardProps) {
  return (
    <Link 
      href={`/posts/${slug}`}
      className="group block overflow-hidden rounded-lg bg-background hover:shadow-lg transition-all duration-200"
    >
      <Card>
      {coverImageKey && (
        <div className="aspect-[16/9] overflow-hidden">
          <img
            src={coverImageKey}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
          />
        </div>
      )}
      <div className="p-6">
        <time dateTime={publishedAt} className="text-sm text-muted-foreground">
          {formatDate(publishedAt)}
        </time>
        
        <h3 className="mt-3 text-xl font-semibold leading-tight text-foreground">
          {title}
        </h3>
        
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground line-clamp-2">
          {excerpt}
        </p>

        {author && (
          <div className="mt-6 flex items-center gap-x-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={author.avatar} alt={author.displayName} />
              <AvatarFallback>{author.displayName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium text-foreground">{author.displayName}</p>
            </div>
          </div>
        )}
      </div>
      </Card>
    </Link>
  );
} 