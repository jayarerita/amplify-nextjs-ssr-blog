import { client } from "@/lib/clients/amplify-client.client";
import { type Schema } from "@/amplify/data/resource";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export function useCreatePostTag(showToast: boolean = true) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: Schema["PostTag"]["createType"]) => {
      return client.models.PostTag.create(input);
    },
    onSuccess: (result) => {
      if (result.errors && result.errors.length > 0) {
        // concatenate all error messages
        const errorMessages = result.errors.map((error) => error.message).join("\n");
        throw new Error(errorMessages);
      }
      queryClient.invalidateQueries({ queryKey: ['tags'] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['postTags'] });
      
      if (showToast) {
        toast.success("Blog tag relation created successfully");
      }
    },
    onError: (error) => {
      if (showToast) {
        toast.error(error.message || "Failed to create blog tag relation");
      }
      console.error(error);
    },
  });
}
