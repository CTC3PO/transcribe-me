const STORAGE_KEY = 'flow_history';

export interface TranscriptionRecord {
    id: string;
    text: string;
    timestamp: number;
}

import { supabase } from './supabase';

export const storage = {
    getAll: (): TranscriptionRecord[] => {
        if (typeof window === 'undefined') return [];
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : [];
    },

    save: async (text: string): Promise<TranscriptionRecord[]> => {
        if (typeof window === 'undefined') return [];

        const newRecord: TranscriptionRecord = {
            id: Math.random().toString(36).substring(2, 9),
            text,
            timestamp: Date.now(),
        };

        // Local Storage
        const records = storage.getAll();
        const updated = [newRecord, ...records].slice(0, 20);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

        // Supabase Sync (if logged in)
        if (typeof window !== 'undefined') {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                await supabase.from('transcriptions').insert({
                    user_id: session.user.id,
                    text: text,
                    metadata: { source: 'web' }
                });
            }
        }

        return updated;
    },

    saveInstructions: (instructions: string) => {
        if (typeof window === 'undefined') return;
        localStorage.setItem('flow_instructions', instructions);
    },

    getInstructions: (): string => {
        if (typeof window === 'undefined') return '';
        return localStorage.getItem('flow_instructions') || '';
    },

    clear: () => {
        if (typeof window === 'undefined') return;
        localStorage.removeItem(STORAGE_KEY);
    },
};
