jest.mock('@tanstack/react-query', () => ({
  useQuery: jest.fn().mockReturnValue({ data: [], isLoading: false, isSuccess: true }),
  useMutation: jest.fn().mockReturnValue({ mutate: jest.fn(), isLoading: false }),
  useQueryClient: jest.fn().mockReturnValue({ setQueryData: jest.fn() }),
  QueryClient: jest.fn().mockImplementation(() => ({})),
  QueryClientProvider: ({ children }: any) => children,
}))

jest.mock('../usePostUpdater', () => ({
  usePostUpdater: jest.fn(() => ({ postUpdater: jest.fn() })),
}))

import { usePostApi, useCreatePost } from '../usePostApi'

describe('usePostApi', () => {
  it('calls useQuery with correct key', () => {
    const { useQuery } = require('@tanstack/react-query')
    usePostApi()
    expect(useQuery).toHaveBeenCalledWith(['posts', undefined], expect.any(Function))
  })

  it('calls useQuery with category id when provided', () => {
    const { useQuery } = require('@tanstack/react-query')
    usePostApi(5)
    expect(useQuery).toHaveBeenCalledWith(['posts', 5], expect.any(Function))
  })

  it('returns query result', () => {
    const result = usePostApi()
    expect(result).toHaveProperty('data')
    expect(result).toHaveProperty('isLoading')
  })
})

describe('useCreatePost', () => {
  it('returns createPostMutate', () => {
    const result = useCreatePost()
    expect(result.createPostMutate).toBeDefined()
  })
})
