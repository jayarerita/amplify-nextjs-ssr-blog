'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { UserPlus, Search, ChevronRight, Loader2 } from 'lucide-react';
import { UserCard } from '@/features/users/UserCard';
import { useGetUserProfilesInfinite } from '@/features/users/database/use-get-user-profiles';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

export default function UsersPage() {
  const router = useRouter();
  const { 
    data: users, 
    isLoading, 
    error, 
    fetchNextPage, 
    hasNextPage,
    isFetchingNextPage
  } = useGetUserProfilesInfinite("userPool");
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = users?.pages.flatMap(page => page.data).filter(user => 
    user.displayName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteUser = (userId: string) => {
    // In a real implementation, you would call a mutation here
    toast.error("User deletion not implemented yet");
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">User Management</h1>
        <Button 
          onClick={() => router.push('/admin/users/new')}
          className="flex items-center gap-2"
        >
          <UserPlus className="h-4 w-4" />
          Add New User
        </Button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search users..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {error && (
        <div className="bg-destructive/10 p-4 rounded-lg mb-6">
          <p className="text-destructive">Error loading users: {error.message}</p>
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-4 w-[150px]" />
                </div>
              </div>
              <Skeleton className="h-[100px] w-full" />
            </div>
          ))}
        </div>
      ) : (
        <>
          {filteredUsers && filteredUsers.length > 0 ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredUsers.map(user => (
                  <UserCard 
                    key={user.id} 
                    user={user} 
                    onDelete={handleDeleteUser} 
                  />
                ))}
              </div>
              
              {/* Pagination Controls */}
              {!searchTerm && hasNextPage && (
                <div className="flex justify-center pt-4">
                  <Button
                    variant="outline"
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                    className="flex items-center gap-2"
                  >
                    {isFetchingNextPage ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Loading more...
                      </>
                    ) : (
                      <>
                        Load More Users
                        <ChevronRight className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-card p-6 rounded-lg shadow text-center">
              {searchTerm ? (
                <p className="text-muted-foreground">No users found matching "{searchTerm}"</p>
              ) : (
                <p className="text-muted-foreground">No users found. Create a new user to get started.</p>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
} 