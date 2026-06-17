import { renderHook } from '@testing-library/react'
import useCustomRouter from '../useCustomRouter'

const mockPush = jest.fn()

jest.mock('next/router', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: jest.fn(),
    pathname: '/post/1',
    query: { id: '42' },
    asPath: '/post/1',
  }),
}))

describe('useCustomRouter', () => {
  it('returns the router with typed query', () => {
    const { result } = renderHook(() => useCustomRouter<{ id: string }>())
    expect(result.current.query.id).toBe('42')
  })

  it('includes router push function', () => {
    const { result } = renderHook(() => useCustomRouter())
    expect(typeof result.current.push).toBe('function')
  })

  it('includes router pathname', () => {
    const { result } = renderHook(() => useCustomRouter())
    expect(result.current.pathname).toBe('/post/1')
  })
})
