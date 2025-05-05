import { client } from "@/lib/clients/amplify-client";
import { type Schema } from "@/amplify/data/resource";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export function useUpdateBlogPost(showToast: boolean = true) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ slug, input }: { slug: string, input: Partial<Schema["BlogPost"]["updateType"]> }) => {
      return client.models.BlogPost.update({ slug, ...input}, { authMode: "userPool" });
    },
    onSuccess: (result, variables) => {
      if (result.errors && result.errors.length > 0) {
        // concatenate all error messages
        const errorMessages = result.errors.map((error) => error.message).join("\n");
        throw new Error(errorMessages);
      }
      
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
      queryClient.invalidateQueries({ queryKey: ['blogPost', variables.slug] });
      queryClient.invalidateQueries({ queryKey: ['blogPostsAuthenticated'] });
      
      if (showToast) {
        toast.success("Blog post updated successfully");
      }
    },
    onError: (error) => {
      if (showToast) {
        toast.error(error.message || "Failed to update blog post");
      }
      console.error(error);
    },
  });
} 