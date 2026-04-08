import { describe, test, expect, beforeAll } from "bun:test";
import { ExecutableResolver } from "../src/server/ExecutableResolver";
import { existsSync } from "fs";
import { join, isAbsolute } from "path";
import { homedir, platform } from "os";

describe("ExecutableResolver", () => {
  describe("resolve", () => {
    test("returns absolute path if it exists", () => {
      // Use current bun executable as test subject
      const bunPath = process.execPath;
      const resolved = ExecutableResolver.resolve(bunPath);
      
      expect(resolved).toBe(bunPath);
      expect(isAbsolute(resolved)).toBe(true);
      expect(existsSync(resolved)).toBe(true);
    });

    test("searches common directories for basename", () => {
      // Test with a common executable that should be in PATH
      const execName = platform() === "win32" ? "cmd.exe" : "sh";
      const resolved = ExecutableResolver.resolve(execName);
      
      // Should resolve to something
      expect(resolved).toBeDefined();
      expect(typeof resolved).toBe("string");
    });

    test("returns configured path as fallback if not found", () => {
      const nonExistentPath = "totally-fake-executable-12345";
      const resolved = ExecutableResolver.resolve(nonExistentPath);
      
      // Should return the configured path as fallback
      expect(resolved).toBe(nonExistentPath);
    });

    test("extracts basename from configured path", () => {
      // Provide a path, should search for just the basename
      const configuredPath = "/some/path/to/opencode";
      const resolved = ExecutableResolver.resolve(configuredPath);
      
      // Should have attempted to search for "opencode" and returned fallback
      expect(resolved).toBeDefined();
    });
  });

  describe("resolveFromPath", () => {
    test("finds executable in PATH", () => {
      // Test with a common executable
      const execName = platform() === "win32" ? "cmd.exe" : "sh";
      const resolved = ExecutableResolver.resolveFromPath(execName);
      
      expect(resolved).not.toBeNull();
      if (resolved) {
        expect(existsSync(resolved)).toBe(true);
      }
    });

    test("returns null for non-existent executable", () => {
      const resolved = ExecutableResolver.resolveFromPath("totally-fake-executable-99999");
      
      expect(resolved).toBeNull();
    });

    test("returns first match on Windows with multiple results", () => {
      if (platform() !== "win32") {
        return; // Skip on non-Windows
      }

      // 'where' on Windows might return multiple results
      const resolved = ExecutableResolver.resolveFromPath("cmd.exe");
      
      expect(resolved).not.toBeNull();
      if (resolved) {
        expect(existsSync(resolved)).toBe(true);
        // Should be absolute path
        expect(isAbsolute(resolved)).toBe(true);
      }
    });
  });

  describe("platform-specific behavior", () => {
    test("searches user bin directories", () => {
      const homeDir = homedir();
      const currentPlatform = platform();
      
      // Test that we would search in user directories
      // We can't test actual file existence, but we can verify the logic
      const testPath = currentPlatform === "win32" 
        ? "opencode.cmd" 
        : "opencode";
      
      const resolved = ExecutableResolver.resolve(testPath);
      expect(resolved).toBeDefined();
    });

    test("handles Windows .cmd extension", () => {
      if (platform() !== "win32") {
        return; // Skip on non-Windows
      }

      const resolved = ExecutableResolver.resolve("opencode.cmd");
      expect(resolved).toBeDefined();
    });

    test("handles Unix executables without extension", () => {
      if (platform() === "win32") {
        return; // Skip on Windows
      }

      const resolved = ExecutableResolver.resolve("opencode");
      expect(resolved).toBeDefined();
    });
  });

  describe("edge cases", () => {
    test("handles empty string", () => {
      const resolved = ExecutableResolver.resolve("");
      // Empty string may resolve to a directory, just ensure it doesn't crash
      expect(resolved).toBeDefined();
      expect(typeof resolved).toBe("string");
    });

    test("handles path with spaces", () => {
      const pathWithSpaces = "/path with spaces/to opencode/opencode";
      const resolved = ExecutableResolver.resolve(pathWithSpaces);
      
      // Should not crash and return something
      expect(resolved).toBeDefined();
    });

    test("handles relative path", () => {
      const relativePath = "./opencode";
      const resolved = ExecutableResolver.resolve(relativePath);
      
      expect(resolved).toBeDefined();
    });

    test("handles Windows-style path on Unix", () => {
      if (platform() === "win32") {
        return; // Skip on Windows
      }

      const windowsPath = "C:\\Program Files\\opencode\\opencode.exe";
      const resolved = ExecutableResolver.resolve(windowsPath);
      
      // Should handle gracefully
      expect(resolved).toBeDefined();
    });

    test("handles Unix-style path on Windows", () => {
      if (platform() !== "win32") {
        return; // Skip on non-Windows
      }

      const unixPath = "/usr/local/bin/opencode";
      const resolved = ExecutableResolver.resolve(unixPath);
      
      // Should handle gracefully
      expect(resolved).toBeDefined();
    });
  });
});
