interface AttentionPulseProps {
  trigger: number;
}

export function AttentionPulse({ trigger }: AttentionPulseProps) {
  return (
    <span
      key={trigger}
      className="pointer-events-none absolute left-1/2 top-[18%] z-[1] h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-200/60 animate-[pulse-ring_1.4s_ease-out]"
    />
  );
}
