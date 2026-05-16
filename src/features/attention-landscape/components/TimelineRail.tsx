import type { AttentionFrame } from "../types";

interface TimelineRailProps {
  frames: AttentionFrame[];
  currentFrame: number;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onFrameSelect: (frameIndex: number) => void;
}

const frameLabels = ["①", "②", "③", "④", "⑤"];

export function TimelineRail({
  frames,
  currentFrame,
  isPlaying,
  onTogglePlay,
  onFrameSelect,
}: TimelineRailProps) {
  const progress = frames.length > 1 ? (currentFrame / (frames.length - 1)) * 100 : 0;

  return (
    <div className="flex flex-1 items-center gap-4 rounded-lg border border-cyan-200/15 bg-slate-950/65 px-5 py-4 shadow-[0_18px_50px_rgba(0,0,0,0.35)] backdrop-blur-lg">
      <button
        type="button"
        onClick={onTogglePlay}
        className="h-10 min-w-16 border border-cyan-200/20 bg-cyan-200/10 px-4 text-sm text-cyan-50 transition hover:border-cyan-200/40 hover:bg-cyan-200/15"
      >
        {isPlaying ? "暂停" : "播放"}
      </button>
      <div className="relative flex flex-1 items-center justify-between gap-4">
        <div className="absolute left-0 right-0 top-1/2 h-[3px] -translate-y-1/2 bg-gradient-to-r from-cyan-400/40 via-white/20 to-orange-300/60" />
        <div
          className="absolute left-0 top-1/2 h-[3px] -translate-y-1/2 bg-gradient-to-r from-cyan-300 to-orange-300 shadow-[0_0_18px_rgba(251,146,60,0.45)] transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
        <span
          className="pointer-events-none absolute top-1/2 z-20 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/50 bg-orange-200 shadow-[0_0_24px_rgba(251,146,60,0.9)] transition-all duration-500"
          style={{ left: `${progress}%` }}
        />
        <input
          aria-label="时间轴帧选择"
          type="range"
          min={0}
          max={frames.length - 1}
          step={1}
          value={currentFrame}
          onChange={(event) => onFrameSelect(Number(event.target.value))}
          className="absolute inset-x-0 top-1/2 z-30 h-10 -translate-y-1/2 cursor-pointer opacity-0"
        />
        {frames.map((frame, index) => {
          const active = index === currentFrame;

          return (
            <button
              key={frame.id}
              type="button"
              aria-label={`帧 ${frame.index}`}
              onClick={() => onFrameSelect(index)}
              className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full border text-sm transition ${
                active
                  ? "border-orange-300 bg-orange-300/20 text-orange-100 shadow-[0_0_20px_rgba(251,146,60,0.35)]"
                  : "border-white/10 bg-black/60 text-slate-300"
              }`}
            >
              {frameLabels[index] ?? frame.index}
            </button>
          );
        })}
      </div>
    </div>
  );
}
