jest.mock('common/lib/axios', () => ({
  __esModule: true,
  default: { get: jest.fn() },
}))

import PostDetailApi from '../PostDetailApi'

const getAxios = () => require('common/lib/axios').default

describe('PostDetailApi', () => {
  it('getPostDetail calls GET /post/getPost with idx param', async () => {
    const mockPost = { idx: 1, title: 'Test Post', content: 'Content', categories: [] }
    getAxios().get.mockResolvedValueOnce({ data: mockPost })

    const result = await PostDetailApi.getPostDetail(1)

    expect(getAxios().get).toHaveBeenCalledWith('/post/getPost', { params: { idx: 1 } })
    expect(result).toEqual(mockPost)
  })

  it('getPostDetail passes correct idx parameter', async () => {
    getAxios().get.mockResolvedValueOnce({ data: { idx: 42 } })

    await PostDetailApi.getPostDetail(42)

    expect(getAxios().get).toHaveBeenCalledWith('/post/getPost', { params: { idx: 42 } })
  })
})
