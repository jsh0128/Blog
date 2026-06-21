import createURL from '../createURL'

describe('createURL', () => {
  const originalEnv = process.env.SERVER_ADDRESS

  beforeEach(() => {
    process.env.SERVER_ADDRESS = 'http://localhost:3001'
  })

  afterEach(() => {
    process.env.SERVER_ADDRESS = originalEnv
  })

  it('returns full URL with server address and public path', () => {
    const result = createURL('image.jpg')
    expect(result).toBe('http://localhost:3001/public/image.jpg')
  })

  it('handles filenames with subdirectory', () => {
    const result = createURL('uploads/photo.png')
    expect(result).toBe('http://localhost:3001/public/uploads/photo.png')
  })
})
