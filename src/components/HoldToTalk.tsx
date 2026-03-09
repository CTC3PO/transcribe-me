'use client';

import { useState, useEffect } from 'react';
import { useRecorder } from '@/hooks/useRecorder';
import { storage, TranscriptionRecord } from '@/lib/storage';
import Visualizer from './Visualizer';
import HistoryList from './HistoryList';

export default function HoldToTalk() {
    const [transcription, setTranscription] = useState<string>('');
    const [history, setHistory] = useState<TranscriptionRecord[]>([]);
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [selectedStyle, setSelectedStyle] = useState('raw');
    const [isRefining, setIsRefining] = useState(false);

    useEffect(() => {
        setHistory(storage.getAll());
    }, []);

    const {
        isRecording,
        isProcessing,
        error,
        startRecording,
        stopRecording,
        stream
    } = useRecorder(async (rawText) => {
        setTranscription(rawText);

        let finalText = rawText;

        if (selectedStyle !== 'raw') {
            setIsRefining(true);
            try {
                const response = await fetch('/api/refine', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ text: rawText, style: selectedStyle }),
                });
                const data = await response.json();
                if (data.text) {
                    finalText = data.text;
                    setTranscription(finalText);
                }
            } catch (err) {
                console.error('Refinement failed:', err);
            } finally {
                setIsRefining(false);
            }
        }

        const updated = storage.save(finalText);
        setHistory(updated);
    });

    const handleCopy = (text: string, id: string = 'current') => {
        if (text) {
            navigator.clipboard.writeText(text);
            setCopiedId(id);
            setTimeout(() => setCopiedId(null), 2000);
        }
    };

    const styles = [
        { id: 'raw', name: 'Raw', icon: '🎤' },
        { id: 'professional', name: 'Professional', icon: '💼' },
        { id: 'casual', name: 'Casual', icon: '☕' },
        { id: 'bullets', name: 'Bullets', icon: '📝' },
        { id: 'critique', name: 'Critique', icon: '🎓' },
    ];

    return (
        <div className="flex flex-col items-center w-full max-w-md mx-auto p-8">
            {/* Style Selector */}
            <div className="flex gap-2 mb-8 bg-zinc-50 p-1 rounded-full border border-zinc-100">
                {styles.map((style) => (
                    <button
                        key={style.id}
                        onClick={() => setSelectedStyle(style.id)}
                        className={`
              px-4 py-1.5 rounded-full text-xs font-medium transition-all
              ${selectedStyle === style.id
                                ? 'bg-white shadow-sm text-zinc-900 border border-zinc-200'
                                : 'text-zinc-400 hover:text-zinc-600'}
            `}
                    >
                        <span className="mr-1">{style.icon}</span> {style.name}
                    </button>
                ))}
            </div>

            <Visualizer stream={stream} isRecording={isRecording} />

            <button
                onMouseDown={startRecording}
                onMouseUp={stopRecording}
                onMouseLeave={stopRecording}
                onTouchStart={startRecording}
                onTouchEnd={stopRecording}
                disabled={isProcessing || isRefining}
                className={`
          relative w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300
          ${isRecording
                        ? 'bg-red-600 scale-95 shadow-inner'
                        : 'bg-zinc-900 scale-100 shadow-xl hover:bg-zinc-800'}
          ${(isProcessing || isRefining) ? 'animate-pulse cursor-not-allowed opacity-50' : 'cursor-pointer'}
        `}
            >
                <div className={`
          absolute inset-0 rounded-full border-4 border-red-500/20
          ${isRecording ? 'animate-ping scale-110 opacity-75' : 'hidden'}
        `} />

                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-12 h-12"
                >
                    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                    <line x1="12" x2="12" y1="19" y2="22" />
                </svg>
            </button>

            <p className="mt-6 text-zinc-500 font-mono text-xs tracking-tighter uppercase">
                {isRefining ? 'Polishing...' : isProcessing ? 'Transcribing...' : isRecording ? 'Listening...' : 'Hold to Talk'}
            </p>

            {error && (
                <p className="mt-4 text-red-500 text-sm font-medium">{error}</p>
            )}

            {transcription && (
                <div className="mt-12 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-6 relative group">
                        <p className="text-zinc-800 text-lg leading-relaxed whitespace-pre-wrap">{transcription}</p>
                        <button
                            onClick={() => handleCopy(transcription, 'current')}
                            className={`
                absolute top-4 right-4 transition-all p-2 rounded-lg border
                ${copiedId === 'current'
                                    ? 'bg-green-500 border-green-600 text-white'
                                    : 'bg-white opacity-0 group-hover:opacity-100 border-zinc-100 text-zinc-400 shadow-sm'}
              `}
                        >
                            {copiedId === 'current' ? (
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" /></svg>
                            )}
                        </button>
                    </div>
                </div>
            )}

            <HistoryList records={history} onCopy={(text) => handleCopy(text, 'history')} />
        </div>
    );
}
