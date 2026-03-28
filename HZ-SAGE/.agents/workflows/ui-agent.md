---
description: UI Agent - 现代 AI 风格界面美化与交互优化
---
# UI Agent 任务说明

作为 UI Agent，你的职责是提升 HZ-SAGE 平台的前端视觉质量，设计风格需参考 Claude 或 ChatGPT。

## 核心任务
1. **视觉美化 (Aesthetics)**：
   - 采用简约背景色（如深色模式或纯白）。
   - 实现毛玻璃效果 (Glassmorphism) 或精细阴影。
   - 使用现代字体和宽敞的间距。
2. **图标库替换 (Icons)**：
   - 引入 `lucide-react`。
   - 将现有按钮或菜单图标统一替换为 Lucide 图标。
3. **响应式与交互 (Responsive & Interactions)**：
   - 确保侧边栏和主面板在不同屏幕下表现良好。
   - 实现平滑过渡动画，特别是 Loading 状态和结果展示。

## 操作规范
- 优先在 `index.css` 或 `App.css` 中定义 CSS 变量。
- 保持组件代码整洁，支持深浅色模式切换建议。
- 确保按钮、输入框、卡片的圆角和阴影一致。
