export type AttentionLayerId = "core" | "support" | "edge";

export interface AttentionMetric {
  turnoverRate: string;
  marginChange: string;
  qaDensity: string;
}

export interface AttentionNode {
  id: string;
  name: string;
  layerId: AttentionLayerId;
  chainPosition: string;
  mapping: string;
  x: number;
  y: number;
  size: number;
  connections: string[];
}

export interface AttentionSidebarContent {
  headline: string;
  eventVisual: string;
  marketVisual: string;
  chainVisual: string;
  summary: string;
}

export interface AttentionFrame {
  id: string;
  index: number;
  title: string;
  timeWindow: string;
  narration: string;
  sidebar: AttentionSidebarContent;
  layerWeights: Record<AttentionLayerId, number>;
  nodeHeat: Record<string, number>;
  activePaths: Array<[string, string]>;
  metrics: Record<string, AttentionMetric>;
}

export interface AttentionCaseStudy {
  id: string;
  title: string;
  event: {
    title: string;
    dateRange: string;
    description: string;
    signalLabel: string;
  };
  layers: Array<{
    id: AttentionLayerId;
    label: string;
    radius: [number, number];
    themeColor: string;
    defaultWeight: number;
  }>;
  nodes: AttentionNode[];
  frames: AttentionFrame[];
}
