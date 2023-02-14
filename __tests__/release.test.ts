import {fetchAvailableVersions, getMatchingVersion} from '../src/release'

describe('release', () => {
  it('should fetch versions', async () => {
    const versions = await fetchAvailableVersions()
    expect(versions.length).toBeGreaterThan(220)
    expect(versions[0]).toBe('1.1-beta-2')
    expect(versions).toContain('4.0.9')
  })

  it("should find the latest version that satisfies '2.x'", async () => {
    const version = await getMatchingVersion('2.x')
    expect(version).toBeDefined()
    expect(version).toBe('2.5.21')
  })

  it('should find latest 2.x releases when excluding 3.0.0', async () => {
    const version = await getMatchingVersion('>=2.x <3.0.0')
    expect(version).toBeDefined()
    expect(version).toBe('2.5.21')
  })

  it('should find 4.0.0-rc-2 pre-release', async () => {
    const version = await getMatchingVersion('4.0.0-rc-2')
    expect(version).toBeDefined()
    expect(version).toBe('4.0.0-rc-2')
  })
})
