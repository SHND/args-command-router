import { expect } from 'chai'
import Command from '../src/Command'
import CallbackData from '../src/CallbackData'

describe('CallbackData class', () => {
  it('create', () => {
    const command = new Command('/cmd1/:param1')
    const params = { param1: 'val' }
    const shortSwitches = { a: 'val1', b: true }
    const longSwitches = { long: 'val2', longer: 'val3' }

    const data = new CallbackData(command, params, shortSwitches, longSwitches)
    expect(data).deep.include({
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

  it('setCommand()', () => {
    const command = new Command('/cmd1/:param1')
    const params = { param1: 'val' }
    const shortSwitches = { a: 'val1', b: true }
    const longSwitches = { long: 'val2', longer: 'val3' }

    const data = new CallbackData(null, params, shortSwitches, longSwitches)
    data.setCommand(command)
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

  it('setParams()', () => {
    const command = new Command('/cmd1/:param1')
    const params = { param1: 'val' }
    const shortSwitches = { a: 'val1', b: true }
    const longSwitches = { long: 'val2', longer: 'val3' }

    const data = new CallbackData(command, {}, shortSwitches, longSwitches)
    data.setParams(params)
    expect(data.params).eql(params)
  })

  it('get shortSwitches()', () => {
    const command = new Command('/cmd1/:param1')
    const params = { param1: 'val' }
    const shortSwitches = { a: 'val1', b: true }
    const longSwitches = { long: 'val2', longer: 'val3' }

    const data = new CallbackData(command, params, shortSwitches, longSwitches)
    expect(data.shortSwitches).eql(shortSwitches)
  })

  it('setShortSwitches()', () => {
    const command = new Command('/cmd1/:param1')
    const params = { param1: 'val' }
    const shortSwitches = { a: 'val1', b: true }
    const longSwitches = { long: 'val2', longer: 'val3' }

    const data = new CallbackData(command, params, {}, longSwitches)
    data.setShortSwitches(shortSwitches)
    expect(data.shortSwitches).eql(shortSwitches)
  })

  it('get longSwitches()', () => {
    const command = new Command('/cmd1/:param1')
    const params = { param1: 'val' }
    const shortSwitches = { a: 'val1', b: true }
    const longSwitches = { long: 'val2', longer: 'val3' }

    const data = new CallbackData(command, params, shortSwitches, longSwitches)
    expect(data.longSwitches).eql(longSwitches)
  })

  it('setLongSwitches()', () => {
    const command = new Command('/cmd1/:param1')
    const params = { param1: 'val' }
    const shortSwitches = { a: 'val1', b: true }
    const longSwitches = { long: 'val2', longer: 'val3' }

    const data = new CallbackData(command, params, shortSwitches, {})
    data.setLongSwitches(longSwitches)
    expect(data.longSwitches).eql(longSwitches)
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
