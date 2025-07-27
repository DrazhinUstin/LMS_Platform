'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';
import { Button } from '@/app/components/ui/button';
import { useTheme } from 'next-themes';
import { CheckIcon, MonitorIcon, MoonIcon, SunIcon, SunMoonIcon } from 'lucide-react';

export default function ThemeSwitch() {
  const { theme: currentTheme, themes, setTheme } = useTheme();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <SunMoonIcon className="size-6" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {themes.map((theme) => (
          <DropdownMenuItem key={theme} onClick={() => setTheme(theme)}>
            {theme === 'light' && <SunIcon />}
            {theme === 'dark' && <MoonIcon />}
            {theme === 'system' && <MonitorIcon />}
            {theme}
            {theme === currentTheme && <CheckIcon />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
