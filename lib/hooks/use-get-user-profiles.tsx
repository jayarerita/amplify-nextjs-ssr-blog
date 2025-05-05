import { client } from "@/lib/clients/amplify-client";
import { useInfiniteQuery } from '@tanstack/react-query';

const getUserProfiles = async ({ pageParam, authMode }: { pageParam?: string, authMode: "identityPool" | "userPool" }) => {
  const { data, errors, nextToken } = await client.models.UserProfile.list({ 
    authMode: authMode, 
    nextToken: pageParam 
  });
  return { data, errors, nextToken };
}

export function useGetUserProfilesInfinite(authMode: "identityPool" | "userPool" = "identityPool") {
  return useInfiniteQuery({
    queryKey: ['userProfiles'],
    queryFn: () => getUserProfiles({ authMode }),
    getNextPageParam: (lastPage) => lastPage.nextToken,
    getPreviousPageParam: () => undefined,
    initialPageParam: undefined,
  });
}