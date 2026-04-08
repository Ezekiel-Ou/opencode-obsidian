import { App, Plugin, PluginSettingTab, Setting, Notice } from "obsidian";
import { existsSync, statSync } from "fs";
import { homedir } from "os";
import { OpenCodeSettings, ViewLocation } from "../types";
import { ServerManager } from "../server/ServerManager";
import { ExecutableResolver } from "../server/ExecutableResolver";
import { t } from "../i18n";

function expandTilde(path: string): string {
  if (path === "~") {
    return homedir();
  }
  if (path.startsWith("~/")) {
    return path.replace("~", homedir());
  }
  return path;
}

export class OpenCodeSettingTab extends PluginSettingTab {
  private validateTimeout: ReturnType<typeof setTimeout> | null = null;

  constructor(
    app: App,
    plugin: Plugin,
    private settings: OpenCodeSettings,
    private serverManager: ServerManager,
    private onSettingsChange: () => Promise<void>
  ) {
    super(app, plugin);
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();
    containerEl.createEl("h2", { text: t("settingsTitle") });
    containerEl.createEl("h3", { text: t("settingsServerConfig") });

    new Setting(containerEl)
      .setName(t("settingsPort"))
      .setDesc(t("settingsPortDesc"))
      .addText((text) =>
        text
          .setPlaceholder("14096")
          .setValue(this.settings.port.toString())
          .onChange(async (value) => {
            const port = parseInt(value, 10);
            if (!isNaN(port) && port > 0 && port < 65536) {
              this.settings.port = port;
              await this.onSettingsChange();
            }
          })
      );

    new Setting(containerEl)
      .setName(t("settingsHostname"))
      .setDesc(t("settingsHostnameDesc"))
      .addText((text) =>
        text
          .setPlaceholder("127.0.0.1")
          .setValue(this.settings.hostname)
          .onChange(async (value) => {
            this.settings.hostname = value || "127.0.0.1";
            await this.onSettingsChange();
          })
      );

    const customCmdSetting = new Setting(containerEl)
      .setName(t("settingsUseCustomCommand"))
      .setDesc(t("settingsUseCustomCommandDesc"))
      .addToggle((toggle) =>
        toggle
          .setValue(this.settings.useCustomCommand)
          .onChange(async (value) => {
            this.settings.useCustomCommand = value;
            await this.onSettingsChange();
            // Re-render to show/hide appropriate fields
            this.display();
          })
      );
    
    const descEl = customCmdSetting.descEl;
    descEl.createEl("br");
    const linkEl = descEl.createEl("a", {
      text: t("settingsLearnMore"),
      href: "https://github.com/mtymek/opencode-obsidian#custom-command-mode"
    });
    linkEl.addEventListener("click", (e) => {
      e.preventDefault();
      window.open(linkEl.href, "_blank");
    });

    if (this.settings.useCustomCommand) {
      new Setting(containerEl)
        .setName(t("settingsCustomCommand"))
        .setDesc(t("settingsCustomCommandDesc"))
        .addTextArea((text) => {
          text
            .setPlaceholder("opencode serve --port 14096 --hostname 127.0.0.1 --cors app://obsidian.md")
            .setValue(this.settings.customCommand)
            .onChange(async (value) => {
              this.settings.customCommand = value;
              await this.onSettingsChange();
            });
          text.inputEl.rows = 3;
          text.inputEl.style.width = "100%";
          return text;
        });
    } else {
      const pathSetting = new Setting(containerEl)
        .setName(t("settingsExecutablePath"))
        .addText((text) =>
          text
            .setPlaceholder("opencode")
            .setValue(this.settings.opencodePath)
            .onChange(async (value) => {
              this.settings.opencodePath = value;
              await this.onSettingsChange();
            })
        );
      
      pathSetting.addButton((button) => {
        button
          .setButtonText(t("settingsAutodetect"))
          .onClick(async () => {
            const detectedPath = ExecutableResolver.resolve("opencode");
            if (detectedPath && detectedPath !== "opencode") {
              this.settings.opencodePath = detectedPath;
              await this.onSettingsChange();
              // Refresh the text input
              this.display();
              new Notice(`${t("noticeAutodetectSuccess")} ${detectedPath}`);
            } else {
              new Notice(t("noticeAutodetectFail"));
            }
          });
      });
    }

    new Setting(containerEl)
      .setName(t("settingsProjectDir"))
      .setDesc(t("settingsProjectDirDesc"))
      .addText((text) =>
        text
          .setPlaceholder("/path/to/project or ~/project")
          .setValue(this.settings.projectDirectory)
          .onChange((value) => {
            // Debounce validation to avoid spamming notices on every keypress
            if (this.validateTimeout) {
              clearTimeout(this.validateTimeout);
            }
            this.validateTimeout = setTimeout(async () => {
              await this.validateAndSetProjectDirectory(value);
            }, 500);
          })
      );

    containerEl.createEl("h3", { text: t("settingsBehavior") });

    new Setting(containerEl)
      .setName(t("settingsAutoStart"))
      .setDesc(t("settingsAutoStartDesc"))
      .addToggle((toggle) =>
        toggle
          .setValue(this.settings.autoStart)
          .onChange(async (value) => {
            this.settings.autoStart = value;
            await this.onSettingsChange();
          })
      );

    new Setting(containerEl)
      .setName(t("settingsDefaultLocation"))
      .setDesc(t("settingsDefaultLocationDesc"))
      .addDropdown((dropdown) =>
        dropdown
          .addOption("sidebar", t("settingsLocationSidebar"))
          .addOption("main", t("settingsLocationMain"))
          .setValue(this.settings.defaultViewLocation)
          .onChange(async (value) => {
            this.settings.defaultViewLocation = value as ViewLocation;
            await this.onSettingsChange();
          })
      );

    containerEl.createEl("h3", { text: t("settingsWorkspaceContext") });

    new Setting(containerEl)
      .setName(t("settingsInjectContext"))
      .setDesc(t("settingsInjectContextDesc"))
      .addToggle((toggle) =>
        toggle
          .setValue(this.settings.injectWorkspaceContext)
          .onChange(async (value) => {
            this.settings.injectWorkspaceContext = value;
            await this.onSettingsChange();
          })
      );

    new Setting(containerEl)
      .setName(t("settingsMaxNotes"))
      .setDesc(t("settingsMaxNotesDesc"))
      .addSlider((slider) =>
        slider
          .setLimits(1, 50, 1)
          .setValue(this.settings.maxNotesInContext)
          .setDynamicTooltip()
          .onChange(async (value) => {
            this.settings.maxNotesInContext = value;
            await this.onSettingsChange();
          })
      );

    new Setting(containerEl)
      .setName(t("settingsMaxSelection"))
      .setDesc(t("settingsMaxSelectionDesc"))
      .addSlider((slider) =>
        slider
          .setLimits(500, 5000, 100)
          .setValue(this.settings.maxSelectionLength)
          .setDynamicTooltip()
          .onChange(async (value) => {
            this.settings.maxSelectionLength = value;
            await this.onSettingsChange();
          })
      );

    containerEl.createEl("h3", { text: t("settingsServerStatus") });

    const statusContainer = containerEl.createDiv({ cls: "opencode-settings-status" });
    this.renderServerStatus(statusContainer);
  }

