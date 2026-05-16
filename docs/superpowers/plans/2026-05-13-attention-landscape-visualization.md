# 注意力驱动资本流动可视化系统 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 基于 `README (1).md` 的案例叙事，重建一个可直接演示的全屏产业地貌可视化系统，完整实现 5 帧播放、场景动画、右侧信息侧栏、时间轴和节点详情交互。

**Architecture:** 保留现有 `Vite + React + TypeScript + Tailwind` 工程底座，在 `src/features/attention-landscape/` 下建立独立功能模块。数据、播放控制、场景渲染和外围 UI 分层实现，`App.tsx` 只负责装配新系统，旧仪表盘组件直接删除或停用。

**Tech Stack:** React 18、TypeScript、Vite、Tailwind CSS、SVG、Vitest、Testing Library

---

## 实施前提

- 当前工作区不是 Git 仓库，执行时跳过提交步骤，改用阶段性验证代替
- 首版只实现内置 `2024 年星舰第五飞` 案例，不接外部接口
- 测试只覆盖高价值逻辑：数据完整性、播放控制和关键交互，不扩写低价值视觉快照

## 文件结构

### 新建文件

- `src/features/attention-landscape/types.ts`
- `src/features/attention-landscape/data/caseStudy.ts`
- `src/features/attention-landscape/data/caseStudy.test.ts`
- `src/features/attention-landscape/hooks/usePlaybackController.ts`
- `src/features/attention-landscape/hooks/usePlaybackController.test.tsx`
- `src/features/attention-landscape/utils/visuals.ts`
- `src/features/attention-landscape/components/SceneStage.tsx`
- `src/features/attention-landscape/components/TerrainMap.tsx`
- `src/features/attention-landscape/components/EnterpriseNode.tsx`
- `src/features/attention-landscape/components/AttentionPulse.tsx`
- `src/features/attention-landscape/components/RadarNarration.tsx`
- `src/features/attention-landscape/components/FrameSidebar.tsx`
- `src/features/attention-landscape/components/TimelineRail.tsx`
- `src/features/attention-landscape/components/LayerMeter.tsx`
- `src/features/attention-landscape/components/NodeTooltip.tsx`
- `src/features/attention-landscape/components/SceneStage.test.tsx`
- `src/features/attention-landscape/index.ts`
- `src/test/setup.ts`

### 修改文件

- `package.json`
- `src/App.tsx`
- `src/index.css`

### 删除文件

- `src/components/ChainFlow.tsx`
- `src/components/Empty.tsx`
- `src/components/EnterpriseMap.tsx`
- `src/components/EventCard.tsx`
- `src/components/Layout.tsx`
- `src/components/SectorChart.tsx`
- `src/components/StockChart.tsx`
- `src/data/events.ts`
- `src/hooks/useStockData.ts`
- `src/pages/Home.tsx`
- `src/types/index.ts`
- `src/utils/calculations.ts`

## Task 1: 建立新模块骨架与测试基线

**Files:**
- Create: `src/features/attention-landscape/types.ts`
- Create: `src/features/attention-landscape/data/caseStudy.ts`
- Create: `src/features/attention-landscape/data/caseStudy.test.ts`
- Create: `src/test/setup.ts`
- Modify: `package.json`

- [ ] **Step 1: 为 Vitest 与 Testing Library 补齐脚本和依赖**

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "eslint .",
    "preview": "vite preview",
    "check": "tsc -b --noEmit",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/react": "^16.0.1",
    "@testing-library/user-event": "^14.5.2",
    "jsdom": "^25.0.1",
    "vitest": "^2.1.5"
  }
}
```

- [ ] **Step 2: 写测试环境初始化文件**

```ts
import "@testing-library/jest-dom/vitest";
```

- [ ] **Step 3: 定义新案例系统的核心类型**

```ts
export type AttentionLayerId = "core" | "support" | "edge";

export interface AttentionMetric {
  turnoverRate: string;
  marginChange: string;
  qaDensity: string;
}

export interface AttentionNode {
  id: string;
  name: string;
  layerId: AttentionLayerId;
  chainPosition: string;
  mapping: string;
  x: number;
  y: number;
  size: number;
  connections: string[];
}

