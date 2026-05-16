import type { AttentionLayerId } from "../types";

interface LayerMeterProps {
  weights: Record<AttentionLayerId, number>;
}

const labels: Record<AttentionLayerId, string> = {
  core: "高地",
  support: "山坡",
  edge: "平原",
};

export function LayerMeter({ weights }: LayerMeterProps) {
  return (
    <div className="w-full rounded-lg border border-cyan-200/15 bg-slate-950/65 p-4 shadow-[0_18px_50px_rgba(0,0,0,0.35)] backdrop-blur-lg sm:w-[280px]">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-medium text-slate-100">海拔权重</p>
        <span className="text-[10px] uppercase tracking-[0.18em] text-cyan-200/60">
          live
        </span>
      </div>
      {(["core", "support", "edge"] as const).map((layerId) => (
        <div key={layerId} className="mb-3 last:mb-0">
          <div className="mb-1 flex items-center justify-between text-xs text-slate-300">
            <span>{labels[layerId]}</span>
            <span>{weights[layerId]}%</span>
          </div>
          <div className="h-2 bg-white/10">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 via-slate-200 to-orange-300 shadow-[0_0_16px_rgba(103,232,249,0.22)] transition-all duration-500"
              style={{ width: `${weights[layerId]}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
