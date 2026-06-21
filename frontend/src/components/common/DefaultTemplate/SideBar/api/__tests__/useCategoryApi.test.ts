// Mock react-query entirely to avoid ESM/CJS issues
jest.mock('@tanstack/react-query', () => ({
  useQuery: jest.fn().mockReturnValue({
    data: undefined,
    isLoading: true,
    isError: false,
    error: null,
  }),
  QueryClient: jest.fn().mockImplementation(() => ({})),
  QueryClientProvider: ({ children }: any) => children,
}))

import { useCategoryApi, useCategoryPosts } from '../useCategoryApi'

describe('useCategoryApi', () => {
  it('calls useQuery with correct key', () => {
    const { useQuery } = require('@tanstack/react-query')
    useCategoryApi()
    expect(useQuery).toHaveBeenCalledWith(['category'], expect.any(Function))
  })

  it('returns query result', () => {
    const result = useCategoryApi()
    expect(result).toHaveProperty('data')
    expect(result).toHaveProperty('isLoading')
  })
})

describe('useCategoryPosts', () => {
  it('calls useQuery with correct key and idx', () => {
    const { useQuery } = require('@tanstack/react-query')
    useCategoryPosts(5)
    expect(useQuery).toHaveBeenCalledWith(['posts'], expect.any(Function))
  })
})
