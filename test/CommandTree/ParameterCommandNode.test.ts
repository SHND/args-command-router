import { expect } from 'chai'
import FixedCommandNode from '../../src/CommandTree/FixedCommandNode'
import ParameterCommandNode from '../../src/CommandTree/ParameterCommandNode'
import { PARAMETER_PREFIX, COMMAND_DELIMITER } from '../../src/constants'
import Command from '../../src/Command'
import Condition from '../../src/Condition'

describe('ParameterCommandNode class', () => {
  it('create for name="node1"', () => {
    const node = new ParameterCommandNode()

    expect(node).deep.include({
      _name: PARAMETER_PREFIX,
      _parentNode: null,
      _command: null,
      _callbackRules: [],
      _children: {},
    })
  })

  it('get name', () => {
    const node = new ParameterCommandNode()

    expect(node.name).eql(PARAMETER_PREFIX)
  })

  it('addNode() adds new node', () => {
    const parentNode = new ParameterCommandNode()
    parentNode.addNode(new ParameterCommandNode())

    expect(parentNode['_children'][PARAMETER_PREFIX]).deep.include({
      _name: PARAMETER_PREFIX,
      _parentNode: parentNode,
      _command: null,
      _callbackRules: [],
      _children: {},
    })
  })

  it('addNode() return existing node for the same name', () => {
    const parentNode = new ParameterCommandNode()
    const node1 = parentNode.addNode(new ParameterCommandNode())
    const node2 = parentNode.addNode(new ParameterCommandNode())
    expect(node1).eql(node2)
  })

  it('hasNode() for string that is not a parameter', () => {
    const parentNode = new ParameterCommandNode()
    parentNode.addNode(new FixedCommandNode('node1'))

    expect(parentNode.hasNode('node1')).to.be.true
  })

  it('hasNode() for string that is a parameter', () => {
    const parentNode = new ParameterCommandNode()
    parentNode.addNode(new ParameterCommandNode())

    expect(parentNode.hasNode(':some_param_name')).to.be.true
  })

  it('setCommand()', () => {
    const node1 = new ParameterCommandNode()
    const command = new Command('some/path')

    node1.setCommand(command)

    expect(node1['_command']).is.eql(command)
  })

  it('hasCommand()', () => {
    const node1 = new ParameterCommandNode()
    const node2 = new ParameterCommandNode()

    node1.setCommand(new Command('some/path'))

    expect(node1.hasCommand()).to.be.true
    expect(node2.hasCommand()).to.be.false
  })

  it('getCommand()', () => {
    const node1 = new ParameterCommandNode()
    const command = new Command('some/path')

    node1.setCommand(command)

    expect(node1.getCommand()).is.eql(command)
  })

  it('get children()', () => {
    const parentNode = new ParameterCommandNode()
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
    const parentNode = new ParameterCommandNode()
    const node1 = new ParameterCommandNode()

    parentNode.addNode(node1)

    expect(parentNode.parameterChild).eqls(node1)
  })

  it('parameterChild() when doesn not exist', () => {
    const parentNode = new ParameterCommandNode()

    expect(parentNode.parameterChild).is.null
  })

  it('matchChild() for paramter string', () => {
    const parentNode = new ParameterCommandNode()
    const node1 = new ParameterCommandNode()

    parentNode.addNode(node1)

    expect(parentNode.matchChild(':some_variable')).eqls(node1)
  })

  it('matchChild() for fixedNode string', () => {
    const parentNode = new ParameterCommandNode()
    const node1 = new FixedCommandNode('node1')

    parentNode.addNode(node1)

    expect(parentNode.matchChild('node1')).eqls(node1)
  })

  it('addCallableRule() for condition string', () => {
    const condition = 'true'
    const func = () => {}

    const node1 = new ParameterCommandNode()
    node1.addCallableRule(condition, func)
    expect(node1['_callbackRules'].length).to.be.equal(1)
    expect(node1['_callbackRules'][0].condition).to.be.instanceof(Condition)
    expect(node1['_callbackRules'][0].callback).to.be.eql(func)
  })

  it('addCallableRule() for condition object', () => {
    const condition = new Condition('true')
    const func = () => {}

    const node1 = new ParameterCommandNode()
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

    const node1 = new ParameterCommandNode()
    node1.addCallableRule(callableRule)

    expect(node1['_callbackRules'].length).to.be.equal(1)
    expect(node1['_callbackRules'][0]).to.be.eql(callableRule)
  })

  it('firstMatchedCallable() when match exist', () => {
    const trueFunc = () => true
    const falseFunc = () => true

    const node1 = new ParameterCommandNode()
    node1.addCallableRule('false', falseFunc)
    node1.addCallableRule('true', trueFunc)
    expect(node1.firstMatchedCallable({})).to.eql(trueFunc)

    const node2 = new ParameterCommandNode()
    node1.addCallableRule('true', trueFunc)
    node1.addCallableRule('false', falseFunc)
    expect(node1.firstMatchedCallable({})).to.eql(trueFunc)
  })

  it('firstMatchedCallable() when match does not exist', () => {
    const node1 = new ParameterCommandNode()
    expect(node1.firstMatchedCallable({})).to.be.null
  })

  it('commandNodePath()', () => {
    const node1 = new ParameterCommandNode()

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
    const node1 = new ParameterCommandNode()

    const path1 = node1.commandNodePathNames()
    expect(path1.length).equals(1)
    expect(path1[0]).eqls(PARAMETER_PREFIX)

    const node2 = new FixedCommandNode('node2')
    node1.addNode(node2)

    const path2 = node2.commandNodePathNames()
    expect(path2.length).equals(2)
    expect(path2[0]).eqls(PARAMETER_PREFIX)
    expect(path2[1]).eqls('node2')
  })

  it('commandNodePathString()', () => {
    const node1 = new ParameterCommandNode()

    const path1 = node1.commandNodePathString()
    expect(path1).eqls(PARAMETER_PREFIX)

    const node2 = new FixedCommandNode('node2')
    node1.addNode(node2)

    const path2 = node2.commandNodePathString()
    expect(path2).eqls(PARAMETER_PREFIX + COMMAND_DELIMITER + 'node2')
  })
})
