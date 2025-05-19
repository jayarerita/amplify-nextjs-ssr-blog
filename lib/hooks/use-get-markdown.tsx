import { useQuery } from '@tanstack/react-query';
import { getUrl } from 'aws-amplify/storage';
import { toast } from 'sonner';

export function useGetMarkdown(markdownKey: string | undefined, { enabled }: { enabled?: boolean }) {
  return useQuery({
    queryKey: ['markdown', markdownKey],
    queryFn: async () => {
      if (!markdownKey) {
        throw new Error('Markdown key is required');
      }
      
      try {
        // Get the URL for the markdown file
        const result = await getUrl({
          path: markdownKey
        });
        
        // Fetch the markdown content
        const response = await fetch(result.url.toString());
        if (!response.ok) {
          console.error('Failed to fetch markdown:', response.statusText);
          toast.error(`Failed to fetch markdown: ${response.statusText}`);
          throw new Error(`Failed to fetch markdown: ${response.statusText}`);
        }
        
        return await response.text();
      } catch (error) {
        console.error('Error fetching markdown:', error);
        toast.error('Failed to fetch markdown content');
        throw new Error('Failed to fetch markdown content');
      }
    },
    enabled: !!markdownKey && enabled,
  });
} 