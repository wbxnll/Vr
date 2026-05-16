import type { AttentionCaseStudy, AttentionFrame } from "../types";
import type { usePlaybackController } from "../hooks/usePlaybackController";
import { AttentionPulse } from "./AttentionPulse";
import { EnterpriseNode } from "./EnterpriseNode";
import { NodeTooltip } from "./NodeTooltip";

type PlaybackController = ReturnType<typeof usePlaybackController>;

interface TerrainMapProps {
  caseStudy: AttentionCaseStudy;
  frame: AttentionFrame;
  controller: PlaybackController;
  isBooting: boolean;
}

export function TerrainMap({
  caseStudy,
  frame,
  controller,
  isBooting,
}: TerrainMapProps) {
  const selectedNode =
    caseStudy.nodes.find((node) => node.id === controller.selectedNodeId) ??
    null;
  const nodeById = new Map(caseStudy.nodes.map((node) => [node.id, node]));

  return (
    <section
      className="relative min-h-screen overflow-hidden"
      onClick={() => controller.selectNode(null)}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(126,208,255,0.13),transparent_28%),radial-gradient(circle_at_50%_34%,rgba(255,150,99,0.16),transparent_22%),linear-gradient(180deg,#07090f_0%,#050505_100%)]" />
      <div className="absolute inset-0 opacity-[0.13] [background-image:linear-gradient(rgba(103,232,249,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(103,232,249,0.2)_1px,transparent_1px)] [background-size:64px_64px]" />
      <div className="absolute inset-x-[8%] top-[12%] h-[520px] rounded-[50%] border border-cyan-200/8 bg-[radial-gradient(ellipse_at_center,rgba(251,146,60,0.08),transparent_58%)]" />
      <div className="absolute inset-x-[12%] top-[16%] h-[420px] rounded-[50%] border border-cyan-200/12" />
      <div className="absolute inset-x-[18%] top-[22%] h-[300px] rounded-[50%] border border-orange-200/12" />
      <div className="absolute inset-x-[25%] top-[28%] h-[190px] rounded-[50%] border border-white/12" />
      {isBooting ? null : <AttentionPulse trigger={controller.transitionToken} />}
      <div className="absolute left-1/2 top-[18%] h-40 w-1 -translate-x-1/2 bg-gradient-to-b from-cyan-100 via-orange-300/50 to-transparent shadow-[0_0_26px_rgba(103,232,249,0.45)]" />
      <div className="absolute left-1/2 top-[14%] -translate-x-1/2 border border-cyan-200/30 bg-slate-950/70 px-4 py-2 text-xs text-cyan-100 shadow-[0_0_24px_rgba(103,232,249,0.2)] backdrop-blur-md">
        {caseStudy.event.signalLabel}
      </div>
      <svg
        className="pointer-events-none absolute inset-0 z-[2] h-full w-full"
        aria-hidden="true"
      >
        <defs>
          <filter id="path-glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {(isBooting ? [] : frame.activePaths).map(([fromId, toId]) => {
          const from = nodeById.get(fromId);
          const to = nodeById.get(toId);

          if (!from || !to) {
            return null;
          }

          return (
            <line
              key={`${fromId}-${toId}`}
              data-testid="active-light-path"
              x1={`${from.x}%`}
              y1={`${from.y}%`}
              x2={`${to.x}%`}
              y2={`${to.y}%`}
              stroke="url(#light-path-gradient)"
              strokeWidth="2.5"
              strokeLinecap="round"
              filter="url(#path-glow)"
              className="animate-[path-breathe_1.8s_ease-in-out_infinite]"
            />
          );
        })}
        <defs>
          <linearGradient id="light-path-gradient" x1="0%" x2="100%">
            <stop offset="0%" stopColor="#67e8f9" stopOpacity="0.2" />
            <stop offset="48%" stopColor="#a7f3d0" stopOpacity="0.82" />
            <stop offset="100%" stopColor="#fed7aa" stopOpacity="0.72" />
          </linearGradient>
        </defs>
      </svg>
      {caseStudy.nodes.map((node) => (
        <EnterpriseNode
          key={node.id}
          node={node}
          heat={isBooting ? 0 : frame.nodeHeat[node.id] ?? 0}
          isSelected={controller.selectedNodeId === node.id}
          onSelect={controller.selectNode}
        />
      ))}
      {selectedNode ? (
        <NodeTooltip
          node={selectedNode}
          metric={frame.metrics[selectedNode.id]}
        />
      ) : null}
      <div className="absolute bottom-44 left-6 rounded-lg border border-cyan-200/15 bg-slate-950/55 px-4 py-3 text-sm text-slate-300 backdrop-blur-md sm:bottom-20 sm:left-10">
        当前帧：{isBooting ? "待机" : frame.title}
      </div>
    </section>
  );
}
