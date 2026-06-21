import React from 'react'
import { render, screen } from '@testing-library/react'
import Header from './index'

// Mock the auth API hook
jest.mock('components/Login/api/useAuthApi', () => ({
  useMeInfoApi: jest.fn().mockReturnValue({ data: null, isLoading: false }),
}))

// Mock next/router
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    pathname: '/',
    query: {},
    asPath: '/',
  }),
}))

describe('Header', () => {
  it('renders the blog title link', () => {
    render(<Header />)
    expect(screen.getByText('Blash')).toBeInTheDocument()
  })

  it('renders github login link when not logged in', () => {
    render(<Header />)
    expect(screen.getByText('깃허브 로그인')).toBeInTheDocument()
  })

  it('renders without crashing', () => {
    expect(() => render(<Header />)).not.toThrow()
  })
})

describe('Header when logged in as admin', () => {
  beforeEach(() => {
    const { useMeInfoApi } = require('components/Login/api/useAuthApi')
    useMeInfoApi.mockReturnValue({
      data: { data: { data: { name: 'TestUser', is_admin: true } } },
      isLoading: false,
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('shows user name when logged in', () => {
    render(<Header />)
    expect(screen.getByText('TestUser')).toBeInTheDocument()
  })

  it('shows 글쓰기 button for admin users', () => {
    render(<Header />)
    expect(screen.getByText('글쓰기')).toBeInTheDocument()
  })
})
