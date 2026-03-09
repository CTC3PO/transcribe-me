'use client';

import { TranscriptionRecord } from '@/lib/storage';

interface HistoryListProps {
    records: TranscriptionRecord[];
    onCopy: (text: string) => void;
}

export default function HistoryList({ records, onCopy }: HistoryListProps) {
    if (records.length === 0) return null;

    return (
        <div className="w-full mt-16 animate-in fade-in duration-700">
            <div className="flex items-center justify-between mb-6 px-2">
                <h2 className="text-xs font-mono uppercase tracking-widest text-zinc-400">Recent Flow</h2>
                <span className="h-px flex-1 bg-zinc-100 mx-4" />
            </div>

            <div className="space-y-3">
                {records.map((record) => (
                    <div
                        key={record.id}
                        className="group bg-white hover:bg-zinc-50 border border-zinc-100 p-4 rounded-xl transition-all cursor-pointer relative"
                        onClick={() => onCopy(record.text)}
                    >
                        <p className="text-zinc-600 text-sm line-clamp-2 pr-8">{record.text}</p>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-400"><rect width="14" height="14" x="8" y="8" rx="2" ry="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" /></svg>
                        </div>
                        <span className="text-[10px] text-zinc-300 font-mono mt-2 block">
                            {new Date(record.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
