import React from 'react'
import { render, renderHook, RenderOptions } from '@testing-library/react'

// We avoid importing QueryClient directly from @tanstack/react-query to prevent
// ESM/CJS resolution issues in the jest worker environment.
// Components that need react-query should mock it directly in their test files.
const AllProviders = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>
}

const renderWithProviders = (ui: React.ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
  render(ui, { wrapper: AllProviders, ...options })

const renderHookWithProviders = <TResult,>(hook: () => TResult) =>
  renderHook(hook, { wrapper: AllProviders })

export * from '@testing-library/react'
export { renderWithProviders, renderHookWithProviders }
