jest.mock('@tanstack/react-query', () => ({
  useQuery: jest.fn().mockReturnValue({
    data: {
      data: {
        category: 'TypeScript',
        content: '# Hello',
        created_at: '2024-01-15T00:00:00Z',
        preview_image: '/test.jpg',
        title: 'Test Post',
      },
    },
    isLoading: false,
    isSuccess: true,
  }),
  QueryClient: jest.fn().mockImplementation(() => ({})),
  QueryClientProvider: ({ children }: any) => children,
}))

import { usePostDetailApi } from '../usePostDetailApi'

describe('usePostDetailApi', () => {
  it('calls useQuery with correct key', () => {
    const { useQuery } = require('@tanstack/react-query')
    usePostDetailApi('1')
    expect(useQuery).toHaveBeenCalledWith(['post', '1'], expect.any(Function))
  })

  it('returns query data', () => {
    const result = usePostDetailApi('1')
    expect(result.data).toBeDefined()
    expect(result.data.data.title).toBe('Test Post')
  })
})
