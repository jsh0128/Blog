import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import CreateComment from './index'

jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    pathname: '/',
    query: { id: '1' },
    asPath: '/post/1',
  }),
}))

// Use jest.fn() directly in mock factory to avoid hoisting issues
jest.mock('../api/useCommentApi', () => ({
  usePostComment: jest.fn().mockReturnValue({
    commentMutate: jest.fn(),
  }),
}))

describe('CreateComment', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Reset mock to fresh fn
    const { usePostComment } = require('../api/useCommentApi')
    usePostComment.mockReturnValue({ commentMutate: jest.fn() })
  })

  it('renders textarea with placeholder', () => {
    render(<CreateComment />)
    expect(screen.getByPlaceholderText('입력하세요 :)')).toBeInTheDocument()
  })

  it('renders submit button', () => {
    render(<CreateComment />)
    expect(screen.getByText('작성')).toBeInTheDocument()
  })

  it('updates textarea value on change', () => {
    render(<CreateComment />)
    const textarea = screen.getByPlaceholderText('입력하세요 :)')
    fireEvent.change(textarea, { target: { value: 'New comment text' } })
    expect(textarea).toHaveValue('New comment text')
  })

  it('calls commentMutate when submit button is clicked', () => {
    const mockMutate = jest.fn()
    const { usePostComment } = require('../api/useCommentApi')
    usePostComment.mockReturnValue({ commentMutate: mockMutate })

    render(<CreateComment />)
    const textarea = screen.getByPlaceholderText('입력하세요 :)')
    fireEvent.change(textarea, { target: { value: 'Test comment' } })
    fireEvent.click(screen.getByText('작성'))
    expect(mockMutate).toHaveBeenCalled()
  })
})