export interface AttentionFrame {
  id: string;
  index: number;
  title: string;
  timeWindow: string;
  narration: string;
  sidebar: {
    headline: string;
    eventVisual: string;
    marketVisual: string;
    chainVisual: string;
    summary: string;
  };
  layerWeights: Record<AttentionLayerId, number>;
  nodeHeat: Record<string, number>;
  activePaths: Array<[string, string]>;
  metrics: Record<string, AttentionMetric>;
}
```

- [ ] **Step 4: 先写失败的数据完整性测试**

```ts
import { describe, expect, it } from "vitest";
import { caseStudy } from "./caseStudy";

describe("caseStudy", () => {
  it("contains the expected 8 companies and 5 frames", () => {
    expect(caseStudy.nodes).toHaveLength(8);
    expect(caseStudy.frames).toHaveLength(5);
  });

  it("keeps every frame weight sum at 100", () => {
    caseStudy.frames.forEach((frame) => {
      const total = Object.values(frame.layerWeights).reduce((sum, value) => sum + value, 0);
      expect(total).toBe(100);
    });
  });

  it("provides metrics for every node in every frame", () => {
    caseStudy.frames.forEach((frame) => {
      caseStudy.nodes.forEach((node) => {
        expect(frame.metrics[node.id]).toBeDefined();
      });
    });
  });
});
```

- [ ] **Step 5: 写最小可用的案例数据实现让测试通过**

```ts
import type { AttentionFrame, AttentionNode } from "../types";

const nodes: AttentionNode[] = [
  { id: "sirui", name: "斯瑞新材", layerId: "core", chainPosition: "核心映射", mapping: "液氧甲烷发动机推力室内壁", x: 50, y: 24, size: 1, connections: ["chaojie", "blt"] },
  { id: "chaojie", name: "超捷股份", layerId: "core", chainPosition: "核心映射", mapping: "箭体结构件与壳段连接", x: 62, y: 32, size: 0.96, connections: ["sirui", "chenguang"] }
];

const frames: AttentionFrame[] = [
  {
    id: "frame-1",
    index: 1,
    title: "事件爆发",
    timeWindow: "T+0",
    narration: "市场注意力先被事件塔捕获，尚未映射到具体标的。",
    sidebar: {
      headline: "帧① 事件爆发",
      eventVisual: "星舰回收成功现场画面",
      marketVisual: "市场仍在理解事件冲击",
      chainVisual: "产业链映射尚未展开",
      summary: "先点亮事件，再等待注意力向产业链扩散。"
    },
    layerWeights: { core: 52, support: 28, edge: 20 },
    nodeHeat: { sirui: 14, chaojie: 12 },
    activePaths: [["sirui", "chaojie"]],
    metrics: {
      sirui: { turnoverRate: "1.2%", marginChange: "+0.4%", qaDensity: "2 条" },
      chaojie: { turnoverRate: "1.1%", marginChange: "+0.3%", qaDensity: "1 条" }
    }
  }
];

export const caseStudy = {
  id: "starship-fifth-flight",
  title: "2024 年星舰第五飞",
  nodes,
  frames
};
```

- [ ] **Step 6: 立刻补齐剩余 6 个节点和 4 帧，避免后续任务在假数据上继续展开**

```ts
nodes.push(
  { id: "chenguang", name: "航天晨光", layerId: "support", chainPosition: "结构支撑", mapping: "燃料输送软管与地面系统", x: 68, y: 46, size: 0.82, connections: ["chaojie", "zs"] },
  { id: "blt", name: "铂力特", layerId: "support", chainPosition: "结构支撑", mapping: "3D 打印发动机部件", x: 38, y: 42, size: 0.8, connections: ["sirui", "xb"] },
  { id: "baogang", name: "宝钢股份", layerId: "edge", chainPosition: "认知阻尼", mapping: "不锈钢材料", x: 72, y: 62, size: 0.7, connections: ["chenguang"] },
  { id: "zs", name: "再升科技", layerId: "edge", chainPosition: "边缘节点", mapping: "超细玻璃纤维保温材料", x: 56, y: 72, size: 0.68, connections: ["chenguang"] },
  { id: "xb", name: "西部材料", layerId: "edge", chainPosition: "边缘节点", mapping: "铌合金热端部件", x: 28, y: 66, size: 0.66, connections: ["blt"] },
  { id: "paike", name: "派克新材", layerId: "edge", chainPosition: "边缘节点", mapping: "航天锻件", x: 43, y: 80, size: 0.64, connections: ["zs"] }
);
```

- [ ] **Step 7: 运行数据测试确认骨架可用**

Run: `pnpm test src/features/attention-landscape/data/caseStudy.test.ts`

Expected: `3 passed`

## Task 2: 实现播放控制器与关键状态流转

**Files:**
- Create: `src/features/attention-landscape/hooks/usePlaybackController.ts`
- Create: `src/features/attention-landscape/hooks/usePlaybackController.test.tsx`
- Modify: `src/features/attention-landscape/data/caseStudy.ts`

- [ ] **Step 1: 先写播放控制器的失败测试**

```tsx
import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { usePlaybackController } from "./usePlaybackController";

