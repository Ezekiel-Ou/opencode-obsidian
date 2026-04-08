# 测试说明 / Testing Guide

[English](#english) | [中文](#chinese)

---

<a name="chinese"></a>
## 中文

### 测试覆盖范围

本项目已添加以下模块的单元测试：

#### ✅ 已测试模块

1. **ExecutableResolver** (`tests/ExecutableResolver.test.ts`)
   - 可执行文件路径解析
   - 跨平台路径处理
   - PATH 环境变量搜索
   - 边缘情况处理（空字符串、特殊字符等）

2. **OpenCodeClient** (`tests/OpenCodeClient.test.ts`)
   - URL 构造和规范化
   - 会话 ID 解析
   - 基础 URL 更新
   - 边缘情况处理

3. **ServerManager** (`tests/ServerManager.test.ts`)
   - 服务器生命周期管理
   - 进程启动和停止
   - 状态转换
   - Unicode 路径支持

4. **Process managers** (`tests/process/`)
   - Windows 进程管理
   - POSIX 进程管理

#### ⚠️ 未测试模块

以下模块由于重度依赖 Obsidian API，未包含完整的单元测试。这些模块应在 Obsidian 环境中进行集成测试：

- **ContextManager** - 需要 Obsidian workspace 和 event 系统
- **ViewManager** - 需要 Obsidian workspace leaf 管理
- **OpenCodeView** - 需要 Obsidian ItemView API
- **SettingsTab** - 需要 Obsidian PluginSettingTab API

### 运行测试

```bash
# 运行所有测试
bun test

# 运行特定测试文件
bun test tests/ExecutableResolver.test.ts

# 带覆盖率报告
bun test --coverage
```

### 测试要求

运行测试前需要：

1. 安装 [Bun](https://bun.sh/) 1.3+
2. 安装 [OpenCode CLI](https://opencode.ai)
3. 确保 `opencode` 命令在 PATH 中可用

### 测试结构

```
tests/
├── ExecutableResolver.test.ts  # 可执行文件解析测试
├── OpenCodeClient.test.ts      # API 客户端测试
├── ServerManager.test.ts       # 服务器管理测试
└── process/                    # 进程管理测试
    ├── PosixProcess.test.ts
    └── WindowsProcess.test.ts
```

### 贡献测试

添加新测试时，请遵循以下准则：

1. 使用 `bun:test` 框架
2. 遵循现有的测试结构和命名约定
3. 为每个测试添加清晰的描述
4. 测试边缘情况和错误处理
5. 确保测试是独立的，不依赖其他测试的状态

---

<a name="english"></a>
## English

### Test Coverage

This project includes unit tests for the following modules:

#### ✅ Tested Modules

1. **ExecutableResolver** (`tests/ExecutableResolver.test.ts`)
   - Executable path resolution
   - Cross-platform path handling
   - PATH environment variable search
   - Edge case handling (empty strings, special characters, etc.)

2. **OpenCodeClient** (`tests/OpenCodeClient.test.ts`)
   - URL construction and normalization
   - Session ID parsing
   - Base URL updates
   - Edge case handling

3. **ServerManager** (`tests/ServerManager.test.ts`)
   - Server lifecycle management
   - Process start and stop
   - State transitions
   - Unicode path support

4. **Process managers** (`tests/process/`)
   - Windows process management
   - POSIX process management

#### ⚠️ Untested Modules

The following modules are not fully covered by unit tests due to heavy Obsidian API dependencies. These should be tested through integration testing in an Obsidian environment:

- **ContextManager** - Requires Obsidian workspace and event system
- **ViewManager** - Requires Obsidian workspace leaf management
- **OpenCodeView** - Requires Obsidian ItemView API
- **SettingsTab** - Requires Obsidian PluginSettingTab API

### Running Tests

```bash
# Run all tests
bun test

# Run specific test file
bun test tests/ExecutableResolver.test.ts

# With coverage report
bun test --coverage
```

### Test Requirements

Before running tests, ensure:

1. [Bun](https://bun.sh/) 1.3+ is installed
2. [OpenCode CLI](https://opencode.ai) is installed
3. `opencode` command is available in PATH

### Test Structure

```
tests/
├── ExecutableResolver.test.ts  # Executable resolution tests
├── OpenCodeClient.test.ts      # API client tests
├── ServerManager.test.ts       # Server management tests
└── process/                    # Process management tests
    ├── PosixProcess.test.ts
    └── WindowsProcess.test.ts
```

### Contributing Tests

When adding new tests, please follow these guidelines:

1. Use the `bun:test` framework
2. Follow existing test structure and naming conventions
3. Add clear descriptions for each test
4. Test edge cases and error handling
5. Ensure tests are independent and don't rely on other test states
