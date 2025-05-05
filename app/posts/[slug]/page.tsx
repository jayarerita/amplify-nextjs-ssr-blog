import { notFound } from 'next/navigation';
import { cookiesClient } from "@/lib/utils/amplify-utils";
import RenderMarkdown from '@/components/RenderMarkdown';
import { Metadata, ResolvingMetadata } from 'next';
import CoverImage from '@/components/CoverImage';
import { BlogPostCardAuthor } from '@/components/BlogPostAuthor';

type Props = {
  params: Promise<{ slug: string }>
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;
  
  const { data: post, errors } = await cookiesClient.models.BlogPost.get(
    { slug: slug },
    { authMode: 'identityPool' }
  );

  if (errors || !post) {
    return {
      title: 'Post Not Found',
    }
  }

  const previousImages = (await parent).openGraph?.images || []

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
    title: post.metaTitle || post.title || '',
    description: post.metaDescription || post.excerpt || '',
    openGraph: {
      title: post.metaTitle || post.title || '',
      description: post.metaDescription || post.excerpt || '',
      type: 'article',
      publishedTime: post.publishedAt || undefined,
      authors: post.owner ? [post.owner] : undefined,
      images: [
        {
          url: post.ogImage || post.coverImageKey || '',
          alt: post.ogImageAlt || post.coverImageAlt || '',
        },
        ...previousImages,
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.metaTitle || post.title || '',
      description: post.metaDescription || post.excerpt || '',
      images: [{ 
        url: post.ogImage || post.coverImageKey || '', 
        alt: post.ogImageAlt || post.coverImageAlt || '' 
      }],
    },
    alternates: post.canonicalUrl ? {
      canonical: post.canonicalUrl,
    } : undefined,
    robots: {
      index: !post.noIndex,
      follow: !post.noIndex,
    },
  }
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { data: post, errors } = await cookiesClient.models.BlogPost.get(
    { slug: slug },
    { authMode: 'identityPool' }
  );

  if (errors) {
    console.error('Error fetching blog post:', errors);
    notFound();
  }

  if (!post) {
    notFound();
  }

  return (
    <main className="min-h-screen p-8 max-w-4xl mx-auto post">
      {post.coverImageKey && (
        <CoverImage imageKey={post.coverImageKey} altText={post.coverImageAlt ?? post.title}/>
      )}
      <h1 className="mb-4">{post.title}</h1>
      <BlogPostCardAuthor authorId={post.owner} />
      <p className="text-muted-foreground">
        Published on {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : ''}
      </p>
      {post.readingTime && (
        <p className="text-muted-foreground">
          {post.readingTime} min read
        </p>
      )}

      <article className="mx-auto max-w-3xl">
        <div className="markdown">
          <RenderMarkdown markdownKey={post.markdownKey} />
        </div>
      </article>
    </main>
  );
} 