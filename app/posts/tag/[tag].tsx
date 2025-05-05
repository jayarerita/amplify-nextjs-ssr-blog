import { ResolvingMetadata } from "next";
import { Metadata } from "next";
import { cookiesClient } from "@/lib/amplify/cookies";

type Props = {
  params: Promise<{ slug: string }>
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;
  
  const { data: post, errors } = await cookiesClient.models.BlogPost.get(
    { slug: slug },
    { authMode: 'identityPool' }
  );

  if (errors || !post) {
    return {
      title: 'Post Not Found',
    }
  }