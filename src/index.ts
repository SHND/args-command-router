import Application from './Application'
import { help } from './plugins/help'
import { tree } from './plugins/tree'
import { autoComplete } from './plugins/autoComplete'

export const argsCommandRouter = function(config = {}) {
  return (function(config) {
    return new Application(config)
  })(config)
}

export const plugins = {
  help,
  tree,
  autoComplete
}
