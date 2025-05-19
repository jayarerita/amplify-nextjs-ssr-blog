import { ResolvingMetadata } from "next";
import { Metadata } from "next";
import { cookiesClient } from "@/lib/utils/amplify-utils";
import { BlogCard } from "@/features/posts/components/PostCard";

type Props = {
  params: Promise<{ tag: string }>
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function Page({ params }: Props) {
  const { tag } = await params;
  
  // Get the tag object from the database
  const { data: tags, errors: tagErrors } = await cookiesClient.models.Tag.listTagByName({ name: tag });

  if (tagErrors || !tags) {
    return {
      title: 'Tag Not Found',
    }
  }

  // Throw an error if there are multiple tags with the same name or if the tag is not found
  if (tags.length > 1) {
    throw new Error('Multiple tags found with the same name');
  }

  if (tags.length === 0) {
    throw new Error('Tag not found');
  }

  const tagId = tags[0].id;

  const { data: postTags, errors: postTagErrors } = await cookiesClient.models.PostTag.listPostTagByTagId({ tagId: tagId });

  if (postTagErrors || !postTags) {
    return {
      title: 'Tag Not Found',
    }
  }

  const postIds = postTags.map((postTag) => postTag.postId);

  const posts = await Promise.all(
    postIds.map(postId =>
      cookiesClient.models.Post.get({ id: postId }).then(res => res.data)
    )
  );
  
  const validPosts = posts.filter(Boolean);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {validPosts.map(post => {
        if (post) {
          return <BlogCard key={post.id} post={post} />
        }
        return null;
      })}
    </div>
  )
}

