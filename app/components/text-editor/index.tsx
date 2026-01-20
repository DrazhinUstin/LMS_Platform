'use client';

import { useEditor, EditorContent, type Content } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Placeholder, CharacterCount } from '@tiptap/extensions';
import Youtube from '@tiptap/extension-youtube';
import Menubar from './menubar';
import CharactersCount from './characters-count';

export default function TextEditor({
  content,
  onContentUpdate,
  placeholder,
  charactersLimit,
}: {
  content?: Content;
  onContentUpdate: (newContent: Content) => void;
  placeholder?: string;
  charactersLimit?: number;
}) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3, 4] } }),
      Placeholder.configure({
        placeholder,
      }),
      CharacterCount.configure({
        limit: charactersLimit,
      }),
      Youtube.configure({
        nocookie: true,
      }),
    ],
    editorProps: {
      attributes: {
        class:
          'prose prose-neutral prose-sm sm:prose-base dark:prose-invert h-60 max-w-none overflow-y-auto rounded-lg border p-2 focus:outline-none',
      },
    },
    content,
    onUpdate: ({ editor }) => {
      onContentUpdate(editor.isEmpty ? '' : editor.getHTML());
    },
    immediatelyRender: false,
  });

  return (
    <div className="space-y-4">
      {editor && <Menubar editor={editor} />}
      <EditorContent editor={editor} />
      {editor && charactersLimit && (
        <CharactersCount editor={editor} charactersLimit={charactersLimit} />
      )}
    </div>
  );
}
