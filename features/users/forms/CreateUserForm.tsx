'use client';

import { useCreateUser } from '@/features/users/database/use-create-user';
import { useForm } from '@tanstack/react-form';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { toast } from 'sonner';
import { type Schema } from '@/amplify/data/resource';
import { signUp } from '@aws-amplify/auth';

const formSchema = z.object({
  username: z.string().min(1, 'Username is required').max(50, 'Username is too long'),
  displayName: z.string().min(1, 'Display name is required').max(100, 'Display name is too long'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
  bio: z.string().max(500, 'Bio is too long').optional(),
});

export function CreateUserForm() {
  const { user } = useAuthenticator((context) => [context.user]);
  const router = useRouter();
  const { mutate: createUser, isPending, error } = useCreateUser();

  const form = useForm({
    defaultValues: {
      username: '',
      displayName: '',
      email: '',
      bio: '',
      avatar: '',
      role: 'user' as const,
      password: '',
    },
    onSubmit: async (form) => {
      try {
        if (!user) {
          throw new Error('Admin user not found');
        }

        const userData: Schema["UserProfile"]["createType"] = {
          username: form.value.username,
          displayName: form.value.displayName,
          email: form.value.email,
          bio: form.value.bio,
          // avatar: form.value.avatar,
          // role: form.value.role,
          role: 'user',
          profileOwner: user.username, // Will be replace by the backend api call to create a new user
        };

        // createUser(userData, {
        //   onSuccess: () => {
        //     toast.success('User created successfully');
        //     router.push('/admin/users');
        //   },
        //   onError: (error) => {
        //     toast.error('Error creating user: ' + error.message);
        //   },
        // });

        const { isSignUpComplete, userId, nextStep } = await signUp({
          username: form.value.email,
          password: form.value.password,
          options: {

            userAttributes: {
              email: form.value.email,
            },
          },
          
        });
        console.log(isSignUpComplete, userId, nextStep);
        if (isSignUpComplete) {
          toast.success('User created successfully');
          router.push('/admin/users');
        } else {
          toast.error('Error creating user: ' + (nextStep as unknown as Error).message);
        }
        if (nextStep?.signUpStep === 'CONFIRM_SIGN_UP') {
          toast.info('Please confirm your email');
        }
      } catch (error) {
        toast.error('Error creating user: ' + (error as Error).message);
      }
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="space-y-8"
    >
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error.message}</AlertDescription>
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
        {( field ) => (
          <div className="space-y-4">
          <Label htmlFor="username">Username</Label>
          <Input
          id={field.name}
          name={field.name}
          value={field.state.value}
          onBlur={field.handleBlur}
          onChange={(e) => field.handleChange(e.target.value)}
          />
            {field.state.meta.errors ? (
              <p className="text-sm text-red-600">{field.state.meta.errors.join(', ')}</p>
            ) : null}
        </div>
        )}
      </form.Field>

      <form.Field
      name="password"
      validators={{
        onChange: ({ value }) => {
          const result = formSchema.shape.password.safeParse(value);
          return result.success ? undefined : result.error.errors[0].message;
        },
      }}
      >
        {( field ) => (
          <div className="space-y-4">
            <Label htmlFor="password">Password</Label>
            <Input
              id={field.name}
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="Password"
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
        {( field ) => (
          <div className="space-y-4">
            <Label htmlFor="displayName">Display Name</Label>
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
        // TODO: Check if email is already in use
        onChangeAsync: async ({ value }) => {
          const result = formSchema.shape.email.safeParse(value);
          return result.success ? undefined : result.error.errors[0].message;
        },
        onChangeAsyncDebounceMs: 1000,
      }}
      >
        {( field ) => (
          <div className="space-y-4">
            <Label htmlFor="email">Email</Label>
          <Input
            id={field.name}
            name={field.name}
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

      <form.Field name="bio">
        {( field ) => (
          <div className="space-y-4">
            <Label htmlFor="bio">Bio</Label>
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

      
      <Button 
        type="submit" 
        disabled={isPending}
        className="w-full"
      >
        {isPending ? 'Creating User...' : 'Create User'}
      </Button>
    </form>
  );
} 