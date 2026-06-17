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

describe('Category admin routes', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    const { validateAdmin } = require('../../lib/middleware/AuthTypeCheck')
    validateAdmin.mockImplementation((req: any, _res: any, next: any) => {
      req.user = mockAdminUser
      next()
    })
  })

  describe('POST /category/create', () => {
    it('returns 409 when category already exists', async () => {
      mockFindOne.mockResolvedValueOnce({ idx: 1, category: 'Tech' })

      const res = await request(app)
        .post('/category/create')
        .send({ category: 'Tech' })

      expect(res.status).toBe(409)
    })

    it('creates category successfully', async () => {
      mockFindOne.mockResolvedValueOnce(null)
      mockSave.mockResolvedValueOnce({})

      const res = await request(app)
        .post('/category/create')
        .send({ category: 'NewCategory' })

      expect(res.status).toBe(200)
      expect(res.body.message).toBe('카테고리 정상적으로 생성되었습니다.')
    })

    it('returns 500 on server error', async () => {
      mockFindOne.mockRejectedValueOnce(new Error('DB Error'))

      const res = await request(app)
        .post('/category/create')
        .send({ category: 'Tech' })

      expect(res.status).toBe(500)
    })
  })

  describe('POST /category/delete', () => {
    it('returns 404 when category not found', async () => {
      mockFindOne.mockResolvedValueOnce(null)

      const res = await request(app)
        .post('/category/delete')
        .send({ category: 'NonExistent' })

      expect(res.status).toBe(404)
    })

    it('deletes category successfully', async () => {
      mockFindOne.mockResolvedValueOnce({ idx: 1, category: 'Tech' })
      mockDelete.mockResolvedValueOnce({})

      const res = await request(app)
        .post('/category/delete')
        .send({ category: 'Tech' })

      expect(res.status).toBe(200)
    })

    it('returns 500 on server error', async () => {
      mockFindOne.mockRejectedValueOnce(new Error('DB Error'))

      const res = await request(app)
        .post('/category/delete')
        .send({ category: 'Tech' })

      expect(res.status).toBe(500)
    })
  })

  describe('POST /category/modify', () => {
    it('returns 404 when category not found', async () => {
      mockFindOne.mockResolvedValueOnce(null)

      const res = await request(app)
        .post('/category/modify')
        .send({ category: 'NonExistent', new_category: 'Updated' })

      expect(res.status).toBe(404)
    })

    it('modifies category successfully', async () => {
      mockFindOne.mockResolvedValueOnce({ idx: 1, category: 'Tech' })
      mockSave.mockResolvedValueOnce({})

      const res = await request(app)
        .post('/category/modify')
        .send({ category: 'Tech', new_category: 'Technology' })

      expect(res.status).toBe(200)
    })

    it('returns 500 on server error', async () => {
      mockFindOne.mockRejectedValueOnce(new Error('DB Error'))

      const res = await request(app)
        .post('/category/modify')
        .send({ category: 'Tech', new_category: 'Updated' })

      expect(res.status).toBe(500)
    })
  })
})
