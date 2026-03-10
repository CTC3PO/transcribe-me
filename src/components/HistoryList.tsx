import { TranscriptionRecord } from '@/lib/storage';
import { BookPlus, Check, Copy } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useState } from 'react';

interface HistoryListProps {
    records: TranscriptionRecord[];
    onCopy: (text: string) => void;
}

export default function HistoryList({ records, onCopy }: HistoryListProps) {
    const [savingId, setSavingId] = useState<string | null>(null);
    const [savedId, setSavedId] = useState<string | null>(null);

    const saveToJournal = async (text: string, id: string) => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) {
            alert('Please login to save to journal');
            return;
        }

        setSavingId(id);
        const { error } = await supabase.from('journal_entries').insert({
            user_id: session.user.id,
            content: text,
        });

        if (!error) {
            setSavedId(id);
            setTimeout(() => setSavedId(null), 2000);
        }
        setSavingId(null);
    };

    if (records.length === 0) return null;

    return (
        <div className="w-full mt-16 animate-in fade-in duration-700">
            <div className="flex items-center justify-between mb-6 px-2">
                <h2 className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-400 coffee-light:text-[#452B1F]/60 coffee-dark:text-[#f4ece1]/60">Recent Flow</h2>
                <span className="h-px flex-1 bg-zinc-100 dark:bg-white/5 mx-4" />
            </div>

            <div className="space-y-3">
                {records.map((record) => (
                    <div
                        key={record.id}
                        className="group bg-white/40 dark:bg-zinc-900/40 coffee-light:bg-white/60 coffee-dark:bg-black/40 backdrop-blur-md hover:bg-white/60 dark:hover:bg-zinc-900/60 coffee-light:hover:bg-white coffee-dark:hover:bg-black/60 border border-zinc-100/50 dark:border-white/5 coffee-light:border-[#452B1F]/10 coffee-dark:border-white/10 p-5 rounded-3xl transition-all relative"
                    >
                        <div className="flex justify-between items-start gap-4">
                            <p className="text-zinc-600 dark:text-zinc-300 text-sm line-clamp-2 transition-colors group-hover:text-zinc-900 dark:group-hover:text-zinc-100" onClick={() => onCopy(record.text)}>
                                {record.text}
                            </p>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => onCopy(record.text)}
                                    className="p-2 text-zinc-400 hover:text-indigo-500 rounded-lg hover:bg-white dark:hover:bg-zinc-800 transition-all shadow-sm border border-zinc-100 dark:border-white/5"
                                    title="Copy"
                                >
                                    <Copy className="w-3.5 h-3.5" />
                                </button>
                                <button
                                    onClick={() => saveToJournal(record.text, record.id)}
                                    disabled={savingId === record.id}
                                    className={`p-2 rounded-lg transition-all shadow-sm border ${savedId === record.id
                                        ? 'bg-green-500 border-green-600 text-white opacity-100'
                                        : 'text-zinc-400 hover:text-indigo-500 bg-white dark:bg-zinc-900 coffee-light:bg-white coffee-dark:bg-black/40 border-zinc-100 dark:border-white/5 coffee-light:border-[#452B1F]/10 coffee-dark:border-white/10'
                                        }`}
                                    title="Save to Journal"
                                >
                                    {savedId === record.id ? <Check className="w-3.5 h-3.5" /> : <BookPlus className={`w-3.5 h-3.5 ${savingId === record.id ? 'animate-pulse' : ''}`} />}
                                </button>
                            </div>
                        </div>
                        <span className="text-[10px] text-zinc-300 dark:text-zinc-500 font-mono mt-2 block">
                            {new Date(record.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
