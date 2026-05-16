import type { AttentionNode } from "../types";
import { getHeatVisual } from "../utils/visuals";

interface EnterpriseNodeProps {
  node: AttentionNode;
  heat: number;
  isSelected: boolean;
  position: {
    x: number;
    y: number;
  };
  onSelect: (nodeId: string | null) => void;
}

export function EnterpriseNode({
  node,
  heat,
  isSelected,
  position,
  onSelect,
}: EnterpriseNodeProps) {
  const visual = getHeatVisual(heat);
  const buildingSize = 18 + node.size * 14;
  const pulseDuration = `${2.5 - Math.min(heat, 90) / 70}s`;

  return (
    <button
      type="button"
      aria-label={node.name}
      data-testid={`enterprise-node-${node.id}`}
      data-layer-id={node.layerId}
      onPointerDown={(event) => event.stopPropagation()}
      onMouseDown={(event) => event.stopPropagation()}
      onClick={(event) => {
        event.stopPropagation();
        onSelect(isSelected ? null : node.id);
      }}
      className="absolute z-10 h-40 w-28 -translate-x-1/2 -translate-y-1/2 bg-transparent [transform-style:preserve-3d]"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
      }}
    >
      <span
        className="absolute bottom-[52px] left-1/2 w-[18px] -translate-x-1/2 rounded-full blur-[10px] transition-all duration-500 animate-[column-breathe_2s_ease-in-out_infinite]"
        style={{
          height: `${visual.height}px`,
          background: visual.glowColor,
          opacity: visual.opacity,
          boxShadow: `0 0 28px ${visual.glowColor}`,
          animationDuration: pulseDuration,
        }}
      />
      <span
        className="absolute bottom-[52px] left-1/2 w-[3px] -translate-x-1/2 bg-white/70 transition-all duration-500"
        style={{
          height: `${Math.max(20, visual.height * 0.72)}px`,
          opacity: Math.max(0.18, visual.opacity - 0.22),
          boxShadow: `0 0 18px ${visual.glowColor}`,
        }}
      />
      <span
        className={`absolute bottom-8 left-1/2 -translate-x-1/2 rounded-[3px] border transition [transform:rotateX(58deg)_rotateZ(45deg)] ${
          isSelected
            ? "border-orange-100 bg-orange-200/90 shadow-[0_0_24px_rgba(251,146,60,0.6),inset_-8px_-8px_16px_rgba(124,45,18,0.5)]"
            : "border-cyan-100/45 bg-slate-950/85 shadow-[0_0_18px_rgba(103,232,249,0.2),inset_-8px_-8px_14px_rgba(8,47,73,0.62)]"
        }`}
        style={{
          height: `${buildingSize}px`,
          width: `${buildingSize}px`,
        }}
      />
      <span className="absolute bottom-1 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-black/45 px-1.5 py-0.5 text-xs font-medium text-white/90 drop-shadow-[0_0_8px_rgba(0,0,0,0.9)]">
        {node.name}
      </span>
    </button>
  );
}
