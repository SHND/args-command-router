import Application from './Application'
import { help } from './plugins/help'
import { debug } from './plugins/debug'
import { autoComplete } from './plugins/autoComplete'

export const argsCommandRouter = function(config = {}) {
  return (function(config) {
    return new Application(config)
  })(config)
}

export const plugins = {
  help,
  debug,
  autoComplete
}
