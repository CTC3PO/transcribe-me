import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        // Groq transcription
        const transcription = await groq.audio.transcriptions.create({
            file: file,
            model: 'whisper-large-v3',
        });

        return NextResponse.json({ text: transcription.text });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
        console.error('Transcription error:', error);
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
