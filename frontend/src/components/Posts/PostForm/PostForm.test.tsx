import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import PostForm from './index'

jest.mock('../api/usePostApi', () => ({
  useCreatePost: jest.fn(() => ({ createPostMutate: jest.fn() })),
}))

jest.mock('components/common/DefaultTemplate/SideBar/api/useCategoryApi', () => ({
  useCategoryApi: jest.fn(() => ({
    data: [
      { idx: 1, category: 'TypeScript' },
      { idx: 2, category: 'React' },
    ],
  })),
}))

jest.mock('components/common/Markdown', () => ({ content }: { content: string }) => (
  <div data-testid="markdown-preview">{content}</div>
))

describe('PostForm', () => {
  it('renders title input', () => {
    render(<PostForm />)
    expect(screen.getByPlaceholderText('제목')).toBeInTheDocument()
  })

  it('renders intro input', () => {
    render(<PostForm />)
    expect(screen.getByPlaceholderText('소개글')).toBeInTheDocument()
  })

  it('renders thumbnail input', () => {
    render(<PostForm />)
    expect(screen.getByPlaceholderText('썸네일 이미지 링크')).toBeInTheDocument()
  })

  it('renders category buttons', () => {
    render(<PostForm />)
    expect(screen.getByText('TypeScript')).toBeInTheDocument()
    expect(screen.getByText('React')).toBeInTheDocument()
  })

  it('renders submit button', () => {
    render(<PostForm />)
    expect(screen.getByText('글생성')).toBeInTheDocument()
  })

  it('renders textarea for content', () => {
    const { container } = render(<PostForm />)
    const textarea = container.querySelector('textarea')
    expect(textarea).toBeInTheDocument()
  })

  it('renders markdown preview', () => {
    render(<PostForm />)
    expect(screen.getByTestId('markdown-preview')).toBeInTheDocument()
  })

  it('calls createPostMutate on submit click', () => {
    const mockMutate = jest.fn()
    const { useCreatePost } = require('../api/usePostApi')
    useCreatePost.mockReturnValueOnce({ createPostMutate: mockMutate })
    render(<PostForm />)
    fireEvent.click(screen.getByText('글생성'))
    expect(mockMutate).toHaveBeenCalledTimes(1)
  })
})
