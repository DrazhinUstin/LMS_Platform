'use client';

import { Prisma } from '@/generated/prisma';
import { useState } from 'react';
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  rectIntersection,
} from '@dnd-kit/core';
import type { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';
import {
  useSortable,
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@/app/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/app/components/ui/collapsible';
import { ChevronDownIcon, GripVerticalIcon } from 'lucide-react';

interface Props {
  data: Prisma.ChapterGetPayload<{ include: { lessons: true } }>[];
}

type ChapterType = Props['data'][0] & { isOpen: boolean };

export default function EditCourseStructure({ data }: Props) {
  const [chapters, setChapters] = useState<ChapterType[]>(
    data.map((item) => ({ ...item, isOpen: true }))
  );

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const activeData = active.data.current as SortableItemProps['data'] | undefined;
    const overData = over.data.current as SortableItemProps['data'] | undefined;

    if (!activeData || !overData) return;

    if (activeData.type === 'chapter') {
      const oldIndex = chapters.findIndex((chapter) => chapter.id === active.id);
      const newIndex = chapters.findIndex(
        (chapter) => chapter.id === (overData.type === 'chapter' ? over.id : overData.chapterId)
      );

      if (oldIndex === -1 || newIndex === -1) return;

      const reorderedChapters = arrayMove(chapters, oldIndex, newIndex).map((chapter, i) => ({
        ...chapter,
        position: i + 1,
      }));

      setChapters(reorderedChapters);
    }

    if (
      activeData.type === 'lesson' &&
      overData.type === 'lesson' &&
      activeData.chapterId === overData.chapterId
    ) {
      const parentChapter = chapters.find((chapter) => chapter.id === activeData.chapterId);

      if (!parentChapter) return;

      const oldIndex = parentChapter.lessons.findIndex((lesson) => lesson.id === active.id);
      const newIndex = parentChapter.lessons.findIndex((lesson) => lesson.id === over.id);

      if (oldIndex === -1 || newIndex === -1) return;

      const reorderedLessons = arrayMove(parentChapter.lessons, oldIndex, newIndex).map(
        (lesson, i) => ({ ...lesson, position: i + 1 })
      );

      const newChapters = chapters.map((chapter) =>
        chapter.id === parentChapter.id ? { ...chapter, lessons: reorderedLessons } : chapter
      );

      setChapters(newChapters);
    }
  }

  return (
    <DndContext sensors={sensors} collisionDetection={rectIntersection} onDragEnd={handleDragEnd}>
      <SortableContext items={chapters} strategy={verticalListSortingStrategy}>
        {chapters.map((chapter) => (
          <SortableItem key={chapter.id} id={chapter.id} data={{ type: 'chapter' }}>
            {(chapterListeners) => (
              <Collapsible
                open={chapter.isOpen}
                onOpenChange={() =>
                  setChapters((prev) =>
                    prev.map((item) =>
                      item.id === chapter.id ? { ...item, isOpen: !item.isOpen } : item
                    )
                  )
                }
                className="rounded-lg border shadow-sm"
              >
                <div className="flex items-center gap-x-2 p-2">
                  <Button variant="ghost" size="icon" {...chapterListeners}>
                    <GripVerticalIcon />
                  </Button>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <ChevronDownIcon />
                    </Button>
                  </CollapsibleTrigger>
                  <h4>{chapter.title}</h4>
                </div>
                <CollapsibleContent className="border-t p-2">
                  <SortableContext items={chapter.lessons} strategy={verticalListSortingStrategy}>
                    {chapter.lessons.map((lesson) => (
                      <SortableItem
                        key={lesson.id}
                        id={lesson.id}
                        data={{ type: 'lesson', chapterId: lesson.chapterId }}
                      >
                        {(lessonListeners) => (
                          <article className="flex items-center gap-x-2">
                            <Button variant="ghost" size="icon" {...lessonListeners}>
                              <GripVerticalIcon />
                            </Button>
                            <h4>{lesson.title}</h4>
                          </article>
                        )}
                      </SortableItem>
                    ))}
                  </SortableContext>
                </CollapsibleContent>
              </Collapsible>
            )}
          </SortableItem>
        ))}
      </SortableContext>
    </DndContext>
  );
}

interface SortableItemProps {
  id: string;
  data: {
    type: 'chapter' | 'lesson';
    chapterId?: string;
  };
  children: (listeners?: SyntheticListenerMap) => React.ReactNode;
}

function SortableItem({ id, data, children }: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id,
    data,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} className="mx-auto max-w-[800px]">
      {children(listeners)}
    </div>
  );
}
