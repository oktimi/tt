# Project Context: Valuo 体育新闻平台 (Next.js + Headless UI 版)

## 1. 项目核心定位
- **名称**: Valuo 体育新闻平台 (valuo.cn)
- **目标**: SEO + GEO 双驱动，追求极致的 LCP 性能与 AI 抓取友好度。
- **视觉风格**: 现代、紧凑、数据驱动。打破 MUI 的呆板，追求类似 The Athletic 或 ESPN 的动感布局。

## 2. 技术栈约束 (Tech Stack)
- **前端框架**: Next.js (App Router)。
- **UI 策略**: **Headless UI 优先**。
  - **Radix UI**: 负责复杂交互逻辑（Dialog, Popover, Tabs, Select）。
  - **Tailwind CSS / CSS Modules**: 负责样式（根据偏好二选一，推荐 Tailwind 配合 Radix 以实现极速样式定制）。
  - **Lucide React**: 统一图标库。
- **渲染策略**: 
  - 战报/快讯: ISR (60s)。
  - 深度解读/数据工具: SSR。
- **存储**: Cloudflare R2 + CDN。

## 3. 开发规范
### 3.1 域名、SEO 与 交付
- **域名**: `valuo.cn`
- **URL**: `/{联赛}/{日期}/{球队A}-vs-{球队B}-{内容类型}.html`
- **CI/CD**: 每次推送镜像到 GitHub 必须**携带版本号 Tag**（例如 `v1.0.1`），触发构建流水线。
- **Metadata**: 必须配置 `generateMetadata` 及 JSON-LD (SportsEvent Schema)。

### 3.2 UI 开发准则 (取代 MUI)
- **无样式逻辑**: 涉及复杂交互（如下拉菜单、模态框）时，严禁自研逻辑，必须使用 **Radix UI** 保证可访问性 (A11y)。
- **响应式**: 体育新闻核心是“比分看板”和“数据表”，必须优先适配 Mobile。
- **性能**: 减少第三方重型库依赖。针对海量图片使用 Next.js `Image` 组件，并由 R2 自动转 WebP。

### 3.3 交互钩子 (Hook Tags)
Markdown 自定义标签解析为 React 组件：
- `[HOOK:WINRATE]` -> `<Predictor />` (基于 Radix Slider/Progress)
- `[HOOK:COMPARE]` -> `<StatsTable />` (响应式粘性表头)
- `[HOOK:ODDS]` -> `<OddsChart />` (轻量级趋势图)

## 4. 当前任务 (Current Focus)
1. **Headless Setup**: 安装 Radix UI 核心组件包。
2. **布局系统**: 建立响应式的体育新闻三栏布局（左：分类/比分，中：正文，右：深度解读排行）。
4. **Markdown 解析**: 编写解析器，支持将数据 Hooks 转换为带动画效果的 Headless 组件。