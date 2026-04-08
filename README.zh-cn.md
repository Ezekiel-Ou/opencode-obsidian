# Obsidian OpenCode 插件

[English](./README.md) | [简体中文](./README.zh-cn.md)

将 [OpenCode](https://opencode.ai) AI 助手直接嵌入 Obsidian，为你的笔记赋予 AI 能力：

<img src="./assets/opencode_in_obsidian.png" alt="OpenCode 嵌入 Obsidian" />

**使用场景：**
- 总结和提炼长篇内容
- 起草、编辑和润色写作
- 查询和探索知识库
- 生成大纲和结构化笔记

本插件使用 OpenCode 的 Web 视图，可以直接嵌入到 Obsidian 窗口中。与大多数类似插件使用 MCP 协议不同，本插件希望探索在不需要实现（和维护）自定义聊天 UI 的情况下能做到什么程度 - 我希望在 Obsidian 中获得 OpenCode 的全部功能。

_注意：插件作者与 OpenCode 或 Obsidian 无关 - 这是第三方软件。_

## 系统要求

- 仅支持桌面版（使用 Node.js 子进程）
- 已安装 [OpenCode CLI](https://opencode.ai)
- 已安装 [Bun](https://bun.sh)

## 安装

### 用户安装（推荐使用 BRAT 进行 Beta 测试）

在 Beta 阶段，最简单的安装方式是通过 [BRAT](https://github.com/TfTHacker/obsidian42-brat)（Beta 测试自动更新工具）：

1. 从 Obsidian 社区插件安装 BRAT 插件
2. 打开 BRAT 设置，点击 "Add Beta plugin"
3. 输入：`mtymek/opencode-obsidian`
4. 点击 "Add Plugin" - BRAT 会自动安装最新版本
5. 在 Obsidian 设置 > 社区插件中启用 OpenCode 插件

BRAT 会自动检查更新，并在新版本可用时通知你。

### 开发者安装

如果你想贡献代码或开发插件：

1. 克隆到你的 vault 根目录下的 `.obsidian/plugins/obsidian-opencode` 子目录：
   ```bash
   git clone https://github.com/mtymek/opencode-obsidian.git .obsidian/plugins/obsidian-opencode
   ```
2. 安装依赖并构建：
   ```bash
   bun install && bun run build
   ```
3. 在 Obsidian 设置 > 社区插件中启用
4. 在工作区根目录添加 AGENTS.md 来指导 AI 助手

## 使用方法

- 点击侧边栏的终端图标，或
- 使用 `Cmd/Ctrl+Shift+O` 快捷键切换面板
- 打开面板时服务器会自动启动

## 设置说明

### 自定义命令模式

当你需要更多控制 OpenCode 启动方式时，启用"使用自定义命令" - 例如添加额外的 CLI 参数、使用自定义包装脚本，或通过容器或虚拟环境运行 OpenCode。

使用自定义命令时：

- **主机名和端口必须匹配**上面端口和主机名字段中设置的值
- 你**必须包含 `--cors app://obsidian.md`** 以允许 Obsidian 嵌入 OpenCode 界面

示例：
```bash
opencode serve --port 14096 --hostname 127.0.0.1 --cors app://obsidian.md
```

其他设置（端口、主机名、自动启动、视图位置、上下文注入）可通过设置界面配置，功能说明见界面提示。

### 上下文注入（实验性）

本插件可以自动向运行中的 OpenCode 实例注入上下文：打开的笔记列表和当前选中的文本。

目前这是一个实验性功能，存在一些限制 - 从 OpenCode 界面创建新会话时无法工作。

## Windows 故障排除

如果尽管已安装 opencode 但仍看到 "Executable not found at 'opencode'" 错误：

1. 查找 opencode.cmd 路径：
   ```
   where opencode.cmd
   ```

2. 在插件设置中配置完整路径：
   ```
   C:\Users\{username}\AppData\Roaming\npm\opencode.cmd
   ```

这是由于 Electron/Obsidian 在 Windows 上无法完全继承 PATH 环境变量。

## 国际化实现

### 国际化设置

本插件引入了国际化模块以支持多语言。实现包括一个集中的 i18n 入口文件 `src/i18n/index.ts`，提供 `t()` 翻译函数和 `initI18n()` 初始化逻辑。语言资源定义在单独的文件中，包括 `src/i18n/locale/en.ts`（英语）和 `src/i18n/locale/zh-cn.ts`（简体中文，默认语言）。

### 核心文件更新

多个核心文件已更新以集成国际化。主入口文件 `src/main.ts` 在插件加载时初始化 i18n 系统，所有命令和通知消息都配置为使用本地化文本。用户界面文件 `src/ui/OpenCodeView.ts` 已更新，使所有 UI 元素（包括按钮和状态消息）默认以中文渲染。同样，`src/settings/SettingsTab.ts` 现在本地化了所有设置标题和描述。

### 本地化覆盖范围

国际化系统覆盖了所有主要的面向用户的内容。这包括视图标题和按钮标签、服务器状态消息（如停止、启动中、运行中和错误状态）、设置页面中的所有配置选项、命令名称，以及各种通知消息（包括成功、失败和警告提示）。

### 默认语言行为

默认语言设置为简体中文（`zh-cn`）。系统会自动检测并匹配 Obsidian 的语言设置。如果检测到的语言不受支持，插件会优雅地回退到中文。目前支持英语和简体中文。

### 构建和测试

项目编译成功，生成约 65KB 的 `main.js` 包。构建过程中没有遇到 TypeScript 类型错误，所有现有功能保持完好。

### 使用说明

插件现在默认以中文显示所有界面元素。这包括插件视图中的所有状态消息和按钮、设置页面上的所有配置选项、命令面板中的命令名称，以及各种通知消息。

### 扩展语言支持

添加额外的语言非常简单。可以在 `src/i18n/locale/` 目录下创建新的语言文件，例如 `ja.ts` 用于日语。然后在 `src/i18n/index.ts` 的 `locales` 对象中注册新语言，最后重新编译项目。

## 贡献

欢迎贡献！请参阅 [CONTRIBUTING.md](./CONTRIBUTING.md) 了解详细信息。

我们特别欢迎：
- Windows 和 WSL 支持改进
- 文档改进
- Bug 修复
- 适用于 Obsidian vault 的 Agent Skills 创意

## 许可证

MIT License - 详见 [LICENSE](./LICENSE) 文件
