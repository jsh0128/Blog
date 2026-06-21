jest.mock('@tanstack/react-query', () => ({
  useQuery: jest.fn().mockReturnValue({
    data: [
      { idx: 1, comment: 'Hello', user_name: 'User1', created_at: '2024-01-01' },
    ],
    isLoading: false,
    isSuccess: true,
  }),
  useMutation: jest.fn().mockReturnValue({ mutate: jest.fn(), isLoading: false }),
  useQueryClient: jest.fn().mockReturnValue({ setQueryData: jest.fn(), getQueryData: jest.fn() }),
  QueryClient: jest.fn().mockImplementation(() => ({})),
  QueryClientProvider: ({ children }: any) => children,
}))

jest.mock('../useCommentUpdater', () => ({
  useCommentUpdater: jest.fn(() => ({ commentUpdater: jest.fn() })),
}))

import { useComments, usePostComment } from '../useCommentApi'

describe('useComments', () => {
  it('calls useQuery with correct key', () => {
    const { useQuery } = require('@tanstack/react-query')
    useComments(1)
    expect(useQuery).toHaveBeenCalledWith(['comments', 1], expect.any(Function))
  })

  it('returns comment data', () => {
    const result = useComments(1)
    expect(result.data).toHaveLength(1)
    expect(result.data[0].comment).toBe('Hello')
  })
})

describe('usePostComment', () => {
  it('returns commentMutate function', () => {
    const result = usePostComment()
    expect(result.commentMutate).toBeDefined()
  })

  it('accepts onSuccess and onError callbacks', () => {
    const onSuccess = jest.fn()
    const onError = jest.fn()
    const result = usePostComment(onSuccess, onError)
    expect(result.commentMutate).toBeDefined()
  })
})
