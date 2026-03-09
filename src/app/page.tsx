import HoldToTalk from "@/components/HoldToTalk";

export default function Home() {
  return (
    <main className="min-h-screen bg-white selection:bg-red-100">
      <div className="max-w-4xl mx-auto px-6 py-20 flex flex-col items-center">
        <header className="text-center mb-16">
          <h1 className="text-5xl font-bold tracking-tight text-zinc-900 mb-4">
            Flow<span className="text-red-500">.</span>
          </h1>
          <p className="text-zinc-500 font-medium text-lg">
            Ready to speak? I&apos;m ready to listen.
          </p>
        </header>

        <section className="w-full flex justify-center">
          <HoldToTalk />
        </section>

        <footer className="mt-32 pt-8 border-t border-zinc-100 w-full flex justify-between items-center text-zinc-400 text-xs font-mono uppercase tracking-widest">
          <div>Groq Whisper Large V3</div>
          <div>Project A1</div>
        </footer>
      </div>
    </main>
  );
}
