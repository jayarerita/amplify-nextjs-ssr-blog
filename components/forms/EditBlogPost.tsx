'use client';

import { useUpdateBlogPost } from '@/lib/hooks/use-update-blog-post';
import { useGetMarkdown } from '@/lib/hooks/use-get-markdown';
import { useForm } from '@tanstack/react-form';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { AlertCircle, Info, X, Copy, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useAuthenticator } from '@aws-amplify/ui-react';
import MDEditor from '@uiw/react-md-editor';
import { useState, useEffect } from 'react';
import { useTheme } from "next-themes";
import { uploadData } from 'aws-amplify/storage';
import { toast } from 'sonner';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Skeleton } from '@/components/ui/skeleton';
import { type Schema } from "@/amplify/data/resource";
import { Switch } from '@/components/ui/switch';
import rehypeSanitize from 'rehype-sanitize';
import { ImagePreview } from '../ImagePreview';
import ReactMarkdown from 'react-markdown';
import { CodeBlock } from '@/components/MarkdownCodeBlock';

const formSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title is too long'),
  excerpt: z.string().max(200, 'Excerpt is too long').optional(),
  published: z.boolean(),
  slug: z.string().min(1, 'Slug is required').max(100, 'Slug is too long'),
  tags: z.array(z.string()).min(1, 'At least one tag is required'),
  // SEO and metadata fields
  metaTitle: z.string().max(60, 'Meta title should be under 60 characters').optional(),
  metaDescription: z.string().max(160, 'Meta description should be under 160 characters').optional(),
  canonicalUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  ogImage: z.string().optional(),
  ogImageAlt: z.string().optional(),
  noIndex: z.boolean().optional(),
  language: z.string().length(2, 'Language code should be 2 characters (e.g., "en")').optional(),
  coverImageKey: z.string().optional(),
  coverImageAlt: z.string().optional(),
  imageFile: z.instanceof(File).optional(),
});

interface EditBlogPostFormProps {
  post: Schema["BlogPost"]["type"];
}

// Add a custom copy button component
const CodeCopyButton = ({ code }: { code: string }) => {
  return (
    <button
      className="absolute right-2 top-2 p-1 rounded bg-muted/50 hover:bg-muted transition-colors"
      onClick={() => {
        navigator.clipboard.writeText(code);
        toast.success('Code copied to clipboard');
      }}
    >
      <Copy className="h-4 w-4" />
    </button>
  );
};

// Add a custom code renderer
const PreBlock = (props: any) => {
  if (props.children?.props?.children?.type === 'code') {
    const code = props.children.props.children.props.children;
    return (
      <pre {...props} className="relative group">
        <CodeCopyButton code={code} />
        {props.children}
      </pre>
    );
  }
  return <pre {...props} />;
};

