jest.mock('dotenv/config', () => {})
jest.mock('reflect-metadata', () => {})

process.env.JWT_SECRET_KEY = 'test-secret'

const mockFindOne = jest.fn()
const noopDecorator = () => () => {}

jest.mock('typeorm', () => ({
  getRepository: jest.fn().mockReturnValue({
    findOne: mockFindOne,
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

const mockVerifyToken = jest.fn()
jest.mock('../jwtToken', () => ({
  verifyToken: mockVerifyToken,
  createToken: jest.fn(),
}))

import { validateAdmin, validateUser, validateAuth } from '../middleware/AuthTypeCheck'

const mockNext = jest.fn()
const mockRes = {
  status: jest.fn().mockReturnThis(),
  send: jest.fn().mockReturnThis(),
  json: jest.fn().mockReturnThis(),
} as any

describe('AuthTypeCheck middleware', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockNext.mockClear()
  })

  describe('validateAuth', () => {
    it('returns user when token is valid', async () => {
      const mockUser = { email: 'test@test.com', name: 'Test', is_admin: false }
      mockVerifyToken.mockResolvedValueOnce({ email: 'test@test.com' })
      mockFindOne.mockResolvedValueOnce(mockUser)

      const mockReq = {
        headers: { authorization: 'Bearer valid-token' },
      } as any
      const result = await validateAuth(mockReq)
      expect(result).toEqual(mockUser)
    })

    it('throws error when token is invalid', async () => {
      mockVerifyToken.mockRejectedValueOnce(new Error('Invalid token'))

      const mockReq = {
        headers: { authorization: 'Bearer invalid-token' },
      } as any
      await expect(validateAuth(mockReq)).rejects.toThrow('Invalid token')
    })
  })

  describe('validateUser', () => {
    it('calls next when token is valid', async () => {
      const mockUser = { email: 'test@test.com', name: 'Test', is_admin: false }
      mockVerifyToken.mockResolvedValueOnce({ email: 'test@test.com' })
      mockFindOne.mockResolvedValueOnce(mockUser)

      const mockReq = {
        headers: { authorization: 'Bearer valid-token' },
        user: null,
      } as any

      await validateUser(mockReq, mockRes, mockNext)
      expect(mockNext).toHaveBeenCalled()
      expect(mockReq.user).toEqual(mockUser)
    })

    it('returns 500 when token verification fails', async () => {
      mockVerifyToken.mockRejectedValueOnce(new Error('Token error'))

      const mockReq = {
        headers: { authorization: 'Bearer bad-token' },
      } as any

      await validateUser(mockReq, mockRes, mockNext)
      expect(mockRes.status).toHaveBeenCalledWith(500)
      expect(mockNext).not.toHaveBeenCalled()
    })
  })

  describe('validateAdmin', () => {
    it('calls next when user is admin', async () => {
      const mockAdminUser = { email: 'admin@test.com', name: 'Admin', is_admin: true }
      mockVerifyToken.mockResolvedValueOnce({ email: 'admin@test.com' })
      mockFindOne.mockResolvedValueOnce(mockAdminUser)

      const mockReq = {
        headers: { authorization: 'Bearer admin-token' },
        user: null,
      } as any

      await validateAdmin(mockReq, mockRes, mockNext)
      expect(mockNext).toHaveBeenCalled()
      expect(mockReq.user).toEqual(mockAdminUser)
    })

    it('returns 403 when user is not admin', async () => {
      const mockRegularUser = { email: 'user@test.com', name: 'User', is_admin: false }
      mockVerifyToken.mockResolvedValueOnce({ email: 'user@test.com' })
      mockFindOne.mockResolvedValueOnce(mockRegularUser)

      const mockReq = {
        headers: { authorization: 'Bearer user-token' },
      } as any

      await validateAdmin(mockReq, mockRes, mockNext)
      expect(mockRes.status).toHaveBeenCalledWith(403)
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('returns 403 when user not found', async () => {
      mockVerifyToken.mockResolvedValueOnce({ email: 'notfound@test.com' })
      mockFindOne.mockResolvedValueOnce(null)

      const mockReq = {
        headers: { authorization: 'Bearer some-token' },
      } as any

      await validateAdmin(mockReq, mockRes, mockNext)
      expect(mockRes.status).toHaveBeenCalledWith(403)
    })

    it('returns 500 on server error', async () => {
      mockVerifyToken.mockRejectedValueOnce(new Error('Server error'))

      const mockReq = {
        headers: { authorization: 'Bearer bad-token' },
      } as any

      await validateAdmin(mockReq, mockRes, mockNext)
      expect(mockRes.status).toHaveBeenCalledWith(500)
    })
  })
})
