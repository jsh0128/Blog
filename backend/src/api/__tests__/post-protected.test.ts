// Must be first - mock dotenv before any imports
jest.mock('dotenv/config', () => {})
jest.mock('reflect-metadata', () => {})

process.env.JWT_SECRET_KEY = 'test-secret'

const mockAdminUser = {
  email: 'admin@test.com',
  name: 'Admin',
  profile_img: null,
  is_admin: true,
}

jest.mock('../../lib/middleware/AuthTypeCheck', () => ({
  validateAdmin: jest.fn((req: any, _res: any, next: any) => {
    req.user = mockAdminUser
    next()
  }),
  validateUser: jest.fn((req: any, _res: any, next: any) => {
    req.user = mockAdminUser
    next()
  }),
  validateAuth: jest.fn(() => Promise.resolve(mockAdminUser)),
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

describe('Post API routes', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    const { validateAdmin } = require('../../lib/middleware/AuthTypeCheck')
    validateAdmin.mockImplementation((req: any, _res: any, next: any) => {
      req.user = mockAdminUser
      next()
    })
  })

  describe('admin authorization boundary', () => {
    it('returns 403 when validateAdmin rejects the request', async () => {
      // Guards the invariant: post write routes must be blocked for non-admins.
      // Without this test, removing validateAdmin from the router would not fail any test.
      const { validateAdmin } = require('../../lib/middleware/AuthTypeCheck')
      validateAdmin.mockImplementationOnce((_req: any, res: any, _next: any) => {
        res.status(403).send({ message: '권한없음' })
      })

      const res = await request(app)
        .post('/post/create')
        .send({ title: 'Test', content: 'Content', introduction: 'Intro' })

      expect(res.status).toBe(403)
    })
  })

  describe('POST /post/create', () => {
    it('creates post successfully without categories', async () => {
      mockSave.mockResolvedValueOnce({ idx: 1 })

      const res = await request(app)
        .post('/post/create')
        .send({ title: 'Test Post', content: 'Content', introduction: 'Intro' })

      expect(res.status).toBe(200)
      expect(res.body.message).toBe('글 생성 성공')
    })

    it('returns 404 when category does not exist', async () => {
      mockFindOne.mockResolvedValueOnce(null)

      const res = await request(app)
        .post('/post/create')
        .send({
          title: 'Test Post',
          content: 'Content',
          introduction: 'Intro',
          categories: ['NonExistent'],
        })

      expect(res.status).toBe(404)
    })

    it('creates post with valid category', async () => {
      mockFindOne.mockResolvedValueOnce({ idx: 1, category: 'Tech' })
      mockSave
        .mockResolvedValueOnce({ idx: 1 })
        .mockResolvedValueOnce({})

      const res = await request(app)
        .post('/post/create')
        .send({
          title: 'Test Post',
          content: 'Content',
          introduction: 'Intro',
          categories: ['Tech'],
        })

      expect(res.status).toBe(200)
    })

    it('returns 500 on server error', async () => {
      mockSave.mockRejectedValueOnce(new Error('DB Error'))

      const res = await request(app)
        .post('/post/create')
        .send({ title: 'Test', content: 'Content', introduction: 'Intro' })

      expect(res.status).toBe(500)
    })
  })

  describe('POST /post/delete', () => {
    it('returns 404 when post not found', async () => {
      mockFindOne.mockResolvedValueOnce(null)

      const res = await request(app)
        .post('/post/delete')
        .send({ post_idx: 999 })

      expect(res.status).toBe(404)
    })

    it('deletes post successfully', async () => {
      mockFindOne.mockResolvedValueOnce({ idx: 1, title: 'Test' })
      mockDelete.mockResolvedValueOnce({})

      const res = await request(app)
        .post('/post/delete')
        .send({ post_idx: 1 })

      expect(res.status).toBe(200)
      expect(res.body.message).toBe('성공적으로 글이 삭제되었습니다.')
    })

    it('returns 500 on server error', async () => {
      mockFindOne.mockRejectedValueOnce(new Error('DB Error'))

      const res = await request(app)
        .post('/post/delete')
        .send({ post_idx: 1 })

      expect(res.status).toBe(500)
    })
  })

  describe('POST /post/modify', () => {
    it('returns 404 when post not found', async () => {
      mockFindOne.mockResolvedValueOnce(null)

      const res = await request(app)
        .post('/post/modify')
        .send({ post_idx: 999, title: 'Updated', content: 'Content' })

      expect(res.status).toBe(404)
    })

    it('modifies post successfully without categories', async () => {
      mockFindOne.mockResolvedValueOnce({ idx: 1, title: 'Old', content: 'Old content' })
      mockFind.mockResolvedValueOnce([])
      mockSave.mockResolvedValueOnce({})

      const res = await request(app)
        .post('/post/modify')
        .send({ post_idx: 1, title: 'Updated', content: 'Updated content' })

      expect(res.status).toBe(200)
      expect(res.body.message).toBe('글 수정 성공')
    })

    it('returns 500 on server error', async () => {
      mockFindOne.mockRejectedValueOnce(new Error('DB Error'))

      const res = await request(app)
        .post('/post/modify')
        .send({ post_idx: 1, title: 'Test', content: 'Content' })

      expect(res.status).toBe(500)
    })
  })
})
