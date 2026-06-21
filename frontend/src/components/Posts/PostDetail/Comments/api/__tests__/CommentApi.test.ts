jest.mock('common/lib/axios', () => ({
  __esModule: true,
  default: { get: jest.fn(), post: jest.fn() },
}))

import CommentApi from '../CommentApi'

const getAxios = () => require('common/lib/axios').default

const mockComments = [
  { idx: 1, content: 'Hello', user_name: 'User1', user_email: 'a@a.com', user_profile_img: null, created_at: '2024-01-01' },
]

describe('CommentApi', () => {
  beforeEach(() => jest.clearAllMocks())

  describe('getComments', () => {
    it('calls GET /comment/getComment with post_idx param', async () => {
      getAxios().get.mockResolvedValueOnce({ data: { data: mockComments } })
      const result = await CommentApi.getComments(1)
      expect(getAxios().get).toHaveBeenCalledWith('/comment/getComment', {
        params: { post_idx: 1 },
      })
      expect(result).toEqual(mockComments)
    })
  })

  describe('postComment', () => {
    it('calls POST /comment/create and returns data', async () => {
      const body = { post_idx: 1, content: 'New comment' }
      getAxios().post.mockResolvedValueOnce({ data: { success: true } })
      const result = await CommentApi.postComment(body as any)
      expect(getAxios().post).toHaveBeenCalledWith('/comment/create', body)
      expect(result).toEqual({ success: true })
    })
  })
})
