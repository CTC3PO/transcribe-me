import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: NextRequest) {
    try {
        const { text, style } = await req.json();

        if (!text) {
            return NextResponse.json({ error: 'No text provided' }, { status: 400 });
        }

        if (style === 'raw') {
            return NextResponse.json({ text });
        }

        const stylePrompts: Record<string, string> = {
            professional: "Rewrite the following text to be professional, clear, and concise. Fix any grammar issues and remove filler words. Keep it natural but suited for a workplace.",
            casual: "Rewrite the following text to be casual and friendly. Keep the tone light but clear. Fix obvious transcription errors.",
            bullets: "Convert the following text into a clean bulleted list. Fix grammar and remove filler words. Ensure it's easy to read.",
            critique: "Act as a language tutor. Review this transcript for both English and Vietnamese. Identify potential mispronunciations (phonetic mishearings), suggest more natural phrasing, and highlight any interesting 'Vietlish' code-switching. Be encouraging but precise.",
        };

        let activeStyle = style;

        // --- AUTOMATIC INTENT DETECTION ---
        const lowerText = text.toLowerCase();
        if (lowerText.includes('bullet point') || lowerText.includes('bullet points') || lowerText.includes('list item')) {
            activeStyle = 'bullets';
        } else if (lowerText.includes('professional mode') || lowerText.includes('make it professional')) {
            activeStyle = 'professional';
        } else if (lowerText.includes('casual mode') || lowerText.includes('make it casual')) {
            activeStyle = 'casual';
        } else if (lowerText.includes('critique my accent') || lowerText.includes('how was my accent')) {
            activeStyle = 'critique';
        }

        const prompt = stylePrompts[activeStyle] || stylePrompts.professional;

        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: `${prompt} The original text might be a mix of American English and Vietnamese (Vietlish). Preserve the meaning and core content while applying the requested style. Return ONLY the rewritten text/critique.`
                },
                {
                    role: "user",
                    content: text.replace(/(bullet point|bullet points|professional mode|make it professional|casual mode|make it casual|critique my accent|how was my accent)/gi, '').trim(),
                },
            ],
            model: "llama-3.1-70b-versatile",
        });

        return NextResponse.json({
            text: completion.choices[0]?.message?.content || text
        });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
        console.error('Refinement error:', error);
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
