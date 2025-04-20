'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { StorageManager } from '@aws-amplify/ui-react-storage';
import { generateClient } from 'aws-amplify/api';
import { Button } from '@aws-amplify/ui-react';

const client = generateClient();

export default function UploadPage() {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);

  const handleSuccess = async (key: string | undefined) => {
    if (!key) return;
    setIsUploading(true);
    try {
      // Here you could add logic to create a blog post from the uploaded markdown
      // For example, you could read the file content and create a new post
      console.log('File uploaded successfully:', key);
      router.push('/admin');
    } catch (error) {
      console.error('Error processing uploaded file:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Upload Markdown</h1>
        <p className="mt-2 text-sm text-gray-600">
          Upload a markdown file to create a new blog post. The file will be stored in S3 and can be used to create a new post.
        </p>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <StorageManager
          acceptedFileTypes={['.md', '.markdown']}
          path="markdown/"
          maxFileCount={1}
          isResumable
          onUploadSuccess={({ key }) => handleSuccess(key)}
          onUploadError={(error) => console.error('Upload error:', error)}
          accessLevel="private"
        />
      </div>

      <div className="mt-6 flex justify-end">
        <Button
          onClick={() => router.push('/admin')}
          variation="link"
          className="text-gray-600 hover:text-gray-900"
        >
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
} 