describe("usePlaybackController", () => {
  it("boots into frame 1 after 2 seconds", () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => usePlaybackController(5));
    expect(result.current.isBooting).toBe(true);
    act(() => vi.advanceTimersByTime(2000));
    expect(result.current.currentFrame).toBe(0);
    expect(result.current.isBooting).toBe(false);
  });

  it("stops auto play on the last frame", () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => usePlaybackController(5));
    act(() => vi.advanceTimersByTime(2000));
    act(() => result.current.jumpToFrame(4));
    act(() => vi.advanceTimersByTime(5000));
    expect(result.current.currentFrame).toBe(4);
    expect(result.current.isPlaying).toBe(false);
  });
});
```

- [ ] **Step 2: 写最小播放控制器实现**

```ts
import { useEffect, useMemo, useState } from "react";

const BOOT_DELAY_MS = 2000;
const FRAME_INTERVAL_MS = 3600;

export function usePlaybackController(totalFrames: number) {
  const [isBooting, setIsBooting] = useState(true);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [transitionToken, setTransitionToken] = useState(0);

  useEffect(() => {
    const bootTimer = window.setTimeout(() => setIsBooting(false), BOOT_DELAY_MS);
    return () => window.clearTimeout(bootTimer);
  }, []);

  useEffect(() => {
    if (isBooting || !isPlaying) return;
    if (currentFrame >= totalFrames - 1) {
      setIsPlaying(false);
      return;
    }
    const frameTimer = window.setTimeout(() => {
      setCurrentFrame((value) => value + 1);
      setTransitionToken((value) => value + 1);
    }, FRAME_INTERVAL_MS);
    return () => window.clearTimeout(frameTimer);
  }, [currentFrame, isBooting, isPlaying, totalFrames]);

  const api = useMemo(
    () => ({
      isBooting,
      currentFrame,
      isPlaying,
      selectedNodeId,
      transitionToken,
      togglePlayback: () => setIsPlaying((value) => (currentFrame >= totalFrames - 1 ? true : !value)),
      jumpToFrame: (nextFrame: number) => {
        setCurrentFrame(nextFrame);
        setTransitionToken((value) => value + 1);
      },
      selectNode: (nodeId: string | null) => setSelectedNodeId(nodeId)
    }),
    [currentFrame, isBooting, isPlaying, selectedNodeId, totalFrames, transitionToken]
  );

  return api;
}
```

- [ ] **Step 3: 修正“最后一帧点击播放应重置回第一帧”的行为测试**

```tsx
it("restarts from frame 1 when play is pressed on the last frame", () => {
  vi.useFakeTimers();
  const { result } = renderHook(() => usePlaybackController(5));
  act(() => vi.advanceTimersByTime(2000));
  act(() => result.current.jumpToFrame(4));
  act(() => result.current.togglePlayback());
  expect(result.current.currentFrame).toBe(0);
  expect(result.current.isPlaying).toBe(true);
});
```

- [ ] **Step 4: 在实现中补上重启逻辑与帧索引边界保护**

```ts
togglePlayback: () => {
  if (currentFrame >= totalFrames - 1) {
    setCurrentFrame(0);
    setTransitionToken((value) => value + 1);
    setIsPlaying(true);
    return;
  }
  setIsPlaying((value) => !value);
},
jumpToFrame: (nextFrame: number) => {
  const safeFrame = Math.max(0, Math.min(nextFrame, totalFrames - 1));
  setCurrentFrame(safeFrame);
  setTransitionToken((value) => value + 1);
}
```

- [ ] **Step 5: 跑控制器测试确认时序正确**

Run: `pnpm test src/features/attention-landscape/hooks/usePlaybackController.test.tsx`

Expected: `3 passed`

## Task 3: 搭建页面骨架与外围信息组件

**Files:**
- Create: `src/features/attention-landscape/components/SceneStage.tsx`
- Create: `src/features/attention-landscape/components/RadarNarration.tsx`
- Create: `src/features/attention-landscape/components/FrameSidebar.tsx`
- Create: `src/features/attention-landscape/components/TimelineRail.tsx`
- Create: `src/features/attention-landscape/components/LayerMeter.tsx`
- Create: `src/features/attention-landscape/index.ts`
- Modify: `src/App.tsx`
- Modify: `src/index.css`

- [ ] **Step 1: 先写场景装配组件的交互测试**

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { SceneStage } from "./SceneStage";
import { caseStudy } from "../data/caseStudy";

describe("SceneStage", () => {
  it("switches the sidebar headline when a frame button is clicked", async () => {
    const user = userEvent.setup();
    render(<SceneStage caseStudy={caseStudy} />);
    await user.click(screen.getByRole("button", { name: "帧 3" }));
    expect(screen.getByText("帧③ 语义渗透")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: 写 `SceneStage` 骨架，把数据层和播放层先串起来**

```tsx
import { caseStudy as defaultCaseStudy } from "../data/caseStudy";
import { usePlaybackController } from "../hooks/usePlaybackController";
import { FrameSidebar } from "./FrameSidebar";
import { LayerMeter } from "./LayerMeter";
import { RadarNarration } from "./RadarNarration";
import { TerrainMap } from "./TerrainMap";
import { TimelineRail } from "./TimelineRail";

