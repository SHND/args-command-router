import Application from './Application'
import _Command from './Command'

export const app = (function() {
  return new Application()
})()

export const Command = _Command
