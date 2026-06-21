// Must be first - mock dotenv before any imports
jest.mock('dotenv/config', () => {})
jest.mock('reflect-metadata', () => {})

process.env.JWT_SECRET_KEY = 'test-secret'

const mockFind = jest.fn()
const mockFindOne = jest.fn()
const mockSave = jest.fn()

const noopDecorator = () => () => {}

jest.mock('typeorm', () => {
  return {
    getRepository: jest.fn().mockReturnValue({
      find: mockFind,
      findOne: mockFindOne,
      save: mockSave,
      delete: jest.fn(),
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

describe('Comment API routes', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET /comment/getComment', () => {
    it('returns 404 when no post_idx provided', async () => {
      const res = await request(app).get('/comment/getComment')
      expect(res.status).toBe(404)
    })

    it('returns comments when post_idx is provided', async () => {
      mockFind
        .mockResolvedValueOnce([
          {
            idx: 1,
            content: 'Test comment',
            created_at: new Date(),
            fk_user_email: 'user@example.com',
            fk_post_idx: 1,
          },
        ])
        .mockResolvedValueOnce([]) // replies
      mockFindOne.mockResolvedValue({
        name: 'TestUser',
        profile_img: '/profile.jpg',
        email: 'user@example.com',
      })

      const res = await request(app).get('/comment/getComment?post_idx=1')
      expect(res.status).toBe(200)
      expect(res.body.message).toBe('댓글 조회 성공')
    })

    it('returns 500 on server error', async () => {
      mockFind.mockRejectedValue(new Error('DB Error'))
      const res = await request(app).get('/comment/getComment?post_idx=1')
      expect(res.status).toBe(500)
    })
  })
})
