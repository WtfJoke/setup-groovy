import {isReleaseAvailable, fetchAvailableVersions} from '../src/release'

describe('release', () => {
  it('should fetch versions', async () => {
    const versions = await fetchAvailableVersions()
    expect(versions.length).toBeGreaterThan(220)
    expect(versions[0]).toBe('1.1-beta-2')
    expect(versions).toContain('4.0.9')
  })

  it("should fetch releases for '4.0.9'", async () => {
    const releases = await isReleaseAvailable('4.0.9')
    expect(releases).toBe(true)
  })
})
