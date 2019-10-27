import { expect } from 'chai'
import Application from '../src/Application'

describe('Application Routing tests', () => {
  it('no routes defined, no args passed', () => {
    expect(() => {
      const app = new Application()
      app.run([])
    }).not.throws()
  })

  it('no routes defined, some args passed', () => {
    expect(() => {
      const app = new Application()
      const args = ['cmd1']
      app.run(args)
    }).not.throws()
  })

  it('one route defined, but args are not matched to route', done => {
    const app = new Application()
    const args = ['cmd1']
    app.route('/cmd2', () => {
      done('This route should not have triggered')
    })
    app.run(args)
    done()
  })

  it('one route defined and args are matched to that route', done => {
    const app = new Application()
    const args = ['cmd1']
    app.route('/cmd1', () => {
      done()
    })
    app.run(args)
  })

  it('multi routes defined and args are matched to one route', done => {
    const app = new Application()
    const args = ['cmd2']
    app.route('/cmd1', () => {
      done('The route "/cmd1" should not have triggered')
    })
    app.route('/cmd2', () => {
      done()
    })
    app.run(args)
  })

  it('multi routes defined and args are matched to two routes but next is not specified in the first route', done => {
    const app = new Application()
    const args = ['cmd1']
    app.route('/cmd1', () => {
      done()
    })
    app.route('/cmd1', () => {
      done('The route "/cmd1" should not have triggered')
    })
    app.run(args)
  })

  it('multi routes defined and args are matched to two routes and next is triggered in the first route', done => {
    const app = new Application()
    const args = ['cmd1']
    let hits = 0
    app.route('/cmd1', (input: Object, next: Function) => {
      hits++
      next()
    })
    app.route('/cmd1', () => {
      if (++hits === 2) {
        done()
      } else {
        done('Expecting 2 routes to get triggered')
      }
    })
    app.run(args)
  })

  it('noroute is triggered when no routes are matched', done => {
    const app = new Application()
    const args = ['cmd1']
    app.route('/cmd2', (input: Object, next: Function) => {
      done('This route callback should not get triggered')
    })
    app.noroute(() => {
      done()
    })
    app.run(args)
  })

  it('multi noroute exist but without next() and no routes are matched', done => {
    const app = new Application()
    const args = ['cmd1']
    app.route('/cmd2', (input: Object, next: Function) => {
      done('This route callback should not get triggered')
    })
    app.noroute(() => {
      done()
    })
    app.noroute(() => {
      done('This noroute callback should not have triggered')
    })
    app.run(args)
  })

  it('multi noroute with next() and no routes are matched', done => {
    const app = new Application()
    const args = ['cmd1']
    let hits = 0
    app.route('/cmd2', (input: Object, next: Function) => {
      done('This route callback should not get triggered')
    })
    app.noroute((input: Object, next: Function) => {
      hits++
      next()
    })
    app.noroute(() => {
      if (++hits === 2) {
        done()
      } else {
        done('Not all noroute callbacks are got triggered')
      }
    })
    app.run(args)
  })

  it('before hooks are triggered before routes and noroutes', done => {
    const app = new Application()
    const args = ['cmd1']
    let hits = 0
    app.before(() => {
      hits++
      done()
    })
    app.route('/cmd2', () => {
      if (hits !== 1) done('Before hook should triggered before any routes')
    })
    app.noroute(() => {
      if (hits !== 1) done('Before hook should triggered before any routes')
    })
    app.run(args)
  })

  it('before hook and matched route are run correctly in order', done => {
    const app = new Application()
    const args = ['cmd1']
    let hits = 0
    app.before(() => {
      hits++
    })
    app.route('/cmd1', () => {
      if (++hits === 2) {
        done()
      } else {
        done('Before hook should triggered before any routes')
      }
    })
    app.noroute(() => {
      done('noroute should not get triggered')
    })
    app.run(args)
  })

  it('before hook and noroute are run correctly in order', done => {
    const app = new Application()
    const args = ['cmd2']
    let hits = 0
    app.before(() => {
      hits++
    })
    app.route('/cmd1', () => {
      done('noroute should not get triggered')
    })
    app.noroute(() => {
      if (++hits === 2) {
        done()
      } else {
        done('Before hook should triggered before any routes')
      }
    })
    app.run(args)
  })

  it('multiple before hooks but "next()" is not called on the first before hook', done => {
    const app = new Application()
    const args = ['cmd1']
    let hits = 0
    app.before(() => {
      hits++
    })
    app.before(() => {
      hits++
    })
    app.route('/cmd1', () => {
      if (hits === 1) {
        done()
      } else {
        done('before hooks are not called correctly')
      }
    })
    app.run(args)
  })

  it('multiple before hooks and "next()" is called on the first before hook', done => {
    const app = new Application()
    const args = ['cmd1']
    let hits = 0
    app.before((input: Object, next: Function) => {
      hits++
      next()
    })
    app.before(() => {
      hits++
    })
    app.route('/cmd1', () => {
      if (hits === 2) {
        done()
      } else {
        done('before hooks are not called correctly')
      }
    })
    app.run(args)
  })

  it('after hooks are called', done => {
    const app = new Application()
    const args = ['cmd1']
    app.after(() => {
      done()
    })
    app.run(args)
  })

  it('multiple after hooks but "next()" is not called on the first before hook', done => {
    const app = new Application()
    const args = ['cmd1']
    app.after(() => {
      done()
    })
    app.after(() => {
      done('The second after hook should not get called')
    })
    app.run(args)
  })

  it('multiple after hooks and "next()" is called on the first before hook', done => {
    const app = new Application()
    const args = ['cmd1']
    let hits = 0
    app.after((input: Object, next: Function) => {
      hits++
      done()
    })
    app.after(() => {
      if (++hits === 2) {
        done()
      } else {
        done('After hooks are called incorrectly')
      }
    })
    app.run(args)
  })

  it('after hooks are called after "before" and "routes" when route matched', done => {
    const app = new Application()
    const args = ['cmd1']
    let hits = 0
    app.before(() => {
      hits++
    })
    app.route('/cmd1', () => {
      hits++
    })
    app.noroute(() => {
      done('noroute should not get called')
    })
    app.after(() => {
      if (++hits === 3) {
        done()
      } else {
        done('before, route and after are not called correctly')
      }
    })
    app.run(args)
  })

  it('after hooks are called after "before" and "noroutes" when route is not matched', done => {
    const app = new Application()
    const args = ['cmd2']
    let hits = 0
    app.before(() => {
      hits++
    })
    app.route('/cmd1', () => {
      done('noroute should not get called')
    })
    app.noroute(() => {
      hits++
    })
    app.after(() => {
      if (++hits === 3) {
        done()
      } else {
        done('before, noroute and after are not called correctly')
      }
    })
    app.run(args)
  })
})
