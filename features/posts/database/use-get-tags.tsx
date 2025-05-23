import { client } from "@/lib/clients/amplify-client.client";
import { useInfiniteQuery } from "@tanstack/react-query";

const getTags = async ({
  queryKey,
  pageParam,
}: {
  queryKey: string[];
  pageParam?: string;
}) => {
  if (queryKey[1]) {
    const { data, errors, nextToken } = await client.models.Tag.list({
      nextToken: pageParam,
      filter: {
        name: {
          contains: queryKey[1],
        },
      },
    });
    return { data, errors, nextToken };
  }
  const { data, errors, nextToken } = await client.models.Tag.list({
    nextToken: pageParam,
  });
  return { data, errors, nextToken };
};

export function useGetTags({ search }: { search: string }) {
  return useInfiniteQuery({
    queryKey: ["tags", search],
    queryFn: getTags,
    getNextPageParam: (lastPage) => lastPage.nextToken,
    getPreviousPageParam: () => undefined,
    initialPageParam: undefined,
  });
}
