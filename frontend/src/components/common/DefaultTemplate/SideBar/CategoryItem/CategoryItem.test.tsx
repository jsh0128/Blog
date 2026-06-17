import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import CategoryItem from './index'

const mockPush = jest.fn()
let mockSearchParamsGet = jest.fn().mockReturnValue(null)

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: jest.fn(),
    pathname: '/',
  }),
  useSearchParams: () => ({ get: mockSearchParamsGet }),
  useParams: () => ({}),
}))

describe('CategoryItem', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockSearchParamsGet = jest.fn().mockReturnValue(null)
  })

  it('renders category name', () => {
    render(<CategoryItem idx={1} category="TypeScript" />)
    expect(screen.getByText('TypeScript')).toBeInTheDocument()
  })

  it('navigates to category filter when clicked (not selected)', () => {
    mockSearchParamsGet = jest.fn().mockReturnValue(null)
    render(<CategoryItem idx={1} category="React" />)
    fireEvent.click(screen.getByText('React'))
    expect(mockPush).toHaveBeenCalledWith('/?category=React')
  })

  it('navigates to root when already selected category is clicked', () => {
    mockSearchParamsGet = jest.fn().mockReturnValue('React')
    render(<CategoryItem idx={1} category="React" />)
    fireEvent.click(screen.getByText('React'))
    expect(mockPush).toHaveBeenCalledWith('/')
  })
})
