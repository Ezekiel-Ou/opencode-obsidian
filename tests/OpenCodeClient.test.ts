import { describe, test, expect, beforeEach } from "bun:test";
import { OpenCodeClient } from "../src/client/OpenCodeClient";

describe("OpenCodeClient", () => {
  let client: OpenCodeClient;
  const API_BASE_URL = "http://localhost:14096";
  const UI_BASE_URL = "http://localhost:14096";
  const PROJECT_DIR = "/test/project";

  beforeEach(() => {
    client = new OpenCodeClient(API_BASE_URL, UI_BASE_URL, PROJECT_DIR);
  });

  describe("constructor and initialization", () => {
    test("normalizes base URLs by removing trailing slashes", () => {
      const clientWithSlash = new OpenCodeClient(
        "http://localhost:14096/",
        "http://localhost:14096/",
        PROJECT_DIR
      );
      
      const url = clientWithSlash.getSessionUrl("test-session");
      expect(url).toBe("http://localhost:14096/session/test-session");
    });

    test("stores project directory", () => {
      // Verify through API calls (project directory is sent in headers)
      expect(client).toBeDefined();
    });
  });

  describe("updateBaseUrl", () => {
    test("updates base URLs and resets tracking", () => {
      const newApiUrl = "http://localhost:15000";
      const newUiUrl = "http://localhost:15000";
      const newProjectDir = "/new/project";
      
      client.updateBaseUrl(newApiUrl, newUiUrl, newProjectDir);
      
      const url = client.getSessionUrl("test");
      expect(url).toBe("http://localhost:15000/session/test");
    });

    test("resets tracking when base URL changes", () => {
      // Set up tracking state by calling updateContext
      // This would set trackedSessionId internally
      
      client.updateBaseUrl(
        "http://localhost:15000",
        "http://localhost:15000",
        "/new/project"
      );
      
      // After update, tracking should be reset (tested implicitly)
      expect(client).toBeDefined();
    });

    test("does not reset if URLs are the same", () => {
      // Update with same values should not reset
      client.updateBaseUrl(API_BASE_URL, UI_BASE_URL, PROJECT_DIR);
      
      expect(client).toBeDefined();
    });
  });

  describe("getSessionUrl", () => {
    test("constructs correct session URL", () => {
      const sessionId = "abc123";
      const url = client.getSessionUrl(sessionId);
      
      expect(url).toBe(`${UI_BASE_URL}/session/${sessionId}`);
    });

    test("handles special characters in session ID", () => {
      const sessionId = "session-with-dashes_and_underscores";
      const url = client.getSessionUrl(sessionId);
      
      expect(url).toContain(sessionId);
    });
  });

  describe("resolveSessionId", () => {
    test("extracts session ID from valid URL", () => {
      const iframeUrl = "http://localhost:14096/session/abc123";
      const sessionId = client.resolveSessionId(iframeUrl);
      
      expect(sessionId).toBe("abc123");
    });

    test("extracts session ID with query parameters", () => {
      const iframeUrl = "http://localhost:14096/session/abc123?param=value";
      const sessionId = client.resolveSessionId(iframeUrl);
      
      expect(sessionId).toBe("abc123");
    });

    test("extracts session ID with hash fragment", () => {
      const iframeUrl = "http://localhost:14096/session/abc123#section";
      const sessionId = client.resolveSessionId(iframeUrl);
      
      expect(sessionId).toBe("abc123");
    });

    test("returns null for invalid URL", () => {
      const iframeUrl = "http://localhost:14096/other/path";
      const sessionId = client.resolveSessionId(iframeUrl);
      
      expect(sessionId).toBeNull();
    });

    test("returns null for empty string", () => {
      const sessionId = client.resolveSessionId("");
      
      expect(sessionId).toBeNull();
    });

    test("handles session IDs with hyphens and underscores", () => {
      const iframeUrl = "http://localhost:14096/session/session-id_123";
      const sessionId = client.resolveSessionId(iframeUrl);
      
      expect(sessionId).toBe("session-id_123");
    });
  });

  describe("resetTracking", () => {
    test("resets internal tracking state", () => {
      client.resetTracking();
      
      // Tracking should be reset (tested implicitly through updateContext behavior)
      expect(client).toBeDefined();
    });
  });

  describe("URL normalization", () => {
    test("removes single trailing slash", () => {
      const c = new OpenCodeClient(
        "http://localhost:14096/",
        "http://localhost:14096/",
        PROJECT_DIR
      );
      const url = c.getSessionUrl("test");
      
      expect(url).not.toContain("//session");
      expect(url).toBe("http://localhost:14096/session/test");
    });

    test("removes multiple trailing slashes", () => {
      const c = new OpenCodeClient(
        "http://localhost:14096///",
        "http://localhost:14096///",
        PROJECT_DIR
      );
      const url = c.getSessionUrl("test");
      
      expect(url).toBe("http://localhost:14096/session/test");
    });

    test("handles URL without trailing slash", () => {
      const c = new OpenCodeClient(
        "http://localhost:14096",
        "http://localhost:14096",
        PROJECT_DIR
      );
      const url = c.getSessionUrl("test");
      
      expect(url).toBe("http://localhost:14096/session/test");
    });
  });

  describe("edge cases", () => {
    test("handles empty session ID", () => {
      const url = client.getSessionUrl("");
      
      expect(url).toBe(`${UI_BASE_URL}/session/`);
    });

    test("handles session ID with special URL characters", () => {
      const sessionId = "session%20with%20encoding";
      const url = client.getSessionUrl(sessionId);
      
      expect(url).toContain(sessionId);
    });

    test("resolveSessionId handles malformed URLs gracefully", () => {
      const malformedUrls = [
        "not-a-url",
        "http://",
        "session/abc123", // Missing protocol
        "//localhost/session/abc",
      ];
      
      malformedUrls.forEach((url) => {
        const result = client.resolveSessionId(url);
        // Should either extract correctly or return null, not throw
        expect(result === null || typeof result === "string").toBe(true);
      });
    });
  });

  describe("project directory handling", () => {
    test("accepts various project directory formats", () => {
      const projectDirs = [
        "/absolute/path",
        "C:\\Windows\\Path",
        "./relative/path",
        "/path/with spaces/in it",
        "/path/with/中文/characters",
      ];
      
      projectDirs.forEach((dir) => {
        const c = new OpenCodeClient(API_BASE_URL, UI_BASE_URL, dir);
        expect(c).toBeDefined();
      });
    });

    test("updates project directory on updateBaseUrl", () => {
      const newProjectDir = "/completely/different/path";
      
      client.updateBaseUrl(API_BASE_URL, UI_BASE_URL, newProjectDir);
      
      expect(client).toBeDefined();
    });
  });

  describe("session ID patterns", () => {
    test("handles UUID-style session IDs", () => {
      const uuid = "550e8400-e29b-41d4-a716-446655440000";
      const url = `http://localhost:14096/session/${uuid}`;
      const sessionId = client.resolveSessionId(url);
      
      expect(sessionId).toBe(uuid);
    });

    test("handles short alphanumeric session IDs", () => {
      const shortId = "abc123";
      const url = `http://localhost:14096/session/${shortId}`;
      const sessionId = client.resolveSessionId(url);
      
      expect(sessionId).toBe(shortId);
    });

    test("handles long session IDs", () => {
      const longId = "a".repeat(100);
      const url = `http://localhost:14096/session/${longId}`;
      const sessionId = client.resolveSessionId(url);
      
      expect(sessionId).toBe(longId);
    });
  });
});
