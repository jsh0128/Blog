jest.mock('@tanstack/react-query', () => ({
  useQuery: jest.fn().mockReturnValue({ data: [] }),
  useMutation: jest.fn().mockReturnValue({ mutate: jest.fn() }),
  useQueryClient: jest.fn().mockReturnValue({ setQueryData: jest.fn() }),
  QueryClient: jest.fn().mockImplementation(() => ({})),
  QueryClientProvider: ({ children }: any) => children,
}))

jest.mock('components/Login/api/useAuthApi', () => ({
  useMeInfoApi: jest.fn(() => ({
    data: { data: { data: { name: 'TestUser', email: 'test@test.com' } } },
  })),
}))

jest.mock('components/Posts/api/usePostApi', () => ({
  usePostApi: jest.fn(() => ({ data: [] })),
}))

import { usePostUpdater } from '../usePostUpdater'

describe('usePostUpdater', () => {
  it('returns postUpdater function', () => {
    const result = usePostUpdater()
    expect(result.postUpdater).toBeDefined()
    expect(typeof result.postUpdater).toBe('function')
  })

  it('postUpdater updates query data', () => {
    const mockSetQueryData = jest.fn()
    const { useQueryClient } = require('@tanstack/react-query')
    useQueryClient.mockReturnValueOnce({ setQueryData: mockSetQueryData })

    const { postUpdater } = usePostUpdater()
    postUpdater({ title: 'New', introduction: 'Intro', categories: [], content: 'Body', preview_img: '/img.jpg' })

    expect(mockSetQueryData).toHaveBeenCalledWith(['posts', null], expect.any(Function))
  })
})
