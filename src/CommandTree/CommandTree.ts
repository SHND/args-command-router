import CommandNode from './CommandNode'
import FixedCommandNode from './FixedCommandNode'
import ParameterCommandNode from './ParameterCommandNode'
import Command, { CommandItem, CommandItemType } from '../Command'
import Condition from '../Condition'
import Route from '../Route'
import { COMMAND_DELIMITER, PARAMETER_PREFIX } from '../constants'

export default class CommandTree {
  private _rootNode: CommandNode = new FixedCommandNode('/')

  constructor(rootNode?: CommandNode) {
    if (rootNode !== undefined) this._rootNode = rootNode
  }

  get root(): CommandNode {
    return this._rootNode
  }

  static createNode(commandItem: CommandItem): CommandNode {
    return commandItem.type === CommandItemType.FIXED
      ? new FixedCommandNode(commandItem.name)
      : new ParameterCommandNode()
  }

  addRoute(route: Route, callback: Function): void
  addRoute(route: string, callback: Function): void
  addRoute(command: string, condition: string, callback: Function): void
  addRoute(command: Command, condition: string, callback: Function): void
  addRoute(command: string, condition: Condition, callback: Function): void
  addRoute(command: Command, condition: Condition, callback: Function): void
  addRoute(
    routeOrCommandOrString: Route | Command | string,
    conditionOrStringOrCallback: Condition | Function | string,
    callback: Function = () => {}
  ): void {
    if (
      routeOrCommandOrString instanceof Route &&
      conditionOrStringOrCallback instanceof Function
    ) {
      const command: Command = routeOrCommandOrString.command
      const condition: Condition = routeOrCommandOrString.condition

      this.addRoute(command, condition, callback)
    } else if (
      typeof routeOrCommandOrString === 'string' &&
      conditionOrStringOrCallback instanceof Function
    ) {
      const route = new Route(routeOrCommandOrString)
      this.addRoute(route, conditionOrStringOrCallback)
    } else if (
      typeof routeOrCommandOrString === 'string' &&
      typeof conditionOrStringOrCallback === 'string' &&
      callback instanceof Function
    ) {
      const command = new Command(routeOrCommandOrString)
      const condition = new Condition(conditionOrStringOrCallback)
      this.addRoute(command, condition, callback)
    } else if (
      routeOrCommandOrString instanceof Command &&
      typeof conditionOrStringOrCallback === 'string' &&
      callback instanceof Function
    ) {
      const condition = new Condition(conditionOrStringOrCallback)
      this.addRoute(routeOrCommandOrString, condition, callback)
    } else if (
      typeof routeOrCommandOrString === 'string' &&
      conditionOrStringOrCallback instanceof Condition &&
      callback instanceof Function
    ) {
      const command = new Command(routeOrCommandOrString)
      this.addRoute(command, conditionOrStringOrCallback, callback)
    } else if (
      routeOrCommandOrString instanceof Command &&
      conditionOrStringOrCallback instanceof Condition &&
      callback instanceof Function
    ) {
      const commandItems: CommandItem[] = routeOrCommandOrString.getCommandItems()

      let currentNode: CommandNode = this._rootNode
      for (let commandItem of commandItems) {
        let nextNode = null

        if (
          (commandItem.type === CommandItemType.FIXED &&
            !currentNode.hasNode(commandItem.name)) ||
          (commandItem.type === CommandItemType.PARAMETER &&
            !currentNode.hasNode(PARAMETER_PREFIX))
        ) {
          nextNode = CommandTree.createNode(commandItem)
          currentNode.addNode(nextNode)
        } else {
          nextNode =
            commandItem.type === CommandItemType.FIXED
              ? currentNode.children[commandItem.name]
              : currentNode.children[PARAMETER_PREFIX]
        }

        currentNode = nextNode
      }

      currentNode.addCallableRule(conditionOrStringOrCallback, callback)
    }
  }

  printTree(): string {
    return this._printTree(this.root)
  }

  private _printTree(node?: CommandNode, level: number = 0): string {
    if (!node) return ''

    let output = ''
    for (let child in node.children) {
      output += Array(level)
        .fill('  ')
        .join('')

      output += child + '\n'
      output += this._printTree(node.children[child], level + 1)
    }

    return output
  }
}
