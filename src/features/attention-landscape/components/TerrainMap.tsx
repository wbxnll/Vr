import { useMemo, useRef, useState } from "react";

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

const orbitGeometry = {
  core: { radius: 22, label: "上游", offset: -86 },
  support: { radius: 34, label: "中游", offset: -34 },
  edge: { radius: 46, label: "下游", offset: 12 },
} as const;

type OrbitPosition = {
  x: number;
  y: number;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function TerrainMap({
  caseStudy,
  frame,
  controller,
  isBooting,
}: TerrainMapProps) {
  const [viewpoint, setViewpoint] = useState({ tilt: 62, rotation: -18 });
  const dragStartRef = useRef<{
    x: number;
    y: number;
    tilt: number;
    rotation: number;
  } | null>(null);
  const selectedNode =
    caseStudy.nodes.find((node) => node.id === controller.selectedNodeId) ??
    null;
  const orbitPositions = useMemo(() => {
    const groups = caseStudy.nodes.reduce<Record<string, string[]>>(
      (result, node) => {
        result[node.layerId] = [...(result[node.layerId] ?? []), node.id];
        return result;
      },
      {}
    );

    return caseStudy.nodes.reduce<Record<string, OrbitPosition>>((result, node) => {
      const group = groups[node.layerId] ?? [];
      const nodeIndex = group.indexOf(node.id);
      const geometry = orbitGeometry[node.layerId];
      const angle =
        geometry.offset + (360 / Math.max(group.length, 1)) * nodeIndex;
      const radians = (angle * Math.PI) / 180;

      result[node.id] = {
        x: 50 + Math.cos(radians) * geometry.radius,
        y: 50 + Math.sin(radians) * geometry.radius,
      };

      return result;
    }, {});
  }, [caseStudy.nodes]);
  const nodeById = new Map(caseStudy.nodes.map((node) => [node.id, node]));
  const startDrag = (clientX: number, clientY: number) => {
    dragStartRef.current = {
      x: clientX,
      y: clientY,
      tilt: viewpoint.tilt,
      rotation: viewpoint.rotation,
    };
  };
  const moveDrag = (clientX: number, clientY: number) => {
    const dragStart = dragStartRef.current;

    if (!dragStart) {
      return;
    }

    setViewpoint({
      tilt: clamp(dragStart.tilt + (clientY - dragStart.y) * 0.3, 44, 76),
      rotation: clamp(
        dragStart.rotation + (clientX - dragStart.x) * 0.3,
        -54,
        54
      ),
    });
  };
  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    startDrag(event.clientX, event.clientY);
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };
  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    moveDrag(event.clientX, event.clientY);
  };
  const handlePointerEnd = (event: React.PointerEvent<HTMLDivElement>) => {
    dragStartRef.current = null;

    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };
  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    startDrag(event.clientX, event.clientY);
  };
  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    moveDrag(event.clientX, event.clientY);
  };
  const handleMouseEnd = () => {
    dragStartRef.current = null;
  };

  return (
    <section
      className="relative min-h-screen overflow-hidden"
      onClick={() => controller.selectNode(null)}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(126,208,255,0.14),transparent_30%),radial-gradient(circle_at_50%_42%,rgba(255,112,67,0.2),transparent_24%),linear-gradient(180deg,#080b11_0%,#050505_100%)]" />
      <div className="absolute inset-0 opacity-[0.13] [background-image:linear-gradient(rgba(103,232,249,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(103,232,249,0.2)_1px,transparent_1px)] [background-size:64px_64px]" />
      <div className="absolute inset-x-[10%] bottom-24 h-32 rounded-[50%] bg-cyan-100/5 blur-3xl" />
      {isBooting ? null : <AttentionPulse trigger={controller.transitionToken} />}
      <div className="absolute left-1/2 top-[54%] h-[min(76vw,780px)] w-[min(76vw,780px)] -translate-x-1/2 -translate-y-1/2 [perspective:1100px]">
        <div
          data-testid="orbital-viewport"
          className="absolute inset-0 cursor-grab select-none rounded-full transition-transform duration-150 active:cursor-grabbing [transform-style:preserve-3d]"
          style={{
            transform: `rotateX(${viewpoint.tilt}deg) rotateZ(${viewpoint.rotation}deg)`,
          }}
          onClick={(event) => event.stopPropagation()}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerEnd}
          onPointerCancel={handlePointerEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseEnd}
          onMouseLeave={handleMouseEnd}
        >
          <div className="absolute inset-[7%] rounded-full border border-cyan-100/8 bg-[radial-gradient(circle_at_center,rgba(251,146,60,0.12),transparent_54%)] shadow-[inset_0_0_80px_rgba(103,232,249,0.08)]" />
          {caseStudy.layers.map((layer) => {
            const geometry = orbitGeometry[layer.id];
            const diameter = geometry.radius * 2;

            return (
              <div
                key={layer.id}
                data-testid={`attention-orbit-${layer.id}`}
                className="absolute rounded-full border shadow-[0_0_32px_rgba(103,232,249,0.12)]"
                style={{
                  borderColor: `${layer.themeColor}55`,
                  height: `${diameter}%`,
                  left: `${50 - geometry.radius}%`,
                  top: `${50 - geometry.radius}%`,
                  width: `${diameter}%`,
                }}
              >
                <span className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rounded bg-black/70 px-2 py-1 text-[10px] text-cyan-50 shadow-[0_0_14px_rgba(0,0,0,0.55)]">
                  {geometry.label}
                </span>
              </div>
            );
          })}
          <svg
            className="pointer-events-none absolute inset-0 z-[2] h-full w-full"
            aria-hidden="true"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <defs>
              <filter id="path-glow">
                <feGaussianBlur stdDeviation="1.4" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <linearGradient id="light-path-gradient" x1="0%" x2="100%">
                <stop offset="0%" stopColor="#67e8f9" stopOpacity="0.2" />
                <stop offset="48%" stopColor="#a7f3d0" stopOpacity="0.82" />
                <stop offset="100%" stopColor="#fed7aa" stopOpacity="0.72" />
              </linearGradient>
            </defs>
            {(isBooting ? [] : frame.activePaths).map(([fromId, toId]) => {
              const from = nodeById.get(fromId);
              const to = nodeById.get(toId);
              const fromPosition = orbitPositions[fromId];
              const toPosition = orbitPositions[toId];

              if (!from || !to || !fromPosition || !toPosition) {
                return null;
              }

              return (
                <line
                  key={`${fromId}-${toId}`}
                  data-testid="active-light-path"
                  x1={fromPosition.x}
                  y1={fromPosition.y}
                  x2={toPosition.x}
                  y2={toPosition.y}
                  stroke="url(#light-path-gradient)"
                  strokeWidth="0.55"
                  strokeLinecap="round"
                  filter="url(#path-glow)"
                  className="animate-[path-breathe_1.8s_ease-in-out_infinite]"
                />
              );
            })}
          </svg>
          {caseStudy.nodes.map((node) => (
            <EnterpriseNode
              key={node.id}
              node={node}
              position={orbitPositions[node.id] ?? { x: 50, y: 50 }}
              heat={isBooting ? 0 : frame.nodeHeat[node.id] ?? 0}
              isSelected={controller.selectedNodeId === node.id}
              onSelect={controller.selectNode}
            />
          ))}
        </div>
      </div>
      <div
        data-testid="central-event-planet"
        className="pointer-events-none absolute left-1/2 top-[54%] z-[12] flex h-40 w-40 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border border-orange-100/45 bg-[radial-gradient(circle_at_34%_28%,#fff3c4_0%,#fb923c_22%,#dc2626_54%,#450a0a_100%)] text-center shadow-[0_0_60px_rgba(248,113,113,0.58),inset_-24px_-32px_48px_rgba(69,10,10,0.72)]"
      >
        <span className="text-[10px] uppercase tracking-[0.2em] text-orange-100/80">
          Event Core
        </span>
        <span className="mt-1 max-w-28 text-xs font-semibold leading-tight text-white">
          {caseStudy.event.signalLabel}
        </span>
      </div>
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
