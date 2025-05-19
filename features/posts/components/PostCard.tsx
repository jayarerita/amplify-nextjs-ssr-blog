import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import { MagicCard } from '@/components/magicui/magic-card';
import {PostImage} from './PostImage';
import { Schema } from '@/amplify/data/resource';
import { useGetUserProfile } from '@/lib/hooks/use-get-user-profile';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';
import { PostCardAuthor } from './PostCardAuthor';
import { PostTags } from './PostTags';


export function PostCard({
  post,
}: {
  post: Schema["Post"]["type"],
}) {
  const { user, route } = useAuthenticator((context) => [context.user, context.route]);
  const { data: userProfile } = useGetUserProfile(user?.userId || '');
  
  // Check if user is authenticated and is either the post owner or has admin role
  const canEdit = 
    route === 'authenticated' && 
    user && 
    (user.userId === post.owner || userProfile?.role === 'admin');

  return (
    <MagicCard className="group block overflow-hidden rounded-lg bg-background hover:shadow-lg transition-all duration-200 relative md:h-[32rem] cursor-pointer">
      <Link 
        href={`/posts/${post.slug}`}
        className="block"
        key={post.slug}
      >
        {post.coverImageKey && (
          <div className="aspect-[16/9] overflow-hidden border border-transparent rounded-t-lg">
                <div className="relative w-full h-full overflow-hidden">

            <PostImage imageKey={post.coverImageKey} alt={post.coverImageAlt || post.title} className="w-full h-full object-cover" />
          </div>
          </div>
        )}
        <div className="p-6">
          <div className="flex items-center justify-between">
            {post.publishedAt && (
            <time dateTime={post.publishedAt} className="text-sm text-muted-foreground">
              {formatDate(post.publishedAt)}
            </time>
            )}
            <PostTags post={post} />
          </div>

          <PostCardAuthor authorId={post.owner} />
          
          <h3 className="mt-3 text-xl font-semibold leading-tight text-foreground">
            {post.title}
          </h3>
          
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground line-clamp-4">
            {post.excerpt}
          </p>

        </div>
      </Link>
      
      {/* Edit button - only visible for authenticated users who are the author or admin */}
      {canEdit && (
        <Link 
          href={`/admin/blog/edit/${post.slug}`}
          className="absolute top-4 right-4 z-10"
          onClick={(e) => e.stopPropagation()}
        >
          <Button 
            size="icon" 
            variant="ghost"
            className="rounded-full w-8 h-8 cursor-pointer bg-foreground/30 hover:bg-background/50 text-primary-foreground"
          >
            <Edit className="h-4 w-4" />
            <span className="sr-only">Edit post</span>
          </Button>
        </Link>
      )}
    </MagicCard>
  );
} 