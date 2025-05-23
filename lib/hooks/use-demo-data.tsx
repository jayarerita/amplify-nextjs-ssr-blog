import { client } from '@/lib/clients/amplify-client.client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export function useGenerateDemoData() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (count: number = 10) => {
      return client.queries.demoData({
        count,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['postsPaginated', 'posts'] });
      toast.success('Demo data generated successfully');
    },
    onError: (error) => {
      toast.error('Failed to generate demo data: ' + error.message);
      console.error(error);
    },
  });
}

export function useDeleteDemoData() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return client.queries.deleteDemoData();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['postsPaginated', 'posts'] });
      toast.success('Demo data deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete demo data: ' + error.message);
      console.error(error);
    },
  });
} 