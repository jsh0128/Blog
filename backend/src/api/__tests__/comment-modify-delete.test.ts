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

describe('Comment modify and delete routes', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    const { validateUser } = require('../../lib/middleware/AuthTypeCheck')
    validateUser.mockImplementation((req: any, _res: any, next: any) => {
      req.user = mockUser
      next()
    })
  })

  describe('POST /comment/modify', () => {
    it('returns 403 when user is not the comment author', async () => {
      mockFindOne.mockResolvedValueOnce({
        idx: 1,
        fk_user_email: 'other@test.com',
        content: 'Original comment',
      })

      const res = await request(app)
        .post('/comment/modify')
        .send({ idx: 1, content: 'Updated content' })

      expect(res.status).toBe(403)
    })

    it('modifies comment successfully', async () => {
      const mockComment = {
        idx: 1,
        fk_user_email: 'user@test.com',
        content: 'Original comment',
      }
      mockFindOne.mockResolvedValueOnce(mockComment)
      mockSave.mockResolvedValueOnce({})

      const res = await request(app)
        .post('/comment/modify')
        .send({ idx: 1, content: 'Updated content' })

      expect(res.status).toBe(200)
      expect(res.body.message).toBe('댓글 변경 성공')
    })

    it('returns 500 on server error', async () => {
      mockFindOne.mockRejectedValueOnce(new Error('DB Error'))

      const res = await request(app)
        .post('/comment/modify')
        .send({ idx: 1, content: 'Updated content' })

      expect(res.status).toBe(500)
    })
  })

  describe('POST /comment/delete', () => {
    it('returns 404 when comment_idx is missing', async () => {
      mockFindOne.mockResolvedValueOnce(null)

      const res = await request(app)
        .post('/comment/delete')
        .send({})

      expect(res.status).toBe(404)
    })

    it('returns 404 when comment not found', async () => {
      mockFindOne.mockResolvedValueOnce(null)

      const res = await request(app)
        .post('/comment/delete')
        .send({ comment_idx: 999 })

      expect(res.status).toBe(404)
    })

    it('returns 403 when user is not the comment author', async () => {
      mockFindOne.mockResolvedValueOnce({
        idx: 1,
        fk_user_email: 'other@test.com',
        content: 'Some comment',
      })

      const res = await request(app)
        .post('/comment/delete')
        .send({ comment_idx: 1 })

      expect(res.status).toBe(403)
    })

    it('deletes comment successfully', async () => {
      mockFindOne.mockResolvedValueOnce({
        idx: 1,
        fk_user_email: 'user@test.com',
        content: 'My comment',
      })
      mockDelete.mockResolvedValueOnce({})

      const res = await request(app)
        .post('/comment/delete')
        .send({ comment_idx: 1 })

      expect(res.status).toBe(200)
      expect(res.body.message).toBe('삭제 성공')
    })

    it('returns 500 on server error', async () => {
      mockFindOne.mockRejectedValueOnce(new Error('DB Error'))

      const res = await request(app)
        .post('/comment/delete')
        .send({ comment_idx: 1 })

      expect(res.status).toBe(500)
    })
  })
})
