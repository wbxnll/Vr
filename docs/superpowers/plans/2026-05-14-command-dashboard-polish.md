# Command Dashboard Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Polish the attention landscape into a command-dashboard interface while preserving the existing data and interactions.

**Architecture:** Keep the current React component boundaries. Improve structural markup and Tailwind styling in the existing visual components, with small tests covering user-visible contracts.

**Tech Stack:** React, TypeScript, Tailwind CSS, Vitest, Testing Library, Vite.

---

### Task 1: Add UI Contract Tests

**Files:**
- Modify: `src/features/attention-landscape/components/SceneStage.test.tsx`

- [ ] Add tests that assert the command-dashboard labels render after boot/manual interaction.
- [ ] Run `pnpm test src/features/attention-landscape/components/SceneStage.test.tsx` and confirm the new tests fail before implementation.

### Task 2: Polish Dashboard Components

**Files:**
- Modify: `src/features/attention-landscape/components/SceneStage.tsx`
- Modify: `src/features/attention-landscape/components/TerrainMap.tsx`
- Modify: `src/features/attention-landscape/components/FrameSidebar.tsx`
- Modify: `src/features/attention-landscape/components/TimelineRail.tsx`
- Modify: `src/features/attention-landscape/components/LayerMeter.tsx`
- Modify: `src/features/attention-landscape/components/EnterpriseNode.tsx`
- Modify: `src/index.css`

- [ ] Add a top command header and compact status treatment.
- [ ] Improve terrain atmosphere with dashboard grid/scan overlays.
- [ ] Upgrade sidebar sections to instrument panels.
- [ ] Improve timeline and layer meter visual hierarchy.
- [ ] Strengthen node signal-column styling without changing data.

### Task 3: Verify

**Commands:**
- `pnpm test`
- `pnpm lint`
- `pnpm build`

- [ ] Capture desktop and mobile screenshots with Playwright and inspect layout for obvious overlap or blank render.
