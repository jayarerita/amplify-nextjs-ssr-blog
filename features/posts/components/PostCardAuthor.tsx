'use client';

import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useGetUserProfile } from "@/features/users/database/use-get-user-profile";

export const PostCardAuthor = ({ authorId }: { authorId: string }) => {
  const { data: userProfile, isLoading: isUserProfileLoading } = useGetUserProfile(authorId);

  if (isUserProfileLoading) {
    return <div className="mt-6 flex items-center gap-x-3">
      <Skeleton className="h-8 w-8 rounded-full" />
      <Skeleton className="h-4 w-24" />
    </div>
  }

  if (userProfile) {
  return (
    
      <div className="mt-6 flex items-center gap-x-3">
        <Avatar className="h-8 w-8">
          <AvatarImage src={userProfile.avatar || ''} alt={userProfile.displayName} />
          <AvatarFallback>{userProfile.displayName.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-medium text-foreground">{userProfile.displayName}</p>
        </div>
      </div>
    )
  }
  return null
}