// Mock react-query entirely to avoid ESM/CJS issues
jest.mock('@tanstack/react-query', () => ({
  useQuery: jest.fn().mockReturnValue({
    data: undefined,
    isLoading: true,
    isError: false,
    error: null,
  }),
  useMutation: jest.fn().mockReturnValue({
    mutate: jest.fn(),
    isLoading: false,
  }),
  QueryClient: jest.fn().mockImplementation(() => ({})),
  QueryClientProvider: ({ children }: any) => children,
}))

import { useMeInfoApi } from '../useAuthApi'

describe('useMeInfoApi', () => {
  it('calls useQuery with correct key', () => {
    const { useQuery } = require('@tanstack/react-query')
    useMeInfoApi()
    expect(useQuery).toHaveBeenCalledWith(['meInfo'], expect.any(Function))
  })

  it('returns query result', () => {
    const result = useMeInfoApi()
    expect(result).toHaveProperty('data')
    expect(result).toHaveProperty('isLoading')
    expect(result).toHaveProperty('isError')
  })
})
