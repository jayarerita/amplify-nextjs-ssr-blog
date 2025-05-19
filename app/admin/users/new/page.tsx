'use client';

import { CreateUserForm } from '@/features/users/forms/CreateUserForm';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function NewUserPage() {
  const router = useRouter();

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Create New User</h1>
          <Button 
            variant="outline" 
            onClick={() => router.back()}
            size="icon"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </div>

        <div className="bg-card p-6 rounded-lg shadow">
          <CreateUserForm />
        </div>
      </div>
    </div>
  );
} 