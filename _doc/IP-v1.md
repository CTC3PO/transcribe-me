# Project A1: Speech-to-Text PWA Implementation Plan

**Objective:** Build a high-performance, mixed-language (English/Vietnamese) transcription tool. Immediate personal value for voice-to-text workflows with zero overhead.

## Architecture & Tech Stack
- **Framework:** Next.js (App Router)
- **API:** Groq (Whisper-large-v3) for ultra-low latency.
- **Client APIs:** `MediaRecorder` (Audio), `Web Audio API` (Visualizer).
- **Persistence:** `localStorage` (History).
- **Distribution:** PWA (Installable on iOS/Android/Desktop).

---

## Phased Implementation

### Phase 1: Core Foundation & Transcription API
The goal is to establish the secure communication between the client and Groq.
- [ ] Initialize Next.js project with TypeScript and Tailwind CSS.
- [ ] Configure `.env.local` with `GROQ_API_KEY`.
- [ ] Implement `src/api/transcribe/route.ts`:
    - Handle `multipart/form-data` audio blob uploads.
    - Connect to Groq API using the SDK or direct `fetch`.
    - Return clean JSON response with transcription text.
- [ ] **Verification**: Successfully transcribe an audio file using `curl` or a simple test script.

### Phase 2: Recording Engine & Visualizer
The goal is to build the "Vibe Coding" interface — premium, responsive, and alive.
- [ ] Create `src/components/HoldToTalk.tsx`:
    - Implement `MediaRecorder` with requested 3s chunking for speed.
    - Handle mic permissions and error states.
- [ ] Integrate `src/lib/waveform.ts`:
    - Use `AnalyserNode` to drive a real-time SVG or Canvas waveform.
- [ ] Style the UI with a "premium" feel:
    - Large, central interaction button.
    - Subtle micro-animations and gradients.
- [ ] **Verification**: Waveform reacts to voice; release button triggers API call and displays text.

### Phase 3: History & Offline PWA Capabilities
The goal is to make it feel like a native app with persistence.
- [ ] Implement `src/lib/storage.ts`:
    - Create a wrapper for `localStorage` to manage the most recent 20 transcriptions.
- [ ] Create `src/components/TranscriptionHistory.tsx`.
- [ ] Configure PWA:
    - Add `manifest.json`.
    - Setup Service Worker for offline loading.
    - Ensure iOS-specific meta tags (status bar, icons).
- [ ] **Verification**: Transcriptions persist after page refresh; app is installable via browser.

### Phase 4: Polish & Integration
The goal is to ensure the "Wispr Flow" experience. See wispr flow features: [wisprflow.ai/features](https://wisprflow.ai/features)
- [ ] Add "Copy to Clipboard" with a visual confirmation flash.
- [ ] **Styles & Formatting (Wispr Mimicry)**:
    - Implement "Auto-format" (remove filler words, fix punctuation).
    - Add "Styles" dropdown (Professional, Casual, Bullet Points).
- [ ] Optimize mobile UX:
    - Touch-start/Touch-end event handling for high-latency mobile browsers.
    - Test iOS Safari vs. Chrome Android mic behaviors.

### Phase 5: Intelligence Layer (Groq Consolidation)
To mimic Wispr Flow's "Intelligence" without needing additional API keys, we will use Groq for both transcription and refinement:
- **Transcription (Groq)**: Whisper-large-v3 for ~1s results.
- **Refinement (Groq)**: Llama-3-70b (also on Groq) for instant auto-formatting and styling.
- [ ] Implement `src/api/refine/route.ts`:
    - Takes raw text + style hint.
    - Sends to Groq's Llama-3 model for instant rewriting.

---

## Wispr Flow Feasibility Analysis (for PWA)

| Feature | Feasibility | Implementation Path |
| :--- | :--- | :--- |
| **Everywhere Insertion** | Medium | Browser-only (Clipboard). Desktop wrapper (Tauri) needed later for global. |
| **Auto-Formatting** | High | Groq Llama-3 post-processing (Phase 5). |
| **Sound Like Yourself** | High | Personalized system prompt on Llama-3. |
| **Self-Correction** | Medium | Logic to detect "actually X" in the transcript via Llama-3. |

## Why Groq for everything?
1. **Zero Context Switching**: You just need one `GROQ_API_KEY`.
2. **Ultra Speed**: Groq's Llama-3-70b is fast enough that the "refinement" step will still feel instantaneous after the transcription.
3. **Consistency**: All AI logic stays within one high-performance provider.

---

## Verification Criteria
- [ ] Code-switching: Speak "Hôm nay I am going to the gym" → Correct transcription.
- [ ] Speed: Total turnaround < 2 seconds.
- [ ] Presence: App appears on home screen as PWA.
- [ ] Stability: Local storage handles up to 20 items without performance degradation.
