import { client } from "@/lib/clients/amplify-client";
import { type Schema } from "@/amplify/data/resource";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export type UpdateUserInput = {
  id: string;
  username?: string;
  displayName?: string;
  email?: string;
  bio?: string;
  avatar?: string;
  role?: "user" | "admin";
};

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: UpdateUserInput) => {
      return client.models.UserProfile.update(
        {
          id: input.id,
          ...(input.username && { username: input.username }),
          ...(input.displayName && { displayName: input.displayName }),
          ...(input.email && { email: input.email }),
          ...(input.bio !== undefined && { bio: input.bio }),
          ...(input.avatar !== undefined && { avatar: input.avatar }),
          ...(input.role && { role: input.role }),
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
      queryClient.invalidateQueries({ queryKey: ['userProfile', result.data?.id] });
      toast.success("User updated successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update user");
      console.error(error);
    },
  });
} 