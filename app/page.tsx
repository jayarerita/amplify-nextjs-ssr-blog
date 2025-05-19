import { AuroraText } from '@/components/magicui/aurora-text';
import { SearchBlogPostsPaginated } from '@/features/posts/components/SearchBlogPostsPaginated';
import { ParticlesBackground } from '@/ParticlesBackground';

export default async function Home() {

  return (
    <main className="min-h-screen">
      <div className="max-w-7xl mx-auto py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Ship Blogs <AuroraText>Fast</AuroraText>
          </h1>
          <h2 className="mt-4 text-xl text-muted-foreground max-w-3xl mx-auto">
            Own your content, and your CMS pipeline.
          </h2>
        </div>
        <ParticlesBackground />
        <SearchBlogPostsPaginated />
      </div>
    </main>
  );
}
