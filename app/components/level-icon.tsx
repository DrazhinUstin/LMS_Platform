import { CourseLevel } from '@/generated/prisma';
import { Dice1Icon, Dice2Icon, Dice3Icon } from 'lucide-react';

const icons: Record<CourseLevel, React.ElementType> = {
  BEGINNER: Dice1Icon,
  INTERMEDIATE: Dice2Icon,
  ADVANCED: Dice3Icon,
};

export default function LevelIcon({
  level,
  className,
}: {
  level: CourseLevel;
  className?: string;
}) {
  const Icon = icons[level];

  return <Icon className={className} />;
}
