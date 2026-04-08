export default {
  // View
  viewTitle: "OpenCode",
  
  // Server States
  serverStopped: "OpenCode 已停止",
  serverStoppedMessage: "点击下方按钮启动 OpenCode 服务器。",
  serverStarting: "正在启动 OpenCode...",
  serverStartingMessage: "请稍候，服务器正在启动中。",
  serverFailed: "启动 OpenCode 失败",
  serverFailedMessage: "启动 OpenCode 服务器时发生错误。",
  
  // Buttons
  buttonStart: "启动 OpenCode",
  buttonRetry: "重试",
  buttonOpenSettings: "打开设置",
  buttonReload: "重新加载",
  buttonStop: "停止服务器",
  
  // Settings
  settingsTitle: "OpenCode 设置",
  settingsServerConfig: "服务器配置",
  settingsPort: "端口",
  settingsPortDesc: "OpenCode Web 服务器的端口号",
  settingsHostname: "主机名",
  settingsHostnameDesc: "服务器绑定的主机名（通常为 127.0.0.1）",
  settingsUseCustomCommand: "使用自定义命令",
  settingsUseCustomCommandDesc: "启用以使用自定义 Shell 命令代替可执行文件路径",
  settingsLearnMore: "了解更多",
  settingsCustomCommand: "自定义命令",
  settingsCustomCommandDesc: "用于启动 OpenCode 的自定义 Shell 命令。",
  settingsExecutablePath: "OpenCode 可执行文件路径",
  settingsAutodetect: "自动检测",
  settingsProjectDir: "项目目录",
  settingsProjectDirDesc: "覆盖 OpenCode 的起始目录。留空则使用 Vault 根目录。",
  
  settingsBehavior: "行为",
  settingsAutoStart: "自动启动服务器",
  settingsAutoStartDesc: "Obsidian 打开时自动启动 OpenCode 服务器（不推荐，会降低启动速度）",
  settingsDefaultLocation: "默认视图位置",
  settingsDefaultLocationDesc: "打开 OpenCode 面板的位置：侧边栏在右侧面板中打开，主窗口在编辑器区域以标签页形式打开",
  settingsLocationSidebar: "侧边栏",
  settingsLocationMain: "主窗口",
  
  settingsWorkspaceContext: "工作区上下文",
  settingsInjectContext: "注入工作区上下文",
  settingsInjectContextDesc: "当视图获得焦点时，在 OpenCode 中包含打开的笔记路径和选中的文本",
  settingsMaxNotes: "上下文中的最大笔记数",
  settingsMaxNotesDesc: "限制包含的打开笔记数量",
  settingsMaxSelection: "最大选择长度",
  settingsMaxSelectionDesc: "截断选中的文本以避免上下文过大",
  
  settingsServerStatus: "服务器状态",
  settingsStatusStopped: "已停止",
  settingsStatusStarting: "启动中...",
  settingsStatusRunning: "运行中",
  settingsStatusError: "错误",
  settingsStatusLabel: "状态：",
  settingsUrlLabel: "网址：",
  settingsButtonStartServer: "启动服务器",
  settingsButtonStopServer: "停止服务器",
  settingsButtonRestartServer: "重启服务器",
  settingsButtonWait: "请稍候...",
  
  // Notices
  noticeAutodetectSuccess: "已找到 OpenCode 可执行文件，位于",
  noticeAutodetectFail: "未找到 opencode。请检查您的安装。",
  noticeDirNotAbsolute: "项目目录必须是绝对路径（或以 ~ 开头）",
  noticeDirNotExist: "项目目录不存在",
  noticeDirNotDirectory: "项目目录路径不是一个目录",
  noticeValidateFailed: "验证路径失败：",
  
  // Commands
  commandToggleView: "切换 OpenCode 视图",
  commandOpenInSidebar: "在侧边栏中打开 OpenCode",
  commandOpenInMain: "在主窗口中打开 OpenCode",
  commandStartServer: "启动服务器",
  commandStopServer: "停止服务器",
  commandRestartServer: "重启服务器",
  
  // Ribbon
  ribbonTitle: "OpenCode",
};
