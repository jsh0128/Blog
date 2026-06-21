jest.mock('dotenv/config', () => {})
jest.mock('reflect-metadata', () => {})

process.env.JWT_SECRET_KEY = 'test-secret'

const mockUser = {
  email: 'user@test.com',
  name: 'TestUser',
  profile_img: null,
  is_admin: false,
}

const mockAdminUser = { ...mockUser, is_admin: true }

jest.mock('../../lib/middleware/AuthTypeCheck', () => ({
  validateUser: jest.fn((req: any, _res: any, next: any) => {
    req.user = mockUser
    next()
  }),
  validateAdmin: jest.fn((req: any, _res: any, next: any) => {
    req.user = mockAdminUser
    next()
  }),
  validateAuth: jest.fn(() => Promise.resolve(mockUser)),
}))

const mockFind = jest.fn()
const mockFindOne = jest.fn()
const mockSave = jest.fn()

const noopDecorator = () => () => {}

jest.mock('typeorm', () => ({
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
}))

import request from 'supertest'
import app from '../../app'

describe('Auth protected routes', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    const { validateUser, validateAdmin } = require('../../lib/middleware/AuthTypeCheck')
    validateUser.mockImplementation((req: any, _res: any, next: any) => {
      req.user = mockUser
      next()
    })
    validateAdmin.mockImplementation((req: any, _res: any, next: any) => {
      req.user = mockAdminUser
      next()
    })
  })

  describe('GET /auth/getInfo', () => {
    it('returns user info successfully', async () => {
      const res = await request(app).get('/auth/getInfo')

      expect(res.status).toBe(200)
      expect(res.body.message).toBe('정보 조회 성공.')
    })
  })

  describe('GET /auth/getUserList', () => {
    it('returns user list successfully', async () => {
      mockFind.mockResolvedValueOnce([
        { email: 'user1@test.com', name: 'User1', is_github: false, profile_img: null },
        { email: 'user2@test.com', name: 'User2', is_github: true, profile_img: null },
      ])

      const res = await request(app).get('/auth/getUserList')

      expect(res.status).toBe(200)
      expect(res.body.message).toBe('유저 조회 성공')
    })

    it('returns 500 on server error', async () => {
      mockFind.mockRejectedValueOnce(new Error('DB Error'))

      const res = await request(app).get('/auth/getUserList')

      expect(res.status).toBe(500)
    })
  })
})
