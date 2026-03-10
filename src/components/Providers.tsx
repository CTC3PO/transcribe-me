'use client';

import { ThemeProvider } from 'next-themes';
import { ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
    return (
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem themes={['light', 'dark', 'coffee-light', 'coffee-dark']}>
            {children}
        </ThemeProvider>
    );
}
