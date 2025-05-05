import { generateClient } from "aws-amplify/data";
import { getAmplifyDataClientConfig } from '@aws-amplify/backend/function/runtime';
import { env } from "$amplify/env/demo-data";
import { S3Client, DeleteObjectCommand, S3ServiceException, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { Amplify } from 'aws-amplify';
import { type Schema } from '../../data/resource';

// Initialize S3 client
const s3Client = new S3Client();

// Enable detailed logging for development/debugging
const DEBUG = process.env.DEBUG === 'true';

function log(message: string, data?: any) {
  if (DEBUG) {
    console.log(`[DeleteDemoData] ${message}`, data ? JSON.stringify(data, null, 2) : '');
  }
}

// Initialize Amplify client
let client: ReturnType<typeof generateClient<Schema>>;

async function initializeAmplify() {
  try {
    log('Initializing Amplify configuration');
    const { resourceConfig, libraryOptions } = await getAmplifyDataClientConfig(env);
    
    if (!resourceConfig) {
      throw new Error('Failed to get resource configuration');
    }

    Amplify.configure(resourceConfig, libraryOptions);
    client = generateClient<Schema>();
    
    log('Amplify configuration successful');
  } catch (error) {
    console.error('Failed to initialize Amplify:', error);
    throw new Error(`Amplify initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

async function deleteS3Objects(prefix: string, slug: string) {
  try {
    const command = new DeleteObjectCommand({
      Bucket: process.env.BLOG_STORAGE_BUCKET_NAME,
      Key: `${prefix}/${slug}.md`
    });
    await s3Client.send(command);
    log(`Deleted ${prefix}/${slug}.md`);
  } catch (error) {
    if (error instanceof S3ServiceException) {
      console.error(`Failed to delete S3 object ${prefix}/${slug}.md:`, {
        code: error.name,
        message: error.$metadata
      });
    }
    throw error;
  }
}

export const handler: Schema["deleteDemoData"]["functionHandler"] = async (event) => {
  const deletedPosts: string[] = [];
  
  try {
    // Initialize Amplify before processing
    await initializeAmplify();
    
    log('Function started');

    if (!client) {
      throw new Error('Amplify client not initialized');
    }

    if (!process.env.BLOG_STORAGE_BUCKET_NAME) {
      throw new Error('BLOG_STORAGE_BUCKET_NAME environment variable is not set');
    }

    // Get all blog posts with the "test" tag
    const posts = await client.models.BlogPost.list({
      filter: {
        tags: {
          contains: "__demo__"
        }
      }
    });

    log(`Found ${posts.data.length} test posts to delete`);

    for (const post of posts.data) {
      try {
        log(`Deleting post: ${post.slug}`);

        // Delete markdown content from S3
        await deleteS3Objects('markdown', post.slug);

        // Delete the blog post from DynamoDB
        await client.models.BlogPost.delete(post);
        
        deletedPosts.push(post.slug);
        log(`Successfully deleted post: ${post.slug}`);
      } catch (error) {
        console.error(`Failed to delete post ${post.slug}:`, error);
        throw error;
      }
    }

    log('Successfully deleted all test posts', { count: deletedPosts.length, slugs: deletedPosts });
    return {
      Success: true,
      postsDeleted: deletedPosts.length,
      slugs: deletedPosts
    };

  } catch (error) {
    console.error('Fatal error in test data deletion:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      postsDeletedBeforeError: deletedPosts.length,
      lastPostDeleted: deletedPosts.length ? deletedPosts[deletedPosts.length - 1] : null
    });
    throw error;
  }
}; 