import { client } from "@/lib/clients/amplify-client";
import { type Schema } from "@/amplify/data/resource";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export function useCreateBlogPost(showToast: boolean = true) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: Schema["BlogPost"]["createType"]) => {
      return client.models.BlogPost.create(input, { authMode: "userPool" });
    },
    onSuccess: (result) => {
      if (result.errors && result.errors.length > 0) {
        // concatenate all error messages
        const errorMessages = result.errors.map((error) => error.message).join("\n");
        throw new Error(errorMessages);
      }
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
      
      if (showToast) {
        toast.success("Blog post created successfully");
      }
    },
    onError: (error) => {
      if (showToast) {
        toast.error(error.message || "Failed to create blog post");
      }
      console.error(error);
    },
  });
}
