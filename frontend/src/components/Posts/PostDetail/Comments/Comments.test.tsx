import React from 'react'
import { render, screen } from '@testing-library/react'
import Comments from './index'

jest.mock('common/hooks/useCustomRouter', () => () => ({
  query: { id: 1 },
  push: jest.fn(),
}))

const mockComments = [
  { idx: 1, comment: 'First comment', user_name: 'User1', created_at: '2024-01-01' },
  { idx: 2, comment: 'Second comment', user_name: 'User2', created_at: '2024-01-02' },
]

jest.mock('./api/useCommentApi', () => ({
  useComments: jest.fn(() => ({ data: mockComments })),
  usePostComment: jest.fn(() => ({ commentMutate: jest.fn() })),
}))

jest.mock('./CommentItem', () => ({ comment }: { comment: { comment: string } }) => (
  <div data-testid="comment-item">{comment.comment}</div>
))
jest.mock('./CreateComment', () => () => <div data-testid="create-comment">CreateComment</div>)

describe('Comments', () => {
  it('renders comment items', () => {
    render(<Comments />)
    const items = screen.getAllByTestId('comment-item')
    expect(items).toHaveLength(2)
  })

  it('renders CreateComment form', () => {
    render(<Comments />)
    expect(screen.getByTestId('create-comment')).toBeInTheDocument()
  })

  it('renders comment text', () => {
    render(<Comments />)
    expect(screen.getByText('First comment')).toBeInTheDocument()
    expect(screen.getByText('Second comment')).toBeInTheDocument()
  })

  it('handles empty comment list', () => {
    const { useComments } = require('./api/useCommentApi')
    useComments.mockReturnValueOnce({ data: [] })
    render(<Comments />)
    expect(screen.queryAllByTestId('comment-item')).toHaveLength(0)
    expect(screen.getByTestId('create-comment')).toBeInTheDocument()
  })
})
