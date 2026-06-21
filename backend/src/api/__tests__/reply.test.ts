// Must be first - mock dotenv before any imports
jest.mock('dotenv/config', () => {})
jest.mock('reflect-metadata', () => {})

process.env.JWT_SECRET_KEY = 'test-secret'

const mockUser = {
  email: 'user@test.com',
  name: 'TestUser',
  profile_img: null,
  is_admin: false,
}

jest.mock('../../lib/middleware/AuthTypeCheck', () => ({
  validateUser: jest.fn((req: any, _res: any, next: any) => {
    req.user = mockUser
    next()
  }),
  validateAdmin: jest.fn((req: any, _res: any, next: any) => {
    req.user = { ...mockUser, is_admin: true }
    next()
  }),
  validateAuth: jest.fn(() => Promise.resolve(mockUser)),
}))

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

describe('Reply API routes', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    const { validateUser } = require('../../lib/middleware/AuthTypeCheck')
    validateUser.mockImplementation((req: any, _res: any, next: any) => {
      req.user = mockUser
      next()
    })
  })

  describe('POST /reply/create', () => {
    it('returns 403 when content or comment_idx missing', async () => {
      const res = await request(app)
        .post('/reply/create')
        .send({ content: '' })

      expect(res.status).toBe(403)
    })

    it('creates reply successfully when all fields provided', async () => {
      mockSave.mockResolvedValueOnce({})

      const res = await request(app)
        .post('/reply/create')
        .send({ comment_idx: 1, content: 'Test reply' })

      expect(res.status).toBe(200)
      expect(res.body.message).toBe('답글 작성 성공')
    })

    it('returns 500 on server error', async () => {
      mockSave.mockRejectedValueOnce(new Error('DB Error'))

      const res = await request(app)
        .post('/reply/create')
        .send({ comment_idx: 1, content: 'Test reply' })

      expect(res.status).toBe(500)
    })
  })

  describe('POST /reply/modify', () => {
    it('returns 404 when reply not found', async () => {
      mockFindOne.mockResolvedValueOnce(null)

      const res = await request(app)
        .post('/reply/modify')
        .send({ reply_idx: 999, content: 'Updated' })

      expect(res.status).toBe(404)
    })

    it('returns 403 when content is empty', async () => {
      mockFindOne.mockResolvedValueOnce({
        idx: 1,
        fk_user_email: 'user@test.com',
        content: 'Original',
      })

      const res = await request(app)
        .post('/reply/modify')
        .send({ reply_idx: 1, content: '' })

      expect(res.status).toBe(403)
    })

    it('returns 403 when user is not the reply author', async () => {
      mockFindOne.mockResolvedValueOnce({
        idx: 1,
        fk_user_email: 'other@test.com',
        content: 'Original',
      })

      const res = await request(app)
        .post('/reply/modify')
        .send({ reply_idx: 1, content: 'Updated' })

      expect(res.status).toBe(403)
    })

    it('modifies reply successfully', async () => {
      mockFindOne.mockResolvedValueOnce({
        idx: 1,
        fk_user_email: 'user@test.com',
        content: 'Original',
      })
      mockSave.mockResolvedValueOnce({})

      const res = await request(app)
        .post('/reply/modify')
        .send({ reply_idx: 1, content: 'Updated content' })

      expect(res.status).toBe(200)
      expect(res.body.message).toBe('변경 성공')
    })

    it('returns 500 on server error', async () => {
      mockFindOne.mockRejectedValueOnce(new Error('DB Error'))

      const res = await request(app)
        .post('/reply/modify')
        .send({ reply_idx: 1, content: 'Updated' })

      expect(res.status).toBe(500)
    })
  })

  describe('GET /reply/delete', () => {
    it('returns 404 when reply not found', async () => {
      mockFindOne.mockResolvedValueOnce(null)

      const res = await request(app).get('/reply/delete?reply_idx=999')
      expect(res.status).toBe(404)
    })

    it('returns 403 when user is not the reply author', async () => {
      mockFindOne.mockResolvedValueOnce({
        idx: 1,
        fk_user_email: 'other@test.com',
        content: 'Some reply',
      })

      const res = await request(app).get('/reply/delete?reply_idx=1')
      expect(res.status).toBe(403)
    })

    it('deletes reply when user is the author', async () => {
      mockFindOne.mockResolvedValueOnce({
        idx: 1,
        fk_user_email: 'user@test.com',
        content: 'My reply',
      })
      mockDelete.mockResolvedValueOnce({})

      const res = await request(app).get('/reply/delete?reply_idx=1')
      expect(res.status).toBe(200)
      expect(res.body.message).toBe('삭제 성공')
    })

    it('returns 500 on server error', async () => {
      mockFindOne.mockRejectedValueOnce(new Error('DB Error'))

      const res = await request(app).get('/reply/delete?reply_idx=1')
      expect(res.status).toBe(500)
    })
  })
})
