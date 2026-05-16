import { useEffect, useMemo, useState } from "react";

const BOOT_DELAY_MS = 2000;
const FRAME_INTERVAL_MS = 3600;

export function usePlaybackController(totalFrames: number) {
  const [isBooting, setIsBooting] = useState(true);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [transitionToken, setTransitionToken] = useState(0);

  useEffect(() => {
    const bootTimer = window.setTimeout(() => {
      setIsBooting(false);
    }, BOOT_DELAY_MS);

    return () => {
      window.clearTimeout(bootTimer);
    };
  }, []);

  useEffect(() => {
    if (isBooting || !isPlaying) {
      return undefined;
    }

    if (currentFrame >= totalFrames - 1) {
      setIsPlaying(false);
      return undefined;
    }

    const frameTimer = window.setTimeout(() => {
      setCurrentFrame((value) => value + 1);
      setTransitionToken((value) => value + 1);
    }, FRAME_INTERVAL_MS);

    return () => {
      window.clearTimeout(frameTimer);
    };
  }, [currentFrame, isBooting, isPlaying, totalFrames]);

  return useMemo(
    () => ({
      isBooting,
      currentFrame,
      isPlaying,
      selectedNodeId,
      transitionToken,
      togglePlayback: () => {
        setIsBooting(false);

        if (currentFrame >= totalFrames - 1) {
          setCurrentFrame(0);
          setTransitionToken((value) => value + 1);
          setIsPlaying(true);
          return;
        }

        setIsPlaying((value) => !value);
      },
      jumpToFrame: (nextFrame: number) => {
        const safeFrame = Math.max(0, Math.min(nextFrame, totalFrames - 1));

        setIsBooting(false);
        setCurrentFrame(safeFrame);
        setTransitionToken((value) => value + 1);
      },
      selectNode: (nodeId: string | null) => setSelectedNodeId(nodeId),
    }),
    [currentFrame, isBooting, isPlaying, selectedNodeId, totalFrames, transitionToken]
  );
}
