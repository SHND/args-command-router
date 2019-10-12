import FixedCommandNode from './FixedCommandNode'
import ParameterCommandNode from './ParameterCommandNode'
import Command from '../Command'
import Condition from '../Condition'
import { PARAMETER_PREFIX } from '../constants'
import { NodeChildrenType } from './models'

export interface CallbackRule {
  condition: Condition
  callback: Function
}

export default abstract class CommandNode {
  static createNode(name: string): CommandNode {
    if (name === PARAMETER_PREFIX) {
      return new ParameterCommandNode()
    }

    return new FixedCommandNode(name)
  }

  private _command: Command | null = null
  private _callbackRules: CallbackRule[] = []
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

  hasCommand(): boolean {
    return !!this._command
  }

  setCommand(command: Command): CommandNode {
    this._command = command

    return this
  }

  addCallableRule(callableRule: CallbackRule): CommandNode
  addCallableRule(condition: Condition, callback: Function): CommandNode
  addCallableRule(condition: string, callback: Function): CommandNode
  addCallableRule(
    policyOrCondition: CallbackRule | Condition | string,
    callback: Function = () => {}
  ): CommandNode {
    let policy: CallbackRule
    if (policyOrCondition instanceof Condition) {
      policy = { condition: policyOrCondition, callback }
    } else if (typeof policyOrCondition === 'string') {
      policy = { condition: new Condition(policyOrCondition), callback }
    } else {
      policy = policyOrCondition
    }
    this._callbackRules = [policy, ...this._callbackRules]

    return this
  }
}
