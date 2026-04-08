export default {
  // View
  viewTitle: "OpenCode",
  
  // Server States
  serverStopped: "OpenCode is stopped",
  serverStoppedMessage: "Click the button below to start the OpenCode server.",
  serverStarting: "Starting OpenCode...",
  serverStartingMessage: "Please wait while the server starts up.",
  serverFailed: "Failed to start OpenCode",
  serverFailedMessage: "There was an error starting the OpenCode server.",
  
  // Buttons
  buttonStart: "Start OpenCode",
  buttonRetry: "Retry",
  buttonOpenSettings: "Open Settings",
  buttonReload: "Reload",
  buttonStop: "Stop server",
  
  // Settings
  settingsTitle: "OpenCode Settings",
  settingsServerConfig: "Server Configuration",
  settingsPort: "Port",
  settingsPortDesc: "Port number for the OpenCode web server",
  settingsHostname: "Hostname",
  settingsHostnameDesc: "Hostname to bind the server to (usually 127.0.0.1)",
  settingsUseCustomCommand: "Use custom command",
  settingsUseCustomCommandDesc: "Enable to use a custom shell command instead of the executable path",
  settingsLearnMore: "Learn more",
  settingsCustomCommand: "Custom command",
  settingsCustomCommandDesc: "Custom shell command to start OpenCode.",
  settingsExecutablePath: "OpenCode executable path",
  settingsAutodetect: "Autodetect",
  settingsProjectDir: "Project directory",
  settingsProjectDirDesc: "Override the starting directory for OpenCode. Leave empty to use the vault root.",
  
  settingsBehavior: "Behavior",
  settingsAutoStart: "Auto-start server",
  settingsAutoStartDesc: "Automatically start the OpenCode server when Obsidian opens (not recommended for faster startup)",
  settingsDefaultLocation: "Default view location",
  settingsDefaultLocationDesc: "Where to open the OpenCode panel: sidebar opens in the right panel, main opens as a tab in the editor area",
  settingsLocationSidebar: "Sidebar",
  settingsLocationMain: "Main window",
  
  settingsWorkspaceContext: "Workspace Context",
  settingsInjectContext: "Inject workspace context",
  settingsInjectContextDesc: "Includes open note paths and selected text in OpenCode when the view is focused",
  settingsMaxNotes: "Max notes in context",
  settingsMaxNotesDesc: "Limit how many open notes are included",
  settingsMaxSelection: "Max selection length",
  settingsMaxSelectionDesc: "Truncate selected text to avoid oversized context",
  
  settingsServerStatus: "Server Status",
  settingsStatusStopped: "Stopped",
  settingsStatusStarting: "Starting...",
  settingsStatusRunning: "Running",
  settingsStatusError: "Error",
  settingsStatusLabel: "Status: ",
  settingsUrlLabel: "URL: ",
  settingsButtonStartServer: "Start Server",
  settingsButtonStopServer: "Stop Server",
  settingsButtonRestartServer: "Restart Server",
  settingsButtonWait: "Please wait...",
  
  // Notices
  noticeAutodetectSuccess: "OpenCode executable found at",
  noticeAutodetectFail: "Could not find opencode. Please check your installation.",
  noticeDirNotAbsolute: "Project directory must be an absolute path (or start with ~)",
  noticeDirNotExist: "Project directory does not exist",
  noticeDirNotDirectory: "Project directory path is not a directory",
  noticeValidateFailed: "Failed to validate path:",
  
  // Commands
  commandToggleView: "Toggle OpenCode view",
  commandOpenInSidebar: "Open OpenCode in sidebar",
  commandOpenInMain: "Open OpenCode in main",
  commandStartServer: "Start server",
  commandStopServer: "Stop server",
  commandRestartServer: "Restart server",
  
  // Ribbon
  ribbonTitle: "OpenCode",
};
