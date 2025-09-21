import path from "node:path";
import {
  addPath,
  error as coreError,
  debug,
  exportVariable,
  getInput,
} from "@actions/core";
import { downloadTool, extractZip } from "@actions/tool-cache";
import { lt } from "semver";
import { getMatchingVersion } from "./release";

const GROOVY_BASE_URL =
  "https://groovy.jfrog.io/artifactory/dist-release-local/groovy-zips";
const FIRST_APACHE_GROOVY_VERSION = "2.4.4";

export const setupGroovy = async () => {
  try {
    const version = getInput("groovy-version");
    return await setupGroovyVersion(version);
  } catch (error: unknown) {
    if (error instanceof Error || typeof error === "string") {
      coreError(error);
    }
    throw error;
  }
};

export const setupGroovyVersion = async (version: string) => {
  const matchingVersion = await getMatchingVersion(version);
  if (!matchingVersion) {
    throw new Error(`Unable to find matching Groovy version for: '${version}'`);
  }
  const groovyBinaryFileName = getFileName(matchingVersion);
  const url = `${GROOVY_BASE_URL}/${groovyBinaryFileName}`;
  const groovyRootPath = await downloadGroovy(url);
  const groovyBinaryPath = path.join(
    groovyRootPath,
    `groovy-${matchingVersion}`,
    "bin",
  );
  const groovyHomePath = path.dirname(groovyBinaryPath);
  debug(`Setting 'GROOVY_HOME' environment variable to: ${groovyHomePath}`);
  exportVariable("GROOVY_HOME", groovyHomePath);
  debug(`Adding '${groovyBinaryPath}' to PATH`);
  addPath(groovyBinaryPath);
  return groovyBinaryPath;
};

const getFileName = (matchingVersion: string) => {
  const oldGroovyFileName = `groovy-binary-${matchingVersion}.zip`;
  const newGroovyFileName = `apache-${oldGroovyFileName}`;
  if (lt(matchingVersion, FIRST_APACHE_GROOVY_VERSION)) {
    debug(
      `Version ${matchingVersion} is lower than ${FIRST_APACHE_GROOVY_VERSION} use old groovy file name format.`,
    );
    return oldGroovyFileName;
  }
  return newGroovyFileName;
};

const downloadGroovy = async (url: string) => {
  debug(`Downloading groovy from url '${url}'`);
  const archivePath = await downloadTool(url);
  const groovyPath = await extractZip(archivePath);
  debug(`Extracted groovy zip to: ${groovyPath}`);
  return groovyPath;
};
