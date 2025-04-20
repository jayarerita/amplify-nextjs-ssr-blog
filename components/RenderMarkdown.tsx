import ReactMarkdown from 'react-markdown';
import { getUrl } from '@aws-amplify/storage/server';
import { runWithAmplifyServerContext } from '@/lib/utils/amplify-utils';


const getMarkdownUrl = async (markdownKey: string) => {
  try {
    const markdownUrl = await runWithAmplifyServerContext({
      nextServerContext: null,
      operation: (contextSpec) =>
      getUrl(contextSpec, {
        path: markdownKey
      })
    });
    return markdownUrl.url.toString();
  } catch (error) {
    console.error(error);
    return null;
  }
};

export default async function RenderMarkdown({ markdownKey }: { markdownKey: string }) {
  const markdownUrl = await getMarkdownUrl(markdownKey);
  if (!markdownUrl) {
    return <p>Something went wrong...</p>;
  }
  const markdown = await fetch(markdownUrl).then(res => res.text());

  return <ReactMarkdown>{markdown}</ReactMarkdown>;
}


