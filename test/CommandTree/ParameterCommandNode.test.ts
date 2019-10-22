import { expect } from 'chai'
import FixedCommandNode from '../../src/CommandTree/FixedCommandNode'
import ParameterCommandNode from '../../src/CommandTree/ParameterCommandNode'
import { PARAMETER_PREFIX } from '../../src/constants'

describe('ParameterCommandNode class', () => {
  it('create for parent=Node', () => {
    const parentNode = new FixedCommandNode('parentNode')
    const node = new ParameterCommandNode()
    parentNode.addNode(node)

    expect(node).deep.include({
      _name: PARAMETER_PREFIX,
      _parentNode: parentNode,
      _command: null,
      _callbackRules: [],
      _children: {},
    })
  })
})
