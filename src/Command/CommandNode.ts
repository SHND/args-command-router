import FixedCommandNode from './FixedCommandNode'
import ParameterCommandNode from './ParameterCommandNode'
import { PARAMETER_PREFIX } from '../constants'
import { NodeChildrenType } from './models'

export default abstract class CommandNode {
  static createNode(name: string): CommandNode {
    if (name === PARAMETER_PREFIX) {
      return new ParameterCommandNode()
    }

    return new FixedCommandNode(name)
  }

  private _children: NodeChildrenType = {}

  constructor(private _name: string) {}

  get name(): string {
    return this._name
  }

  hasNode(str: string): boolean
  hasNode(node: CommandNode): boolean
  hasNode(nodeOrString: CommandNode | string): boolean {
    if (nodeOrString instanceof CommandNode) {
      return this._children[nodeOrString.name] !== undefined
    } else {
      return this._children[nodeOrString] !== undefined
    }
  }

  addNode(str: string): CommandNode | null
  addNode(node: CommandNode): CommandNode | null
  addNode(nodeOrString: CommandNode | string): CommandNode | null {
    if (nodeOrString instanceof CommandNode) {
      if (!this.hasNode(nodeOrString)) {
        this._children[nodeOrString.name] = nodeOrString
        return nodeOrString
      }

      return this._children[nodeOrString.name]
    } else {
      if (!this.hasNode(nodeOrString)) {
        this._children[nodeOrString] = CommandNode.createNode(nodeOrString)
        return this._children[nodeOrString]
      }

      return this._children[nodeOrString]
    }
  }
}
