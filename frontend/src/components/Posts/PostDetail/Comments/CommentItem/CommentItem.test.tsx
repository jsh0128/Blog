import React from 'react'
import { render, screen } from '@testing-library/react'
import CommentItem from './index'

const mockComment = {
  idx: 1,
  content: 'This is a test comment',
  user_name: 'CommentAuthor',
  user_profile_img: '/profile.jpg',
  created_at: '2024-01-15T10:30:00Z',
  fk_post_idx: 1,
  fk_user_email: 'author@example.com',
}

describe('CommentItem', () => {
  it('renders comment content', () => {
    render(<CommentItem comment={mockComment} />)
    expect(screen.getByText('This is a test comment')).toBeInTheDocument()
  })

  it('renders user name', () => {
    render(<CommentItem comment={mockComment} />)
    expect(screen.getByText('CommentAuthor')).toBeInTheDocument()
  })

  it('renders profile image with alt text', () => {
    render(<CommentItem comment={mockComment} />)
    const img = screen.getByAltText('CommentAuthor 사진')
    expect(img).toBeInTheDocument()
  })

  it('renders formatted timestamp', () => {
    render(<CommentItem comment={mockComment} />)
    // dayjs formats in local timezone; check for date portion only
    expect(screen.getByText(/2024-01-1/)).toBeInTheDocument()
  })
})
