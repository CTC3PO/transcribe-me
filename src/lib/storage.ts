'use client';

export interface TranscriptionRecord {
    id: string;
    text: string;
    timestamp: number;
}

const STORAGE_KEY = 'flow_transcriptions_v1';
const MAX_HISTORY = 20;

export const storage = {
    save(text: string): TranscriptionRecord[] {
        if (typeof window === 'undefined') return [];

        const records = this.getAll();
        const newRecord: TranscriptionRecord = {
            id: Math.random().toString(36).substring(2, 9),
            text,
            timestamp: Date.now(),
        };

        const updated = [newRecord, ...records].slice(0, MAX_HISTORY);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return updated;
    },

    getAll(): TranscriptionRecord[] {
        if (typeof window === 'undefined') return [];

        const data = localStorage.getItem(STORAGE_KEY);
        if (!data) return [];

        try {
            return JSON.parse(data);
        } catch (e) {
            console.error('Failed to parse history', e);
            return [];
        }
    },

    clear() {
        if (typeof window === 'undefined') return;
        localStorage.removeItem(STORAGE_KEY);
    }
};
