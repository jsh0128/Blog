// Must be first - mock dotenv before any imports
jest.mock('dotenv/config', () => {})
jest.mock('reflect-metadata', () => {})

process.env.JWT_SECRET_KEY = 'test-secret'

const mockFind = jest.fn()
const mockFindOne = jest.fn()
const mockSave = jest.fn()
const mockDelete = jest.fn()

const noopDecorator = () => () => {}

jest.mock('typeorm', () => {
  return {
    getRepository: jest.fn().mockReturnValue({
      find: mockFind,
      findOne: mockFindOne,
      save: mockSave,
      delete: mockDelete,
      create: jest.fn(),
    }),
    createConnection: jest.fn().mockResolvedValue({}),
    Entity: () => noopDecorator(),
    PrimaryGeneratedColumn: () => noopDecorator(),
    PrimaryColumn: () => noopDecorator(),
    Column: () => noopDecorator(),
    ManyToOne: () => noopDecorator(),
    OneToMany: () => noopDecorator(),
    JoinColumn: () => noopDecorator(),
    CreateDateColumn: () => noopDecorator(),
    Repository: class {},
    Connection: class {},
  }
})

import request from 'supertest'
import app from '../../app'

describe('Category API routes', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET /category/getCategory', () => {
    it('returns categories successfully', async () => {
      mockFind.mockResolvedValueOnce([
        { idx: 1, category: 'Technology' },
        { idx: 2, category: 'Travel' },
      ])

      const res = await request(app).get('/category/getCategory')
      expect(res.status).toBe(200)
      expect(res.body.message).toBe('카테고리 조회 성공')
    })

    it('returns 500 on server error', async () => {
      mockFind.mockRejectedValueOnce(new Error('DB Error'))

      const res = await request(app).get('/category/getCategory')
      expect(res.status).toBe(500)
    })
  })

  describe('GET /category/searchPostCategory', () => {
    it('returns posts for a valid category', async () => {
      const mockCategory = { idx: 1, category: 'Technology' }
      const mockPosts = [{ fk_post_idx: 1, fk_category_idx: 1 }]
      const mockPost = {
        idx: 1,
        title: 'Post 1',
        fk_user_email: 'user@test.com',
        categories: [],
        user_name: 'User',
      }

      mockFindOne
        .mockResolvedValueOnce(mockCategory) // checkCategory
        .mockResolvedValueOnce(mockPost)     // postRepository.findOne for each post
        .mockResolvedValueOnce({ name: 'User', email: 'user@test.com' }) // userRepository.findOne

      mockFind
        .mockResolvedValueOnce(mockPosts) // postCategoryRepository.find
        .mockResolvedValueOnce([{ idx: 1, fk_post_idx: 1, fk_category_idx: 1 }]) // postCategories

      const res = await request(app).get('/category/searchPostCategory?category=1')
      expect(res.status).toBe(200)
    })

    it('returns 500 on server error', async () => {
      mockFindOne.mockRejectedValueOnce(new Error('DB Error'))

      const res = await request(app).get('/category/searchPostCategory?category=1')
      expect(res.status).toBe(500)
    })
  })
})
