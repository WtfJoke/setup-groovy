import {HttpClient} from '@actions/http-client'
import {debug} from '@actions/core'
import {XMLParser} from 'fast-xml-parser'
import {valid} from 'semver'

const GROOVY_OLDER_RELEASES_URL =
  'https://repo1.maven.org/maven2/org/codehaus/groovy/groovy/maven-metadata.xml'
const GROOVY_CURRENT_URL =
  'https://repo1.maven.org/maven2/org/apache/groovy/groovy/maven-metadata.xml'

interface XMLMetadata {
  metadata: {
    groupId: string
    artifactId: string
    versioning: {
      latest: string
      release: string
      versions: {
        version: string[]
      }
      lastUpdated: string
    }
  }
}

const http = new HttpClient('setup-groovy', undefined, {
  allowRetries: true,
  maxRetries: 3
})
const parser = new XMLParser()

export const isReleaseAvailable = async (version: string) => {
  if (!valid(version)) {
    throw new Error(`Invalid version '${version}'`)
  }
  const versions = await fetchAvailableVersions()
  debug(`Available versions: ${JSON.stringify(versions)})`)
  const isVersionAvailable = versions.includes(version)
  return isVersionAvailable
}

export const fetchAvailableVersions = async () => {
  const versionsPromise = fetchVersionsFromMavenMetadata(GROOVY_CURRENT_URL)
  const oldVersionsPromise = fetchVersionsFromMavenMetadata(
    GROOVY_OLDER_RELEASES_URL
  )
  const versions = (await oldVersionsPromise).concat(await versionsPromise)
  return versions
}

const fetchVersionsFromMavenMetadata = async (mavenMetaDataUrl: string) => {
  // fetch from groovy current url using @actions/http-client
  const releasesResponse = await http.get(mavenMetaDataUrl)
  const mavenMetadataXML = await releasesResponse.readBody()
  const releases = parser.parse(mavenMetadataXML) as XMLMetadata
  const versions = releases.metadata.versioning.versions.version
  return versions
}
