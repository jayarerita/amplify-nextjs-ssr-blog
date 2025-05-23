'use client';

import { useGetUserProfile } from '@/features/users/database/use-get-user-profile';
import { useUpdateUser, type UpdateUserInput } from '@/features/users/database/use-update-user';
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
  username: z.string().min(1, 'Username is required').max(50, 'Username is too long').readonly(),
  displayName: z.string().min(1, 'Display name is required').max(100, 'Display name is too long'),
  email: z.string().email('Invalid email address'),
  bio: z.string().max(500, 'Bio is too long').optional(),
  avatar: z.string().optional(),
  role: z.enum(['user', 'admin']).default('user').readonly(),
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

      <form.Field
        name="username"
        validators={{
          onChange: ({ value }) => {
            const result = formSchema.shape.username.safeParse(value);
            return result.success ? undefined : result.error.errors[0].message;
          },
        }}
      >
        {(field) => (
          <div>
            <Label htmlFor={field.name}>Username</Label>
            <Input
              id={field.name}
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="username"
              disabled
            />
            {field.state.meta.errors ? (
              <p className="mt-1 text-sm text-red-500">{field.state.meta.errors.join(', ')}</p>
            ) : null}
          </div>
        )}
      </form.Field>

      <form.Field
        name="displayName"
        validators={{
          onChange: ({ value }) => {
            const result = formSchema.shape.displayName.safeParse(value);
            return result.success ? undefined : result.error.errors[0].message;
          },
        }}
      >
        {(field) => (
          <div>
            <Label htmlFor={field.name}>Display Name</Label>
            <Input
              id={field.name}
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="Display Name"
            />
            {field.state.meta.errors ? (
              <p className="mt-1 text-sm text-red-500">{field.state.meta.errors.join(', ')}</p>
            ) : null}
          </div>
        )}
      </form.Field>

      <form.Field
        name="email"
        validators={{
          onChange: ({ value }) => {
            const result = formSchema.shape.email.safeParse(value);
            return result.success ? undefined : result.error.errors[0].message;
          },
        }}
      >
        {(field) => (
          <div>
            <Label htmlFor={field.name}>Email</Label>
            <Input
              id={field.name}
              name={field.name}
              type="email"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="user@example.com"
            />
            {field.state.meta.errors ? (
              <p className="mt-1 text-sm text-red-500">{field.state.meta.errors.join(', ')}</p>
            ) : null}
          </div>
        )}
      </form.Field>

      <form.Field
        name="bio"
        validators={{
          onChange: ({ value }) => {
            const result = formSchema.shape.bio.safeParse(value);
            return result.success ? undefined : result.error.errors[0].message;
          },
        }}
      >
        {(field) => (
          <div>
            <Label htmlFor={field.name}>Bio</Label>
            <Textarea
              id={field.name}
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="User bio"
              rows={3}
            />
            {field.state.meta.errors ? (
              <p className="mt-1 text-sm text-red-500">{field.state.meta.errors.join(', ')}</p>
            ) : null}
          </div>
        )}
      </form.Field>

      <form.Field
        name="avatar"
        validators={{
          onChange: ({ value }) => {
            const result = formSchema.shape.avatar.safeParse(value);
            return result.success ? undefined : result.error.errors[0].message;
          },
        }}
      >
        {(field) => (
          <div>
            <Label htmlFor={field.name}>Avatar URL</Label>
            <Input
              id={field.name}
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="https://example.com/avatar.jpg"
            />
            {field.state.meta.errors ? (
              <p className="mt-1 text-sm text-red-500">{field.state.meta.errors.join(', ')}</p>
            ) : null}
          </div>
        )}
      </form.Field>

      <form.Field
        name="role"
        validators={{
          onChange: ({ value }) => {
            const result = formSchema.shape.role.safeParse(value);
            return result.success ? undefined : result.error.errors[0].message;
          },
        }}
      >
        {(field) => (
          <div>
            <Label>Role</Label>
            <RadioGroup
              value={field.state.value}
              onValueChange={(value) => field.handleChange(value as 'user' | 'admin')}
              disabled
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
            {field.state.meta.errors ? (
              <p className="mt-1 text-sm text-red-500">{field.state.meta.errors.join(', ')}</p>
            ) : null}
          </div>
        )}
      </form.Field>

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