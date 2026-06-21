import { handleResponse } from '../handleResponse'

describe('handleResponse', () => {
  const mockStatus = jest.fn()
  const mockSend = jest.fn()
  const mockResponse: any = {
    status: mockStatus.mockReturnThis(),
    send: mockSend.mockReturnThis(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
    mockStatus.mockReturnValue(mockResponse)
    mockSend.mockReturnValue(mockResponse)
  })

  it('sends a response with status and message', () => {
    handleResponse(mockResponse, 200, 'Success')
    expect(mockStatus).toHaveBeenCalledWith(200)
    expect(mockSend).toHaveBeenCalledWith({ status: 200, message: 'Success', data: undefined })
  })

  it('sends a response with data when provided', () => {
    const data = { id: 1, name: 'Test' }
    handleResponse(mockResponse, 200, 'Success', data)
    expect(mockSend).toHaveBeenCalledWith({ status: 200, message: 'Success', data })
  })

  it('sends a 404 response correctly', () => {
    handleResponse(mockResponse, 404, 'Not Found')
    expect(mockStatus).toHaveBeenCalledWith(404)
    expect(mockSend).toHaveBeenCalledWith({ status: 404, message: 'Not Found', data: undefined })
  })

  it('sends a 500 error response correctly', () => {
    handleResponse(mockResponse, 500, '서버 오류입니다')
    expect(mockStatus).toHaveBeenCalledWith(500)
    expect(mockSend).toHaveBeenCalledWith({ status: 500, message: '서버 오류입니다', data: undefined })
  })
})
