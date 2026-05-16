import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { caseStudy } from "../data/caseStudy";
import { SceneStage } from "./SceneStage";

describe("SceneStage", () => {
  it("switches the sidebar headline when a frame button is clicked", async () => {
    const user = userEvent.setup();

    render(<SceneStage caseStudy={caseStudy} />);

    await user.click(screen.getByRole("button", { name: "帧 3" }));

    expect(screen.getByText("帧③ 语义渗透")).toBeInTheDocument();
  });

  it("opens node details when a company node is clicked", async () => {
    const user = userEvent.setup();

    render(<SceneStage caseStudy={caseStudy} />);

    await user.click(screen.getByRole("button", { name: "斯瑞新材" }));

    expect(
      screen.getByText("液氧甲烷发动机推力室内壁，对应星舰猛禽发动机热端部件。")
    ).toBeInTheDocument();
  });

  it("renders active ground light paths for the current frame", async () => {
    const user = userEvent.setup();

    render(<SceneStage caseStudy={caseStudy} />);

    await user.click(screen.getByRole("button", { name: "帧 4" }));

    expect(screen.getAllByTestId("active-light-path")).toHaveLength(
      caseStudy.frames[3].activePaths.length
    );
  });

  it("shows the quiet boot state before the first pulse wakes the city", () => {
    vi.useFakeTimers();

    render(<SceneStage caseStudy={caseStudy} />);

    expect(screen.getByText("待机扫描中")).toBeInTheDocument();

    vi.useRealTimers();
  });

  it("lets the timeline range jump to a frame", () => {
    render(<SceneStage caseStudy={caseStudy} />);

    fireEvent.change(screen.getByLabelText("时间轴帧选择"), {
      target: { value: "4" },
    });

    expect(screen.getByText("帧⑤ 真实经济信号")).toBeInTheDocument();
  });

  it("presents the command dashboard framing after wake", async () => {
    const user = userEvent.setup();

    render(<SceneStage caseStudy={caseStudy} />);

    await user.click(screen.getByRole("button", { name: "帧 2" }));

    expect(screen.getByText("资本注意力指挥舱")).toBeInTheDocument();
    expect(screen.getByText("帧报告")).toBeInTheDocument();
    expect(screen.getByText("海拔权重")).toBeInTheDocument();
  });

  it("renders the event planet at the center of three upstream-to-downstream orbits", () => {
    render(<SceneStage caseStudy={caseStudy} />);

    expect(screen.getByTestId("central-event-planet")).toHaveTextContent(
      caseStudy.event.signalLabel
    );
    expect(screen.getByTestId("attention-orbit-core")).toBeInTheDocument();
    expect(screen.getByTestId("attention-orbit-support")).toBeInTheDocument();
    expect(screen.getByTestId("attention-orbit-edge")).toBeInTheDocument();
  });

  it("places every company tile on its chain orbit", () => {
    render(<SceneStage caseStudy={caseStudy} />);

    for (const node of caseStudy.nodes) {
      expect(screen.getByTestId(`enterprise-node-${node.id}`)).toHaveAttribute(
        "data-layer-id",
        node.layerId
      );
    }
  });

  it("lets pointer dragging rotate the orbital viewpoint", () => {
    render(<SceneStage caseStudy={caseStudy} />);

    const viewport = screen.getByTestId("orbital-viewport");

    expect(viewport).toHaveStyle({
      transform: "rotateX(62deg) rotateZ(-18deg)",
    });

    fireEvent.mouseDown(viewport, { clientX: 240, clientY: 180 });
    fireEvent.mouseMove(viewport, { clientX: 320, clientY: 220 });
    fireEvent.mouseUp(viewport);

    expect(viewport).toHaveStyle({
      transform: "rotateX(74deg) rotateZ(6deg)",
    });
  });
});
