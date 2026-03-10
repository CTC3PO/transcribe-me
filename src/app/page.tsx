'use client';

import { useState } from 'react';
import HoldToTalk from "@/components/HoldToTalk";
import { Auth } from "@/components/Auth";
import { JournalTab } from "@/components/JournalTab";
import { Sparkles, BookText, Moon, Sun, Coffee } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect } from 'react';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'transcribe' | 'journal'>('transcribe');
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const allThemes = ['light', 'dark', 'coffee-light', 'coffee-dark'];
    const currentIndex = allThemes.indexOf(theme || 'light');
    const nextIndex = (currentIndex + 1) % allThemes.length;
    setTheme(allThemes[nextIndex]);
    console.log("Switched to theme:", allThemes[nextIndex]);
  };

  return (
    <main className={`min-h-screen transition-colors duration-500 selection:bg-indigo-100`}>
      <div className="max-w-4xl mx-auto px-6 py-12 flex flex-col relative z-10 w-full">
        <header className="flex justify-between items-center mb-20">
          <h1 className="text-xl font-bold tracking-tighter flex items-center gap-1 opacity-50">
            Flow<span className="text-indigo-600">.</span>
          </h1>

          <div className="flex items-center gap-2 bg-white/80 dark:bg-zinc-900/80 coffee-light:bg-white/60 coffee-dark:bg-black/40 backdrop-blur-md p-1.5 rounded-2xl border border-zinc-200 dark:border-white/10 coffee-light:border-[#452B1F]/10 coffee-dark:border-white/10 shadow-sm">
            <button
              onClick={() => setActiveTab('transcribe')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeTab === 'transcribe'
                ? 'bg-zinc-900 text-white dark:bg-white dark:text-black coffee-light:bg-[#452B1F] coffee-light:text-white coffee-dark:bg-[#f4ece1] coffee-dark:text-[#452B1F] shadow-md'
                : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 coffee-light:hover:text-[#452B1F] coffee-dark:hover:text-[#f4ece1]'
                }`}
            >
              <Sparkles className="w-4 h-4" /> Transcribe
            </button>
            <button
              onClick={() => setActiveTab('journal')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeTab === 'journal'
                ? 'bg-zinc-900 text-white dark:bg-white dark:text-black coffee-light:bg-[#452B1F] coffee-light:text-white coffee-dark:bg-[#f4ece1] coffee-dark:text-[#452B1F] shadow-md'
                : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 coffee-light:hover:text-[#452B1F] coffee-dark:hover:text-[#f4ece1]'
                }`}
            >
              <BookText className="w-4 h-4" /> Journal
            </button>
            <div className="w-px h-6 bg-zinc-200 dark:bg-white/10 coffee-light:bg-[#452B1F]/10 coffee-dark:bg-white/10 mx-1" />
            <button
              onClick={toggleTheme}
              className="p-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 coffee-light:hover:text-[#452B1F] coffee-dark:hover:text-[#f4ece1] transition-colors"
            >
              {!mounted ? (
                <div className="w-4 h-4" /> // Placeholder during hydration
              ) : theme === 'dark' ? (
                <Moon className="w-4 h-4" />
              ) : theme?.startsWith('coffee') ? (
                <Coffee className="w-4 h-4" />
              ) : (
                <Sun className="w-4 h-4" />
              )}
            </button>
          </div>
        </header>

        <section className="space-y-12">
          {activeTab === 'transcribe' ? (
            <div className="space-y-12 animate-in fade-in duration-700">
              {/* Large Logo Version */}
              <div className="flex flex-col items-center justify-center py-12 text-center pointer-events-none select-none">
                <h2 className="text-8xl font-black tracking-tighter mb-4 flex items-center gap-1">
                  Flow<span className="text-indigo-600">.</span>
                </h2>
                <p className="text-zinc-400 dark:text-zinc-500 coffee-light:text-[#452B1F]/40 coffee-dark:text-[#f4ece1]/40 text-lg font-medium">
                  Ready to speak? I'm ready to listen.
                </p>
              </div>
              <HoldToTalk />
            </div>
          ) : (
            <JournalTab />
          )}

          <div className="pt-8">
            <Auth />
          </div>
        </section>

        <footer className="mt-20 pt-8 border-t border-zinc-200 dark:border-white/5 coffee-light:border-[#452B1F]/10 coffee-dark:border-white/10 w-full flex justify-between items-center text-zinc-300 dark:text-zinc-600 coffee-light:text-[#452B1F]/40 coffee-dark:text-[#f4ece1]/40 text-[10px] font-mono uppercase tracking-[0.2em]">
          <div>Groq Whisper Large V3</div>
          <div className="flex gap-4">
            <span>Sync Ready</span>
            <span>Journal v1</span>
          </div>
        </footer>
      </div>
    </main>
  );
}
