'use client';

import { useState, useEffect } from 'react';
import { useRecorder } from '@/hooks/useRecorder';
import { storage, TranscriptionRecord } from '@/lib/storage';
import Visualizer from './Visualizer';
import HistoryList from './HistoryList';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface HoldToTalkProps {
    setIsRecording?: (val: boolean) => void;
    setIsProcessing?: (val: boolean) => void;
    setIsRefining?: (val: boolean) => void;
}

export default function HoldToTalk({
    setIsRecording: setParentRecording,
    setIsProcessing: setParentProcessing,
    setIsRefining: setParentRefining
}: HoldToTalkProps) {
    const [transcription, setTranscription] = useState<string>('');
    const [history, setHistory] = useState<TranscriptionRecord[]>([]);
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [selectedStyle, setSelectedStyle] = useState('raw');
    const [isRefining, setIsRefining] = useState(false);
    const [instructions, setInstructions] = useState('');
    const [showInstructions, setShowInstructions] = useState(false);

    useEffect(() => {
        setHistory(storage.getAll());
        setInstructions(storage.getInstructions());
    }, []);

    const handleInstructionsChange = (val: string) => {
        setInstructions(val);
        storage.saveInstructions(val);
    };

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

        // Always refine if instructions exist, even if style is 'raw'
        if (selectedStyle !== 'raw' || instructions.trim()) {
            setIsRefining(true);
            try {
                const response = await fetch('/api/refine', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        text: rawText,
                        style: selectedStyle,
                        instructions: instructions.trim()
                    }),
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

        const updated = await storage.save(finalText);
        setHistory(updated);
    });

    useEffect(() => {
        setParentRecording?.(isRecording);
    }, [isRecording, setParentRecording]);

    useEffect(() => {
        setParentProcessing?.(isProcessing);
    }, [isProcessing, setParentProcessing]);

    useEffect(() => {
        setParentRefining?.(isRefining);
    }, [isRefining, setParentRefining]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.code === 'Space') {
                if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;
                e.preventDefault(); // Always prevent scrolling

                if (!isRecording && !isProcessing && !isRefining) {
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
    }, [isRecording, isProcessing, isRefining, startRecording, stopRecording]);

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
        { id: 'bullets', name: 'List', icon: '📝' },
        { id: 'intelligence', name: 'Intelligence', icon: '🧠' },
    ];

    return (
        <div className="flex flex-col items-center w-full mx-auto p-4 sm:p-8">
            {/* Style Selector */}
            <div className="flex gap-2 mb-4 bg-zinc-50 dark:bg-zinc-900/50 p-1 rounded-full border border-zinc-100 dark:border-white/10">
                {styles.map((style) => (
                    <button
                        key={style.id}
                        onClick={() => setSelectedStyle(style.id)}
                        className={`
              px-4 py-1.5 rounded-full text-xs font-medium transition-all
              ${selectedStyle === style.id
                                ? 'bg-white dark:bg-zinc-800 shadow-sm text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-white/10'
                                : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200'}
            `}
                    >
                        <span className="mr-1">{style.icon}</span> {style.name}
                    </button>
                ))}
            </div>

            {/* Instructions Toggle */}
            <div className="w-full flex flex-col items-center gap-2 mb-8">
                <button
                    onClick={() => setShowInstructions(!showInstructions)}
                    className="text-[10px] text-zinc-400 uppercase tracking-widest hover:text-zinc-600 transition-colors flex items-center gap-1"
                >
                    <span>{showInstructions ? '−' : '+'} Custom Instructions & Accent Training</span>
                    {instructions.trim() && <span className="w-1 h-1 bg-red-500 rounded-full" />}
                </button>
                {showInstructions && (
                    <p className="text-[9px] text-zinc-400 italic text-center max-w-xs leading-relaxed">
                        To train Flow for your accent: speak naturally and use instructions like <span className="text-indigo-500">&quot;I have a Vietnamese accent, prioritize phonetically similar English words.&quot;</span>
                    </p>
                )}
            </div>

            {showInstructions && (
                <div className="w-full mb-8 animate-in fade-in zoom-in-95 duration-200">
                    <textarea
                        value={instructions}
                        onChange={(e) => handleInstructionsChange(e.target.value)}
                        placeholder="e.g. 'I speak Vietlish. Check my accent.' or 'I have a deep rasp, ignore background static.'"
                        className="w-full h-24 bg-white/40 dark:bg-zinc-900/40 coffee-light:bg-white/60 coffee-dark:bg-black/20 backdrop-blur-md border border-zinc-200 dark:border-white/10 coffee-light:border-[#452B1F]/10 coffee-dark:border-white/10 rounded-[1.5rem] p-4 text-sm text-zinc-600 dark:text-zinc-400 coffee-light:text-[#452B1F] coffee-dark:text-[#f4ece1] focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all resize-none shadow-sm"
                    />
                </div>
            )}

            <Visualizer stream={stream} isRecording={isRecording} />

            <button
                onMouseDown={startRecording}
                onMouseUp={stopRecording}
                onMouseLeave={stopRecording}
                onTouchStart={startRecording}
                onTouchEnd={stopRecording}
                disabled={isProcessing || isRefining}
                className={`
          relative w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 mt-12
          ${isRecording
                        ? 'bg-red-600 scale-95 shadow-inner'
                        : 'bg-zinc-900 dark:bg-zinc-800 coffee-light:bg-[#452B1F] coffee-dark:bg-[#f4ece1] scale-100 shadow-xl hover:bg-zinc-800 dark:hover:bg-zinc-700 coffee-light:hover:bg-zinc-800 coffee-dark:hover:bg-white'}
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

            <p className="mt-6 text-zinc-500 coffee-light:text-[#452B1F]/60 coffee-dark:text-[#f4ece1]/60 font-mono text-xs tracking-tighter uppercase text-center h-4">
                {isRefining ? 'Polishing Style...' : isProcessing ? 'Transcribing...' : isRecording ? 'Listening...' : 'Hold to Talk'}
            </p>

            {error && (
                <p className="mt-4 text-red-500 text-sm font-medium">{error}</p>
            )}

            {transcription && (
                <div className="mt-12 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="bg-white/40 dark:bg-zinc-900/40 coffee-light:bg-white/60 coffee-dark:bg-black/40 backdrop-blur-md border border-zinc-100/50 dark:border-white/10 coffee-light:border-[#452B1F]/10 coffee-dark:border-white/10 rounded-[2rem] p-8 relative group shadow-xl shadow-indigo-500/5">
                        <div className="text-zinc-800 dark:text-zinc-100 coffee-light:text-[#452B1F] coffee-dark:text-[#f4ece1] text-lg leading-relaxed whitespace-pre-wrap prose prose-sm dark:prose-invert max-w-none 
                            prose-headings:text-zinc-900 dark:prose-headings:text-white coffee-light:prose-headings:text-[#452B1F] coffee-dark:prose-headings:text-[#f4ece1]
                            prose-p:leading-relaxed prose-li:my-0
                            prose-strong:text-indigo-600 dark:prose-strong:text-indigo-400 coffee-light:prose-strong:text-[#452B1F] coffee-dark:prose-strong:text-[#f4ece1]">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {transcription}
                            </ReactMarkdown>
                        </div>
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
