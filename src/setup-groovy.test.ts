import { existsSync } from "node:fs";
import { rm } from "node:fs/promises";
import path from "node:path";
import * as core from "@actions/core";
import { vi } from "vitest";
import { setupGroovy } from "./setup-groovy.js";

const tempDir = path.join(__dirname, "runner", "temp");
process.env.RUNNER_TEMP = tempDir;

describe("setup-groovy", { timeout: 30_000 }, () => {
  beforeAll(async () => {
    await rm(tempDir, { recursive: true, force: true });
  });

  beforeEach(() => {
    vi.resetAllMocks();
    vi.spyOn(core, "debug").mockImplementation(vi.fn());
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  it.each(["4.0.9", "4.0.0-rc-2", "1.8.0-beta-1"])(
    "should setup groovy '%s'",
    async (version) => {
      const groovyExecutableFolderName = path.join(`groovy-${version}`, "bin");
      vi.spyOn(core, "getInput").mockReturnValue(version);

      const groovyPath = await setupGroovy();
      const groovyHome = path.dirname(groovyPath);

      expect(groovyPath.endsWith(groovyExecutableFolderName)).toBe(true);
      expect(existsSync(path.join(groovyPath, "groovy"))).toBe(true);
      expect(process.env.GROOVY_HOME).toBe(groovyHome);
    },
  );

  it("should throw an error when version can't be found", async () => {
    const version = "0.0.1";
    vi.spyOn(core, "getInput").mockReturnValue(version);
    vi.spyOn(core, "error").mockImplementation(vi.fn());

    await expect(setupGroovy()).rejects.toThrow(
      `Unable to find matching Groovy version for: '0.0.1'`,
    );
    expect(core.error).toHaveBeenCalledWith(
      new Error("Unable to find matching Groovy version for: '0.0.1'"),
    );
  });
});
