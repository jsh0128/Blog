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
    it('returns posts for a valid category (multi-post fixture)', async () => {
      // Handler flow per post: findOne(post) → then outer findOne(user) + inner findOne(category)
      // Using 2 posts to guard against fixture-size-dependent stub exhaustion
      const mockCategory = { idx: 1, category: 'Technology' }
      const mockPost1 = { idx: 1, title: 'Post 1', fk_user_email: 'user@test.com', categories: [], user_name: 'User' }
      const mockPost2 = { idx: 2, title: 'Post 2', fk_user_email: 'user@test.com', categories: [], user_name: 'User' }
      const mockUser = { name: 'User', email: 'user@test.com' }
      const mockCategoryResult = { idx: 1, category: 'Technology' }

      mockFindOne
        .mockResolvedValueOnce(mockCategory)       // categoryRepository.findOne (checkCategory)
        .mockResolvedValueOnce(mockPost1)          // postRepository.findOne (loop post 1)
        .mockResolvedValueOnce(mockPost2)          // postRepository.findOne (loop post 2)
        .mockResolvedValueOnce(mockUser)           // userRepository.findOne (post 1's user)
        .mockResolvedValueOnce(mockCategoryResult) // categoryRepository.findOne (post 1's category)
        .mockResolvedValueOnce(mockUser)           // userRepository.findOne (post 2's user)
        .mockResolvedValueOnce(mockCategoryResult) // categoryRepository.findOne (post 2's category)

      mockFind
        .mockResolvedValueOnce([                                        // postCategoryRepository.find (posts in category)
          { fk_post_idx: 1, fk_category_idx: 1 },
          { fk_post_idx: 2, fk_category_idx: 1 },
        ])
        .mockResolvedValueOnce([                                        // postCategoryRepository.find (all postCategories)
          { idx: 1, fk_post_idx: 1, fk_category_idx: 1 },
          { idx: 2, fk_post_idx: 2, fk_category_idx: 1 },
        ])

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
