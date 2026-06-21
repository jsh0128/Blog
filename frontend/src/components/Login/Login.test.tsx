import React from 'react'
import { render, screen, act } from '@testing-library/react'
import GithubAuthContainer from './index'

// Mock react-query
jest.mock('@tanstack/react-query', () => ({
  useMutation: jest.fn().mockReturnValue({
    mutate: jest.fn(),
    isLoading: false,
  }),
  useQuery: jest.fn().mockReturnValue({
    data: undefined,
    isLoading: false,
  }),
}))

const mockRouterPush = jest.fn()

// Override the module-level mock inline to control exactly what gets exported
jest.mock('next/router', () => {
  const push = jest.fn()
  return {
    __esModule: true,
    default: { push, replace: jest.fn(), events: { on: jest.fn(), off: jest.fn() } },
    useRouter: () => ({ push, replace: jest.fn(), pathname: '/login', query: {} }),
  }
})

// Mock react-cookie
jest.mock('react-cookie', () => ({
  useCookies: jest.fn().mockReturnValue([{}, jest.fn()]),
}))

// Mock qs
jest.mock('qs', () => ({
  parse: jest.fn().mockReturnValue({ code: 'test-code' }),
}))

// Mock the auth API
jest.mock('./api/AuthApi', () => ({
  default: {
    getToken: jest.fn().mockResolvedValue({ data: 'test-token' }),
  },
}))

describe('GithubAuthContainer (Login)', () => {
  it('renders github login loading text', async () => {
    await act(async () => {
      render(<GithubAuthContainer />)
    })
    expect(screen.getByText('Github Login중..')).toBeInTheDocument()
  })
})
