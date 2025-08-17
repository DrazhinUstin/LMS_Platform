import { useEditorState, type Editor } from '@tiptap/react';

export default function CharactersCount({
  editor,
  charactersLimit,
}: {
  editor: Editor;
  charactersLimit: number;
}) {
  const { charactersCount } = useEditorState({
    editor,
    selector: (context) => ({
      charactersCount: context.editor.storage.characterCount.characters(),
    }),
  });

  const isLimitExceeded = charactersCount >= charactersLimit;

  return (
    <p className="text-muted-foreground text-sm">
      <span className={isLimitExceeded ? 'text-destructive' : ''}>{charactersCount}</span>/
      {charactersLimit}
    </p>
  );
}
