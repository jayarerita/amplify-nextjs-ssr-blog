import { client } from "@/lib/clients/amplify-client";
import { useQuery } from '@tanstack/react-query';

export function useGetUserProfile(id: string) {
  return useQuery({
    queryKey: ['userProfile', id],
    queryFn: async () => {
      const { data, errors } = await client.models.UserProfile.get(
        { id }
      );

      if (errors) {
        console.error("Failed to fetch user profile", errors);
        throw new Error(errors[0]?.message || "Failed to fetch user profile");
      }
      
      if (!data) {
        throw new Error("User profile not found");
      }
      
      return data;
    },
    enabled: !!id,
  });
}
