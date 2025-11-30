import type { Metadata } from 'next';
import './globals.css';
import { inter } from './lib/fonts';
import { Toaster } from '@/app/components/ui/sonner';
import { ThemeProvider } from './theme-provider';

export const metadata: Metadata = {
  title: {
    template: '%s | LMS Platform',
    default: 'LMS Platform',
  },
  description: 'Platform to learn something new',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        <Toaster expand />
      </body>
    </html>
  );
}
