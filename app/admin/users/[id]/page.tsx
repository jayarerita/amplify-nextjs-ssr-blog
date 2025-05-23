'use client';

import { useGetUserProfile } from '@/features/users/database/use-get-user-profile';
import { UserCard } from '@/features/users/UserCard';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface UserDetailsPageProps {
  params: {
    id: string;
  };
}

export default function UserDetailsPage({ params }: UserDetailsPageProps) {
  const { id } = params;
  const router = useRouter();
  const { data: user, isLoading, error } = useGetUserProfile(id);

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">User Details</h1>
          <Button 
            variant="outline" 
            onClick={() => router.back()}
            size="icon"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </div>
        <div className="bg-card p-6 rounded-lg shadow">
          {isLoading && <p>Loading...</p>}
          {error && <p className="text-red-500">{error.message}</p>}
          {user && <UserCard user={user} />}
        </div>
      </div>
    </div>
  );
}
