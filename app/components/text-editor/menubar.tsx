import { useEditorState, type Editor } from '@tiptap/react';
import { Button } from '@/app/components/ui/button';
import {
  BetweenHorizonalStartIcon,
  BoldIcon,
  BracesIcon,
  CodeIcon,
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
  Heading4Icon,
  ItalicIcon,
  ListIcon,
  ListOrderedIcon,
  PilcrowIcon,
  QuoteIcon,
  RedoIcon,
  SeparatorHorizontalIcon,
  StrikethroughIcon,
  UnderlineIcon,
  UndoIcon,
  XIcon,
} from 'lucide-react';
import { cn } from '@/app/lib/utils';

export default function Menubar({ editor }: { editor: Editor }) {
  const editorState = useEditorState({
    editor,
    selector: (ctx) => {
      return {
        isBold: ctx.editor.isActive('bold') ?? false,
        canBold: ctx.editor.can().chain().toggleBold().run() ?? false,
        isItalic: ctx.editor.isActive('italic') ?? false,
        canItalic: ctx.editor.can().chain().toggleItalic().run() ?? false,
        isStrike: ctx.editor.isActive('strike') ?? false,
        canStrike: ctx.editor.can().chain().toggleStrike().run() ?? false,
        isUnderline: ctx.editor.isActive('underline') ?? false,
        canUnderline: ctx.editor.can().chain().toggleUnderline().run() ?? false,
        isCode: ctx.editor.isActive('code') ?? false,
        canCode: ctx.editor.can().chain().toggleCode().run() ?? false,
        canClearMarks: ctx.editor.can().chain().unsetAllMarks().run() ?? false,
        isParagraph: ctx.editor.isActive('paragraph') ?? false,
        isHeading1: ctx.editor.isActive('heading', { level: 1 }) ?? false,
        isHeading2: ctx.editor.isActive('heading', { level: 2 }) ?? false,
        isHeading3: ctx.editor.isActive('heading', { level: 3 }) ?? false,
        isHeading4: ctx.editor.isActive('heading', { level: 4 }) ?? false,
        isBulletList: ctx.editor.isActive('bulletList') ?? false,
        isOrderedList: ctx.editor.isActive('orderedList') ?? false,
        isCodeBlock: ctx.editor.isActive('codeBlock') ?? false,
        isBlockquote: ctx.editor.isActive('blockquote') ?? false,
        canUndo: ctx.editor.can().chain().undo().run() ?? false,
        canRedo: ctx.editor.can().chain().redo().run() ?? false,
      };
    },
  });
  return (
    <div className="flex flex-wrap gap-4">
      <div className="flex flex-wrap gap-1">
        <Button
          type="button"
          variant="outline"
          size="icon"
          title="Bold"
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editorState.canBold}
          className={cn('size-8', editorState.isBold && 'border-primary dark:border-primary')}
        >
          <BoldIcon />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          title="Italic"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editorState.canItalic}
          className={cn('size-8', editorState.isItalic && 'border-primary dark:border-primary')}
        >
          <ItalicIcon />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          title="Strike"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editorState.canStrike}
          className={cn('size-8', editorState.isStrike && 'border-primary dark:border-primary')}
        >
          <StrikethroughIcon />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          title="Underline"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          disabled={!editorState.canUnderline}
          className={cn('size-8', editorState.isUnderline && 'border-primary dark:border-primary')}
        >
          <UnderlineIcon />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          title="Code"
          onClick={() => editor.chain().focus().toggleCode().run()}
          disabled={!editorState.canCode}
          className={cn('size-8', editorState.isCode && 'border-primary dark:border-primary')}
        >
          <CodeIcon />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          title="Clear marks"
          onClick={() => editor.chain().focus().unsetAllMarks().run()}
          disabled={!editorState.canClearMarks}
          className="size-8"
        >
          <XIcon className="text-destructive" />
        </Button>
      </div>
      <div className="flex flex-wrap gap-1">
        <Button
          type="button"
          variant="outline"
          size="icon"
          title="Paragraph"
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={cn('size-8', editorState.isParagraph && 'border-primary dark:border-primary')}
        >
          <PilcrowIcon />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          title="Heading 1"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={cn('size-8', editorState.isHeading1 && 'border-primary dark:border-primary')}
        >
          <Heading1Icon />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          title="Heading 2"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={cn('size-8', editorState.isHeading2 && 'border-primary dark:border-primary')}
        >
          <Heading2Icon />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          title="Heading 3"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={cn('size-8', editorState.isHeading3 && 'border-primary dark:border-primary')}
        >
          <Heading3Icon />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          title="Heading 4"
          onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
          className={cn('size-8', editorState.isHeading4 && 'border-primary dark:border-primary')}
        >
          <Heading4Icon />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          title="Bullet list"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={cn('size-8', editorState.isBulletList && 'border-primary dark:border-primary')}
        >
          <ListIcon />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          title="Ordered list"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={cn(
            'size-8',
            editorState.isOrderedList && 'border-primary dark:border-primary'
          )}
        >
          <ListOrderedIcon />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          title="Code block"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={cn('size-8', editorState.isCodeBlock && 'border-primary dark:border-primary')}
        >
          <BracesIcon />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          title="Blockquote"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={cn('size-8', editorState.isBlockquote && 'border-primary dark:border-primary')}
        >
          <QuoteIcon />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          title="Horizontal rule"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className="size-8"
        >
          <SeparatorHorizontalIcon />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          title="Hard break"
          onClick={() => editor.chain().focus().setHardBreak().run()}
          className="size-8"
        >
          <BetweenHorizonalStartIcon />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          title="Clear nodes"
          onClick={() => editor.chain().focus().clearNodes().run()}
          className="size-8"
        >
          <XIcon className="text-destructive" />
        </Button>
      </div>
      <div className="flex flex-wrap gap-1">
        <Button
          type="button"
          variant="outline"
          size="icon"
          title="Undo"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editorState.canUndo}
          className="size-8"
        >
          <UndoIcon />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          title="Redo"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editorState.canRedo}
          className="size-8"
        >
          <RedoIcon />
        </Button>
      </div>
    </div>
  );
}
