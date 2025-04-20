'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';

const MDEditor = dynamic(
  () => import('@uiw/react-md-editor'),
  { ssr: false }
);

interface MarkdownEditorProps {
  value: string;
  onChange: (value?: string) => void;
}

export function MarkdownEditor({ value, onChange }: MarkdownEditorProps) {
  return (
    <div className="container mx-auto" data-color-mode="light">
      <MDEditor
        value={value}
        onChange={onChange}
        height={500}
        preview="live"
        enableScroll={true}
        className="rounded-lg shadow-sm border border-gray-200"
      />
    </div>
  );
} 