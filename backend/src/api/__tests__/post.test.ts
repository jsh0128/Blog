// Must be first - mock dotenv before any imports
jest.mock('dotenv/config', () => {})
jest.mock('reflect-metadata', () => {})

process.env.JWT_SECRET_KEY = 'test-secret'

// Comprehensive typeorm mock with all decorators
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
    // Decorators must return decorator functions
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

describe('Post API routes', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET /post/getPost', () => {
    it('returns all posts when no idx provided', async () => {
      mockFind
        .mockResolvedValueOnce([
          {
            idx: 1,
            title: 'Test Post',
            introduction: 'Introduction',
            created_at: new Date('2024-01-15'),
            fk_user_email: 'user@example.com',
            preview_image: '/img.jpg',
          },
        ])
        .mockResolvedValueOnce([]) // postCategories
      mockFindOne.mockResolvedValue({ name: 'TestUser', email: 'user@example.com' })

      const res = await request(app).get('/post/getPost')
      expect(res.status).toBe(200)
      expect(res.body.message).toBe('글 조회 성공')
    })

    it('returns 404 when post not found with idx', async () => {
      mockFindOne.mockResolvedValue(null)

      const res = await request(app).get('/post/getPost?idx=999')
      expect(res.status).toBe(404)
    })

    it('returns 500 on server error', async () => {
      mockFind.mockRejectedValue(new Error('DB Error'))

      const res = await request(app).get('/post/getPost')
      expect(res.status).toBe(500)
    })
  })
})
