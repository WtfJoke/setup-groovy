import * as core from '@actions/core'
import {existsSync} from 'fs'
import {rm} from 'fs/promises'
import path from 'path'
import {setupGroovy} from '../src/setup-groovy'

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

  it.each(['4.0.9', '4.0.0-rc-2', '1.8.0-beta-1'])(
    "should setup groovy '%s'",
    async version => {
      const groovyExecutableFolderName = path.join(`groovy-${version}`, 'bin')
      jest.spyOn(core, 'getInput').mockReturnValue(version)

      const groovyPath = await setupGroovy()
      const groovyHome = path.dirname(groovyPath)

      expect(groovyPath.endsWith(groovyExecutableFolderName)).toBe(true)
      expect(await existsSync(path.join(groovyPath, 'groovy'))).toBe(true)
      expect(process.env['GROOVY_HOME']).toBe(groovyHome)
    }
  )

  it("should throw an error when version can't be found", async () => {
    const version = '0.0.1'
    jest.spyOn(core, 'getInput').mockReturnValue(version)
    jest.spyOn(core, 'error').mockImplementation()

    await expect(setupGroovy()).rejects.toThrow(
      `Unable to find matching Groovy version for: '0.0.1'`
    )
    expect(core.error).toBeCalledWith(
      new Error("Unable to find matching Groovy version for: '0.0.1'")
    )
  })
})
