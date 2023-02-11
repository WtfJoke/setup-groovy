import * as core from '@actions/core'
import {existsSync} from 'fs'
import {rm} from 'fs/promises'
import path from 'path'
import {setupGroovy, setupGroovyVersion} from '../src/setup-groovy'

const tempDir = path.join(__dirname, 'runner', 'temp')
process.env['RUNNER_TEMP'] = tempDir

jest.setTimeout(30_000)

describe('setup-groovy', () => {
  beforeAll(async () => {
    await rm(tempDir, {recursive: true, force: true})
  })

  beforeEach(() => {
    jest.resetAllMocks()
  })

  it.each(['4.0.9', '1.1-beta-2'])(
    "should setup groovy '%s'",
    async version => {
      const groovyExecutableFolderName = path.join(`groovy-${version}`, 'bin')
      jest.spyOn(core, 'getInput').mockReturnValue(version)

      const groovyPath = await setupGroovy()

      expect(groovyPath.endsWith(groovyExecutableFolderName)).toBe(true)
      expect(await existsSync(path.join(groovyPath, 'groovy'))).toBe(true)
    }
  )
})
