import {getInput, debug, addPath, error as coreError} from '@actions/core'
import {downloadTool, extractZip} from '@actions/tool-cache'
import {isReleaseAvailable} from './release'

const GROOVY_BASE_URL =
  'https://groovy.jfrog.io/artifactory/dist-release-local/groovy-zips'

export const setupGroovy = async () => {
  try {
    const version = getInput('groovy-version')
    debug(`Fetching groovy releases for Groovy version '${version}'`)
    const isVersionAvailable = await isReleaseAvailable(version)
    if (!isVersionAvailable) {
      throw new Error(`Unable to find Groovy version '${version}'`)
    }
    const url = `${GROOVY_BASE_URL}/apache-groovy-sdk-${version}.zip`
    const groovyRootPath = await downloadGroovy(url)
    const groovyPath = `${groovyRootPath}/groovy-${version}/bin`
    debug(`Adding '${groovyPath}' to PATH`)
    addPath(groovyPath)
  } catch (error: unknown) {
    if (error instanceof Error || typeof error === 'string') {
      coreError(error)
    }
    throw error
  }
}

export const downloadGroovy = async (url: string) => {
  debug(`Downloading groovy from url '${url}'`)
  const archivePath = await downloadTool(url)
  const groovyPath = await extractZip(archivePath)

  debug(`Groovy path is ${groovyPath}`)

  if (!archivePath || !groovyPath) {
    throw new Error(`Unable to download groovy from ${url}`)
  }

  return groovyPath
}
