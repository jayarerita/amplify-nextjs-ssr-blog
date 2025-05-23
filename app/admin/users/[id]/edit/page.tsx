import { EditUserForm } from '@/features/users/forms/EditUserForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface EditUserPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditUserPage({ params }: EditUserPageProps) {
  const { id } = await params;

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Edit User</h1>
          <Link href="/admin/users">
            <Button 
              variant="outline" 
              size="icon"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="bg-card p-6 rounded-lg shadow">
          <EditUserForm userId={id} />
        </div>
      </div>
    </div>
  );
} 