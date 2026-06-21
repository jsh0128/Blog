import React from 'react'
import { render, screen } from '@testing-library/react'
import SideBar from './index'

jest.mock('./api/useCategoryApi', () => ({
  useCategoryApi: jest.fn().mockReturnValue({ data: [] }),
}))

describe('SideBar', () => {
  it('renders without crashing when no categories', () => {
    expect(() => render(<SideBar />)).not.toThrow()
  })

  it('renders category items when categories are provided', () => {
    const { useCategoryApi } = require('./api/useCategoryApi')
    useCategoryApi.mockReturnValue({
      data: [
        { idx: 1, category: 'TypeScript' },
        { idx: 2, category: 'React' },
      ],
    })
    render(<SideBar />)
    expect(screen.getByText('TypeScript')).toBeInTheDocument()
    expect(screen.getByText('React')).toBeInTheDocument()
  })
})
