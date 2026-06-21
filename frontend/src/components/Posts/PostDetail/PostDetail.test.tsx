import React from 'react'
import { render, screen } from '@testing-library/react'
import PostDetail from './index'

jest.mock('common/hooks/useCustomRouter', () => () => ({
  query: { id: '1' },
  push: jest.fn(),
}))

jest.mock('./api/usePostDetailApi', () => ({
  usePostDetailApi: jest.fn(() => ({
    data: {
      data: {
        category: 'TypeScript',
        content: '# Hello\nTest content',
        created_at: '2024-01-15T00:00:00Z',
        preview_image: '/test.jpg',
        title: 'Test Post Title',
      },
    },
  })),
}))

jest.mock('./Comments', () => () => <div data-testid="comments">Comments</div>)
jest.mock('components/common/Markdown', () => ({ content }: { content: string }) => (
  <div data-testid="markdown">{content}</div>
))

describe('PostDetail', () => {
  it('renders post title', () => {
    render(<PostDetail />)
    expect(screen.getByText('Test Post Title')).toBeInTheDocument()
  })

  it('renders formatted date', () => {
    render(<PostDetail />)
    expect(screen.getByText('2024-01-15')).toBeInTheDocument()
  })

  it('renders markdown content', () => {
    render(<PostDetail />)
    expect(screen.getByTestId('markdown')).toBeInTheDocument()
  })

  it('renders Comments section', () => {
    render(<PostDetail />)
    expect(screen.getByTestId('comments')).toBeInTheDocument()
  })

  it('renders preview image', () => {
    render(<PostDetail />)
    const img = screen.getByAltText('Test Post Title_썸네일')
    expect(img).toBeInTheDocument()
  })
})
