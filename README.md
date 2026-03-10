# Flow.

**"Ready to speak? I'm ready to listen."**

Flow is a high-performance, premium Speech-to-Text PWA designed for mixed American-Vietnamese (Vietlish) workflows. It provides ultra-low latency transcriptions and intelligent post-processing using Groq's high-speed inference engine.

## 🚀 Features

- **Ultra-Fast Transcription**: Powered by Groq's Whisper-large-v3 (~1s turnaround).
- **Intelligence Layer (🧠)**: Advanced linguistic analysis—choose between **Professional**, **Casual**, **Bullets**, or **Intelligence**.
- **Accent & Tone Analysis**: Get deep feedback on your pronunciation ("Vietlish" nuances) and emotional tone.
- **Custom Instructions**: Train Flow for your specific voice and accent patterns.
- **Dual Coffee Themes**: Smooth **Coffee Light** and immersive **Dark Roast** for late-night sessions.
- **Responsive Layout**: Wider, fluid flex layout optimized for both mobile and desktop browser views.
- **Local History**: Your last 20 transcriptions are saved in the browser for instant access and one-tap copy.
- **PWA support**: Installable on iOS, Android, and Desktop as a native-feeling app with PWA sync readiness.

## 🛠️ Tech Stack

### Core
- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with native CSS variables for theme management.
- **Rendering**: [React 18](https://reactjs.org/) with client-side hydration for dynamic themes.

### AI & Processing
- **Inference Engine**: [Groq SDK](https://groq.com/) (Whisper-large-v3 & Llama 3.3 70B).
- **Markdown Handling**: [react-markdown](https://github.com/remarkjs/react-markdown) for beautiful AI-structured outputs.
- **Styling**: `@tailwindcss/typography` (Prose) for rich text rendering.

### Infrastructure
- **Database / Auth**: [Supabase](https://supabase.com/) for journal syncing and user accounts.
- **Theme Management**: `next-themes` for persistent light/dark/coffee mode switching.
- **Icons**: [Lucide React](https://lucide.dev/).

## 🛠️ Setup & Startup

### Prerequisites
- Node.js 18+
- A [Groq Cloud](https://console.groq.com) API Key.
- [Supabase](https://supabase.com) credentials.

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/CTC3PO/transcribe-me.git
   cd transcribe-me
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment:
   Create a `.env.local` file in the root and add your keys:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   GROQ_API_KEY=your_groq_api_key
   ```

### Running Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to start flowing.

---
*Built with passion for high-impact communication.*
