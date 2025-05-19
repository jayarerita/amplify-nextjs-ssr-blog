import { getUrl } from '@aws-amplify/storage/server';
import { runWithAmplifyServerContext } from '@/lib/utils/amplify-utils';

const getImageUrl = async (imageKey: string) => {
  try {
    const imageUrl = await runWithAmplifyServerContext({
      nextServerContext: null,
      operation: (contextSpec) =>
      getUrl(contextSpec, {
        path: imageKey
      })
    });
    return imageUrl.url.toString();
  } catch (error) {
    console.error(error);
    return null;
  }
};

export default async function PostCoverImage({ imageKey, altText }: { imageKey: string, altText: string }) {
  const imageUrl = await getImageUrl(imageKey);
  
  if (!imageUrl) {
    return <p>Something went wrong...</p>;
  }

  return (
    <div className="relative w-full h-auto overflow-hidden">
      <img
        src={imageUrl} 
        alt={altText} 
        className="w-full h-auto rounded-lg mb-4"
      />
    </div>
  );
}


