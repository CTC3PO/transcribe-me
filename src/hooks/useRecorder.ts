'use client';

import { useState, useRef, useCallback } from 'react';

export function useRecorder(onTranscription: (text: string) => void) {
    const [isRecording, setIsRecording] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const streamRef = useRef<MediaStream | null>(null);

    const sendToTranscribe = useCallback(async (blob: Blob) => {
        setIsProcessing(true);
        try {
            const formData = new FormData();
            formData.append('file', blob, 'audio.webm');

            const response = await fetch('/api/transcribe', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) throw new Error('Transcription failed');

            const data = await response.json();
            onTranscription(data.text);
        } catch (err) {
            console.error('Transcription error:', err);
            setError('Transcription failed. Check your API key.');
        } finally {
            setIsProcessing(false);
        }
    }, [onTranscription]);

    const startRecording = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;

            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                await sendToTranscribe(audioBlob);
            };

            mediaRecorder.start();
            setIsRecording(true);
            setError(null);
        } catch (err) {
            console.error('Error starting recording:', err);
            setError('Could not access microphone');
        }
    }, [sendToTranscribe]);

    const stopRecording = useCallback(() => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
            setIsRecording(false);
        }
    }, [isRecording]);

    return {
        isRecording,
        isProcessing,
        error,
        startRecording,
        stopRecording,
        stream: streamRef.current
    };
}