  private async validateAndSetProjectDirectory(value: string): Promise<void> {
    const trimmed = value.trim();

    // Empty value is valid - means use vault root
    if (!trimmed) {
      this.serverManager.updateProjectDirectory("");
      await this.onSettingsChange();
      return;
    }

    // Validate absolute path (supports ~, /, and Windows drive letters)
    if (!trimmed.startsWith("/") && !trimmed.startsWith("~") && !trimmed.match(/^[A-Za-z]:\\/)) {
      new Notice(t("noticeDirNotAbsolute"));
      return;
    }

    const expanded = expandTilde(trimmed);

    try {
      if (!existsSync(expanded)) {
        new Notice(t("noticeDirNotExist"));
        return;
      }
      const stat = statSync(expanded);
      if (!stat.isDirectory()) {
        new Notice(t("noticeDirNotDirectory"));
        return;
      }
    } catch (error) {
      new Notice(`${t("noticeValidateFailed")} ${(error as Error).message}`);
      return;
    }

    this.serverManager.updateProjectDirectory(expanded);
    await this.onSettingsChange();
  }

  private renderServerStatus(container: HTMLElement): void {
    container.empty();

    const state = this.serverManager.getState();
    const statusText = {
      stopped: t("settingsStatusStopped"),
      starting: t("settingsStatusStarting"),
      running: t("settingsStatusRunning"),
      error: t("settingsStatusError"),
    };

    const statusClass = {
      stopped: "status-stopped",
      starting: "status-starting",
      running: "status-running",
      error: "status-error",
    };

    const statusEl = container.createDiv({ cls: "opencode-status-line" });
    statusEl.createSpan({ text: t("settingsStatusLabel") });
    statusEl.createSpan({
      text: statusText[state],
      cls: `opencode-status-badge ${statusClass[state]}`,
    });

    if (state === "error") {
      const errorMsg = this.serverManager.getLastError();
      if (errorMsg) {
        const errorEl = container.createDiv({ cls: "opencode-error-details" });
        errorEl.createEl("div", {
          text: errorMsg,
          cls: "opencode-error-text"
        });
      }
    }

    if (state === "running") {
      const urlEl = container.createDiv({ cls: "opencode-status-line" });
      urlEl.createSpan({ text: t("settingsUrlLabel") });
      const serverUrl = this.serverManager.getUrl();
      const linkEl = urlEl.createEl("a", {
        text: serverUrl,
        href: serverUrl,
      });
      linkEl.addEventListener("click", (e) => {
        e.preventDefault();
        window.open(serverUrl, "_blank");
      });
    }

    const buttonContainer = container.createDiv({ cls: "opencode-settings-buttons" });

    if (state === "stopped" || state === "error") {
      const startButton = buttonContainer.createEl("button", {
        text: t("settingsButtonStartServer"),
        cls: "mod-cta",
      });
      startButton.addEventListener("click", async () => {
        await this.serverManager.start();
        this.renderServerStatus(container);
      });
    }

    if (state === "running") {
      const stopButton = buttonContainer.createEl("button", {
        text: t("settingsButtonStopServer"),
      });
      stopButton.addEventListener("click", () => {
        this.serverManager.stop();
        this.renderServerStatus(container);
      });

      const restartButton = buttonContainer.createEl("button", {
        text: t("settingsButtonRestartServer"),
        cls: "mod-warning",
      });
      restartButton.addEventListener("click", async () => {
        this.serverManager.stop();
        await this.serverManager.start();
        this.renderServerStatus(container);
      });
    }

    if (state === "starting") {
      buttonContainer.createSpan({
        text: t("settingsButtonWait"),
        cls: "opencode-status-waiting",
      });
    }
  }
}
