import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { usePlaybackController } from "./usePlaybackController";

describe("usePlaybackController", () => {
  it("boots into frame 1 after 2 seconds", () => {
    vi.useFakeTimers();

    const { result } = renderHook(() => usePlaybackController(5));

    expect(result.current.isBooting).toBe(true);

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(result.current.currentFrame).toBe(0);
    expect(result.current.isBooting).toBe(false);

    vi.useRealTimers();
  });

  it("stops auto play on the last frame", () => {
    vi.useFakeTimers();

    const { result } = renderHook(() => usePlaybackController(5));

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    act(() => {
      result.current.jumpToFrame(4);
    });

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(result.current.currentFrame).toBe(4);
    expect(result.current.isPlaying).toBe(false);

    vi.useRealTimers();
  });

  it("restarts from frame 1 when play is pressed on the last frame", () => {
    vi.useFakeTimers();

    const { result } = renderHook(() => usePlaybackController(5));

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    act(() => {
      result.current.jumpToFrame(4);
    });

    act(() => {
      result.current.togglePlayback();
    });

    expect(result.current.currentFrame).toBe(0);
    expect(result.current.isPlaying).toBe(true);

    vi.useRealTimers();
  });
});
