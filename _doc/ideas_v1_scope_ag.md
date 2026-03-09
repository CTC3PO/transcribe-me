# CT Apps: Priority A Sprint Plans (v2.0 Refined)

*Based on `ideas_v2_scope_cl.html` and the Vibe-Coding Protocol. This document outlines the refined sprint plans, architecture, and suggested shipping order for the Priority A projects.*

**Stack Default:** Next.js · TypeScript · Tailwind · Supabase · Python/PyTorch

---

## Suggested Shipping Order
To maximize momentum and time-to-value, build in this sequence:
1. **A1 (Speech-to-Text PWA)**: Weekend solo build, immediate personal value, zero dependencies. 
2. **B4 (Da Nang Events)**: Fork of existing codebase — fastest possible path to something live.
3. **B1 (Item Exchange)**: Real community need, you'll be in Da Nang to seed it personally.
4. **C5 (3D RL Viz)**: Portfolio centerpiece — ship before graduation job interviews.
5. **C1 (Pet Health CV)**: ML portfolio + PyTorch practice.
6. **A2 (Vibe-Coding CLI)**: Build and refine this in parallel while doing every other project.
7. **B2 (Language App)**: Needs community seeding plan first — design before building.
8. **C6 (Accessibility CV)**: Scope is aspirational — ship as research prototype later.

---

## 1. Project A1: Custom Speech-to-Text PWA
**Tagline:** Personal Wispr Flow alternative — mixed American-Vietnamese accent
**Sprint:** 3 Days | **Cost:** ~$0/mo (Groq free tier)

- **Day 1: Scaffold & API Route (Architect + Backend Agent)**
  - Setup Next.js repo. Build `/api/transcribe` using the Groq SDK (`groq.audio.transcriptions.create` using `whisper-large-v3`). 
  - *Why Groq?* 6,000 requests/day free tier, handles Vietnamese/English code-switching natively, ultra-low latency.
- **Day 2: Recording UI & Browser API (Frontend Agent)**
  - Implement `MediaRecorder` Web API (send audio in chunks) and Web Audio API `AnalyserNode` for a real-time waveform. 
  - Build a massive, touch-friendly hold-to-talk button.
- **Day 3: Polish, PWA Config & History (Frontend + QA Agent)**
  - Add visual "Copy to clipboard" confirmation. Session history via `localStorage` (no database). Configure `manifest.json` for PWA. Test mobile mic permissions.
- **Verification:** Speak 5 mixed language sentences; all return within 2 seconds. Installable on mobile and desktop.

---

## 2. Project B4: Da Nang Event Aggregator
**Tagline:** ĐàLạt.app ported for Da Nang
**Sprint:** 3 Days | **Cost:** ~$0 (Supabase free tier)

- **Day 1: Fork, Reskin & Schema Migration (Architect Agent + Human)**
  - Fork existing ĐàLạt.app repo (proven architecture, multilingual support built-in). Update env vars to a new Supabase project. 
  - Update categories for Da Nang context (Tech, Language Exchange) and add a `source_group` column for WhatsApp attribution.
- **Day 2: Admin Panel & Filtering (Frontend + Backend Agent)**
  - Secure admin event form. Add public "Submit Event" form that queues for admin approval. Seed 10-15 real events.
- **Day 3: Mobile Polish & Add-to-Calendar (Frontend + QA Agent)**
  - Add `.ics` export buttons. Crucial: Add Web Share API button to allow users to share events back to WhatsApp groups to drive viral loops.
- **Verification:** Filter works on mobile without reload. Share button opens native share sheet. 

---

## 3. Project B1: Transient City Item Exchange
**Tagline:** Borrow/lend platform for expats and locals
**Sprint:** 4 Days | **Cost:** ~$0 (Supabase free tier)

- **Day 1: Supabase Setup & Auth (Architect + Backend Agent)**
  - Setup tables: `profiles`, `items`, `borrow_requests`. Enable RLS (only owners edit). Google OAuth / Magic link.
- **Day 2: Server Actions & Image Upload (Backend Agent)**
  - Write Server Actions for CRUD. Compress images client-side before sending to Supabase Storage `item-images` bucket.
- **Day 3: Feed UI & Item Form (Frontend Agent)**
  - Build item card grid, category/city/price filters, and the dynamic upload form.
- **Day 4: Contact Flow, Reputation & Polish (Frontend + QA Agent)**
  - Instead of in-app chat, build a "Contact Owner" button generating a deep link: `wa.me/{phone}?text=...`. Add simple +1 reputation system.
