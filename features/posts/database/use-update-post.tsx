import { client } from "@/lib/clients/amplify-client.client";
import { type Schema } from "@/amplify/data/resource";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export function useUpdatePost(showToast: boolean = true) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, input }: { id: string, input: Partial<Schema["Post"]["updateType"]> }) => {
        return client.models.Post.update({ id, ...input}, { authMode: "userPool" });
    },
    onSuccess: (result, variables) => {
      if (result.errors && result.errors.length > 0) {
        // concatenate all error messages
        const errorMessages = result.errors.map((error) => error.message).join("\n");
        throw new Error(errorMessages);
      }
      
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['post', variables.id] });
      
      if (showToast) {
        toast.success("Post updated successfully");
      }
    },
    onError: (error) => {
      if (showToast) {
        toast.error(error.message || "Failed to update post");
      }
      console.error(error);
    },
  });
} 