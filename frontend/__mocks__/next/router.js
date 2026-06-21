const mockPush = jest.fn()
const mockReplace = jest.fn()

const Router = {
  push: mockPush,
  replace: mockReplace,
  events: {
    on: jest.fn(),
    off: jest.fn(),
    emit: jest.fn(),
  },
  pathname: '/',
  query: {},
  asPath: '/',
}

const useRouter = () => ({
  push: mockPush,
  replace: mockReplace,
  pathname: '/',
  query: {},
  asPath: '/',
})

// CommonJS exports for both named and default imports
module.exports = Router
module.exports.default = Router
module.exports.useRouter = useRouter
module.exports.__esModule = true
