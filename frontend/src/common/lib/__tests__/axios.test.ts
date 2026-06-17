jest.mock('axios', () => {
  const mockAxiosInstance = {
    get: jest.fn(),
    post: jest.fn(),
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() },
    },
    defaults: { baseURL: '' },
  }
  return {
    default: {
      create: jest.fn(() => mockAxiosInstance),
    },
    create: jest.fn(() => mockAxiosInstance),
  }
})

jest.mock('react-cookie', () => ({
  Cookies: jest.fn().mockImplementation(() => ({
    get: jest.fn().mockReturnValue(null),
  })),
}))

import { setHeader } from '../axios'

describe('axios config', () => {
  it('adds Authorization header when token exists', () => {
    const { Cookies } = require('react-cookie')
    Cookies.mockImplementationOnce(() => ({
      get: jest.fn().mockReturnValue('my-token'),
    }))

    const config = {
      headers: {},
    } as any
    const result = setHeader(config)
    expect(result.headers.Authorization).toBe('Bearer my-token')
  })

  it('does not add Authorization header when no token', () => {
    const config = {
      headers: {},
    } as any
    const result = setHeader(config)
    expect(result.headers.Authorization).toBeUndefined()
  })

  it('handles config without headers gracefully', () => {
    const config = {} as any
    const result = setHeader(config)
    expect(result).toBeDefined()
  })
})
