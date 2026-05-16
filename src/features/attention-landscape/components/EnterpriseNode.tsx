import type { AttentionNode } from "../types";
import { getHeatVisual } from "../utils/visuals";

interface EnterpriseNodeProps {
  node: AttentionNode;
  heat: number;
  isSelected: boolean;
  onSelect: (nodeId: string | null) => void;
}

export function EnterpriseNode({
  node,
  heat,
  isSelected,
  onSelect,
}: EnterpriseNodeProps) {
  const visual = getHeatVisual(heat);
  const buildingSize = 12 + node.size * 12;
  const pulseDuration = `${2.5 - Math.min(heat, 90) / 70}s`;

  return (
    <button
      type="button"
      aria-label={node.name}
      onClick={(event) => {
        event.stopPropagation();
        onSelect(isSelected ? null : node.id);
      }}
      className="absolute z-10 h-44 w-28 -translate-x-1/2 -translate-y-full bg-transparent"
      style={{
        left: `${node.x}%`,
        top: `${node.y}%`,
      }}
    >
      <span
        className="absolute bottom-10 left-1/2 w-[12px] -translate-x-1/2 blur-[8px] transition-all duration-500 animate-[column-breathe_2s_ease-in-out_infinite]"
        style={{
          height: `${visual.height}px`,
          background: visual.glowColor,
          opacity: visual.opacity,
          boxShadow: `0 0 28px ${visual.glowColor}`,
          animationDuration: pulseDuration,
        }}
      />
      <span
        className="absolute bottom-10 left-1/2 w-[2px] -translate-x-1/2 bg-white/70 transition-all duration-500"
        style={{
          height: `${Math.max(20, visual.height * 0.72)}px`,
          opacity: Math.max(0.18, visual.opacity - 0.22),
          boxShadow: `0 0 18px ${visual.glowColor}`,
        }}
      />
      <span
        className={`absolute bottom-6 left-1/2 -translate-x-1/2 rounded-sm border transition ${
          isSelected
            ? "border-orange-200 bg-orange-200/80 shadow-[0_0_20px_rgba(251,146,60,0.45)]"
            : "border-cyan-100/40 bg-slate-950/80"
        }`}
        style={{
          height: `${buildingSize}px`,
          width: `${buildingSize}px`,
        }}
      />
      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-medium text-white/90 drop-shadow-[0_0_8px_rgba(0,0,0,0.9)]">
        {node.name}
      </span>
    </button>
  );
}
