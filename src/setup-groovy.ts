import {getInput, debug, addPath, error as coreError} from '@actions/core'
import {downloadTool, extractZip} from '@actions/tool-cache'
import {coerce, lt} from 'semver'
import {isReleaseAvailable} from './release'

const GROOVY_BASE_URL =
  'https://groovy.jfrog.io/artifactory/dist-release-local/groovy-zips'
const FIRST_APACHE_GROOVY_VERSION = '2.4.4'

export const setupGroovy = async () => {
  try {
    const version = getInput('groovy-version')
    return await setupGroovyVersion(version)
  } catch (error: unknown) {
    if (error instanceof Error || typeof error === 'string') {
      coreError(error)
    }
    throw error
  }
}

export const setupGroovyVersion = async (version: string) => {
  debug(`Fetching groovy releases for Groovy version '${version}'`)
  const isVersionAvailable = await isReleaseAvailable(version)
  if (!isVersionAvailable) {
    throw new Error(`Unable to find Groovy version '${version}'`)
  }
  const groovyBinaryFileName = getFileName(version)
  const url = `${GROOVY_BASE_URL}/${groovyBinaryFileName}`
  const groovyRootPath = await downloadGroovy(url)
  const groovyBinaryPath = `${groovyRootPath}/groovy-${version}/bin`
  debug(`Adding '${groovyBinaryPath}' to PATH`)
  addPath(groovyBinaryPath)
  return groovyBinaryPath
}

const getFileName = (version: string) => {
  const parsedVersion = coerce(version)
  const oldGroovyFileName = `groovy-binary-${version}.zip`
  const newGroovyFileName = `apache-${oldGroovyFileName}`
  if (!parsedVersion || lt(parsedVersion, FIRST_APACHE_GROOVY_VERSION)) {
    debug(
      `Version ${version} lower than ${FIRST_APACHE_GROOVY_VERSION} or not parsable, use old groovy file name`
    )
    return oldGroovyFileName
  }
  return newGroovyFileName
}

const downloadGroovy = async (url: string) => {
  debug(`Downloading groovy from url '${url}'`)
  const archivePath = await downloadTool(url)
  const groovyPath = await extractZip(archivePath)

  debug(`Extracted groovy zip to: ${groovyPath}`)

  if (!archivePath || !groovyPath) {
    throw new Error(`Unable to download groovy from ${url}`)
  }

  return groovyPath
}