export function SceneStage({ caseStudy = defaultCaseStudy }) {
  const controller = usePlaybackController(caseStudy.frames.length);
  const frame = caseStudy.frames[controller.currentFrame];

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050505] text-white">
      <RadarNarration narration={frame.narration} frameTitle={frame.title} />
      <TerrainMap caseStudy={caseStudy} frame={frame} controller={controller} />
      <div className="pointer-events-none absolute right-8 top-20 z-20">
        <FrameSidebar sidebar={frame.sidebar} frameIndex={frame.index} />
      </div>
      <div className="absolute inset-x-0 bottom-8 z-20 mx-auto flex w-[min(1200px,92vw)] items-end justify-between gap-6">
        <TimelineRail frames={caseStudy.frames} currentFrame={controller.currentFrame} isPlaying={controller.isPlaying} onTogglePlay={controller.togglePlayback} onFrameSelect={controller.jumpToFrame} />
        <LayerMeter weights={frame.layerWeights} />
      </div>
    </main>
  );
}
```

- [ ] **Step 3: 写右侧侧栏和顶部扫描栏的最小实现**

```tsx
export function RadarNarration({ narration, frameTitle }: { narration: string; frameTitle: string }) {
  return (
    <div className="absolute inset-x-8 top-6 z-20 rounded-full border border-white/10 bg-white/5 px-5 py-3 backdrop-blur-md">
      <div className="mb-2 h-px w-full overflow-hidden bg-white/10">
        <div className="h-full w-24 animate-[scan_3.2s_linear_infinite] bg-cyan-300/70" />
      </div>
      <p className="text-sm text-slate-200">[雷达扫描] {frameTitle} - {narration}</p>
    </div>
  );
}

