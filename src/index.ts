import Application from './Application'

export const argsCommandRouter = function(config = {}) {
  return (function(config) {
    return new Application(config)
  })(config)
}

// const app = argsCommandRouter();

// app.debug()