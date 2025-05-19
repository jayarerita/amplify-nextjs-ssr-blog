import { faker } from '@faker-js/faker';
import { type Schema } from "../../data/resource";
import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/data";
import { getAmplifyDataClientConfig } from '@aws-amplify/backend/function/runtime';
import { env } from "$amplify/env/demo-data";
import { S3Client, PutObjectCommand, S3ServiceException } from '@aws-sdk/client-s3';
import fetch from 'node-fetch';

// Initialize S3 client
const s3Client = new S3Client();

// Enable detailed logging for development/debugging
const DEBUG = process.env.DEBUG === 'true';

function log(message: string, data?: any) {
  if (DEBUG) {
    console.log(`[DemoData] ${message}`, data ? JSON.stringify(data, null, 2) : '');
  }
}

async function downloadAndStoreImage(slug: string, type: 'cover' | 'thumbnail'): Promise<string> {
  try {
    const width = type === 'thumbnail' ? 400 : 1200;
    const height = type === 'thumbnail' ? 225 : 675;
    
    // Get image URL from Faker (using only supported parameters)
    const imageUrl = faker.image.url({ width, height });
    
    // Download the image
    log(`Downloading ${type} image from ${imageUrl}`);
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to download image: ${response.statusText}`);
    }
    
    const imageBuffer = await response.buffer();
    const key = `${type}s/${slug}-${type}.jpg`;

    // Upload to S3
    await s3Client.send(new PutObjectCommand({
      Bucket: process.env.BLOG_STORAGE_BUCKET_NAME,
      Key: key,
      Body: imageBuffer,
      ContentType: 'image/jpeg'
    }));

    // Return the S3 key
    return key;
  } catch (error) {
    console.error(`Failed to process ${type} image:`, error);
    throw error;
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

export const handler: Schema["demoData"]["functionHandler"] = async (event) => {
  const postsCreated: string[] = [];
  
  try {
    await initializeAmplify();
    
    log('Function started with arguments:', event.arguments);
    const {count} = event.arguments;

    if (!client) {
      throw new Error('Amplify client not initialized');
    }

    if (!process.env.BLOG_STORAGE_BUCKET_NAME) {
      throw new Error('BLOG_STORAGE_BUCKET_NAME environment variable is not set');
    }

    // Get a user profile from the database
    const { data: userProfiles, errors } = await client.models.UserProfile.list();
    if (userProfiles.length === 0) {
      throw new Error('No user profiles found');
    }
    const userProfile = userProfiles[0];

    // Get or create 6 tags to use for the posts
    const { data: tags, errors: tagErrors } = await client.models.Tag.list();
    if (tags.length === 0) {
      console.log('No tags found, creating 6 tags');
      try {
        for (let i = 0; i < 6; i++) {
          const tag = {
            name: faker.lorem.word(),
            isDemo: true
          };
          await client.models.Tag.create(tag);
        }
      } catch (error) {
        console.error('Failed to create tags:', error);
        throw error;
      }

    }
    
    for (let i = 0; i < (count || 20); i++) {
      log(`Creating post ${i + 1} of ${count || 20}`);
      
      try {
        // Get a lsit of all tags
        const { data: tags, errors: tagErrors } = await client.models.Tag.list();
        if (tags.length === 0) {
          throw new Error('No tags found');
        }

        // Get a random tag
        const randomTag = tags[Math.floor(Math.random() * tags.length)];


        if (!randomTag) {
          throw new Error('No tags found');
        }

        // Create the tags array
        const tagsArray = [ randomTag ];

        const slug = faker.lorem.slug();

        const postId = faker.string.uuid();
        
        // Download and store images first
        log('Processing images');
        const coverKey = await downloadAndStoreImage(postId, 'cover');
        const thumbnailKey = await downloadAndStoreImage(postId, 'thumbnail');

        const post: Schema["Post"]["createType"] = {
          id: postId,
          slug,
          title: faker.lorem.sentence(),
          excerpt: faker.lorem.paragraph(),
          owner: userProfile.id,
          coverImageKey: coverKey,
          markdownKey: `markdown/${postId}.md`,
          thumbnailImageKey: thumbnailKey,
          published: true,
          publishedAt: new Date().toISOString(),
          isDemo: true
        };
        
        log('Creating blog post in database:', { slug: post.slug, id: post.id });
        const createdPost = await client.models.Post.create(post);
        
        if (!createdPost || !createdPost.data) {
          throw new Error(`Failed to create post in database: ${post.slug}`);
        }
        
        // Create the blog tags
        for (const tag of tagsArray) {
          await client.models.PostTag.create({
            tagId: tag.id,
            postId: createdPost.data.id
          });
        }

        postsCreated.push(post.slug);

        // Save markdown content
        const markdownContent = generateMarkdownContent();
        log('Saving markdown content to S3', { key: `markdown/${createdPost.data.id}.md` });
        try {
          await s3Client.send(new PutObjectCommand({
            Bucket: process.env.BLOG_STORAGE_BUCKET_NAME,
            Key: `markdown/${createdPost.data.id}.md`,
            Body: markdownContent,
            ContentType: 'text/markdown'
          }));
        } catch (s3Error) {
          if (s3Error instanceof S3ServiceException) {
            console.error(`S3 error saving markdown for ${createdPost.data.id}:`, {
              code: s3Error.name,
              message: s3Error.$metadata
            });
          }
          throw s3Error;
        }
      } catch (postError) {
        console.error(`Failed to create post ${i + 1}:`, postError);
        throw postError;
      }
    }

    log('Successfully created all posts', { count: postsCreated.length, slugs: postsCreated });
    return {
      Success: true,
      postsCreated: postsCreated.length,
      slugs: postsCreated
    };

  } catch (error) {
    console.error('Fatal error in demo data generation:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      postsCreatedBeforeError: postsCreated.length,
      lastPostCreated: postsCreated.length ? postsCreated[postsCreated.length - 1] : null
    });
    throw error;
  }
};

function generateMarkdownContent(): string {
  const sections = [
    `# ${faker.lorem.sentence()}\n\n`,
    faker.lorem.paragraphs(2) + '\n\n',
    `## ${faker.lorem.sentence()}\n\n`,
    faker.lorem.paragraphs(3) + '\n\n',
    '```typescript\n' +
    'const example = () => {\n' +
    '  console.log("Hello World");\n' +
    '}\n' +
    '```\n\n',
    `## ${faker.lorem.sentence()}\n\n`,
    faker.lorem.paragraphs(2) + '\n\n',
    '- ' + faker.lorem.sentence() + '\n' +
    '- ' + faker.lorem.sentence() + '\n' +
    '- ' + faker.lorem.sentence() + '\n\n',
    `### ${faker.lorem.sentence()}\n\n`,
    faker.lorem.paragraphs(1)
  ];

  return sections.join('');
}


