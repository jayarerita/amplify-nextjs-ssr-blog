import { cookieBasedClient } from '@/lib/clients/amplify-server-client';
import { MetadataRoute } from 'next';

export async function GET(): Promise<MetadataRoute.Sitemap> {
  
  try {
    // Fetch your dynamic blog posts
    const posts = await cookieBasedClient.models.BlogPost.list();
    
    // Create sitemap entries for each post
    const postEntries = posts.data.map((post) => ({
      url: `${process.env.SITE_URL}/blog/${post.slug}`,
      lastModified: new Date(post.updatedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

    // Add any other dynamic routes here
    return [
      ...postEntries,
      {
        url: `${process.env.SITE_URL}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 1,
      },
      {
        url: `${process.env.SITE_URL}/blog`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 0.9,
      },
      {
        url: `${process.env.SITE_URL}/socials`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      },
    ];
  } catch (error) {
    console.error('Error generating dynamic sitemap:', error);
    return [];
  }
} 