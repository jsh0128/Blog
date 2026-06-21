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

describe('Comment protected routes', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    const { validateUser } = require('../../lib/middleware/AuthTypeCheck')
    validateUser.mockImplementation((req: any, _res: any, next: any) => {
      req.user = mockUser
      next()
    })
  })

  describe('POST /comment/create', () => {
    it('creates comment successfully', async () => {
      mockSave.mockResolvedValueOnce({})

      const res = await request(app)
        .post('/comment/create')
        .send({ post_idx: 1, content: 'Test comment' })

      expect(res.status).toBe(200)
      expect(res.body.message).toBe('댓글 작성 성공')
    })

    it('returns 500 on server error', async () => {
      mockSave.mockRejectedValueOnce(new Error('DB Error'))

      const res = await request(app)
        .post('/comment/create')
        .send({ post_idx: 1, content: 'Test comment' })

      expect(res.status).toBe(500)
    })
  })
})
