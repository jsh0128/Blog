import React from 'react'
import { render, screen } from '@testing-library/react'
import PostItem from './index'

const mockPost = {
  idx: 1,
  title: 'Test Post Title',
  introduction: 'This is a test introduction',
  content: 'Test content',
  preview_image: '/test-image.jpg',
  created_at: '2024-01-15T00:00:00Z',
  fk_user_email: 'test@example.com',
  category: ['TypeScript'],
  user_name: 'TestUser',
}

describe('PostItem', () => {
  it('renders post title', () => {
    render(<PostItem post={mockPost} />)
    expect(screen.getByText('Test Post Title')).toBeInTheDocument()
  })

  it('renders post introduction', () => {
    render(<PostItem post={mockPost} />)
    expect(screen.getByText('This is a test introduction')).toBeInTheDocument()
  })

  it('renders formatted date', () => {
    render(<PostItem post={mockPost} />)
    expect(screen.getByText('2024-01-15')).toBeInTheDocument()
  })

  it('renders post image with alt text', () => {
    render(<PostItem post={mockPost} />)
    const img = screen.getByAltText('Test Post Title_썸네일')
    expect(img).toBeInTheDocument()
  })

  it('links to post detail page', () => {
    render(<PostItem post={mockPost} />)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/post/1')
  })
})