export function FrameSidebar({ sidebar, frameIndex }: { sidebar: AttentionFrame["sidebar"]; frameIndex: number }) {
  return (
    <aside className="w-[320px] rounded-[28px] border border-white/10 bg-white/8 p-4 backdrop-blur-xl">
      <p className="mb-3 text-sm text-cyan-200">帧{["①","②","③","④","⑤"][frameIndex - 1]} {sidebar.headline}</p>
      <div className="space-y-3">
        <section className="rounded-2xl bg-white/6 p-4 text-sm">{sidebar.eventVisual}</section>
        <section className="rounded-2xl bg-white/6 p-4 text-sm">{sidebar.marketVisual}</section>
        <section className="rounded-2xl bg-white/6 p-4 text-sm">{sidebar.chainVisual}</section>
      </div>
      <p className="mt-4 text-sm leading-6 text-slate-200">{sidebar.summary}</p>
    </aside>
  );
}
```

- [ ] **Step 4: 写时间轴和海拔注意力仪的最小实现**

```tsx
export function TimelineRail({ frames, currentFrame, isPlaying, onTogglePlay, onFrameSelect }: TimelineRailProps) {
  return (
    <div className="flex flex-1 items-center gap-4 rounded-full border border-white/10 bg-black/35 px-5 py-4 backdrop-blur-lg">
      <button type="button" onClick={onTogglePlay} className="rounded-full border border-white/10 px-4 py-2 text-sm">
        {isPlaying ? "暂停" : "播放"}
      </button>
      <div className="relative flex flex-1 items-center justify-between">
        {frames.map((frame, index) => (
          <button key={frame.id} type="button" aria-label={`帧 ${frame.index}`} onClick={() => onFrameSelect(index)} className={index === currentFrame ? "text-orange-300" : "text-slate-400"}>
            {["①", "②", "③", "④", "⑤"][index]}
          </button>
        ))}
      </div>
    </div>
  );
}

