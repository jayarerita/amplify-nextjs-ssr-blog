'use client';

import { EditUserForm } from '@/components/forms/EditUserForm';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface EditUserPageProps {
  params: {
    id: string;
  };
}

export default function EditUserPage({ params }: EditUserPageProps) {
  const { id } = params;
  const router = useRouter();

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Edit User</h1>
          <Button 
            variant="outline" 
            onClick={() => router.back()}
            size="icon"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </div>

        <div className="bg-card p-6 rounded-lg shadow">
          <EditUserForm userId={id} />
        </div>
      </div>
    </div>
  );
} 