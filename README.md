# 注意力驱动资本流动可视化系统

基于热点事件叙事，展示市场注意力如何在产业链上逐层扩散的全屏可视化系统。

## 核心思路

传统股价可视化回答"涨了多少"，本系统回答一个更根本的问题：**此刻，市场的目光集中在产业链的什么地方？**

整个界面如同一座俯瞰视角的夜间卫星城——事件节点是峰顶信号塔，企业的关注度化作向上生长的光柱，注意力扩散的方向和节奏通过帧切换时的脉冲波来呈现。

## 案例：2024 年星舰第五飞

**事件**：2024 年 10 月 13 日，SpaceX 星舰第五飞首次实现"筷子夹火箭"机械臂捕获回收。

**8 家 A 股关联公司**，按技术关联度分为三个海拔圈层：

| 圈层 | 公司 | 技术映射 |
|------|------|---------|
| 核心映射层 | 斯瑞新材 | 液氧甲烷发动机推力室内壁 → 星舰猛禽发动机 |
| 核心映射层 | 超捷股份 | 箭体结构件 → 星舰不锈钢箭体 |
| 结构支撑层 | 航天晨光 | 燃料输送软管、地面支持系统 |
| 结构支撑层 | 铂力特 | 3D 打印发动机部件 |
| 边缘节点层 | 再升科技 | 超细玻璃纤维保温材料 |
| 边缘节点层 | 西部材料 | 铌合金热端部件 |
| 边缘节点层 | 派克新材 | 航天锻件 |
| 认知阻尼层 | 宝钢股份 | 不锈钢材料（市值大、业务分散） |

## 5 帧叙事

| 帧 | 时间窗口 | 叙事焦点 |
|----|---------|---------|
| ① | T+0 | 事件爆发，市场注意力被事件塔捕获，尚未映射到具体标的 |
| ② | T+1~T+3 | 情绪响应，核心映射层（斯瑞新材、超捷股份）换手率飙升 |
| ③ | T+3~T+7 | 语义渗透，结构支撑层开始被激活，互动易出现技术关键词 |
| ④ | T+7~T+14 | 逻辑确认，机构调研、融资流入，多层级共同发光但强度有别 |
| ⑤ | T+14~T+30 | 真实经济信号，暖色分布趋于均匀，实体经营信号兑现 |

## 界面组成

- **产业地貌主场景**：俯瞰同心圈层地形，节点光柱高度/亮度/暖度映射关注度
- **顶部雷达扫描栏**：扫描线往返移动，显示当前帧注意力分布摘要
- **右侧信息侧栏**：随帧整体翻页，包含事件画面、市场反应、链路示意和帧说明
- **底部光轨时间轴**：支持自动播放、暂停、点击跳帧，当前帧光点滑动高亮
- **海拔注意力仪**：三段条实时呈现高地 / 山坡 / 平原三层权重占比
- **节点详情浮层**：点击企业节点后原位展开，展示产业链位置、技术映射和当前帧三项指标

## 技术栈

- React 18 + TypeScript
- Vite（构建工具）
- Tailwind CSS（样式）
- SVG + CSS 动画（可视化渲染）
- Vitest + Testing Library（测试）

## 快速开始

```bash
# 安装依赖
pnpm install

# 开发模式
pnpm dev

# 生产构建
pnpm build

# 类型检查
pnpm check

# 运行测试
pnpm test
```

## 项目结构

```
src/
├── features/
│   └── attention-landscape/
│       ├── components/       # 场景组件
│       │   ├── SceneStage.tsx       # 总舞台
│       │   ├── TerrainMap.tsx       # 产业地貌主图
│       │   ├── EnterpriseNode.tsx   # 企业节点
│       │   ├── NodeTooltip.tsx      # 节点详情浮层
│       │   ├── AttentionPulse.tsx   # 脉冲波效果
│       │   ├── RadarNarration.tsx   # 雷达扫描栏
│       │   ├── FrameSidebar.tsx     # 右侧侧栏
│       │   ├── TimelineRail.tsx     # 时间轴
│       │   └── LayerMeter.tsx       # 海拔注意力仪
│       ├── data/
│       │   └── caseStudy.ts        # 星舰第五飞案例数据
│       ├── hooks/
│       │   └── usePlaybackController.ts  # 播放状态控制器
│       ├── utils/
│       │   └── visuals.ts          # 视觉映射工具
│       └── types.ts                # 核心类型定义
└── App.tsx                  # 入口（装配 SceneStage）
```

## 设计文档

- [设计规格](docs/superpowers/specs/2026-05-13-attention-landscape-visualization-design.md)
- [实现计划](docs/superpowers/plans/2026-05-13-attention-landscape-visualization.md)

## 理论支撑

- Barber & Odean, *All That Glitters: The Effect of Attention and News on the Buying Behavior of Individual and Institutional Investors*
- *Speed Matters: Limited Attention and Supply Chain Information Diffusion*
- Falkinger, *Limited Attention as the Scarce Resource in an Information-Rich Economy*
