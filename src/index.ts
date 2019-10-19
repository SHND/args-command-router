import Application from './Application'
import _Command from './Command'

export const argsCommandRouter = function(config = {}) {
  return (function(config) {
    return new Application(config)
  })(config)
}

export const Command = _Command
