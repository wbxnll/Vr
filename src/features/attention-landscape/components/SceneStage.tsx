import { caseStudy as defaultCaseStudy } from "../data/caseStudy";
import { usePlaybackController } from "../hooks/usePlaybackController";
import type { AttentionCaseStudy } from "../types";
import { FrameSidebar } from "./FrameSidebar";
import { LayerMeter } from "./LayerMeter";
import { RadarNarration } from "./RadarNarration";
import { TerrainMap } from "./TerrainMap";
import { TimelineRail } from "./TimelineRail";

interface SceneStageProps {
  caseStudy?: AttentionCaseStudy;
}

export function SceneStage({ caseStudy = defaultCaseStudy }: SceneStageProps) {
  const controller = usePlaybackController(caseStudy.frames.length);
  const frame = caseStudy.frames[controller.currentFrame];

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050505] text-white">
      <header className="absolute left-6 top-6 z-30 w-[min(320px,calc(100vw-48px))] rounded-lg border border-cyan-200/15 bg-slate-950/70 p-4 shadow-[0_18px_60px_rgba(0,0,0,0.45)] backdrop-blur-xl">
        <p className="text-[11px] uppercase tracking-[0.22em] text-cyan-200/70">
          Capital Flow Console
        </p>
        <h1 className="mt-2 text-xl font-semibold text-white">
          资本注意力指挥舱
        </h1>
        <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
          <div className="border border-white/10 bg-white/[0.04] p-2">
            <p className="text-slate-500">事件</p>
            <p className="mt-1 text-cyan-100">{caseStudy.event.title}</p>
          </div>
          <div className="border border-white/10 bg-white/[0.04] p-2">
            <p className="text-slate-500">窗口</p>
            <p className="mt-1 text-orange-100">{frame.timeWindow}</p>
          </div>
          <div className="border border-white/10 bg-white/[0.04] p-2">
            <p className="text-slate-500">帧</p>
            <p className="mt-1 text-white">{frame.index}/5</p>
          </div>
        </div>
      </header>
      <RadarNarration narration={frame.narration} frameTitle={frame.title} />
      <TerrainMap
        caseStudy={caseStudy}
        frame={frame}
        controller={controller}
        isBooting={controller.isBooting}
      />
      {controller.isBooting ? (
        <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center bg-black/25 backdrop-saturate-50">
          <div className="rounded-full border border-cyan-200/15 bg-black/45 px-5 py-3 text-sm tracking-[0.18em] text-cyan-100/85 backdrop-blur-md">
            待机扫描中
          </div>
        </div>
      ) : null}
      {!controller.isBooting ? (
        <div className="pointer-events-none absolute left-4 right-4 top-52 z-20 sm:left-auto sm:right-8 sm:top-28">
          <div className="pointer-events-auto">
            <FrameSidebar sidebar={frame.sidebar} />
          </div>
        </div>
      ) : null}
      <div className="absolute inset-x-0 bottom-6 z-20 mx-auto flex w-[min(1200px,92vw)] flex-col items-stretch justify-between gap-3 sm:bottom-8 sm:flex-row sm:items-end sm:gap-6">
        <TimelineRail
          frames={caseStudy.frames}
          currentFrame={controller.currentFrame}
          isPlaying={controller.isPlaying}
          onTogglePlay={controller.togglePlayback}
          onFrameSelect={controller.jumpToFrame}
        />
        <LayerMeter weights={frame.layerWeights} />
      </div>
    </main>
  );
}