export function LayerMeter({ weights }: { weights: Record<AttentionLayerId, number> }) {
  return (
    <div className="w-[280px] rounded-[24px] border border-white/10 bg-black/35 p-4 backdrop-blur-lg">
      <p className="mb-2 text-sm text-slate-200">注意力海拔仪</p>
      {(["core", "support", "edge"] as const).map((layerId) => (
        <div key={layerId} className="mb-2">
          <div className="mb-1 flex items-center justify-between text-xs text-slate-300">
            <span>{layerId}</span>
            <span>{weights[layerId]}%</span>
          </div>
          <div className="h-2 rounded-full bg-white/10">
            <div className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-orange-300" style={{ width: `${weights[layerId]}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 5: 用新场景替换旧 `App.tsx` 和基础样式**

```tsx
import { SceneStage } from "./features/attention-landscape";

function App() {
  return <SceneStage />;
}

export default App;
```

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  color: #f8fafc;
  background: #050505;
  font-family: Inter, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body, #root {
  min-height: 100vh;
  margin: 0;
}

@keyframes scan {
  0% { transform: translateX(-120%); }
  100% { transform: translateX(520%); }
}
```

- [ ] **Step 6: 运行场景交互测试**

Run: `pnpm test src/features/attention-landscape/components/SceneStage.test.tsx`

Expected: `1 passed`

## Task 4: 实现主场景、节点交互与脉冲转场

**Files:**
- Create: `src/features/attention-landscape/components/TerrainMap.tsx`
- Create: `src/features/attention-landscape/components/EnterpriseNode.tsx`
- Create: `src/features/attention-landscape/components/AttentionPulse.tsx`
- Create: `src/features/attention-landscape/components/NodeTooltip.tsx`
- Create: `src/features/attention-landscape/utils/visuals.ts`
- Modify: `src/features/attention-landscape/components/SceneStage.tsx`

- [ ] **Step 1: 先写主场景里节点弹层开关的失败测试**

```tsx
it("opens node details when a company node is clicked", async () => {
  const user = userEvent.setup();
  render(<SceneStage caseStudy={caseStudy} />);
  await user.click(screen.getByRole("button", { name: "斯瑞新材" }));
  expect(screen.getByText("液氧甲烷发动机推力室内壁")).toBeInTheDocument();
});
```

- [ ] **Step 2: 写热度到光柱样式的纯函数，避免样式计算散落在组件内**

```ts
export function getHeatVisual(heat: number) {
  const height = 50 + heat * 1.8;
  const hue = heat > 72 ? "#ff784a" : heat > 38 ? "#ffb36b" : "#6fd3ff";
  const opacity = Math.min(0.95, 0.28 + heat / 120);
  return { height, hue, opacity };
}
```

- [ ] **Step 3: 写单节点和浮层组件**

```tsx
export function EnterpriseNode({ node, heat, isSelected, onSelect }: EnterpriseNodeProps) {
  const visual = getHeatVisual(heat);
  return (
    <foreignObject x={`${node.x - 8}%`} y={`${node.y - 18}%`} width="120" height="170">
      <button type="button" aria-label={node.name} onClick={() => onSelect(isSelected ? null : node.id)} className="group relative h-full w-full bg-transparent text-left">
        <div className="absolute bottom-10 left-1/2 w-[10px] -translate-x-1/2 rounded-full blur-sm" style={{ height: visual.height, background: visual.hue, opacity: visual.opacity }} />
        <div className="absolute bottom-6 left-1/2 h-4 w-4 -translate-x-1/2 rounded-full border border-white/40 bg-black/70 shadow-[0_0_24px_rgba(82,222,255,0.45)]" />
        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs text-white/90">{node.name}</span>
      </button>
    </foreignObject>
  );
}

export function NodeTooltip({ node, metric }: NodeTooltipProps) {
  return (
    <div className="absolute min-w-[260px] rounded-2xl border border-white/10 bg-slate-950/80 p-4 backdrop-blur-xl">
      <p className="text-sm text-cyan-200">{node.name}</p>
      <p className="mt-2 text-sm text-slate-300">{node.mapping}</p>
      <div className="mt-3 grid grid-cols-3 gap-2 text-xs text-slate-200">
        <div><span>换手率</span><strong>{metric.turnoverRate}</strong></div>
        <div><span>融资增幅</span><strong>{metric.marginChange}</strong></div>
        <div><span>问答密度</span><strong>{metric.qaDensity}</strong></div>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: 写脉冲波和主地貌 SVG**

```tsx
export function AttentionPulse({ trigger }: { trigger: number }) {
  return (
    <circle
      key={trigger}
      cx="50%"
      cy="24%"
      r="24"
      fill="none"
      stroke="rgba(125,229,255,0.72)"
      strokeWidth="2"
      className="animate-[pulse-ring_1.4s_ease-out]"
    />
  );
}

export function TerrainMap({ caseStudy, frame, controller }: TerrainMapProps) {
  const selectedNode = caseStudy.nodes.find((node) => node.id === controller.selectedNodeId) ?? null;
  return (
    <section className="relative min-h-screen" onClick={() => controller.selectNode(null)}>
      <svg viewBox="0 0 1200 800" className="h-screen w-full">
        <defs>
          <radialGradient id="terrainGlow" cx="50%" cy="28%">
            <stop offset="0%" stopColor="rgba(125,229,255,0.18)" />
            <stop offset="100%" stopColor="rgba(7,10,18,0)" />
          </radialGradient>
        </defs>
        <rect width="1200" height="800" fill="url(#terrainGlow)" />
        <circle cx="600" cy="200" r="110" stroke="rgba(255,255,255,0.16)" fill="none" />
        <circle cx="600" cy="200" r="210" stroke="rgba(255,255,255,0.1)" fill="none" />
        <circle cx="600" cy="200" r="330" stroke="rgba(255,255,255,0.06)" fill="none" />
        <AttentionPulse trigger={controller.transitionToken} />
        {caseStudy.nodes.map((node) => (
          <EnterpriseNode key={node.id} node={node} heat={frame.nodeHeat[node.id]} isSelected={controller.selectedNodeId === node.id} onSelect={controller.selectNode} />
        ))}
      </svg>
      {selectedNode ? <NodeTooltip node={selectedNode} metric={frame.metrics[selectedNode.id]} /> : null}
    </section>
  );
}
```

- [ ] **Step 5: 在全局样式里补齐脉冲和光柱动画**

```css
@keyframes pulse-ring {
  0% {
    opacity: 0.9;
    transform: scale(0.2);
  }
  100% {
    opacity: 0;
    transform: scale(8);
  }
}

@keyframes tower-breathe {
  0%, 100% { opacity: 0.55; }
  50% { opacity: 0.95; }
}
```

- [ ] **Step 6: 再跑节点交互测试**

Run: `pnpm test src/features/attention-landscape/components/SceneStage.test.tsx`

Expected: `2 passed`

## Task 5: 清理旧系统并完成整体验证

**Files:**
- Delete: `src/components/ChainFlow.tsx`
- Delete: `src/components/Empty.tsx`
- Delete: `src/components/EnterpriseMap.tsx`
- Delete: `src/components/EventCard.tsx`
- Delete: `src/components/Layout.tsx`
- Delete: `src/components/SectorChart.tsx`
- Delete: `src/components/StockChart.tsx`
- Delete: `src/data/events.ts`
- Delete: `src/hooks/useStockData.ts`
- Delete: `src/pages/Home.tsx`
- Delete: `src/types/index.ts`
- Delete: `src/utils/calculations.ts`
- Modify: `src/features/attention-landscape/data/caseStudy.ts`
- Modify: `src/features/attention-landscape/components/FrameSidebar.tsx`
- Modify: `src/features/attention-landscape/components/TimelineRail.tsx`
- Modify: `src/features/attention-landscape/components/LayerMeter.tsx`
- Modify: `src/features/attention-landscape/components/TerrainMap.tsx`

- [ ] **Step 1: 删除旧仪表盘文件，确保入口不再依赖旧数据与旧图表**

```txt
删除列表：
- src/components/ChainFlow.tsx
- src/components/Empty.tsx
- src/components/EnterpriseMap.tsx
- src/components/EventCard.tsx
- src/components/Layout.tsx
- src/components/SectorChart.tsx
- src/components/StockChart.tsx
- src/data/events.ts
- src/hooks/useStockData.ts
- src/pages/Home.tsx
- src/types/index.ts
- src/utils/calculations.ts
```

- [ ] **Step 2: 回到数据文件，补齐所有帧的侧栏文案、节点热度和路径，让 UI 不再依赖占位文本**

```ts
{
  id: "frame-3",
  index: 3,
  title: "语义渗透",
  timeWindow: "T+3 ~ T+7",
  narration: "互动易中的技术关键词扩散到结构支撑层，山腰开始升温。",
  sidebar: {
    headline: "帧③ 语义渗透",
    eventVisual: "技术讨论从回收动作延伸到发动机与地面系统",
    marketVisual: "互动易问答与主题讨论明显增加",
    chainVisual: "注意力从核心映射层向中游支撑层扩散",
    summary: "结构支撑层的节点开始被市场赋予更明确的技术角色。"
  },
  layerWeights: { core: 46, support: 34, edge: 20 }
}
```

- [ ] **Step 3: 打磨 UI 文案与标签，把 `core/support/edge` 替换成高地/山坡/平原等中文展示名**

```ts
export const layerLabels: Record<AttentionLayerId, string> = {
  core: "高地",
  support: "山坡",
  edge: "平原"
};
```

- [ ] **Step 4: 运行完整测试、类型检查、构建和 lint**

Run: `pnpm test`
Expected: all tests pass

Run: `pnpm check`
Expected: no TypeScript errors

Run: `pnpm build`
Expected: build succeeds and outputs `dist/`

Run: `pnpm lint`
Expected: no new lint errors

- [ ] **Step 5: 手动验收演示流**

```txt
手动检查：
1. 首屏进入后先出现冷色静态地貌
2. 约 2 秒后自动切入帧 1
3. 时间轴可切到帧 3/4/5，右侧侧栏同步变化
4. 点击斯瑞新材、超捷股份、铂力特时浮层能贴近节点出现
5. 播放到最后一帧后停留，再点播放会回到帧 1
```

## 自检

- 覆盖规格：计划已经对应数据模型、5 帧播放、顶部扫描栏、右侧信息侧栏、底部光轨、海拔注意力仪、节点浮层、删除旧仪表盘等全部核心要求
- 无占位词：未使用 `TODO`、`TBD`、`适当处理` 一类空泛表述
- 类型一致：`AttentionLayerId`、`AttentionFrame`、`selectedNodeId`、`transitionToken` 等命名在各任务中保持一致
- 风险说明：测试基线先行，避免在视觉组件完成后才发现数据结构或播放时序不成立
