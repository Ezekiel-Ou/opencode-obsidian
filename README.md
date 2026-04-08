# OpenCode plugin for Obsidian

[English](./README.md) | [简体中文](./README.zh-cn.md)

Give your notes AI capability by embedding Opencode [OpenCode](https://opencode.ai) AI assistant directly in Obsidian:

<img src="./assets/opencode_in_obsidian.png" alt="OpenCode embeded in Obsidian" />

**Use cases:**
- Summarize and distill long-form content
- Draft, edit, and refine your writing
- Query and explore your knowledge base
- Generate outlines and structured notes

This plugin uses OpenCode's web view that can be embedded directly into Obsidian window. Usually similar plugins would use the ACP protocol, but I want to see how how much is possible without having to implement (and manage) a custom chat UI - I want the full power of OpenCode in my Obsidian.

_Note: plugin author is not afiliated with OpenCode or Obsidian - this is a 3rd party software._

## Requirements

- Desktop only (uses Node.js child processes)
- [OpenCode CLI](https://opencode.ai) installed 
- [Bun](https://bun.sh) installed

## Installation

### For Users (BRAT - Recommended for Beta Testing)

The easiest way to install this plugin during beta is via [BRAT](https://github.com/TfTHacker/obsidian42-brat) (Beta Reviewer's Auto-update Tool):

1. Install the BRAT plugin from Obsidian Community Plugins
2. Open BRAT settings and click "Add Beta plugin"
3. Enter: `mtymek/opencode-obsidian`
4. Click "Add Plugin" - BRAT will install the latest release automatically
5. Enable the OpenCode plugin in Obsidian Settings > Community Plugins

BRAT will automatically check for updates and notify you when new versions are available.

### For Developers

If you want to contribute or develop the plugin:

1. Clone to `.obsidian/plugins/obsidian-opencode` subdirectory under your vault's root:
   ```bash
   git clone https://github.com/mtymek/opencode-obsidian.git .obsidian/plugins/obsidian-opencode
   ```
2. Install dependencies and build:
   ```bash
   bun install && bun run build
   ```
3. Enable in Obsidian Settings > Community Plugins
4. Add AGENTS.md to your workspace root to guide the AI assistant

## Usage

- Click the terminal icon in the ribbon, or
- `Cmd/Ctrl+Shift+O` to toggle the panel
- Server starts automatically when you open the panel


## Settings

### Custom Command Mode

Enable "Use custom command" when you need more control over how OpenCode starts—for example, to add extra CLI flags, use a custom wrapper script, or run OpenCode through a container or virtual environment.

When using custom command:

- **Hostname and port must match** the values set in the Port and Hostname fields above
- You **must include `--cors app://obsidian.md`** to allow Obsidian to embed the OpenCode interface

Example:
```bash
opencode serve --port 14096 --hostname 127.0.0.1 --cors app://obsidian.md
```

Other settings (port, hostname, auto-start, view location, context injection) are available through the settings UI and are self-explanatory.

### Context injection (experimental)

This plugin can automatically inject context to the running OC instance: list of open notes and currently selected text.

Currently, this is work-in-progress feature with some limitations - it won't work when creating new session from OC interface.

## Windows Troubleshooting

If you see "Executable not found at 'opencode'" despite opencode being installed:

1. Find your opencode.cmd path:
   ```
   where opencode.cmd
   ```

2. Configure the full path in plugin settings:
   ```
   C:\Users\{username}\AppData\Roaming\npm\opencode.cmd
   ```

This is due to Electron/Obsidian not fully inheriting PATH on Windows.

## Internationalization (i18n) Implementation
Here is a polished English version of your README section, rewritten without numbered structure and in a natural, professional style:

---

### Internationalization Setup

An internationalization module has been introduced to support multiple languages. The implementation includes a centralized i18n entry file located at `src/i18n/index.ts`, which provides the `t()` translation function and the `initI18n()` initialization logic. Language resources are defined in separate files, including `src/i18n/locale/en.ts` for English and `src/i18n/locale/zh-cn.ts` for Simplified Chinese, which is set as the default language.

### Core File Updates

Several core files have been updated to integrate internationalization. The main entry file `src/main.ts` now initializes the i18n system when the plugin loads, and all commands and notification messages are configured to use localized text. The user interface file `src/ui/OpenCodeView.ts` has been updated so that all UI elements, including buttons and status messages, are rendered in Chinese by default. Similarly, `src/settings/SettingsTab.ts` now localizes all setting titles and descriptions.

### Coverage of Localization

The internationalization system covers all major user-facing content. This includes view titles and button labels, server status messages such as stopped, starting, running, and error states, all configuration options within the settings page, command names, and various notification messages including success, failure, and warning prompts.

### Default Language Behavior

The default language is set to Simplified Chinese (`zh-cn`). The system automatically detects and matches the language setting of Obsidian. If the detected language is not supported, the plugin gracefully falls back to Chinese. Currently, both English and Simplified Chinese are supported.

### Build and Testing

The project compiles successfully and produces a `main.js` bundle of approximately 65KB. No TypeScript type errors were encountered during the build process, and all existing functionalities remain intact.

### Usage

The plugin now displays all interface elements in Chinese by default. This includes all status messages and buttons within the plugin view, all configuration options on the settings page, command names in the command palette, and various notification messages.

### Extending Language Support

Additional languages can be added with minimal effort. A new language file can be created under the `src/i18n/locale/` directory, such as `ja.ts` for Japanese. The new language should then be registered in the `locales` object within `src/i18n/index.ts`, followed by recompilation of the project.