export function EditBlogPostForm({ post }: EditBlogPostFormProps) {
  const { theme } = useTheme();
  const { user } = useAuthenticator((context) => [context.user]);
  const router = useRouter();
  const { mutate: updatePost, isPending, error } = useUpdateBlogPost();
  const [isUploading, setIsUploading] = useState(false);
  const [hasImageFile, setHasImageFile] = useState(false);
  
  // Fetch markdown content
  const { data: markdownContent, isLoading: isLoadingMarkdown } = useGetMarkdown(post.markdownKey ?? '');
  const [markdown, setMarkdown] = useState<string>('');

  // Set markdown content when loaded
  useEffect(() => {
    if (markdownContent) {
      setMarkdown(markdownContent);
    }
  }, [markdownContent]);

  const resizeImage = async (image: File, width: number, height: number) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.src = URL.createObjectURL(image);
    
    return new Promise<string>((resolve) => {
      img.onload = () => {
        canvas.width = width;
        canvas.height = height;
        ctx?.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg'));
      };
    });
  }

  const form = useForm({
    defaultValues: {
      title: post.title || '',
      excerpt: post.excerpt || '',
      published: post.published || false,
      slug: post.slug || '',
      tags: post.tags || [] as string[],
      metaTitle: post.metaTitle || '',
      metaDescription: post.metaDescription || '',
      canonicalUrl: post.canonicalUrl || '',
      ogImage: post.ogImage || '',
      ogImageAlt: post.ogImageAlt || '',
      noIndex: post.noIndex || false,
      language: post.language || 'en',
      coverImageKey: post.coverImageKey || '',
      coverImageAlt: post.coverImageAlt || '',
      imageFile: undefined as unknown as File | null,
    },
    onSubmit: async (form) => {
      try {
        setIsUploading(true);
        const publishedAt = form.value.published 
          ? post.publishedAt || new Date().toISOString() 
          : post.publishedAt;

        if (!user) {
          throw new Error('User not found');
        }

        // Upload markdown file if content changed
        let markdownKey = post.markdownKey;
        if (markdown !== markdownContent) {
          markdownKey = `markdown/${form.value.slug}.md`;
          try {
            await uploadData({
              path: markdownKey,
              data: markdown,
              options: {
                contentType: 'text/markdown',
                onProgress: ({ transferredBytes, totalBytes }) => {
                  if (totalBytes) {
                    console.log(
                      `Upload progress ${Math.round(
                        (transferredBytes / totalBytes) * 100
                      )} %`
                    );
                  }
                },
              },
            }).result;
          } catch (error) {
            toast.error('Error uploading markdown file: ' + (error as Error).message);
            return;
          }
        }

        // Upload image file if provided
        let coverImageKey = form.value.coverImageKey;
        let ogImage = form.value.ogImage;
        
        if (form.value.imageFile) {
          console.log("Uploading image file");
          const imageKey = `${form.value.slug}.${form.value.imageFile.type.split('/')[1]}`;
          coverImageKey = 'covers/' + imageKey;
          
          try {
            await uploadData({
              path: coverImageKey,
              data: form.value.imageFile,
              options: {
                contentType: form.value.imageFile.type,
              },
            }).result;
          } catch (error) {
            toast.error('Error uploading image file: ' + (error as Error).message);
            return;
          }

          // Resize image to 1200x630 for social sharing
          const thumbnailImageKey = `thumbnails/${imageKey}`;
          const thumbnailImage = await resizeImage(form.value.imageFile, 1200, 630);
          
          try {
            await uploadData({
              path: thumbnailImageKey,
              data: thumbnailImage,
              options: {
                contentType: form.value.imageFile.type,
              },
            }).result;
          } catch (error) {
            toast.error('Error uploading thumbnail image file: ' + (error as Error).message);
            return;
          }
          
          ogImage = thumbnailImageKey;
        }

        // Update blog post with all fields
        updatePost({
          slug: post.slug,
          input: {
            title: form.value.title,
            published: form.value.published,
            excerpt: form.value.excerpt,
            slug: form.value.slug,
            tags: form.value.tags,
            publishedAt: publishedAt,
            markdownKey: markdownKey,
            metaTitle: form.value.metaTitle || form.value.title,
            metaDescription: form.value.metaDescription || form.value.excerpt,
            canonicalUrl: form.value.canonicalUrl,
            ogImage: ogImage,
            ogImageAlt: form.value.ogImageAlt,
            noIndex: form.value.noIndex,
            language: form.value.language,
            coverImageKey: coverImageKey,
            coverImageAlt: form.value.coverImageAlt,
            readingTime: Math.ceil(markdown.split(/\s+/).length / 200),
          }
        }, {
          onSuccess: () => {
            toast.success('Blog post updated successfully');
            router.push('/admin');
          },
          onError: (error) => {
            toast.error('Error updating blog post: ' + error.message);
          },
        });
      } catch (error) {
        toast.error('Error updating blog post: ' + (error as Error).message);
      } finally {
        setIsUploading(false);
      }
    },
  });

  // Construct a slug from the title
  const constructSlugFromTitle = () => {
    const title = form.getFieldValue('title');
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };
  
  if (isLoadingMarkdown) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        void form.handleSubmit();
      }}
      className="flex flex-col space-y-6 mb-8"
    >
      <form.Field
        name="title"
        validators={{
            onChange: ({ value }) => {
              const result = formSchema.shape.title.safeParse(value);
              return result.success ? undefined : result.error.errors[0].message;
            },
          }}
      >
        {(field) => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>Title</Label>
            <Input
              id={field.name}
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
            />
            {field.state.meta.errors ? (
              <p className="text-sm text-red-600">{field.state.meta.errors.join(', ')}</p>
            ) : null}
          </div>
        )}
      </form.Field>

      <form.Field
        name="slug"
        validators={{
          onChange: ({ value }) => {
            const result = formSchema.shape.slug.safeParse(value);
            return result.success ? undefined : result.error.errors[0].message;
          },
        }}
      >
        {(field) => (
          <div className="space-y-2">
            <span className="flex flex-row gap-2 items-end">
            <div className="space-y-1 w-full">
            <Label htmlFor={field.name}>Slug</Label>
            <Input
              id={field.name}
              name={field.name} 
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
            />
            </div>
            <Button variant="outline" onClick={(e) => {
              e.preventDefault();
              field.handleChange(constructSlugFromTitle());
            }}>
              Generate Slug
              </Button>
            </span>
          {field.state.meta.errors ? (
            <p className="text-sm text-red-600">{field.state.meta.errors.join(', ')}</p>
            ) : null}
          </div>
        )}
      </form.Field>

      <form.Field
        name="excerpt"
        validators={{
          onChange: ({ value }) => {
            const result = formSchema.shape.excerpt.safeParse(value);
            return result.success ? undefined : result.error.errors[0].message;
          },
        }}
      >
        {(field) => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>Excerpt</Label>
            <Textarea
              id={field.name}
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
            />
            {field.state.meta.errors ? (
              <p className="text-sm text-red-600">{field.state.meta.errors.join(', ')}</p>
            ) : null}
          </div>
        )}
      </form.Field>

      <form.Field
        name="published"
        validators={{
          onChange: ({ value }) => {
            const result = formSchema.shape.published.safeParse(value);
            return result.success ? undefined : result.error.errors[0].message;
          },
        }}
      >
        {(field) => (
          <div className="space-y-2">
            <Label>Status</Label>
            <RadioGroup
              value={field.state.value.toString()}
              onValueChange={(value) => field.handleChange(value === "true")}
              className="flex flex-col space-y-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="false" id="draft" />
                <Label htmlFor="draft">Draft</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="true" id="published" />
                <Label htmlFor="published">Published</Label>
              </div>
            </RadioGroup>
            {field.state.meta.errors ? (
              <p className="text-sm text-red-600">{field.state.meta.errors.join(', ')}</p>
            ) : null}
          </div>
        )}
      </form.Field>
      <form.Field
        name="tags"
        mode="array"
        >
        {(field) => (
            <div className="space-y-2">
            <Label className="mr-2">Tags</Label>
            {field.state.value.map((_, index) => (
              <div key={index} className="flex gap-2 my-2">
                <form.Field
                  name={`tags[${index}]`}
                  children={(subField) => (
                    <Input
                      type="text"
                      value={subField.state.value ?? ''}
                      autoFocus
                      onChange={(e) =>
                        subField.handleChange(e.target.value)
                      }
                    />
                  )}
                />
                <Button
                  variant={"destructive"}
                  onClick={() => field.removeValue(index)}
                >
                  <X />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant={"outline"}
              onClick={() => field.pushValue("")}
            >
              Add
            </Button>
            </div>
        )}
      </form.Field>

      <div className="space-y-6 border rounded-lg p-6 bg-muted/50">
        <h2 className="text-lg font-semibold">SEO & Metadata</h2>
        
        <form.Field
          name="metaTitle"
          validators={{
            onChange: ({ value }) => {
              const result = formSchema.shape.metaTitle.safeParse(value);
              return result.success ? undefined : result.error.errors[0].message;
            },
          }}
        >
          {(field) => (
            <div className="space-y-2">
              <Label htmlFor={field.name}>Meta Title</Label>
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="Custom title for search engines"
              />
              <div className="text-xs text-muted-foreground">
                {field.state.value?.length || 0}/60 characters
              </div>
              {field.state.meta.errors ? (
                <p className="text-sm text-red-600">{field.state.meta.errors.join(', ')}</p>
              ) : null}
            </div>
          )}
        </form.Field>

        <form.Field
          name="metaDescription"
          validators={{
            onChange: ({ value }) => {
              const result = formSchema.shape.metaDescription.safeParse(value);
              return result.success ? undefined : result.error.errors[0].message;
            },
          }}
        >
          {(field) => (
            <div className="space-y-2">
              <Label htmlFor={field.name}>Meta Description</Label>
              <Textarea
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="Custom description for search engines"
              />
              <div className="text-xs text-muted-foreground">
                {field.state.value?.length || 0}/160 characters
              </div>
              {field.state.meta.errors ? (
                <p className="text-sm text-red-600">{field.state.meta.errors.join(', ')}</p>
              ) : null}
            </div>
          )}
        </form.Field>

        <form.Field
          name="canonicalUrl"
          validators={{
            onChange: ({ value }) => {
              if (!value) return undefined;
              const result = formSchema.shape.canonicalUrl.safeParse(value);
              return result.success ? undefined : result.error.errors[0].message;
            },
          }}
        >
          {(field) => (
            <div className="space-y-2">
              <Label htmlFor={field.name}>Canonical URL</Label>
              <span className="flex flex-row gap-2">
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="https://example.com/original-post"
                />
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={(e) => {
                    e.preventDefault();
                    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
                    const slug = form.getFieldValue('slug');
                    field.handleChange(`${siteUrl}/blog/${slug}`);
                  }}
                >
                  Generate URL
                </Button>
              </span>
              {field.state.meta.errors ? (
                <p className="text-sm text-red-600">{field.state.meta.errors.join(', ')}</p>
              ) : null}
            </div>
          )}
        </form.Field>

        <form.Field
          name="noIndex"
          validators={{
            onChange: ({ value }) => {
              const result = formSchema.shape.noIndex.safeParse(value);
              return result.success ? undefined : result.error.errors[0].message;
            },
          }}
        >
          {(field) => (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Switch
                  id={field.name}
                  checked={field.state.value}
                  onCheckedChange={field.handleChange}
                />
                <Label htmlFor={field.name}>Hide from search engines</Label>
              </div>
              {field.state.meta.errors ? (
                <p className="text-sm text-red-600">{field.state.meta.errors.join(', ')}</p>
              ) : null}
            </div>
          )}
        </form.Field>

        <form.Field
          name="language"
          validators={{
            onChange: ({ value }) => {
              const result = formSchema.shape.language.safeParse(value);
              return result.success ? undefined : result.error.errors[0].message;
            },
          }}
        >
          {(field) => (
            <div className="space-y-2">
              <Label htmlFor={field.name}>Language Code</Label>
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="en"
                maxLength={2}
              />
              {field.state.meta.errors ? (
                <p className="text-sm text-red-600">{field.state.meta.errors.join(', ')}</p>
              ) : null}
            </div>
          )}
        </form.Field>
      </div>

      <div className="space-y-6 border rounded-lg p-6 bg-muted/50">
        <h2 className="text-lg font-semibold">Images</h2>

        <form.Field
          name="imageFile"
          validators={{
            onChange: ({ value }) => {
              const result = formSchema.shape.imageFile.safeParse(value);
              return result.success ? undefined : result.error.errors[0].message;
            },
          }}
        >
          {(field) => (
            <div className="space-y-2">
              <Label htmlFor={field.name}>Image File</Label>
              <Input 
                type="file" 
                accept="image/*" 
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  setHasImageFile(!!file);
                  field.handleChange(file);
                }} 
              />
              
              <ImagePreview 
                imageFile={field.state.value}
                imageKey={post.coverImageKey}
                altText={post.coverImageAlt}
                onCancel={field.state.value ? () => {
                  field.handleChange(null);
                  setHasImageFile(false);
                } : undefined}
              />
            </div>
          )}
        </form.Field>
        
        <form.Field
          name="coverImageKey"
          validators={{
            onChange: ({ value }) => {
              const result = formSchema.shape.coverImageKey.safeParse(value);
              return result.success ? undefined : result.error.errors[0].message;
            },
          }}
        >
          {(field) => (
            <div className="space-y-2">
              <span className="flex flex-row gap-2 items-center">
              <Label htmlFor={field.name}>Cover Image URL</Label>
              { hasImageFile ? (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                    <Info className="w-4 h-4" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Image will be uploaded to S3 and the URL will be automatically generated.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              ) : null}
              </span>
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="Path to cover image"
                disabled={true}
              />
              {field.state.meta.errors ? (
                <p className="text-sm text-red-600">{field.state.meta.errors.join(', ')}</p>
              ) : null}
            </div>
          )}
        </form.Field>

        <form.Field
          name="coverImageAlt"
          validators={{
            onChange: ({ value }) => {
              const result = formSchema.shape.coverImageAlt.safeParse(value);
              return result.success ? undefined : result.error.errors[0].message;
            },
          }}
        >
          {(field) => (
            <div className="space-y-2">
              <Label htmlFor={field.name}>Cover Image Alt Text</Label>
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="Descriptive text for the cover image"
              />
              {field.state.meta.errors ? (
                <p className="text-sm text-red-600">{field.state.meta.errors.join(', ')}</p>
              ) : null}
            </div>
          )}
        </form.Field>

        <form.Field
          name="ogImage"
          validators={{
            onChange: ({ value }) => {
              const result = formSchema.shape.ogImage.safeParse(value);
              return result.success ? undefined : result.error.errors[0].message;
            },
          }}
        >
          {(field) => (
            <div className="space-y-2">
              <span className="flex flex-row gap-2 items-center">
              <Label htmlFor={field.name}>Social Share Image URL</Label>
              { hasImageFile ? (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                    <Info className="w-4 h-4" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Image will be uploaded to S3, resized to 1200x630 and the URL will be automatically generated.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              ) : null}
              </span>
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="Path to social sharing image (1200x630 recommended)"
                disabled={true}
              />
              {field.state.meta.errors ? (
                <p className="text-sm text-red-600">{field.state.meta.errors.join(', ')}</p>
              ) : null}
            </div>
          )}
        </form.Field>

        <form.Field
          name="ogImageAlt"
          validators={{
            onChange: ({ value }) => {
              const result = formSchema.shape.ogImageAlt.safeParse(value);
              return result.success ? undefined : result.error.errors[0].message;
            },
          }}
        >
          {(field) => (
            <div className="space-y-2">
              <Label htmlFor={field.name}>Social Share Image Alt Text</Label>
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="Descriptive text for the social sharing image"
              />
              {field.state.meta.errors ? (
                <p className="text-sm text-red-600">{field.state.meta.errors.join(', ')}</p>
              ) : null}
            </div>
          )}
        </form.Field>
      </div>

      <form.Subscribe
        selector={(state) => state.errors}
        children={(errors) =>
          errors.length > 0 && (
            <Alert variant={"destructive"}>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{JSON.stringify(errors)}</AlertDescription>
            </Alert>
          )
        }
      />

      {error && (
        <Alert variant={"destructive"}>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      )}

      <h2 className="text-lg font-semibold">Content</h2>
      <div className="flex flex-col md:flex-row gap-4 w-full mt-4">
        <Textarea
          value={markdown}
          onChange={(e) => setMarkdown(e.target.value)}
          className="h-[500px] overflow-y-auto"
        />
        <div className="container" data-color-mode={theme} id="md-editor">
          <div className="markdown h-[500px] overflow-y-auto">
            <ReactMarkdown
              components={{
                code: CodeBlock
              }}
              rehypePlugins={[rehypeSanitize]}
            >
              {markdown}
            </ReactMarkdown>
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-4">
        <Button 
          type="button" 
          variant="outline"
          onClick={() => router.push('/admin')}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={!form.state.canSubmit || isPending || isUploading}
        >
          {isPending || isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Updating...
            </>
          ) : (
            'Update Post'
          )}
        </Button>
      </div>
    </form>
  );
} 