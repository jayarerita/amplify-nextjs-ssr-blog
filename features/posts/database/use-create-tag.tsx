import { client } from "@/lib/clients/amplify-client";
import { type Schema } from "@/amplify/data/resource";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export function useCreateTag(showToast: boolean = true) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: Schema["Tag"]["createType"]) => {
      return client.models.Tag.create(input);
    },
    onSuccess: (result) => {
      if (result.errors && result.errors.length > 0) {
        // concatenate all error messages
        const errorMessages = result.errors.map((error) => error.message).join("\n");
        throw new Error(errorMessages);
      }
      queryClient.invalidateQueries({ queryKey: ['tags'] });
      
      if (showToast) {
        toast.success("Tag created successfully");
      }
    },
    onError: (error) => {
      if (showToast) {
        toast.error(error.message || "Failed to create tag");
      }
      console.error(error);
    },
  });
}
