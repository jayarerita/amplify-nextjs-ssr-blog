'use client';

import { useCreateBlogPost } from '@/lib/hooks/use-create-blog-post';
import { useForm } from '@tanstack/react-form';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { AlertCircle, X } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useAuthenticator } from '@aws-amplify/ui-react';
import MDEditor from '@uiw/react-md-editor';
import { useState } from 'react';
import { useTheme } from "next-themes";
import { uploadData } from 'aws-amplify/storage';
import { toast } from 'sonner';
// TODO add cover image string field
// TODO add markdown file upload field


const formSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title is too long'),
  excerpt: z.string().max(200, 'Excerpt is too long').optional(),
  published: z.boolean(),
  slug: z.string().min(1, 'Slug is required').max(100, 'Slug is too long'),
  tags: z.array(z.string()).min(1, 'At least one tag is required'),
});


export function CreateBlogPostForm() {
  const { theme } = useTheme();
  const { user } = useAuthenticator((context) => [context.user]);
  const router = useRouter();
  const { mutate: createPost, isPending, error } = useCreateBlogPost();
  const [markdown, setMarkdown] = useState('Hello world');
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm({
    defaultValues: {
      title: '',
      excerpt: '',
      published: false,
      slug: '',
      tags: [] as string[],
    },
    onSubmit: async (form) => {
      try {
        setIsUploading(true);
        const publishedAt = form.value.published ? new Date().toISOString() : null;

        if (!user) {
          throw new Error('User not found');
        }

        // Upload markdown file first
        const markdownKey = `markdown/${form.value.slug}.md`;
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

        // Create blog post with markdown file reference
        createPost({
          title: form.value.title,
          published: form.value.published,
          excerpt: form.value.excerpt,
          slug: form.value.slug,
          tags: form.value.tags,
          publishedAt: publishedAt,
          owner: user.userId,
          markdownKey: markdownKey,
        }, {
          onSuccess: () => {
            toast.success('Blog post created successfully');
            router.push('/admin');
          },
          onError: (error) => {
            toast.error('Error creating blog post: ' + error.message);
          },
        });
      } catch (error) {
        toast.error('Error uploading markdown: ' + (error as Error).message);
      } finally {
        setIsUploading(false);
      }
    },
  });

  // Optional: Construct a slug from the title and update the slug field
  const constructSlugFromTitle = () => {
    const title = form.getFieldValue('title');
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    console.log(slug);
    return slug;
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        void form.handleSubmit();
      }}
      className="flex flex-col space-y-6"
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
                      value={subField.state.value}
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

      <div className="container" data-color-mode={theme} id="md-editor">
        <MDEditor
          height={500}
          value={markdown}
          textareaProps={{
            placeholder: 'Please enter Markdown text',
          }}
          onChange={(value) => setMarkdown(value || '')}
        />
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          //disabled={!form.state.canSubmit || isPending}
          onClick={() => {
            console.log('Form state:', {
              canSubmit: form.state.canSubmit,
              isPending,
              values: form.state.values,
              errors: form.state.errors
            });
          }}
        >
          {isPending || isUploading ? 'Creating...' : 'Create Post'}
        </Button>
      </div>
    </form>
  );
}
