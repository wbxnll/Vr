interface RadarNarrationProps {
  narration: string;
  frameTitle: string;
}

export function RadarNarration({
  narration,
  frameTitle,
}: RadarNarrationProps) {
  return (
    <div className="absolute inset-x-6 top-24 z-20 hidden rounded-lg border border-cyan-200/15 bg-slate-950/55 px-5 py-3 shadow-[0_18px_50px_rgba(0,0,0,0.35)] backdrop-blur-md sm:left-[360px] sm:right-6 sm:top-6 sm:block">
      <div className="mb-2 h-px w-full overflow-hidden bg-white/10">
        <div className="h-full w-28 animate-[scan_3.2s_linear_infinite] bg-cyan-300/70" />
      </div>
      <p className="text-sm leading-6 text-slate-200">
        [雷达扫描] {frameTitle} - {narration}
      </p>
    </div>
  );
}
