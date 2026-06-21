const Link = ({ children, href, ...props }) => {
  return require('react').createElement('a', { href, ...props }, children)
}
module.exports = Link
module.exports.default = Link
