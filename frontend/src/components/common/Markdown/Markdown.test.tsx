import React from 'react'
import { render, screen } from '@testing-library/react'
import Markdown from './index'

jest.mock('react-markdown', () => ({ children }: { children: string }) => (
  <div data-testid="react-markdown">{children}</div>
))

jest.mock('react-syntax-highlighter', () => ({
  Prism: ({ children }: { children: string }) => <pre>{children}</pre>,
}))

jest.mock('react-syntax-highlighter/dist/esm/styles/prism', () => ({
  vscDarkPlus: {},
}))

describe('Markdown', () => {
  it('renders plain text content', () => {
    render(<Markdown content="Hello world" />)
    expect(screen.getByTestId('react-markdown')).toBeInTheDocument()
    expect(screen.getByText('Hello world')).toBeInTheDocument()
  })

  it('renders without content (undefined)', () => {
    const { container } = render(<Markdown />)
    expect(container).toBeInTheDocument()
    expect(screen.getByTestId('react-markdown')).toBeInTheDocument()
  })

  it('renders empty string content', () => {
    render(<Markdown content="" />)
    expect(screen.getByTestId('react-markdown')).toBeInTheDocument()
  })

  it('passes content prop to ReactMarkdown', () => {
    render(<Markdown content="# Heading" />)
    expect(screen.getByText('# Heading')).toBeInTheDocument()
  })
})
