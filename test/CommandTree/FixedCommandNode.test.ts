import { expect } from 'chai'
import FixedCommandNode from '../../src/CommandTree/FixedCommandNode'
import { PARAMETER_PREFIX } from '../../src/constants'
import ParameterCommandNode from '../../src/CommandTree/ParameterCommandNode'
import Command from '../../src/Command'
import Condition from '../../src/Condition'
import CommandNode from '../../src/CommandTree/CommandNode'

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

  it('parameterChild() when doesn not exist', () => {
    const parentNode = new FixedCommandNode('node1')

    expect(parentNode.parameterChild).is.null
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

  it('prependCallableRule() for condition string', () => {
    const condition = 'true'
    const func = () => {}

    const node1 = new FixedCommandNode('node1')
    node1.prependCallableRule(condition, func)
    expect(node1['_callbackRules'].length).to.be.equal(1)
    expect(node1['_callbackRules'][0].condition).to.be.instanceof(Condition)
    expect(node1['_callbackRules'][0].callback).to.be.eql(func)
  })

  it('prependCallableRule() for condition object', () => {
    const condition = new Condition('true')
    const func = () => {}

    const node1 = new FixedCommandNode('node1')
    node1.prependCallableRule(condition, func)
    expect(node1['_callbackRules'].length).to.be.equal(1)
    expect(node1['_callbackRules'][0].condition).to.be.eql(condition)
    expect(node1['_callbackRules'][0].callback).to.be.eql(func)
  })

  it('prependCallableRule() for CallableRule object', () => {
    const callableRule = {
      condition: new Condition('true'),
      callback: () => {},
    }

    const node1 = new FixedCommandNode('node1')
    node1.prependCallableRule(callableRule)

    expect(node1['_callbackRules'].length).to.be.equal(1)
    expect(node1['_callbackRules'][0]).to.be.eql(callableRule)
  })

  it('prependCallableRule() for multiple callableRule', () => {
    const callableRule1 = {
      condition: new Condition('true'),
      callback: () => {},
    }
    const callableRule2 = {
      condition: new Condition('true'),
      callback: () => {},
    }

    const node1 = new FixedCommandNode('node1')
    node1.prependCallableRule(callableRule1)
    node1.prependCallableRule(callableRule2)

    expect(node1['_callbackRules'].length).to.be.equal(2)
    expect(node1['_callbackRules'][0]).to.be.eql(callableRule2)
    expect(node1['_callbackRules'][1]).to.be.eql(callableRule1)
  })

  it('appendCallableRule() for condition string', () => {
    const condition = 'true'
    const func = () => {}

    const node1 = new FixedCommandNode('node1')
    node1.appendCallableRule(condition, func)
    expect(node1['_callbackRules'].length).to.be.equal(1)
    expect(node1['_callbackRules'][0].condition).to.be.instanceof(Condition)
    expect(node1['_callbackRules'][0].callback).to.be.eql(func)
  })

  it('appendCallableRule() for condition object', () => {
    const condition = new Condition('true')
    const func = () => {}

    const node1 = new FixedCommandNode('node1')
    node1.appendCallableRule(condition, func)
    expect(node1['_callbackRules'].length).to.be.equal(1)
    expect(node1['_callbackRules'][0].condition).to.be.eql(condition)
    expect(node1['_callbackRules'][0].callback).to.be.eql(func)
  })

  it('appendCallableRule() for CallableRule object', () => {
    const callableRule = {
      condition: new Condition('true'),
      callback: () => {},
    }

    const node1 = new FixedCommandNode('node1')
    node1.appendCallableRule(callableRule)

    expect(node1['_callbackRules'].length).to.be.equal(1)
    expect(node1['_callbackRules'][0]).to.be.eql(callableRule)
  })

  it('appendCallableRule() for multiple callableRule', () => {
    const callableRule1 = {
      condition: new Condition('true'),
      callback: () => {},
    }
    const callableRule2 = {
      condition: new Condition('true'),
      callback: () => {},
    }

    const node1 = new FixedCommandNode('node1')
    node1.appendCallableRule(callableRule1)
    node1.appendCallableRule(callableRule2)

    expect(node1['_callbackRules'].length).to.be.equal(2)
    expect(node1['_callbackRules'][0]).to.be.eql(callableRule1)
    expect(node1['_callbackRules'][1]).to.be.eql(callableRule2)
  })

  it('firstMatchedCallable() when match exist', () => {
    const trueFunc = () => true
    const falseFunc = () => true

    const node1 = new FixedCommandNode('node1')
    node1.appendCallableRule('false', falseFunc)
    node1.appendCallableRule('true', trueFunc)
    expect(node1.firstMatchedCallable({})).to.eql(trueFunc)

    const node2 = new FixedCommandNode('node1')
    node1.appendCallableRule('true', trueFunc)
    node1.appendCallableRule('false', falseFunc)
    expect(node1.firstMatchedCallable({})).to.eql(trueFunc)
  })

  it('firstMatchedCallable() when multimatch exist', () => {
    const func1 = () => true
    const func2 = () => true

    const node1 = new FixedCommandNode('node1')
    node1.appendCallableRule('true', func1)
    node1.appendCallableRule('true', func2)
    expect(node1.firstMatchedCallable({})).to.eql(func1)
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

  it('commandNodePathString() when command does not exist on the CommandNode', () => {
    const node1 = new FixedCommandNode('node1')
    const path1 = node1.commandNodePathString()
    expect(path1).eql('')

    const node2 = new FixedCommandNode('node2')
    node1.addNode(node2)
    const path2 = node2.commandNodePathString()
    expect(path2).eql('node2')
  })

  it('commandNodePathString() when command exists CommandNode', () => {
    const node1 = new FixedCommandNode('node1')

    const path1 = node1.commandNodePathString()
    expect(path1).eql('')

    const node2 = new FixedCommandNode('node2')
    node1.addNode(node2)

    const path2 = node2.commandNodePathString()
    expect(path2).eql('node2')
  })

  it('getCommandPathForHelp() when command does not exist on the CommandNode', () => {
    const node1 = new FixedCommandNode('node1')

    const path1 = node1.getCommandPathForHelp()
    expect(path1.length).equals(2)
    expect(path1).eql(['<APP>', '<COMMAND>'])

    const node2 = new FixedCommandNode('node2')
    node1.addNode(node2)

    const path2 = node2.getCommandPathForHelp()
    expect(path2.length).equals(3)
    expect(path2).eql(['<APP>', 'node2', '<COMMAND>'])
  })

  it('getCommandPathForHelp() when command exists CommandNode', () => {
    const node1 = new FixedCommandNode('node1')
    node1.setCommand(new Command('node1'))

    const path1 = node1.getCommandPathForHelp()
    expect(path1.length).equals(3)
    expect(path1).eql(['<APP>', 'node1', '[COMMAND]'])

    const node2 = new FixedCommandNode('node2')
    node2.setCommand(new Command('node1/node2'))
    node1.addNode(node2)

    const path2 = node2.getCommandPathForHelp()
    expect(path2.length).equals(4)
    expect(path2).eql(['<APP>', 'node1', 'node2', '[COMMAND]'])
  })

  it('_createHelpByNodes() for only one node', () => {
    const node1 = new FixedCommandNode('node1')
    let _createHelpByNodes = CommandNode.prototype['_createHelpByNodes']
    _createHelpByNodes = _createHelpByNodes.bind(node1)
    expect(_createHelpByNodes.call(node1)).eql([
      {
        header: 'Usage',
        content: '<APP> <COMMAND>',
      },
      {
        header: 'Command List',
        content: [],
      },
    ])
  })

  it('_createHelpByNodes() for two node chain', () => {
    const node1 = new FixedCommandNode('node1')
    const node2 = new FixedCommandNode('node2')
    node1.addNode(node2)
    let _createHelpByNodes = CommandNode.prototype['_createHelpByNodes']
    _createHelpByNodes = _createHelpByNodes.bind(node1)
    expect(_createHelpByNodes.call(node1)).eql([
      {
        header: 'Usage',
        content: '<APP> <COMMAND>',
      },
      {
        header: 'Command List',
        content: [
          {
            name: 'node2',
            summary: '',
          },
        ],
      },
    ])
  })

  it('_createHelpByCommand() when command not exist', () => {
    const node1 = new FixedCommandNode('node1')
    let _createHelpByCommand = CommandNode.prototype['_createHelpByCommand']
    _createHelpByCommand = _createHelpByCommand.bind(node1)

    expect(() => {
      const helpObject = _createHelpByCommand()
    }).throws()
  })

  it('_createHelpByCommand() when command exist and node has no children', () => {
    const node1 = new FixedCommandNode('node1')
    let _createHelpByCommand = CommandNode.prototype['_createHelpByCommand']
    _createHelpByCommand = _createHelpByCommand.bind(node1)
    const command = new Command('node1')
    node1.setCommand(command)

    const helpObject = _createHelpByCommand()
    expect(helpObject).eql([
      { header: 'Usage', content: '<APP> node1 [COMMAND]' },
      { header: 'Command List', content: [] },
    ])
    // console.log(helpObject)
  })

  it('_createHelpByCommand() when command exist and node has a child', () => {
    const node1 = new FixedCommandNode('node1')
    const node2 = new FixedCommandNode('node2')
    node1.addNode(node2)
    let _createHelpByCommand = CommandNode.prototype['_createHelpByCommand']
    _createHelpByCommand = _createHelpByCommand.bind(node1)
    const command = new Command('node1')
    node1.setCommand(command)

    const helpObject = _createHelpByCommand()
    expect(helpObject).eql([
      { header: 'Usage', content: '<APP> node1 [COMMAND]' },
      { header: 'Command List', content: [{ name: 'node2', summary: '' }] },
    ])
    // console.log(helpObject)
  })

  it('_createHelpByCommand() when command exist and switches exist', () => {
    const node1 = new FixedCommandNode('node1')
    let _createHelpByCommand = CommandNode.prototype['_createHelpByCommand']
    _createHelpByCommand = _createHelpByCommand.bind(node1)
    const command = new Command('node1')
    command.booleanSwitch('b', 'boolean', 'description1')
    command.requiredSwitch('r', 'required', 'description2')
    command.valuedSwitch('v', 'valued', 'description3')
    node1.setCommand(command)

    const helpObject = _createHelpByCommand()
    // console.log(helpObject)
    expect(helpObject).eql([
      { header: 'Usage', content: '<APP> node1 [COMMAND]' },
      { header: 'Command List', content: [] },
      {
        header: 'Required Options',
        optionList: [
          {
            alias: 'r',
            description: 'description2',
            name: 'required',
            typeLabel: '{underline value}',
          },
        ],
      },
      {
        header: 'Optional Options',
        optionList: [
          {
            alias: 'b',
            description: 'description1',
            name: 'boolean',
            type: Boolean,
          },
          {
            alias: 'v',
            description: '',
            name: 'valued',
            typeLabel: '{underline value}',
          },
        ],
      },
    ])
  })
})