- **Verification:** User A uploads "Drill". User B clicks Contact Owner and WhatsApp opens with pre-filled message.

---

## 4. Project C5: 3D Reinforcement Learning Visualization
**Tagline:** Live 3D playthrough of your Pacman Q-learning agent
**Sprint:** 3 Days | **Cost:** $0 (Client-side)

- **Day 1: Export Agent Replay Data (Human + Backend Python)**
  - Modify Pacman Q-learning agent to serialize game episodes as JSON (state, action, reward, q-values). Generate 5-10 episodes across different training epochs.
- **Day 2: Three.js Scene Setup (Frontend Agent)**
  - Use React Three Fiber. Load episode JSON and animate agent. Color-code floor tiles as a heatmap based on Q-values. Add OrbitControls.
- **Day 3: Overlays, Playback & Polish (Frontend Agent)**
  - HTML overlays for current reward and epoch. Play/pause and speed slider. The core portfolio narrative: easily toggle between an "Early" (chaotic) and "Converged" (smooth) agent.
- **Verification:** Scene loads < 5s. Q-value heatmap moves with the agent. Visibly distinct behavior between early and late epochs.

---

## 5. Project C1: Pet Health CV Scanner
**Tagline:** Upload dog photo → AI flags conditions, prompts vet visit
**Sprint:** 3 Days | **Cost:** HuggingFace free tier

- **Day 1: Model Fine-tuning & API (Architect + Backend Python)**
  - *Better Path:* Fine-tune EfficientNet-B0 on Kaggle Dog Diseases dataset using PyTorch on Colab (~2 hrs). Push to HuggingFace Hub. Write Next.js `/api/scan` to route the image and return labels + confidence.
- **Day 2: Drag-and-Drop Upload UI (Frontend Agent)**
  - Build `react-dropzone` UI. Accept JPEG/PNG, resize client-side to save bandwidth. Skeleton loading state.
- **Day 3: Results Display & Disclaimer (Frontend + QA Agent)**
  - Render labels + confidence. **Mandatory medical disclaimer modal** on first visit. Link to Google Maps "Find a vet near me".
- **Verification:** Disclaimer appears and requires acceptance. Upload returns labels + scores. Mobile camera capture works.

---

## 6. Project B2: "Snapchat for Language"
**Tagline:** Buddy streak system + SRS flashcards
**Sprint:** 4 Days | **Cost:** Supabase free tier

- **Day 1: Schema & Auth (Architect + Backend)**
  - Setup tables: `users`, `cards`, `decks`, `buddy_pairs`, `study_sessions`. 
- **Day 2: Flashcard UI + SM-2 Algorithm (Frontend + Backend)**
  - UI: swipe/tap to flip, rate Easy/Hard/Again. Server action for SM-2 spaced repetition (Easy = +N days, Hard = 1 day, Again = same session).
- **Day 3: Buddy Dashboard (Frontend)**
  - Dashboard comparing streaks. Supabase Realtime subscriptons to see buddy status ("Studying now"). WhatsApp invite link generation.
- **Day 4: PWA, Notifications & Polish (Frontend + QA)**
  - PWA manifest. Optional: Resend email trigger at 8pm if buddy is waiting.
- **Verification:** Two users linked. User A finishes session → User B's dashboard updates in real-time.

---

## 7. Project C6: Urban Accessibility CV Prototype
**Tagline:** Live camera + TF.js object detection → audio alerts
**Sprint:** 4 Days | **Scope Warning:** Research prototype only.

- **Day 1: Camera Setup via WebRTC (Frontend)**
  - `getUserMedia` to get rear camera. Add Start/Stop buttons. 
- **Day 2: TF.js Object Detection (Frontend)**
  - Load `@tensorflow-models/coco-ssd`. Run inference on frames (every 500ms). Draw canvas bounding boxes (filter to person, car, bike).
- **Day 3: Audio Feedback Map (Frontend)**
  - Use `window.speechSynthesis`. Throttle speech so it only announces on major changes or proximity changes (large bounding box = "very close").
- **Day 4 (Optional): GPS Context Layer (Backend/QA)**
  - Query OpenStreetMap for nearby crosswalks.
- **Verification:** Person walking into frame triggers throttled spoken audio.

---

## 8. Project A2: Vibe-Coding Protocol (CLI Tool)
**Tagline:** AI-powered project scaffold CLI

- **Action:** Not a product sprint. Write a Python CLI (`plan.py "app idea"`) that prompts standard LLM templates to output `task.md` and SQL schema automatically before you start any of the sprints above. This automates the "Architect Agent" phase.
