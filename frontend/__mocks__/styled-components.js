// Mock for styled-components that works in Jest test environment
const React = require('react')

// Create a component factory for a given HTML tag
const createStyledComponent = (tag) => {
  // This is the tagged template function: styled.div`...` calls this with template args
  const taggedTemplateFn = function(strings, ...interpolations) {
    // Return a React component
    const Component = React.forwardRef(function StyledComponent(props, ref) {
      const { children, ...rest } = props
      // Filter out non-standard HTML props (any prop that isn't a string value key)
      const htmlProps = {}
      for (const key in rest) {
        if (key !== 'selected') { // filter styled-component specific props
          htmlProps[key] = rest[key]
        }
      }
      return React.createElement(tag, { ...htmlProps, ref }, children)
    })
    Component.displayName = `styled.${typeof tag === 'string' ? tag : 'Component'}`
    Component.attrs = () => taggedTemplateFn
    Component.withConfig = () => taggedTemplateFn
    return Component
  }
  // Allow .attrs().withConfig() etc
  taggedTemplateFn.attrs = () => taggedTemplateFn
  taggedTemplateFn.withConfig = () => taggedTemplateFn
  return taggedTemplateFn
}

// styled(Component)`...` support
const styledFn = function(Component) {
  return createStyledComponent(Component)
}

// Add all HTML tags as properties: styled.div, styled.button, etc.
const HTML_TAGS = [
  'a', 'abbr', 'address', 'article', 'aside', 'audio', 'b', 'blockquote',
  'button', 'canvas', 'caption', 'cite', 'code', 'col', 'colgroup', 'data',
  'datalist', 'dd', 'del', 'details', 'dfn', 'dialog', 'div', 'dl', 'dt',
  'em', 'embed', 'fieldset', 'figcaption', 'figure', 'footer', 'form', 'h1',
  'h2', 'h3', 'h4', 'h5', 'h6', 'header', 'hr', 'i', 'iframe', 'img',
  'input', 'ins', 'kbd', 'label', 'legend', 'li', 'main', 'map', 'mark',
  'menu', 'meter', 'nav', 'object', 'ol', 'optgroup', 'option', 'output',
  'p', 'picture', 'pre', 'progress', 'q', 'rp', 'rt', 'ruby', 's', 'samp',
  'section', 'select', 'small', 'source', 'span', 'strong', 'sub', 'summary',
  'sup', 'table', 'tbody', 'td', 'textarea', 'tfoot', 'th', 'thead', 'time',
  'tr', 'track', 'u', 'ul', 'var', 'video', 'wbr',
]

HTML_TAGS.forEach((tag) => {
  styledFn[tag] = createStyledComponent(tag)
})

module.exports = styledFn
module.exports.default = styledFn
module.exports.createGlobalStyle = () => () => null
module.exports.css = (...args) => args
module.exports.keyframes = (...args) => args.join('')
module.exports.ThemeProvider = ({ children }) => children
module.exports.__esModule = true
