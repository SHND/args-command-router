import { expect } from 'chai'
import FixedCommandNode from '../../src/CommandTree/FixedCommandNode'
import {
  PARAMETER_PREFIX,
  ROOT_COMMAND_NAME,
  COMMAND_DELIMITER,
} from '../../src/constants'
import ParameterCommandNode from '../../src/CommandTree/ParameterCommandNode'
import Command from '../../src/Command'
import Condition from '../../src/Condition'

describe('FixedCommandNode class', () => {
  it('create for name="node1"', () => {
    const node = new FixedCommandNode('node1')

    expect(node).deep.include({
      _name: 'node1',
      _parentNode: null,
      _command: null,
      _callbackRules: [],
      _children: {},
    })
  })

  it('create for name=":"', () => {
    expect(() => {
      new FixedCommandNode(PARAMETER_PREFIX)
    }).throws()
  })

  it('get name', () => {
    const node = new FixedCommandNode('node1')

    expect(node.name).eql('node1')
  })

  it('addNode() adds new node', () => {
    const parentNode = new FixedCommandNode('parentNode')
    parentNode.addNode(new FixedCommandNode('node1'))

    expect(parentNode['_children']['node1']).deep.include({
      _name: 'node1',
      _parentNode: parentNode,
      _command: null,
      _callbackRules: [],
      _children: {},
    })
  })

  it('addNode() return existing node for the same name', () => {
    const parentNode = new FixedCommandNode('parentNode')
    const node1 = parentNode.addNode(new FixedCommandNode('node1'))
    const node2 = parentNode.addNode(new FixedCommandNode('node1'))

    expect(node1).eql(node2)
  })

  it('hasNode() for string that is not a parameter', () => {
    const parentNode = new FixedCommandNode('parentNode')
    parentNode.addNode(new FixedCommandNode('node1'))

    expect(parentNode.hasNode('node1')).to.be.true
  })

  it('hasNode() for string that is a parameter', () => {
    const parentNode = new FixedCommandNode('parentNode')
    parentNode.addNode(new ParameterCommandNode())

    expect(parentNode.hasNode(':some_param_name')).to.be.true
  })

  it('setCommand()', () => {
    const node1 = new FixedCommandNode('node1')
    const command = new Command('some/path')

    node1.setCommand(command)

    expect(node1['_command']).is.eql(command)
  })

  it('hasCommand()', () => {
    const node1 = new FixedCommandNode('node1')
    const node2 = new FixedCommandNode('node2')

    node1.setCommand(new Command('some/path'))

    expect(node1.hasCommand()).to.be.true
    expect(node2.hasCommand()).to.be.false
  })

  it('getCommand()', () => {
    const node1 = new FixedCommandNode('node1')
    const command = new Command('some/path')

    node1.setCommand(command)

    expect(node1.getCommand()).is.eql(command)
  })

  it('get children()', () => {
    const parentNode = new FixedCommandNode('parentNode')
    const node1 = new ParameterCommandNode()
    const node2 = new FixedCommandNode('node2')
    const node3 = new FixedCommandNode('node3')

    parentNode.addNode(node1)
    parentNode.addNode(node2)
    parentNode.addNode(node3)

    expect(parentNode['_children']).is.deep.equals({
      [PARAMETER_PREFIX]: node1,
      node2: node2,
      node3: node3,
    })
  })

  it('parameterChild()', () => {
    const parentNode = new FixedCommandNode('parentNode')
    const node1 = new ParameterCommandNode()

    parentNode.addNode(node1)

    expect(parentNode.parameterChild).eqls(node1)
  })

  it('matchChild() for paramter string', () => {
    const parentNode = new FixedCommandNode('parentNode')
    const node1 = new ParameterCommandNode()

    parentNode.addNode(node1)

    expect(parentNode.matchChild(':some_variable')).eqls(node1)
  })

  it('matchChild() for fixedNode string', () => {
    const parentNode = new FixedCommandNode('parentNode')
    const node1 = new FixedCommandNode('node1')

    parentNode.addNode(node1)

    expect(parentNode.matchChild('node1')).eqls(node1)
  })

  it('addCallableRule() for condition string', () => {
    const condition = 'true'
    const func = () => {}

    const node1 = new FixedCommandNode('node1')
    node1.addCallableRule(condition, func)
    expect(node1['_callbackRules'].length).to.be.equal(1)
    expect(node1['_callbackRules'][0].condition).to.be.instanceof(Condition)
    expect(node1['_callbackRules'][0].callback).to.be.eql(func)
  })

  it('addCallableRule() for condition object', () => {
    const condition = new Condition('true')
    const func = () => {}

    const node1 = new FixedCommandNode('node1')
    node1.addCallableRule(condition, func)
    expect(node1['_callbackRules'].length).to.be.equal(1)
    expect(node1['_callbackRules'][0].condition).to.be.eql(condition)
    expect(node1['_callbackRules'][0].callback).to.be.eql(func)
  })

  it('addCallableRule() for CallableRule object', () => {
    const callableRule = {
      condition: new Condition('true'),
      callback: () => {},
    }

    const node1 = new FixedCommandNode('node1')
    node1.addCallableRule(callableRule)

    expect(node1['_callbackRules'].length).to.be.equal(1)
    expect(node1['_callbackRules'][0]).to.be.eql(callableRule)
  })

  it('firstMatchedCallable() when match exist', () => {
    const trueFunc = () => true
    const falseFunc = () => true

    const node1 = new FixedCommandNode('node1')
    node1.addCallableRule('false', falseFunc)
    node1.addCallableRule('true', trueFunc)
    expect(node1.firstMatchedCallable({})).to.eql(trueFunc)

    const node2 = new FixedCommandNode('node1')
    node1.addCallableRule('true', trueFunc)
    node1.addCallableRule('false', falseFunc)
    expect(node1.firstMatchedCallable({})).to.eql(trueFunc)
  })

  it('firstMatchedCallable() when match does not exist', () => {
    const node1 = new FixedCommandNode('node1')
    expect(node1.firstMatchedCallable({})).to.be.null
  })

  it('commandNodePath()', () => {
    const node1 = new FixedCommandNode('node1')

    const path1 = node1.commandNodePath()
    expect(path1.length).equals(1)
    expect(path1[0]).eqls(node1)

    const node2 = new FixedCommandNode('node2')
    node1.addNode(node2)

    const path2 = node2.commandNodePath()
    expect(path2.length).equals(2)
    expect(path2[0]).eqls(node1)
    expect(path2[1]).eqls(node2)
  })

  it('commandNodePathNames()', () => {
    const node1 = new FixedCommandNode('node1')

    const path1 = node1.commandNodePathNames()
    expect(path1.length).equals(1)
    expect(path1[0]).eqls('node1')

    const node2 = new FixedCommandNode('node2')
    node1.addNode(node2)

    const path2 = node2.commandNodePathNames()
    expect(path2.length).equals(2)
    expect(path2[0]).eqls('node1')
    expect(path2[1]).eqls('node2')
  })

  it('commandNodePathString()', () => {
    const node1 = new FixedCommandNode('node1')

    const path1 = node1.commandNodePathString()
    expect(path1).eqls('node1')

    const node2 = new FixedCommandNode('node2')
    node1.addNode(node2)

    const path2 = node2.commandNodePathString()
    expect(path2).eqls('node1' + COMMAND_DELIMITER + 'node2')
  })
})
