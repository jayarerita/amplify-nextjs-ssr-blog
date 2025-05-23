// Redirect to the /posts/[slug] page
import { redirect } from 'next/navigation';

export default async function PostPage({ params }: {params: Promise<{ slug: string }>}) {

    const { slug } = await params;
    
    redirect(`/posts/${slug}`);
}


