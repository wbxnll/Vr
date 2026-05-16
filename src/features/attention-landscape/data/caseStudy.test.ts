import { describe, expect, it } from "vitest";

import { caseStudy } from "./caseStudy";

describe("caseStudy", () => {
  it("contains the expected 8 companies and 5 frames", () => {
    expect(caseStudy.nodes).toHaveLength(8);
    expect(caseStudy.frames).toHaveLength(5);
  });

  it("keeps every frame weight sum at 100", () => {
    caseStudy.frames.forEach((frame) => {
      const total = Object.values(frame.layerWeights).reduce(
        (sum, value) => sum + value,
        0
      );

      expect(total).toBe(100);
    });
  });

  it("provides metrics for every node in every frame", () => {
    caseStudy.frames.forEach((frame) => {
      caseStudy.nodes.forEach((node) => {
        expect(frame.metrics[node.id]).toBeDefined();
      });
    });
  });
});
