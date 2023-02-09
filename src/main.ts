import * as core from '@actions/core'

const run = async () => {
  try {
    const groovyVersion: string = core.getInput('groovy-version')
    core.debug(`Supplied groovy-version: '${groovyVersion}'`) // debug is only output if you set the secret `ACTIONS_STEP_DEBUG` to true

    core.setOutput('time', new Date().toTimeString())
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message)
    }
  }
}

run()
