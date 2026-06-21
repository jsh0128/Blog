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

describe('Auth API routes', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('POST /auth/signin', () => {
    it('returns 404 when user not found', async () => {
      mockFindOne.mockResolvedValueOnce(null)

      const res = await request(app)
        .post('/auth/signin')
        .send({ email: 'notfound@test.com', password: 'wrongpassword' })

      expect(res.status).toBe(404)
      expect(res.body.message).toBe('없는 회원입니다')
    })

    it('returns 401 when password is wrong', async () => {
      mockFindOne
        .mockResolvedValueOnce({ email: 'user@test.com' }) // emailCheck passes
        .mockResolvedValueOnce(null) // password check fails

      const res = await request(app)
        .post('/auth/signin')
        .send({ email: 'user@test.com', password: 'wrongpass' })

      expect(res.status).toBe(401)
    })

    it('returns 200 and token when login succeeds', async () => {
      const mockUser = {
        email: 'user@test.com',
        name: 'Test User',
        profile_img: '/img.jpg',
        is_admin: false,
        is_github: false,
      }

      mockFindOne
        .mockResolvedValueOnce({ email: 'user@test.com' }) // emailCheck
        .mockResolvedValueOnce(mockUser) // userInfo

      const res = await request(app)
        .post('/auth/signin')
        .send({ email: 'user@test.com', password: 'password123' })

      expect(res.status).toBe(200)
      expect(res.body.message).toBe('로그인 성공하셨습니다')
      expect(res.body.data).toBeDefined()
    })

    it('returns 500 on server error', async () => {
      mockFindOne.mockRejectedValueOnce(new Error('DB Error'))

      const res = await request(app)
        .post('/auth/signin')
        .send({ email: 'user@test.com', password: 'password123' })

      expect(res.status).toBe(500)
    })
  })

})
