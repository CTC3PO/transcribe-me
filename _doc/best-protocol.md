# AI Agent Vibe Coding Protocol & Workflow Guide

## 1. Agent Roles & Task Orchestration
To prevent conflicts and maximize token efficiency, assign clear, isolated roles to different agents.

### Core Roles & Subtasks

- **Architect/Planner Agent (The Lead):** 
  - *Subtasks:* Translating business requirements into technical specs, designing database schemas, defining API contracts, and drafting the `implementation_plan.md` and `task.md`.
  - *How they work:* This agent *never* writes application code. They only read the codebase, write documentation, create the initial folder structure, and ask the human clarifying questions before execution begins.

- **Frontend/UI Agent:** 
  - *Subtasks:* Building visual components, writing CSS/Tailwind, implementing animations, and wiring up UI state.
  - *How they work:* They operate strictly within `/src/components` and `/src/styles`. If the backend isn't ready, they use hardcoded mock data to build the UI unblocked. They must be explicitly told not to modify server code.

- **Backend/API Agent:** 
  - *Subtasks:* Setting up database models, writing serverless functions/API routes, handling authentication, and integrating third-party APIs (like Stripe or OpenAI).
  - *How they work:* They operate strictly within `/src/api`, `/server`, or `/src/lib`. They expose clean data endpoints for the frontend to consume. They should write basic unit tests for their endpoints before handing off.

- **QA/Testing Agent:** 
  - *Subtasks:* Writing integration tests (e.g., Jest, Cypress, Playwright), performing security audits, checking for hardcoded secrets, and verifying user flows.
  - *How they work:* They read the `walkthrough.md` or `implementation_plan.md` to understand what *should* happen, run the app, and write scripts to break it. They generate bug reports for the other agents to fix.

### Task Sequencing
1. **Planning Phase:** Architect Agent analyzes requirements and drafts the implementation plan. (Requires Human Approval).
2. **Execution Phase:** Frontend and Backend agents work sequentially or in parallel on *strictly different* files/domains (e.g., backend writes the endpoint, UI creates the form).
3. **Verification Phase:** QA Agent tests the integration and generates the `walkthrough.md`.

### The "Ralph" Loop (Evaluating & Refining)
Whether referring to REPL (Read-Eval-Print Loop), RLHF, or a customized autonomous agent loop, the concept is the same:
- **Observe/Read:** Agent reads the current codebase or terminal errors.
- **Plan:** Determines the exact fix needed.
- **Act:** Writes the code/tests.
- **Evaluate:** Runs the test command or linter.
*Golden Rule:* Explicitly limit agents to **3 iterations** in this loop. If they fail 3 times, they must stop and document the blocker for human review to avoid infinite token-draining hallucination cycles.

---

## 2. Project Architecture & File Structure
Agent-friendly architecture prioritizes high decoupling and strict boundaries. Agents struggle with massive, monolithic files because it eats up their context window and causes them to "forget" details or accidentally delete logic.

### Recommended Tech Stack (Modern Web)
Explicitly instruct agents on your preferred stack to prevent them from hallucinating deprecated libraries or mixing paradigms (e.g., mixing Pages Router with App Router).
- **Core Framework:** Next.js (App Router favored for server components, or Pages Router if explicitly specified).
- **UI Library:** React.
- **Styling:** Tailwind CSS (utility-first prevents CSS bleed and keeps styling localized to the component).
- **Language:** TypeScript (strict typing acts as a foundational guardrail for the AI).
- **State Management:** Zustand or React Context (avoid Redux for AI unless explicitly needed, as boilerplate confuses agents).
- **Data Fetching:** React Query (client-side) or native Next.js `fetch` (server-side).

### Recommended Architectural Patterns

**1. Feature-Sliced Design (Domain-Driven)**
Instead of grouping files by type (all components together, all APIs together), group them by *feature*. This allows Agent A to work on the "Auth" feature without ever seeing the "Dashboard" feature.
```text
/project-root
  /docs                  # implementation_plan.md, task.md, handover.md
  /src
    /features
      /authentication
        /components      # LoginForm.tsx
        /api             # login.ts
        /types           # AuthUser.ts
      /dashboard
        /components
        /api
    /shared              # Generic buttons, layout wrappers, global utils
```

**2. The Shared "Types" Dictionary**
If building in TypeScript, always keep a `/shared/types` or `/types` directory. This is the contract between agents. The Architect defines the `User` type. The Backend agent builds an API that returns a `User`. The Frontend agent builds a UI that displays a `User`. This guarantees they output compatible code without having to read each other's files.

**3. Smart vs. Dumb Components**
- **Dumb Components (UI):** Render UI based on props. Driven entirely by the UI Agent.
- **Smart Components (Containers):** Fetch data, manage state, and pass props to Dumb components. Driven by the API/Integration Agent.
Keeping these separate means one agent can perfectly style a button while another agent simultaneously writes the fetching logic for it.

**4. Keep Files Under 250 Lines**
Explicitly instruct agents to refactor files that grow too large. If an agent has to read a 1,000-line file to change a button color, it wastes context tokens and increases the risk of code deletion mistakes. Use index/barrel files (`index.ts`) to cleanly re-export smaller files.

