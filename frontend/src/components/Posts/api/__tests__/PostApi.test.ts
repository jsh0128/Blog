jest.mock('common/lib/axios', () => {
  const mockGet = jest.fn()
  const mockPost = jest.fn()
  return {
    __esModule: true,
    default: { get: mockGet, post: mockPost },
  }
})

import PostApi from '../PostApi'

const getAxios = () => require('common/lib/axios').default

const mockPosts = [
  { idx: 1, title: 'Post 1', introduction: 'Intro', content: 'Content', preview_image: '/img.jpg', created_at: '2024-01-01', fk_user_email: 'a@a.com', category: ['React'], user_name: 'User1' },
]

describe('PostApi', () => {
  beforeEach(() => jest.clearAllMocks())

  describe('getPosts', () => {
    it('calls GET /post/getPost and returns data', async () => {
      getAxios().get.mockResolvedValueOnce({ data: { data: mockPosts } })
      const result = await PostApi.getPosts()
      expect(getAxios().get).toHaveBeenCalledWith('/post/getPost')
      expect(result).toEqual(mockPosts)
    })
  })

  describe('createPost', () => {
    it('calls POST /post/create and returns data', async () => {
      const body = { title: 'New', introduction: 'Intro', categories: [], content: 'Body', preview_img: '' }
      getAxios().post.mockResolvedValueOnce({ data: { success: true } })
      const result = await PostApi.createPost(body)
      expect(getAxios().post).toHaveBeenCalledWith('/post/create', body)
      expect(result).toEqual({ success: true })
    })
  })
})
