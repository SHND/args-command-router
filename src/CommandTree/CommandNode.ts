import commandLineUsage from 'command-line-usage'
import FixedCommandNode from './FixedCommandNode'
import ParameterCommandNode from './ParameterCommandNode'
import Command from '../Command'
import Condition from '../Condition'
import { PARAMETER_PREFIX, COMMAND_DELIMITER } from '../constants'
import { NodeChildrenType } from './models'

export interface CallbackRule {
  condition: Condition
  callback: Function
}

export default abstract class CommandNode {
  private _parentNode: CommandNode | null = null
  private _command: Command | null = null
  private _callbackRules: CallbackRule[] = []
  private _children: NodeChildrenType = {}

  constructor(private _name: string, _parentNode: CommandNode | null) {
    this._parentNode = _parentNode

    this.printHelp = this.printHelp.bind(this)
  }

  get name(): string {
    return this._name
  }

  get parent(): CommandNode | null {
    return this._parentNode
  }

  hasNode(str: string): boolean
  hasNode(node: CommandNode): boolean
  hasNode(nodeOrString: CommandNode | string): boolean {
    if (nodeOrString instanceof CommandNode) {
      return this._children[nodeOrString.name] !== undefined
    } else {
      const nodeName = nodeOrString.startsWith(PARAMETER_PREFIX)
        ? PARAMETER_PREFIX
        : nodeOrString

      return this._children[nodeName] !== undefined
    }
  }

  addNode(nodeOrString: CommandNode): CommandNode {
    if (!this.hasNode(nodeOrString)) {
      this._children[nodeOrString.name] = nodeOrString
      return nodeOrString
    }

    return this._children[nodeOrString.name]
  }

  hasCommand(): boolean {
    return !!this._command
  }

  setCommand(command: Command): CommandNode {
    this._command = command

    return this
  }

  getCommand(): Command | null {
    return this._command
  }

  get children(): NodeChildrenType {
    return this._children
  }

  get parameterChild(): CommandNode | null {
    return this._children[PARAMETER_PREFIX]
  }

  matchChild(name: string): CommandNode | null {
    return this._children[name]
      ? this._children[name]
      : this._children[PARAMETER_PREFIX]
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

  /**
   * Find the first callableRule which its condition evaluates to true;
   * @param values these are values passed in run-time. it can be parameter or switch values without ':', '-' or '--'
   * @returns first match callableRule function or null
   */
  firstMatchedCallable(args: {
    [key: string]: string | boolean
  }): Function | null {
    for (let i = 0; i < this._callbackRules.length; i++) {
      const rule = this._callbackRules[i]

      if (rule.condition.evaluate(args)) return rule.callback
    }

    return null
  }

  commandNodePath(): CommandNode[] {
    const commandNodes: CommandNode[] = []
    let currentNode: CommandNode | null = this
    while (currentNode) {
      commandNodes.push(currentNode)
      currentNode = currentNode.parent
    }

    return commandNodes.reverse()
  }

  commandNodePathNames(): string[] {
    return this.commandNodePath().map(cn => cn.name)
  }

  commandNodePathString(): string {
    return this.commandNodePathNames().join(COMMAND_DELIMITER)
  }

  printHelp(): void {
    const command: Command | null = this.getCommand()
    if (!command) {
      const pathNames = this.commandNodePathNames()
      const usage = commandLineUsage([
        {
          header: 'Usage',
          content: this.commandNodePathNames().join(' '),
        },
      ])
      console.log(usage)
    } else {
      const usage = commandLineUsage([
        {
          header: 'Usage',
          content: "Hi this is something i'm doing",
        },
      ])
      console.log(usage)
    }
  }
}