---

## 3. Streamlined Agent Workflow (The Document Cascade)
Your proposed workflow is naturally aligned with the best practices of Agentic Coding. Here is an optimized version:

1. **`implementation_plan.md` (The Blueprint - PLANNING MODE)**
   - Created before any code is written.
   - Summarizes the goal, defines architecture, and provides a markdown checklist of specific files to create, modify, or delete.
   - *Tip:* Ensure you (the human) review and approve this file before execution begins.

2. **`task.md` (The Active State - EXECUTION MODE)**
   - A living checklist broken down into highly granular steps.
   - Agents update this file (`[ ]` to `[x]`) as they work.
   - *Tip:* This serves as the agent's short-term memory. If an agent crashes or you start a new session, the next agent reads `task.md` to instantly know where to resume.

3. **`walkthrough.md` (The Proof of Work - VERIFICATION MODE)**
   - Written after a feature is completed.
   - Documents what was changed, how it was tested, screenshots of UI changes, and any validation results.

4. **`handover.md` (The Save State - SESSION END)**
   - Crucial for multi-day human-AI sessions.
   - *Format:*
     1. What was accomplished today.
     2. What is currently broken, mid-progress, or failing.
     3. *Next Actions:* Exactly what the Agent should do when starting the next session.

---

## 4. Functionality, Security & The Self-Testing Loop

- **Test-Driven AI (TDAI):** Have your QA Agent (or the executing agent) write the test *first*. Then, write the implementation to make the test pass. This prevents agents from writing code that looks right but functions wrong.
- **Self-Testing Loop:** 
  - Instruct the agent to run tests (e.g., `npm run test` or `npm run lint`) after completing a component.
  - The agent reads the terminal output. If it fails, it enters the correction loop (up to 3 times before asking for your help).
- **Security Checkpoints:** 
  - **Never** let an agent install new dependencies (npm packages) without asking you first. This prevents adding bloated or potentially unvetted packages.
  - Instruct agents to scan for accidentally hardcoded secrets before committing code.

---

## 5. Additional Best Practices for Full-Stack Shipping

### Micro-Prompting: The Key to Agency
Agents fail when overwhelmed by vague or massive requests. Micro-prompting ensures they only focus on one discrete logic block at a time.
- **The "Chain of Components" Pattern:** Do not ask to "build an authentication system." Instead, explicitly chain microscopic tasks:
  1. *Prompt 1:* "Create the `LoginForm` UI component in `/src/components`. It needs email/password inputs and a disabled submit state."
  2. *Prompt 2:* "Create a utility function `loginUser` in `/src/lib/auth.ts` that sends a POST request to `/api/auth`."
  3. *Prompt 3:* "Now, import `loginUser` into `LoginForm` and connect the submit button to it."
- **Define I/O Clearly:** When asking an agent to write a helper function, explicitly state the expected input types and exactly what it should return.

### Context Hygiene
AI agents have a limited "attention span" (context window). Feeding them too much irrelevant code causes hallucinations.
- **The "3-File Rule":** Force agents to work with a maximum of 3 open files at once (e.g., the component, the API route, and the database schema). Close everything else.
- **Compartmentalize Chat Threads:** Do not keep a single, massive ChatGPT/Claude thread running for a week. Start a *new* chat session for the Database setup, a *new* session for the Frontend UI, and a *new* session for Deployment.
- **Eject on Confusion:** If an agent gets "stuck" in a loop generating identical or broken code, the context is ruined. Cut your losses, summarize the current correct state into a `handover.md`, start a brand new chat, and paste the handover file to give the new agent a fresh brain.

### Engineering Standards for AI
- **Strict Linting & Hooks:** Use Prettier, ESLint, and Husky pre-commit hooks. AI agents sometimes write functionally correct but poorly formatted code. Enforcing formatting automatically saves the AI from wasting tokens "fixing indentation."
- **Defensive Error Handling:** Instruct agents to aggressively use `try/catch` and add robust, structured logging around complex logic or API calls. If an error occurs during the verification loop, the agent can rapidly diagnose it by reading the logs rather than blindly guessing the root cause.
- **Environment & Secrets Management:** Never let an agent create or modify `.env` files with real production API keys. Have them work strictly with `.env.example` and placeholder/mock keys until you manually substitute the real ones locally.
- **Database Migration Safety:** Agents must generate declarative migration files (e.g., Prisma migrations, pure SQL scripts) rather than connecting to and modifying production schemas on the fly. Always have a human review migration files.

### The "Knowledge Brain"
- **Knowledge Items (KI):** If you or an agent figure out a tricky, project-specific pattern (e.g., how to handle Strava OAuth redirects on Vercel), immediately have the agent write a short markdown file in a `/knowledge` or `/docs/brain` folder (e.g., `strava-oauth-vercel.md`). 
- For future tasks in new chat threads, you can simply tell the new agent: `"Read /knowledge/strava-oauth-vercel.md before writing this API route."` This creates persistent, cross-session memory for your project.
