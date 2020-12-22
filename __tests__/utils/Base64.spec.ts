
import Base64 from '../../src/utils/Base64'

describe('Base64 Utils', () => {
  it('should encode the text correctly!!', async () => {
    const txtPlain: string = 'Coded text with accentuation and number of 0,1,2,3,5 and # @'
    const txtEncoded: string = 'Q29kZWQgdGV4dCB3aXRoIGFjY2VudHVhdGlvbiBhbmQgbnVtYmVyIG9mIDAsMSwyLDMsNSBhbmQgIyBA'

    expect(Base64.encode(txtPlain)).toBe(txtEncoded)
  })
  it('should decode the text correctly!!', async () => {
    const txtPlain: string = 'Coded text with accentuation and number of 0,1,2,3,5 and # @'
    const txtEncoded: string = 'Q29kZWQgdGV4dCB3aXRoIGFjY2VudHVhdGlvbiBhbmQgbnVtYmVyIG9mIDAsMSwyLDMsNSBhbmQgIyBA'

    expect(Base64.decode(txtEncoded)).toBe(txtPlain)
  })
})
