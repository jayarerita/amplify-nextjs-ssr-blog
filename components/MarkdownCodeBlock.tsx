'use client';

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export const CodeBlock = ({ node, inline, className, children, ...props }: any) => {
  const match = /language-(\w+)/.exec(className || '');
  const code = String(children).replace(/\n$/, '');

  if (!inline && match) {
    return (
      <div className="relative group">
        <button
          onClick={() => {
            navigator.clipboard.writeText(code);
            toast.success('Code copied to clipboard');
          }}
          className="absolute right-2 top-2 p-1.5 rounded-md bg-muted/50 hover:bg-muted transition-colors opacity-0 group-hover:opacity-100"
        >
          <Copy className="h-4 w-4" />
        </button>
        <SyntaxHighlighter
          {...props}
          style={vscDarkPlus}
          language={match[1]}
          PreTag="div"
          className={cn("rounded-lg", className)}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    );
  }

  return (
    <code {...props} className={className}>
      {children}
    </code>
  );
};