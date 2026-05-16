import type { AttentionMetric, AttentionNode } from "../types";

interface NodeTooltipProps {
  node: AttentionNode;
  metric: AttentionMetric;
}

export function NodeTooltip({ node, metric }: NodeTooltipProps) {
  return (
    <div
      className="absolute z-20 min-w-[290px] rounded-2xl border border-white/10 bg-slate-950/80 p-4 backdrop-blur-xl"
      style={{
        left: `min(calc(${node.x}% + 32px), calc(100% - 320px))`,
        top: `min(calc(${node.y}% - 120px), calc(100% - 180px))`,
      }}
    >
      <p className="text-sm text-cyan-200">{node.name}</p>
      <p className="mt-1 text-xs text-slate-400">{node.chainPosition}</p>
      <p className="mt-3 text-sm leading-6 text-slate-200">{node.mapping}</p>
      <div className="mt-4 grid grid-cols-3 gap-2 text-xs text-slate-200">
        <div className="rounded-xl bg-white/5 p-2">
          <div className="mb-1 text-slate-400">换手率</div>
          <strong>{metric.turnoverRate}</strong>
        </div>
        <div className="rounded-xl bg-white/5 p-2">
          <div className="mb-1 text-slate-400">融资增幅</div>
          <strong>{metric.marginChange}</strong>
        </div>
        <div className="rounded-xl bg-white/5 p-2">
          <div className="mb-1 text-slate-400">问答密度</div>
          <strong>{metric.qaDensity}</strong>
        </div>
      </div>
    </div>
  );
}
