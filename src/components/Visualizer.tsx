'use client';

import { useEffect, useRef } from 'react';

interface VisualizerProps {
    stream: MediaStream | null;
    isRecording: boolean;
}

export default function Visualizer({ stream, isRecording }: VisualizerProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number>();
    const analyserRef = useRef<AnalyserNode>();

    useEffect(() => {
        if (!stream || !isRecording) {
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
            return;
        }

        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const audioContext = new AudioContextClass();
        const source = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();

        analyser.fftSize = 256;
        source.connect(analyser);
        analyserRef.current = analyser;

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const draw = () => {
            animationRef.current = requestAnimationFrame(draw);
            analyser.getByteFrequencyData(dataArray);

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const barWidth = (canvas.width / bufferLength) * 2.5;
            let barHeight;
            let x = 0;

            for (let i = 0; i < bufferLength; i++) {
                barHeight = (dataArray[i] / 255) * canvas.height;

                // Gradient for a "premium" feel
                const gradient = ctx.createLinearGradient(0, canvas.height - barHeight, 0, canvas.height);
                gradient.addColorStop(0, '#ef4444'); // red-500
                gradient.addColorStop(1, '#991b1b'); // red-800

                ctx.fillStyle = gradient;
                ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

                x += barWidth + 1;
            }
        };

        draw();

        return () => {
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
            audioContext.close();
        };
    }, [stream, isRecording]);

    return (
        <div className="w-full h-24 bg-black/5 rounded-xl overflow-hidden mb-8 flex items-center justify-center">
            {isRecording ? (
                <canvas ref={canvasRef} width={400} height={100} className="w-full h-full" />
            ) : (
                <div className="text-muted text-sm font-mono tracking-widest opacity-30 text-zinc-400">
                    WAITING FOR INPUT...
                </div>
            )}
        </div>
    );
}
