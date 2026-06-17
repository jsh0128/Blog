// Mock dotenv/config before any imports
jest.mock('dotenv/config', () => {})

// Set env before importing module
process.env.JWT_SECRET_KEY = 'test-secret-key-for-unit-tests'

import { createToken, verifyToken } from '../jwtToken'

describe('createToken', () => {
  it('creates a JWT string', () => {
    const token = createToken('test@example.com', 'TestUser', '/profile.jpg', false, true)
    expect(typeof token).toBe('string')
    expect(token.split('.')).toHaveLength(3) // JWT has 3 parts
  })

  it('creates different tokens for different inputs', () => {
    const token1 = createToken('user1@example.com', 'User1', '/p1.jpg', false, true)
    const token2 = createToken('user2@example.com', 'User2', '/p2.jpg', true, false)
    expect(token1).not.toBe(token2)
  })
})

describe('verifyToken', () => {
  it('verifies a valid token and returns payload', () => {
    const token = createToken('test@example.com', 'TestUser', '/profile.jpg', false, true)
    const decoded: any = verifyToken(token)
    expect(decoded.email).toBe('test@example.com')
    expect(decoded.name).toBe('TestUser')
    expect(decoded.is_admin).toBe(false)
    expect(decoded.is_github).toBe(true)
  })

  it('throws an error for an invalid token', () => {
    expect(() => verifyToken('invalid.token.here')).toThrow()
  })

  it('throws an error for a tampered token', () => {
    const token = createToken('test@example.com', 'TestUser', '/profile.jpg', false, true)
    const tampered = token.slice(0, -5) + 'xxxxx'
    expect(() => verifyToken(tampered)).toThrow()
  })
})
