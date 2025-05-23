import { client } from "@/lib/clients/amplify-client.client";
import { type Schema } from "@/amplify/data/resource";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: Schema["UserProfile"]["createType"]) => {
      return client.models.UserProfile.create(
        {
          id: input.username,
          username: input.username,
          displayName: input.displayName,
          email: input.email,
          bio: input.bio || "",
          avatar: input.avatar || "",
          profileOwner: input.profileOwner,
          role: input.role
        },
      );
    },
    onSuccess: (result) => {
      if (result.errors && result.errors.length > 0) {
        // concatenate all error messages
        const errorMessages = result.errors.map((error) => error.message).join("\n");
        throw new Error(errorMessages);
      }
      queryClient.invalidateQueries({ queryKey: ['userProfiles'] });
      toast.success("User created successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create user");
      console.error(error);
    },
  });
} 