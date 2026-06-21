jest.mock('common/lib/axios', () => ({
  __esModule: true,
  default: { get: jest.fn(), post: jest.fn() },
}))

import CategoryApi from '../CategoryApi'

const getAxios = () => require('common/lib/axios').default

const mockCategories = [
  { idx: 1, category: 'TypeScript' },
  { idx: 2, category: 'React' },
]

const mockPosts = [
  { idx: 1, title: 'Post', introduction: 'Intro', content: 'Body', preview_image: '/img.jpg', created_at: '2024-01-01', fk_user_email: 'a@a.com', category: ['TypeScript'], user_name: 'User' },
]

describe('CategoryApi', () => {
  beforeEach(() => jest.clearAllMocks())

  describe('getCategory', () => {
    it('calls GET /category/getCategory and returns data', async () => {
      getAxios().get.mockResolvedValueOnce({ data: { data: mockCategories } })
      const result = await CategoryApi.getCategory()
      expect(getAxios().get).toHaveBeenCalledWith('/category/getCategory')
      expect(result).toEqual(mockCategories)
    })
  })

  describe('getCategoryPosts', () => {
    it('calls GET /category/searchpostcategory with category param', async () => {
      getAxios().get.mockResolvedValueOnce({ data: { data: mockPosts } })
      const result = await CategoryApi.getCategoryPosts(1)
      expect(getAxios().get).toHaveBeenCalledWith('/category/searchpostcategory', {
        params: { category: 1 },
      })
      expect(result).toEqual(mockPosts)
    })
  })
})
