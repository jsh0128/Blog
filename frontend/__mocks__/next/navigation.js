const useRouter = () => ({
  push: jest.fn(),
  replace: jest.fn(),
  pathname: '/',
})
const useSearchParams = () => ({ get: jest.fn().mockReturnValue(null) })
const useParams = () => ({})
module.exports = { useRouter, useSearchParams, useParams }
