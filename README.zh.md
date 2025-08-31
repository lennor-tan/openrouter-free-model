# OpenRouter 免费模型浏览器

[**English**](./README.md) | [**中文**](./README.zh.md)

---

这是一个用于浏览、筛选、排序和管理 OpenRouter 上可用免费模型的 Web 应用。它允许用户轻松选择模型，并以兼容其他工具的各种格式复制其 ID。该应用基于 Next.js 构建，并支持多语言（英文和中文）。

## 功能特性

- **模型浏览:** 查看来自 OpenRouter API 的所有免费模型列表。
- **筛选:** 按公司和提供商筛选模型。
- **排序:** 按名称、上下文长度等对模型进行排序。
- **搜索:** 按名称搜索模型。
- **批量选择:** 支持多选模型，并提供“全选”、“取消全选”和“反选”功能。
- **推理模型筛选:** 可选择仅显示支持推理的模型。
- **复制 ID:** 方便地复制所选模型的 ID。
- **多语言支持:** 可在中英文之间切换。
- **响应式设计:** 界面已为桌面和移动设备优化。

## 复制格式

该应用支持以两种不同的格式复制所选模型的 ID，分别兼容 `NewAPI` 和 `UniAPI`。

### NewAPI 格式

- **模型名称 :** 以逗号分隔的模型名称列表，非常适合快速创建列表。
- **模型映射 (JSON):** 一个 JSON 对象，可将自定义名称映射到原始的 OpenRouter 模型 ID，适用于创建别名。

### UniAPI 格式

- **YAML 列表:** YAML 风格的列表。如果启用了映射，格式为 `原始ID: 映射后名称`；否则，仅显示 `原始ID`。

### 自定义选项

两种格式均可通过以下映射选项进行自定义：

- **前缀:** 为模型名称添加自定义前缀。
- **移除 `:free` 后缀:** 从模型 ID 中移除 `:free` 后缀。
- **移除公司名称:** 从模型 ID 中移除公司名称（例如 `google/`）。

## 技术栈

- **框架:** [Next.js](https://nextjs.org/)
- **UI 组件:** [shadcn/ui](https://ui.shadcn.com/) (基于 Radix UI 构建)
- **样式:** [Tailwind CSS](https://tailwindcss.com/)
- **国际化 (i18n):** [next-intl](https://next-intl-docs.vercel.app/)
- **数据获取:** [SWR](https://swr.vercel.app/)
- **图标:** [Lucide React](https://lucide.dev/)
- **代码质量:** TypeScript, ESLint, Prettier

## 如何开始

### 环境要求

- [Node.js](https://nodejs.org/) (版本 20 或更高)
- [pnpm](https://pnpm.io/) (或你选择的包管理器)

### 安装

1.  克隆仓库:
    ```bash
    git clone https://github.com/your-username/openrouter-free-model.git
    cd openrouter-free-model
    ```
2.  安装依赖:
    ```bash
    pnpm install
    ```

### 运行开发服务器

启动开发服务器:

```bash
pnpm dev
```

在浏览器中打开 [http://localhost:3000](http://localhost:3000) 查看结果。

## 项目结构

- `app/[lang]/`: 国际化动态路由。
- `app/api/`: API 路由。
- `components/`: React 组件。
- `hooks/`: 自定义 React 钩子。
- `lib/`: 工具函数。
- `messages/`: i18n 语言文件。
- `public/`: 静态资源。
- `types/`: TypeScript 类型定义。
