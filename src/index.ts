import Application from './Application'
import { debug } from './plugins/debug'
import { autoComplete } from './plugins/autoComplete'

export const argsCommandRouter = function(config = {}) {
  return (function(config) {
    return new Application(config)
  })(config)
}

export const plugins = {
  debug,
  autoComplete
}
