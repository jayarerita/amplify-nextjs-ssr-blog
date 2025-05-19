import { client } from "@/lib/clients/amplify-client";
import { type Schema } from "@/amplify/data/resource";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export function useCreatePost(showToast: boolean = true) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: Schema["Post"]["createType"]) => {
      return client.models.Post.create(input, { authMode: "userPool" });
    },
    onSuccess: (result) => {
      if (result.errors && result.errors.length > 0) {
        // concatenate all error messages
        const errorMessages = result.errors.map((error) => error.message).join("\n");
        throw new Error(errorMessages);
      }
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      
      if (showToast) {
        toast.success("Post created successfully");
      }
    },
    onError: (error) => {
      if (showToast) {
        toast.error(error.message || "Failed to create post");
      }
      console.error(error);
    },
  });
}
