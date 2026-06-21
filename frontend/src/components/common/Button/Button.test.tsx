import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import Button from './index'

describe('Button', () => {
  it('renders children correctly', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('calls onClick handler when clicked', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    fireEvent.click(screen.getByText('Click me'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('renders as a button element', () => {
    render(<Button>Submit</Button>)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('applies custom style prop', () => {
    render(<Button style={{ marginLeft: '1rem' }}>Styled</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveStyle({ marginLeft: '1rem' })
  })

  it('renders without onClick handler', () => {
    expect(() => render(<Button>No handler</Button>)).not.toThrow()
  })
})
