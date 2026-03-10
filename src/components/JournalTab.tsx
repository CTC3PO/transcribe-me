import { useState, useEffect } from 'react';
import { supabase, JournalEntry } from '@/lib/supabase';
import { Book, Mic, Plus, Trash2, Loader2 } from 'lucide-react';
import { useRecorder } from '@/hooks/useRecorder';
import { User } from '@supabase/supabase-js';

export function JournalTab() {
    const [entries, setEntries] = useState<JournalEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);

    const {
        isRecording,
        isProcessing,
        startRecording,
        stopRecording,
    } = useRecorder(async (text) => {
        if (user) {
            const { data, error } = await supabase
                .from('journal_entries')
                .insert({
                    user_id: user.id,
                    content: text,
                })
                .select()
                .single();

            if (!error && data) {
                setEntries([data, ...entries]);
            }
        }
    });

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.code === 'Space') {
                if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;
                e.preventDefault();
                if (!isRecording && !isProcessing) {
                    startRecording();
                }
            }
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            if (e.code === 'Space') {
                e.preventDefault();
                if (isRecording) {
                    stopRecording();
                }
            }
        };

        const handleBlur = () => {
            if (isRecording) stopRecording();
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        window.addEventListener('blur', handleBlur);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
            window.removeEventListener('blur', handleBlur);
        };
    }, [isRecording, isProcessing, startRecording, stopRecording]);

    useEffect(() => {
        const fetchUserAndEntries = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user ?? null);

            if (session?.user) {
                const { data, error } = await supabase
                    .from('journal_entries')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (!error) setEntries(data || []);
            }
            setLoading(false);
        };

        fetchUserAndEntries();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    const deleteEntry = async (id: string) => {
        const { error } = await supabase.from('journal_entries').delete().match({ id });
        if (!error) {
            setEntries(entries.filter(e => e.id !== id));
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-20 text-zinc-400">
                <Loader2 className="w-8 h-8 animate-spin mb-4" />
                <p>Fetching your memories...</p>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="text-center py-20 px-6">
                <Book className="w-16 h-16 text-zinc-200 mx-auto mb-6 opacity-20" />
                <h3 className="text-xl font-semibold text-zinc-800 dark:text-zinc-200 mb-2">Secure Journal</h3>
                <p className="text-zinc-500 max-w-xs mx-auto">Please login to start your private voice-to-journal journey.</p>
            </div>
        );
    }

    return (
        <div className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center bg-white/80 dark:bg-zinc-900/80 coffee-light:bg-white/60 coffee-dark:bg-black/40 backdrop-blur-md p-6 rounded-3xl border border-zinc-100 dark:border-white/10 coffee-light:border-[#452B1F]/10 coffee-dark:border-white/10 shadow-sm relative overflow-hidden">
                {isRecording && (
                    <div className="absolute inset-0 bg-red-500/5 animate-pulse pointer-events-none" />
                )}
                <div className="relative z-10">
                    <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 coffee-light:text-[#452B1F] coffee-dark:text-[#f4ece1]">Journal</h2>
                    <p className="text-sm text-zinc-500 coffee-light:text-[#452B1F]/60 coffee-dark:text-[#f4ece1]/60">
                        {isProcessing ? 'Transcribing...' : isRecording ? 'Listening...' : `${entries.length} reflections saved`}
                    </p>
                </div>
                <button
                    onMouseDown={startRecording}
                    onMouseUp={stopRecording}
                    onTouchStart={startRecording}
                    onTouchEnd={stopRecording}
                    disabled={isProcessing}
                    className={`relative z-10 p-4 rounded-2xl transition-all shadow-lg active:scale-95 ${isRecording
                        ? 'bg-red-600 shadow-red-500/20'
                        : 'bg-indigo-600 dark:bg-indigo-500 coffee-light:bg-[#452B1F] coffee-dark:bg-[#f4ece1] shadow-indigo-500/20'
                        } ${isProcessing ? 'opacity-50 cursor-not-allowed animate-pulse' : ''}`}
                >
                    <Mic className={`w-6 h-6 text-white coffee-light:text-white coffee-dark:text-[#452B1F] ${isRecording ? 'animate-bounce' : ''}`} />
                </button>
            </div>

            <div className="grid gap-4">
                {entries.length === 0 ? (
                    <div className="text-center py-12 bg-zinc-50 dark:bg-zinc-900/30 rounded-3xl border-2 border-dashed border-zinc-200 dark:border-white/5 mx-6">
                        <Plus className="w-10 h-10 text-zinc-300 mx-auto mb-3" />
                        <p className="text-zinc-400 text-sm italic">Speak your first entry...</p>
                    </div>
                ) : (
                    entries.map((entry) => (
                        <div key={entry.id} className="group bg-white/50 dark:bg-zinc-900/40 coffee-light:bg-white/60 coffee-dark:bg-black/40 backdrop-blur-sm p-6 rounded-3xl border border-zinc-100 dark:border-white/10 coffee-light:border-[#452B1F]/10 coffee-dark:border-white/10 hover:shadow-xl hover:shadow-indigo-500/5 transition-all">
                            <div className="flex justify-between items-start mb-4">
                                <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
                                    {new Date(entry.created_at).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                </span>
                                <button
                                    onClick={() => deleteEntry(entry.id)}
                                    className="opacity-0 group-hover:opacity-100 p-2 text-zinc-300 hover:text-red-500 transition-all"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                            <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed mb-4">
                                {entry.content}
                            </p>
                            {entry.photo_urls && entry.photo_urls.length > 0 && (
                                <div className="flex gap-2 overflow-x-auto pb-2">
                                    {entry.photo_urls.map((url, i) => (
                                        <div key={i} className="relative w-24 h-24 rounded-xl overflow-hidden bg-zinc-100 shrink-0">
                                            <img src={url} alt="Journal attachment" className="w-full h-full object-cover" />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
