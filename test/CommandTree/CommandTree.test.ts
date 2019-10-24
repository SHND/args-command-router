import { expect } from 'chai'
import CommandTree from '../../src/CommandTree/CommandTree'
import CommandNode from '../../src/CommandTree/CommandNode'
import FixedCommandNode from '../../src/CommandTree/FixedCommandNode'
import { CommandItemType } from '../../src/models'
import ParameterCommandNode from '../../src/CommandTree/ParameterCommandNode'
import { PARAMETER_PREFIX, HELP_COMMAND_NODE_NAME } from '../../src/constants'
import Route from '../../src/Route'
import Command from '../../src/Command'
import Condition from '../../src/Condition'

describe('CommandTree class', () => {
  it('create with no rootNode', () => {
    const commandTree = new CommandTree()

    expect(commandTree['_rootNode']).to.be.instanceof(CommandNode)
  })

  it('create with rootNode', () => {
    const fixedCommandNode = new FixedCommandNode('node1')
    const commandTree = new CommandTree(fixedCommandNode)

    expect(commandTree['_rootNode']).to.be.instanceof(CommandNode)
  })

  it('get root()', () => {
    const commandTree = new CommandTree()

    expect(commandTree.root).to.be.instanceof(CommandNode)
  })

  it('createNode() for Fixed Command Item', () => {
    const node1 = CommandTree.createNode({
      type: CommandItemType.FIXED,
      name: 'node1',
    })

    expect(node1).instanceof(FixedCommandNode)
    expect(node1.name).equal('node1')
  })

  it('createNode() for Parameter Command Item', () => {
    const node1 = CommandTree.createNode({
      type: CommandItemType.PARAMETER,
      name: 'node1',
    })

    expect(node1).instanceof(ParameterCommandNode)
    expect(node1.name).equal(PARAMETER_PREFIX)
  })

  it('addRoute(Route, Function)', () => {
    const commandTree = new CommandTree()
    const route = new Route('cmd1[true]')
    const func = () => {}

    commandTree.addRoute(route, func)
    expect(commandTree.root.children['cmd1']).instanceOf(FixedCommandNode)

    const callableRules = commandTree.root.children['cmd1']['_callbackRules']
    expect(callableRules.length).equal(1)

    const rule = callableRules[0]
    expect(rule.callback).eql(func)
    expect(rule.condition['_expressionStr']).eql('true')
  })

  it('addRoute("cmd1[true]", Function)', () => {
    const commandTree = new CommandTree()
    const route = 'cmd1[true]'
    const func = () => {}

    commandTree.addRoute(route, func)
    expect(commandTree.root.children['cmd1']).instanceOf(FixedCommandNode)

    const callableRules = commandTree.root.children['cmd1']['_callbackRules']
    expect(callableRules.length).equal(1)

    const rule = callableRules[0]
    expect(rule.callback).eql(func)
    expect(rule.condition['_expressionStr']).eql('true')
  })

  it('addRoute("cmd1", "true", Function)', () => {
    const commandTree = new CommandTree()
    const command = 'cmd1'
    const condition = 'true'
    const func = () => {}

    commandTree.addRoute(command, condition, func)
    expect(commandTree.root.children['cmd1']).instanceOf(FixedCommandNode)

    const callableRules = commandTree.root.children['cmd1']['_callbackRules']
    expect(callableRules.length).equal(1)

    const rule = callableRules[0]
    expect(rule.callback).eql(func)
    expect(rule.condition['_expressionStr']).eql('true')
  })

  it('addRoute(Command, "true", Function)', () => {
    const commandTree = new CommandTree()
    const command = new Command('cmd1')
    const condition = 'true'
    const func = () => {}

    commandTree.addRoute(command, condition, func)
    expect(commandTree.root.children['cmd1']).instanceOf(FixedCommandNode)

    const callableRules = commandTree.root.children['cmd1']['_callbackRules']
    expect(callableRules.length).equal(1)

    const rule = callableRules[0]
    expect(rule.callback).eql(func)
    expect(rule.condition['_expressionStr']).eql('true')
  })

  it('addRoute("cmd1", Condition, Function)', () => {
    const commandTree = new CommandTree()
    const command = 'cmd1'
    const condition = new Condition('true')
    const func = () => {}

    commandTree.addRoute(command, condition, func)
    expect(commandTree.root.children['cmd1']).instanceOf(FixedCommandNode)

    const callableRules = commandTree.root.children['cmd1']['_callbackRules']
    expect(callableRules.length).equal(1)

    const rule = callableRules[0]
    expect(rule.callback).eql(func)
    expect(rule.condition['_expressionStr']).eql('true')
  })

  it('addRoute(Command, Condition, Function)', () => {
    const commandTree = new CommandTree()
    const command = new Command('cmd1')
    const condition = new Condition('true')
    const func = () => {}

    commandTree.addRoute(command, condition, func)
    expect(commandTree.root.children['cmd1']).instanceOf(FixedCommandNode)

    const callableRules = commandTree.root.children['cmd1']['_callbackRules']
    expect(callableRules.length).equal(1)

    const rule = callableRules[0]
    expect(rule.callback).eql(func)
    expect(rule.condition['_expressionStr']).eql('true')
  })

  it('_createHelpNode()', () => {
    const node1 = new FixedCommandNode('node1')
    const helpNode = CommandTree._createHelpNode(node1)

    expect(helpNode).instanceof(FixedCommandNode)
  })

  it('_createOrGetNextNode(node, fixedCommandItem) when does not exist', () => {
    const node1 = new FixedCommandNode('node1')
    const node2 = CommandTree._createOrGetNextNode(node1, {
      type: CommandItemType.FIXED,
      name: 'node2',
    })

    expect(node2).instanceof(FixedCommandNode)
    expect(node2.name).equals('node2')
    expect(node1.children['node2']).equals(node2)
  })

  it('_createOrGetNextNode(node, paramCommandItem) when does not exist', () => {
    const node1 = new FixedCommandNode('node1')
    const node2 = CommandTree._createOrGetNextNode(node1, {
      type: CommandItemType.PARAMETER,
      name: 'node2',
    })

    expect(node2).instanceof(ParameterCommandNode)
    expect(node2.name).equals(PARAMETER_PREFIX)
    expect(node1.children[PARAMETER_PREFIX]).equals(node2)
  })

  it('_createOrGetNextNode(node, fixedCommandItem) when child node exist', () => {
    const node1 = new FixedCommandNode('node1')
    const childNode = new FixedCommandNode('node2')
    node1.addNode(childNode)
    const node2 = CommandTree._createOrGetNextNode(node1, {
      type: CommandItemType.FIXED,
      name: 'node2',
    })

    expect(node2).instanceof(FixedCommandNode)
    expect(node2.name).equals('node2')
    expect(childNode).equals(node2)
  })

  it('_createOrGetNextNode(node, paramCommandItem) when child node exist', () => {
    const node1 = new FixedCommandNode('node1')
    const childNode = new ParameterCommandNode()
    node1.addNode(childNode)
    const node2 = CommandTree._createOrGetNextNode(node1, {
      type: CommandItemType.PARAMETER,
      name: 'node2',
    })

    expect(node2).instanceof(ParameterCommandNode)
    expect(node2.name).equals(PARAMETER_PREFIX)
    expect(childNode).equals(node2)
  })

  it('_nodeHasCommandItem(node, fixedCommandItem) when child not exist', () => {
    const node1 = new FixedCommandNode('node1')
    const childNode = new FixedCommandNode('node2')

    expect(
      CommandTree._nodeHasCommandItem(node1, {
        type: CommandItemType.FIXED,
        name: 'node2',
      })
    ).is.false
  })

  it('_nodeHasCommandItem(node, paramCommandItem) when child not exist', () => {
    const node1 = new FixedCommandNode('node1')
    const childNode = new ParameterCommandNode()

    expect(
      CommandTree._nodeHasCommandItem(node1, {
        type: CommandItemType.PARAMETER,
        name: 'node2',
      })
    ).is.false
  })

  it('_nodeHasCommandItem(node, fixedCommandItem) when child exist', () => {
    const node1 = new FixedCommandNode('node1')
    const childNode = new FixedCommandNode('node2')
    node1.addNode(childNode)

    expect(
      CommandTree._nodeHasCommandItem(node1, {
        type: CommandItemType.FIXED,
        name: 'node2',
      })
    ).is.true
  })

  it('_nodeHasCommandItem(node, paramCommandItem) when child exist', () => {
    const node1 = new FixedCommandNode('node1')
    const childNode = new ParameterCommandNode()
    node1.addNode(childNode)

    expect(
      CommandTree._nodeHasCommandItem(node1, {
        type: CommandItemType.PARAMETER,
        name: 'node2',
      })
    ).is.true
  })
})
