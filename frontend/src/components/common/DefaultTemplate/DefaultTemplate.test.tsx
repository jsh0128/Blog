import React from 'react'
import { render, screen } from '@testing-library/react'
import DefaultTemplate from './index'

jest.mock('./Header', () => () => <div data-testid="header">Header</div>)
jest.mock('./SideBar', () => () => <div data-testid="sidebar">SideBar</div>)

describe('DefaultTemplate', () => {
  it('renders children', () => {
    render(<DefaultTemplate><div>Content</div></DefaultTemplate>)
    expect(screen.getByText('Content')).toBeInTheDocument()
  })

  it('renders Header', () => {
    render(<DefaultTemplate><span>child</span></DefaultTemplate>)
    expect(screen.getByTestId('header')).toBeInTheDocument()
  })

  it('renders SideBar', () => {
    render(<DefaultTemplate><span>child</span></DefaultTemplate>)
    expect(screen.getByTestId('sidebar')).toBeInTheDocument()
  })
})
