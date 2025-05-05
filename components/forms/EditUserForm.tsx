'use client';

import { useGetUserProfile } from '@/lib/hooks/use-get-user-profile';
import { useUpdateUser, type UpdateUserInput } from '@/lib/hooks/use-update-user';
import { useForm } from '@tanstack/react-form';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

const formSchema = z.object({
  username: z.string().min(1, 'Username is required').max(50, 'Username is too long'),
  displayName: z.string().min(1, 'Display name is required').max(100, 'Display name is too long'),
  email: z.string().email('Invalid email address'),
  bio: z.string().max(500, 'Bio is too long').optional(),
  avatar: z.string().optional(),
  role: z.enum(['user', 'admin']).default('user'),
});

interface EditUserFormProps {
  userId: string;
}

export function EditUserForm({ userId }: EditUserFormProps) {
  const router = useRouter();
  const { data: user, isLoading, error: fetchError } = useGetUserProfile(userId);
  const { mutate: updateUser, isPending, error: updateError } = useUpdateUser();

  const form = useForm({
    defaultValues: {
      username: user?.username || '',
      displayName: user?.displayName || '',
      email: user?.email || '',
      bio: user?.bio || '',
      avatar: user?.avatar || '',
      role: (user?.role as 'user' | 'admin') || 'user',
    },
    onSubmit: async (form) => {
      try {
        const userData: UpdateUserInput = {
          id: userId,
          username: form.value.username,
          displayName: form.value.displayName,
          email: form.value.email,
          bio: form.value.bio,
          avatar: form.value.avatar,
          role: form.value.role,
        };

        updateUser(userData, {
          onSuccess: () => {
            toast.success('User updated successfully');
            router.push('/admin/users');
          },
          onError: (error) => {
            toast.error('Error updating user: ' + error.message);
          },
        });
      } catch (error) {
        toast.error('Error updating user: ' + (error as Error).message);
      }
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-full max-w-[200px]" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  if (fetchError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Failed to load user: {fetchError.message}</AlertDescription>
      </Alert>
    );
  }

  if (!user) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>User not found</AlertDescription>
      </Alert>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="space-y-8"
    >
      {updateError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{updateError.message}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        <div>
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            defaultValue={user.username}
            {...form.getFieldProps('username')}
            placeholder="username"
          />
          {form.getFieldError('username') && (
            <p className="mt-1 text-sm text-red-500">{form.getFieldError('username')}</p>
          )}
        </div>

        <div>
          <Label htmlFor="displayName">Display Name</Label>
          <Input
            id="displayName"
            defaultValue={user.displayName}
            {...form.getFieldProps('displayName')}
            placeholder="Display Name"
          />
          {form.getFieldError('displayName') && (
            <p className="mt-1 text-sm text-red-500">{form.getFieldError('displayName')}</p>
          )}
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            defaultValue={user.email}
            {...form.getFieldProps('email')}
            placeholder="user@example.com"
          />
          {form.getFieldError('email') && (
            <p className="mt-1 text-sm text-red-500">{form.getFieldError('email')}</p>
          )}
        </div>

        <div>
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            defaultValue={user.bio || ''}
            {...form.getFieldProps('bio')}
            placeholder="User bio"
            rows={3}
          />
          {form.getFieldError('bio') && (
            <p className="mt-1 text-sm text-red-500">{form.getFieldError('bio')}</p>
          )}
        </div>

        <div>
          <Label htmlFor="avatar">Avatar URL</Label>
          <Input
            id="avatar"
            defaultValue={user.avatar || ''}
            {...form.getFieldProps('avatar')}
            placeholder="https://example.com/avatar.jpg"
          />
          {form.getFieldError('avatar') && (
            <p className="mt-1 text-sm text-red-500">{form.getFieldError('avatar')}</p>
          )}
        </div>

        <div>
          <Label>Role</Label>
          <RadioGroup 
            defaultValue={user.role || 'user'}
            onValueChange={(value) => form.setFieldValue('role', value as 'user' | 'admin')}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="user" id="user" />
              <Label htmlFor="user">User</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="admin" id="admin" />
              <Label htmlFor="admin">Admin</Label>
            </div>
          </RadioGroup>
          {form.getFieldError('role') && (
            <p className="mt-1 text-sm text-red-500">{form.getFieldError('role')}</p>
          )}
        </div>
      </div>

      <div className="flex space-x-4">
        <Button 
          type="submit" 
          disabled={isPending}
          className="flex-1"
        >
          {isPending ? 'Updating User...' : 'Update User'}
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => router.push('/admin/users')}
          className="flex-1"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
} 