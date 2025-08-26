# 开发计划 - OpenRouter 免费模型监控器

本项目旨在创建一个高效、自动化的工具来监控和导出 OpenRouter 上的免费模型。以下是详细的任务清单。

## Phase 1: 项目初始化与环境搭建

- [ ] **初始化 Next.js 项目**
    - [ ] 使用 `npx create-next-app@latest` 命令创建项目。
    - [ ] 选择 TypeScript, ESLint, App Router 等推荐配置。
- [ ] **集成 UI 框架**
    - [ ] 安装并配置 Tailwind CSS。
    - [ ] 按照官方文档初始化 `shadcn/ui`。
- [ ] **安装核心依赖**
    - [ ] 安装 `swr` 用于客户端数据获取。
    - [ ] 安装 `lucide-react` 作为 `shadcn/ui` 的图标库。
- [ ] **项目结构设置**
    - [ ] 创建 `/components` 目录用于存放 React 组件。
    - [ ] 创建 `/lib` 目录用于存放工具函数（如数据格式化）。
- [ ] **版本控制**
    - [ ] 初始化 Git 仓库。
    - [ ] 创建 `.gitignore` 文件，并添加 `node_modules`, `.next`, `.env.local` 等。
    - [ ] 完成首次代码提交。

## Phase 2: 核心后端 API 实现

- [ ] **创建 API 路由**
    - [ ] 在 `app/api/models/route.ts` 创建一个新的 API Route Handler。
- [ ] **实现数据获取逻辑**
    - [ ] 使用 `fetch` API 调用 OpenRouter 的端点: `https://openrouter.ai/api/frontend/models/find?max_price=0`。
    - [ ] 实现健壮的错误处理，使用 `try...catch` 捕获网络或解析错误。
- [ ] **实现缓存策略**
    - [ ] 在 `fetch` 调用中配置 `next: { revalidate: 43200 }` 来启用 Vercel 的数据缓存（12小时）。
- [ ] **数据处理与响应**
    - [ ] 从返回的 JSON 中解析出模型列表。
    - [ ] 对数据进行清洗和格式化，确保只返回前端需要的字段 (`id`, `name` 等)，避免暴露过多无关信息。
    - [ ] 在成功时返回 `NextResponse.json(data)`，在失败时返回包含错误信息的响应。

## Phase 3: 前端 UI 构建与数据展示

- [ ] **创建主页面组件**
    - [ ] 在 `app/page.tsx` 中设置页面基本布局。
- [ ] **实现数据获取 Hook**
    - [ ] 创建一个自定义 Hook `useModels`，内部使用 `SWR` 来调用 `/api/models`。
    - [ ] 该 Hook 需要处理 `data`, `isLoading`, `error` 三种状态。
- [ ] **构建模型数据表格 (`ModelTable.tsx`)**
    - [ ] 使用 `shadcn/ui` 的 `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableCell` 组件构建表格结构。
    - [ ] 表格需要包含三列：复选框、模型ID (`id`)、模型名称 (`name`)。
- [ ] **处理加载与错误状态**
    - [ ] 在 `isLoading` 状态为 `true` 时，显示一个 `Skeleton` 加载占位符或 Spinner。
    - [ ] 在 `error` 状态存在时，显示一个友好的错误提示信息组件。

## Phase 4: 前端交互功能

- [ ] **状态管理**
    - [ ] 使用 `React.useState` 来管理已选中模型的 ID 列表。
- [ ] **实现单选/多选逻辑**
    - [ ] 为每一行的 `Checkbox` 组件添加 `onCheckedChange` 事件处理器，用以更新已选中的模型列表。
- [ ] **实现全选/取消全选逻辑**
    - [ ] 在表头的 `Checkbox` 中实现全选功能，点击后将所有模型的 ID 添加到选中列表。
    - [ ] 全选框的状态需要与当前所有行的选中状态同步。
- [ ] **实现手动刷新**
    - [ ] 添加一个“刷新”按钮 (`Button` 组件)。
    - [ ] 按钮的 `onClick` 事件触发 SWR 的 `mutate` 函数，强制重新验证数据。
- [ ] **UI 反馈**
    - [ ] 在页面上添加一个计数器，实时显示 `已选择: X / 总数: Y`。

## Phase 5: 数据导出功能

- [ ] **创建导出组件 (`ExportControls.tsx`)**
    - [ ] 设计一组按钮，每个按钮对应一种导出格式（逗号分隔, JSON, Markdown）。
- [ ] **实现数据格式化逻辑**
    - [ ] 创建一个工具函数 `formatModels(models, format)` 来处理不同格式的转换。
- [ ] **实现剪贴板复制功能**
    - [ ] 使用 `navigator.clipboard.writeText` 将格式化后的字符串复制到用户剪贴板。
    - [ ] 按钮在没有选中任何模型时应处于 `disabled` 状态。
- [ ] **用户反馈**
    - [ ] 引入 `sonner` 或 `react-hot-toast` 来实现 Toast 通知。
    - [ ] 复制成功后，弹出一个 "已成功复制到剪贴板" 的提示。

## Phase 6: 部署与测试

- [ ] **代码准备**
    - [ ] 确保所有代码都已提交到 GitHub 仓库。
- [ ] **Vercel 部署**
    - [ ] 在 Vercel 上创建新项目并连接到 GitHub 仓库。
    - [ ] 配置环境变量（如果未来有的话）。
    - [ ] 触发部署并等待完成。
- [ ] **生产环境验证**
    - [ ] 访问 Vercel 提供的 URL，检查所有功能是否正常。
    - [ ] 重点测试 API 缓存是否生效（首次访问后，刷新页面应立即加载数据）。
    - [ ] 进行跨浏览器测试（Chrome, Firefox, Safari）。
