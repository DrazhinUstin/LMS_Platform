import {
  BrainIcon,
  BriefcaseBusinessIcon,
  CameraIcon,
  GridIcon,
  HeartPulseIcon,
  HouseIcon,
  LanguagesIcon,
  MonitorIcon,
  SchoolIcon,
} from 'lucide-react';

const icons: Record<string, React.ElementType> = {
  'IT & Software': MonitorIcon,
  'Art & Design': CameraIcon,
  'Health & Fitness': HeartPulseIcon,
  'Business & Marketing': BriefcaseBusinessIcon,
  'Personal Development': BrainIcon,
  Languages: LanguagesIcon,
  Academia: SchoolIcon,
  'Home & Lifestyle': HouseIcon,
};

export default function CategoryIcon({
  categoryName,
  className,
}: {
  categoryName: string;
  className?: string;
}) {
  const Icon = icons[categoryName] ?? GridIcon;

  return <Icon className={className} />;
}
