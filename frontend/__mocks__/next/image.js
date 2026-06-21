const Image = ({ src, alt, ...props }) => {
  return require('react').createElement('img', { src, alt, ...props })
}
module.exports = Image
module.exports.default = Image
