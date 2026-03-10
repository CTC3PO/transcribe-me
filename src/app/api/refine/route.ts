import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: NextRequest) {
    try {
        const { text, style, instructions } = await req.json();

        if (!text) {
            return NextResponse.json({ error: 'No text provided' }, { status: 400 });
        }

        if (style === 'raw' && !instructions) {
            return NextResponse.json({ text });
        }

        const stylePrompts: Record<string, string> = {
            professional: `REWRITE the text to be boardroom-ready. 
- Use sophisticated, high-impact vocabulary. 
- Fix ALL grammar and remove ALL filler words.
- Format as a clear, authoritative statement or a short memo.
- RETURN ONLY THE REFINED TEXT.

EXAMPLE:
User: "uh so like I was thinking maybe we should you know fix the budget for next year maybe."
Assistant: "We must prioritize the finalization of next year's budget to ensure long-term fiscal stability."`,

            casual: `REWRITE the text to be friendly, breezy, and conversational. 
- Maintain a warm, natural vibe.
- Fix obvious transcription errors but keep it approachable.
- RETURN ONLY THE REFINED TEXT.

EXAMPLE:
User: "hey man I was wondering if you wanted to like hang out later"
Assistant: "Hey! Just wondering if you're free to hang out later?"`,

            bullets: `TRANSFORM the text into a clean, hierarchical bulleted list. 
- Use '*' for bullets. 
- Use **BOLD** for headers or key themes.
- Organize logically into categories if possible.
- RETURN ONLY THE BULLETED LIST.

EXAMPLE:
User: "get eggs and milk and also bread for the house"
Assistant: * **Grocery List**
  * Eggs
  * Milk
  * Bread`,

            intelligence: `Act as a world-class Communication & Linguistics Engine. Analyze the transcript for:
1. **CORE INTENT**: One sentence summary of the primary goal.
2. **TONE ANALYSIS**: Identify emotional state and level of formality.
3. **ACCENT & PRONUNCIATION**: Identify "Vietlish" nuances or phonetic mishearings.
4. **POLISHED VERSION**: A perfectly refined, high-impact version.
5. **PRO TIP**: A tactical tip for sounding more natural.

FORMAT: Use clear Markdown headers (###) for each section.`,
        };

        let activeStyle = style === 'critique' ? 'intelligence' : style;

        // --- ENHANCED INTENT DETECTION ---
        const lowerText = text.toLowerCase();
        const hasKeyword = (keywords: string[]) => keywords.some(k => lowerText.includes(k));

        if (hasKeyword(['bullet', 'list', 'points'])) {
            activeStyle = 'bullets';
        } else if (hasKeyword(['professional', 'work', 'formal', 'fix for email'])) {
            activeStyle = 'professional';
        } else if (hasKeyword(['casual', 'friendly', 'vibe'])) {
            activeStyle = 'casual';
        } else if (hasKeyword(['accent', 'how do i sound', 'critique', 'tone', 'intelligence', 'analyze', 'vietlish', 'mishear'])) {
            activeStyle = 'intelligence';
        }

        const basePrompt = stylePrompts[activeStyle] || stylePrompts.professional;
        const customPrompt = instructions ? `\n\nUSER CUSTOM INSTRUCTIONS: ${instructions}` : "";

        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: `${basePrompt}${customPrompt} 

Context: The user may be using "Vietlish" (mixed English-Vietnamese). 
Constraint: DO NOT include any preamble like "Sure, here is your text" or "Refined version:". Start immediately with the content.`
                },
                {
                    role: "user",
                    content: text,
                },
            ],
            model: "llama-3.3-70b-versatile",
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
