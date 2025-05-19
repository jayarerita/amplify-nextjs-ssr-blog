import ReactMarkdown from 'react-markdown';
import { getUrl } from '@aws-amplify/storage/server';
import { runWithAmplifyServerContext } from '@/lib/utils/amplify-utils';
import rehypeSanitize from 'rehype-sanitize';
import { CodeBlock } from '@/components/MarkdownCodeBlock';
import { Alert } from '@/components/ui/alert';

const getMarkdownUrl = async (markdownKey: string) => {
  try {
    const markdownUrl = await runWithAmplifyServerContext({
      nextServerContext: null,
      operation: (contextSpec) =>{
        //console.log("contextSpec:", contextSpec)
        //console.log("markdownKey:", markdownKey)
      const url = getUrl(contextSpec, {
        path: markdownKey
      })
      return url
    }
    });
    return markdownUrl.url.toString();
  } catch (error) {
    console.error(error);
    return null;
  }
};

export default async function RenderMarkdown({ markdownKey }: { markdownKey?: string | null }) {
  
  if (!markdownKey) {
    return <Alert variant="destructive">No markdown key provided</Alert>;
  }

  const markdownUrl = await getMarkdownUrl(markdownKey);
  if (!markdownUrl) {
    return <p>Something went wrong...</p>;
  }
  const markdown = await fetch(markdownUrl).then(res => res.text());

  return (
    <ReactMarkdown
      components={{
        code: CodeBlock
      }}
      rehypePlugins={[rehypeSanitize]}
    >
      {markdown}
    </ReactMarkdown>
  );
}


