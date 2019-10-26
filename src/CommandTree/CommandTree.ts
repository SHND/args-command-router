import CommandNode from './CommandNode'
import FixedCommandNode from './FixedCommandNode'
import ParameterCommandNode from './ParameterCommandNode'
import Command from '../Command'
import Condition from '../Condition'
import Route from '../Route'
import {
  PARAMETER_PREFIX,
  ROOT_COMMAND_NAME,
  COMMAND_DELIMITER,
  HELP_COMMAND_NODE_NAME,
} from '../constants'
import { CommandItem, CommandItemType } from '../models'

export default class CommandTree {
  private _rootNode: CommandNode

  constructor(rootNode?: CommandNode) {
    if (rootNode !== undefined) {
      this._rootNode = rootNode
    } else {
      this._rootNode = new FixedCommandNode(ROOT_COMMAND_NAME)
      this._rootNode.addNode(CommandTree._createHelpNode(this._rootNode))
    }
  }

  get root(): CommandNode {
    return this._rootNode
  }

  static createNode(commandItem: CommandItem): CommandNode {
    return commandItem.type === CommandItemType.FIXED
      ? new FixedCommandNode(commandItem.name)
      : new ParameterCommandNode()
  }

  addRoute(route: Route, callback: Function): Command
  addRoute(route: string, callback: Function): Command
  addRoute(command: string, condition: string, callback: Function): Command
  addRoute(command: Command, condition: string, callback: Function): Command
  addRoute(command: string, condition: Condition, callback: Function): Command
  addRoute(command: Command, condition: Condition, callback: Function): Command
  addRoute(
    routeOrCommandOrString: Route | Command | string,
    conditionOrStringOrCallback: Condition | Function | string,
    callback: Function = () => {}
  ): Command {
    if (
      routeOrCommandOrString instanceof Route &&
      conditionOrStringOrCallback instanceof Function
    ) {
      const command: Command = routeOrCommandOrString.command
      const condition: Condition = routeOrCommandOrString.condition

      return this.addRoute(command, condition, conditionOrStringOrCallback)
    } else if (
      typeof routeOrCommandOrString === 'string' &&
      conditionOrStringOrCallback instanceof Function
    ) {
      const route = new Route(routeOrCommandOrString)
      return this.addRoute(route, conditionOrStringOrCallback)
    } else if (
      typeof routeOrCommandOrString === 'string' &&
      typeof conditionOrStringOrCallback === 'string' &&
      callback instanceof Function
    ) {
      const command = new Command(routeOrCommandOrString)
      const condition = new Condition(conditionOrStringOrCallback)
      return this.addRoute(command, condition, callback)
    } else if (
      routeOrCommandOrString instanceof Command &&
      typeof conditionOrStringOrCallback === 'string' &&
      callback instanceof Function
    ) {
      const condition = new Condition(conditionOrStringOrCallback)
      return this.addRoute(routeOrCommandOrString, condition, callback)
    } else if (
      typeof routeOrCommandOrString === 'string' &&
      conditionOrStringOrCallback instanceof Condition &&
      callback instanceof Function
    ) {
      const command = new Command(routeOrCommandOrString)
      return this.addRoute(command, conditionOrStringOrCallback, callback)
    } else if (
      routeOrCommandOrString instanceof Command &&
      conditionOrStringOrCallback instanceof Condition &&
      callback instanceof Function
    ) {
      const commandItems: CommandItem[] = routeOrCommandOrString.getCommandItems()

      let currentNode: CommandNode = this._rootNode
      for (let commandItem of commandItems) {
        currentNode = CommandTree._createOrGetNextNode(currentNode, commandItem)
      }

      currentNode.setCommand(routeOrCommandOrString)
      currentNode.appendCallableRule(conditionOrStringOrCallback, callback)

      return routeOrCommandOrString
    }

    throw Error(
      `Incorrect parameters is passed to CommandTree::addRoute.\nThe parameters are: "${[
        ...arguments,
      ]}"`
    )
  }

  static _createHelpNode(parentNode: CommandNode): CommandNode {
    const helpNode = CommandTree.createNode({
      name: HELP_COMMAND_NODE_NAME,
      type: CommandItemType.FIXED,
    })

    const command = new Command(
      parentNode.commandNodePathString() +
        COMMAND_DELIMITER +
        HELP_COMMAND_NODE_NAME
    )
    command.description('Print help')
    helpNode.setCommand(command)

    helpNode.appendCallableRule({
      condition: new Condition(),
      callback: parentNode.printHelp,
    })

    return helpNode
  }

  static _createOrGetNextNode(
    currentNode: CommandNode,
    commandItem: CommandItem
  ): CommandNode {
    if (!CommandTree._nodeHasCommandItem(currentNode, commandItem)) {
      const node = CommandTree.createNode(commandItem)
      currentNode.addNode(node)

      const helpNode = CommandTree._createHelpNode(node)
      node.addNode(helpNode)

      return node
    }

    return commandItem.type === CommandItemType.FIXED
      ? currentNode.children[commandItem.name]
      : currentNode.children[PARAMETER_PREFIX]
  }

  static _nodeHasCommandItem(
    node: CommandNode,
    commandItem: CommandItem
  ): boolean {
    return (
      (commandItem.type === CommandItemType.FIXED &&
        node.hasNode(commandItem.name)) ||
      (commandItem.type === CommandItemType.PARAMETER &&
        node.hasNode(PARAMETER_PREFIX))
    )
  }

  toString(): string {
    return this._toString(this.root)
  }

  private _toString(node?: CommandNode, level: number = 0): string {
    if (!node) return ''

    let output = ''
    for (let child in node.children) {
      output += Array(level)
        .fill('  ')
        .join('')

      output += child + '\n'
      output += this._toString(node.children[child], level + 1)
    }

    return output
  }
}
