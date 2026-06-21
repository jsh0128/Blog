jest.mock('@tanstack/react-query', () => ({
  useQueryClient: jest.fn(),
}))

jest.mock('components/Login/api/useAuthApi', () => ({
  useMeInfoApi: jest.fn(() => ({
    data: { data: { data: { name: 'TestUser', email: 'test@test.com', profile_img: '/img.jpg' } } },
  })),
}))

jest.mock('dayjs', () => () => ({ format: () => '2026-01-01 12:00:00' }))

import { useCommentUpdater } from '../useCommentUpdater'

const getReactQuery = () => require('@tanstack/react-query')

describe('useCommentUpdater', () => {
  let mockSetQueryData: jest.Mock

  beforeEach(() => {
    mockSetQueryData = jest.fn()
    getReactQuery().useQueryClient.mockReturnValue({ setQueryData: mockSetQueryData })
  })

  it('returns commentUpdater function', () => {
    const { commentUpdater } = useCommentUpdater()
    expect(typeof commentUpdater).toBe('function')
  })

  it('calls setQueryData with correct key', () => {
    const { commentUpdater } = useCommentUpdater()
    commentUpdater({ content: 'Test comment', post_idx: 1 })

    expect(mockSetQueryData).toHaveBeenCalledWith(
      ['comments', 1],
      expect.any(Function)
    )
  })

  it('prepends new comment to existing list', () => {
    const { commentUpdater } = useCommentUpdater()
    commentUpdater({ content: 'New comment', post_idx: 2 })

    const updaterFn = mockSetQueryData.mock.calls[0][1]
    const oldData = [
      {
        idx: 1,
        content: 'Old comment',
        created_at: '2025-01-01 00:00:00',
        user_email: 'old@test.com',
        user_name: 'OldUser',
        user_profile_img: '',
      },
    ]
    const result = updaterFn(oldData)

    expect(result).toHaveLength(2)
    expect(result[0].content).toBe('New comment')
    expect(result[0].user_name).toBe('TestUser')
    expect(result[0].user_email).toBe('test@test.com')
    expect(result[0].user_profile_img).toBe('/img.jpg')
    expect(result[0].created_at).toBe('2026-01-01 12:00:00')
    expect(result[0].idx).toBe(2)
  })

  it('sets idx to oldData.length + 1', () => {
    const { commentUpdater } = useCommentUpdater()
    commentUpdater({ content: 'Third comment', post_idx: 3 })

    const updaterFn = mockSetQueryData.mock.calls[0][1]
    const oldData = [
      { idx: 1, content: 'A', created_at: '', user_email: '', user_name: '', user_profile_img: '' },
      { idx: 2, content: 'B', created_at: '', user_email: '', user_name: '', user_profile_img: '' },
    ]
    const result = updaterFn(oldData)

    expect(result[0].idx).toBe(3)
    expect(result).toHaveLength(3)
  })
})
