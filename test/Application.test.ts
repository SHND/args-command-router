import { expect } from 'chai'
import Application from '../src/Application'
import CommandTree from '../src/CommandTree/CommandTree'
import Route from '../src/Route'
import FixedCommandNode from '../src/CommandTree/FixedCommandNode'
import Command from '../src/Command'
import Condition from '../src/Condition'
import CommandNode from '../src/CommandTree/CommandNode'

describe('Application class', () => {
  it('create', () => {
    const app = new Application()

    expect(app['_config']).is.eql({})
    expect(app['_commandTree']).is.instanceof(CommandTree)
  })

  it('route(Route, Function)', () => {
    const app = new Application()
    const commandTree = app['_commandTree']
    const route = new Route('cmd1[true]')
    const func = () => {}

    app.route(route, func)
    expect(commandTree.root.children['cmd1']).instanceOf(FixedCommandNode)

    const callableRules = commandTree.root.children['cmd1']['_callbackRules']
    expect(callableRules.length).equal(1)

    const rule = callableRules[0]
    expect(rule.callback).eql(func)
    expect(rule.condition['_expressionStr']).eql('true')
  })

  it('route("cmd1[true]", Function)', () => {
    const app = new Application()
    const commandTree = app['_commandTree']
    const route = 'cmd1[true]'
    const func = () => {}

    app.route(route, func)
    expect(commandTree.root.children['cmd1']).instanceOf(FixedCommandNode)

    const callableRules = commandTree.root.children['cmd1']['_callbackRules']
    expect(callableRules.length).equal(1)

    const rule = callableRules[0]
    expect(rule.callback).eql(func)
    expect(rule.condition['_expressionStr']).eql('true')
  })

  it('route("cmd1", "true", Function)', () => {
    const app = new Application()
    const commandTree = app['_commandTree']
    const command = 'cmd1'
    const condition = 'true'
    const func = () => {}

    app.route(command, condition, func)
    expect(commandTree.root.children['cmd1']).instanceOf(FixedCommandNode)

    const callableRules = commandTree.root.children['cmd1']['_callbackRules']
    expect(callableRules.length).equal(1)

    const rule = callableRules[0]
    expect(rule.callback).eql(func)
    expect(rule.condition['_expressionStr']).eql('true')
  })

  it('route(Command, "true", Function)', () => {
    const app = new Application()
    const commandTree = app['_commandTree']
    const command = new Command('cmd1')
    const condition = 'true'
    const func = () => {}

    app.route(command, condition, func)
    expect(commandTree.root.children['cmd1']).instanceOf(FixedCommandNode)

    const callableRules = commandTree.root.children['cmd1']['_callbackRules']
    expect(callableRules.length).equal(1)

    const rule = callableRules[0]
    expect(rule.callback).eql(func)
    expect(rule.condition['_expressionStr']).eql('true')
  })

  it('route("cmd1", Condition, Function)', () => {
    const app = new Application()
    const commandTree = app['_commandTree']
    const command = 'cmd1'
    const condition = new Condition('true')
    const func = () => {}

    app.route(command, condition, func)
    expect(commandTree.root.children['cmd1']).instanceOf(FixedCommandNode)

    const callableRules = commandTree.root.children['cmd1']['_callbackRules']
    expect(callableRules.length).equal(1)

    const rule = callableRules[0]
    expect(rule.callback).eql(func)
    expect(rule.condition['_expressionStr']).eql('true')
  })

  it('route(Command, Condition, Function)', () => {
    const app = new Application()
    const commandTree = app['_commandTree']
    const command = new Command('cmd1')
    const condition = new Condition('true')
    const func = () => {}

    app.route(command, condition, func)
    expect(commandTree.root.children['cmd1']).instanceOf(FixedCommandNode)

    const callableRules = commandTree.root.children['cmd1']['_callbackRules']
    expect(callableRules.length).equal(1)

    const rule = callableRules[0]
    expect(rule.callback).eql(func)
    expect(rule.condition['_expressionStr']).eql('true')
  })

  it('noroute()', () => {
    const app = new Application()
    const commandTree = app['_commandTree']
    const func = () => {}
    app.noroute(func)
    expect(app['_norouteCallback']).is.equal(func)
  })

  it('findCommandNode() when node exist', () => {
    const app = new Application()
    const func = () => {}
    app.route('cmd1/:param1/cmd2/:param2', func)
    const findCommandNode = app['findCommandNode']
    const node = findCommandNode(['cmd1', 'val1', 'cmd2', 'val2'])
    expect(node).instanceOf(CommandNode)
  })

  it('findCommandNode() when node does not exist', () => {
    const app = new Application()
    const func = () => {}
    const findCommandNode = app['findCommandNode']
    const node = findCommandNode(['cmd1'])
    expect(node).to.be.null
  })

  it('getCommandParamsArray()', () => {
    const app = new Application()
    const func = () => {}
    app.route('cmd1/:param1/cmd2/:param2', func)
    const getCommandParamsArray = app['getCommandParamsArray']
    const params = getCommandParamsArray(['cmd1', 'val1', 'cmd2', 'val2'])
    expect(params).eql(['val1', 'val2'])
  })

  it('run()', () => {
    const app = new Application()
    const args = ['cmd1', 'cmd2']

    expect(() => {
      app.run(args)
    }).not.throws()
  })

  it('run() when route exist', done => {
    const app = new Application()
    const args = ['cmd1', 'cmd2']

    app.route('/cmd1/cmd2', () => {
      done()
    })

    expect(() => {
      app.run(args)
    }).not.throws()
  })
})
