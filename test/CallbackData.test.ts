import { expect } from 'chai'
import Command from '../src/Command'
import CallbackData from '../src/CallbackData'

describe('Application class', () => {
  it('create', () => {
    const command = new Command('/cmd1/:param1')
    const params = { param1: 'val' }
    const shortSwitches = { a: 'val1', b: true }
    const longSwitches = { long: 'val2', longer: 'val3' }

    const data = new CallbackData(command, params, shortSwitches, longSwitches)
    expect(data).deep.equals({
      _command: command,
      _params: params,
      _switches: {
        short: shortSwitches,
        long: longSwitches,
      },
    })
  })

  it('get command()', () => {
    const command = new Command('/cmd1/:param1')
    const params = { param1: 'val' }
    const shortSwitches = { a: 'val1', b: true }
    const longSwitches = { long: 'val2', longer: 'val3' }

    const data = new CallbackData(command, params, shortSwitches, longSwitches)
    expect(data.command).eql(command)
  })

  it('get params()', () => {
    const command = new Command('/cmd1/:param1')
    const params = { param1: 'val' }
    const shortSwitches = { a: 'val1', b: true }
    const longSwitches = { long: 'val2', longer: 'val3' }

    const data = new CallbackData(command, params, shortSwitches, longSwitches)
    expect(data.params).eql(params)
  })

  it('get shortSwitches()', () => {
    const command = new Command('/cmd1/:param1')
    const params = { param1: 'val' }
    const shortSwitches = { a: 'val1', b: true }
    const longSwitches = { long: 'val2', longer: 'val3' }

    const data = new CallbackData(command, params, shortSwitches, longSwitches)
    expect(data['_switches'].short).eql(shortSwitches)
  })

  it('get longSwitches()', () => {
    const command = new Command('/cmd1/:param1')
    const params = { param1: 'val' }
    const shortSwitches = { a: 'val1', b: true }
    const longSwitches = { long: 'val2', longer: 'val3' }

    const data = new CallbackData(command, params, shortSwitches, longSwitches)
    expect(data['_switches'].long).eql(longSwitches)
  })

  it('get switches()', () => {
    const command = new Command('/cmd1/:param1')
    const params = { param1: 'val' }
    const shortSwitches = { a: 'val1', b: true }
    const longSwitches = { long: 'val2', longer: 'val3' }

    const data = new CallbackData(command, params, shortSwitches, longSwitches)
    expect(data.switches).eql({ ...shortSwitches, ...longSwitches })
  })

  it('get all()', () => {
    const command = new Command('/cmd1/:param1')
    const params = { param1: 'val' }
    const shortSwitches = { a: 'val1', b: true }
    const longSwitches = { long: 'val2', longer: 'val3' }

    const data = new CallbackData(command, params, shortSwitches, longSwitches)
    expect(data.all).eql({ ...params, ...shortSwitches, ...longSwitches })
  })
})
