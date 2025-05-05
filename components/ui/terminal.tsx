import React from 'react';
import { cn } from '@/lib/utils';

interface TerminalProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  content?: string;
  showFileSystem?: boolean;
  className?: string;
  width?: string | number;
  height?: string | number;
}

export function Terminal({
  title = 'Terminal — bash',
  content = 'Welcome to my awesome blog!',
  showFileSystem = true,
  className,
  width = '100%',
  height = '100%',
  ...props
}: TerminalProps) {
  return (
    <div 
      className={cn("rounded-lg overflow-hidden shadow-2xl", className)} 
      style={{ width, height }}
      {...props}
    >
      {/* Terminal Header */}
      <div className="h-8 bg-gray-800 flex items-center px-4">
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <div className="text-white text-xs mx-auto font-mono">
          {title}
        </div>
      </div>
      
      {/* Terminal Body */}
      <div className="bg-black h-[calc(100%-32px)] p-6 font-mono text-white">
        <div className="flex flex-wrap">
          <span className="text-green-400">user@macbook</span>
          <span className="text-white">:</span>
          <span className="text-blue-400">~</span>
          <span className="text-white">$ </span>
          <span className="ml-2">echo "{content}"</span>
        </div>
        <div className="mt-2 text-xl font-bold">{content}</div>
        
        {showFileSystem && (
          <>
            <div className="flex flex-wrap mt-6">
              <span className="text-green-400">user@macbook</span>
              <span className="text-white">:</span>
              <span className="text-blue-400">~</span>
              <span className="text-white">$ </span>
              <span className="ml-2">ls -la</span>
            </div>
            <div className="mt-2 grid grid-cols-5 gap-1">
              <div>drwxr-xr-x</div>
              <div>user</div>
              <div>staff</div>
              <div>May 23 12:34</div>
              <div className="text-blue-400">Blog Posts</div>
              
              <div>drwxr-xr-x</div>
              <div>user</div>
              <div>staff</div>
              <div>May 20 09:15</div>
              <div className="text-blue-400">Projects</div>
              
              <div>-rw-r--r--</div>
              <div>user</div>
              <div>staff</div>
              <div>May 18 15:42</div>
              <div className="text-yellow-400">resume.pdf</div>
            </div>
          </>
        )}
        
        <div className="flex flex-wrap mt-6">
          <span className="text-green-400">user@macbook</span>
          <span className="text-white">:</span>
          <span className="text-blue-400">~</span>
          <span className="text-white">$ </span>
          <span className="ml-2 animate-pulse">_</span>
        </div>
      </div>
    </div>
  );
} 