import type { AttentionSidebarContent } from "../types";

interface FrameSidebarProps {
  sidebar: AttentionSidebarContent;
}

export function FrameSidebar({ sidebar }: FrameSidebarProps) {
  const panels = [
    ["现场画面", "VIDEO", sidebar.eventVisual],
    ["市场反应", "MARKET", sidebar.marketVisual],
    ["链路示意", "CHAIN", sidebar.chainVisual],
  ] as const;

  return (
    <aside className="max-h-[calc(100vh-520px)] w-full overflow-y-auto rounded-lg border border-cyan-200/15 bg-slate-950/70 p-4 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:max-h-none sm:w-[340px] sm:overflow-visible">
      <div className="mb-3 border-b border-white/10 pb-3">
        <p className="text-[11px] uppercase tracking-[0.22em] text-cyan-200/60">
          帧报告
        </p>
        <p className="mt-1 text-base font-semibold text-cyan-100">
          {sidebar.headline}
        </p>
      </div>
      <div className="space-y-0">
        {panels.map(([label, code, value]) => (
          <section
            key={label}
            className="group border-b border-white/10 py-3 text-sm text-slate-100 last:border-b-0"
          >
            <div className="mb-2 flex items-center justify-between">
              <p className="text-[11px] text-slate-400">{label}</p>
              <span className="border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[10px] text-cyan-200/70">
                {code}
              </span>
            </div>
            <div className="mb-3 hidden h-12 border border-white/10 bg-[linear-gradient(135deg,rgba(103,232,249,0.12),rgba(251,146,60,0.04)),repeating-linear-gradient(90deg,rgba(255,255,255,0.05)_0,rgba(255,255,255,0.05)_1px,transparent_1px,transparent_10px)] sm:block" />
            <p className="leading-6 text-slate-200">{value}</p>
          </section>
        ))}
      </div>
      <p className="mt-3 border-t border-white/10 pt-3 text-sm font-medium leading-6 text-white">
        {sidebar.summary}
      </p>
    </aside>
  );
}
