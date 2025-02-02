import {env, execPath} from 'process'
import {join} from 'path'
import {test} from '@jest/globals'
import {execFileSync, ExecFileSyncOptions} from 'child_process'

// shows how the runner will run a javascript action with env / stdout protocol
// eslint-disable-next-line jest/expect-expect, jest/no-disabled-tests
test.skip('runs', () => {
  env['INPUT_GROOVY-VERSION'] = '4.0.9'
  const np = execPath
  const ip = join(__dirname, '..', 'lib', 'main.js')
  const options: ExecFileSyncOptions = {
    env
  }
  // eslint-disable-next-line no-console
  console.log(execFileSync(np, [ip], options).toString())
})
