import CommandNode from './CommandNode'
import FixedCommandNode from './FixedCommandNode'
import ParameterCommandNode from './ParameterCommandNode'
import Command, { CommandItem, CommandItemType } from '../Command'
import Condition from '../Condition'
import Route from '../Route'
import { COMMAND_DELIMITER, PARAMETER_PREFIX } from '../constants'

export default class CommandTree {
  private _rootNode: CommandNode = new FixedCommandNode('/', null)

  constructor(rootNode?: CommandNode) {
    if (rootNode !== undefined) this._rootNode = rootNode
  }

  get root(): CommandNode {
    return this._rootNode
  }

  static createNode(
    commandItem: CommandItem,
    parentNode: CommandNode | null = null
  ): CommandNode {
    return commandItem.type === CommandItemType.FIXED
      ? new FixedCommandNode(commandItem.name, parentNode)
      : new ParameterCommandNode(parentNode)
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
        currentNode = this.createOrGetNextNode(currentNode, commandItem)
      }

      currentNode.setCommand(routeOrCommandOrString)
      currentNode.addCallableRule(conditionOrStringOrCallback, callback)

      return routeOrCommandOrString
    }

    throw Error(
      `Incorrect parameters is passed to CommandTree::addRoute.\nThe parameters are: "${[
        ...arguments,
      ]}"`
    )
  }

  private createHelpNode(parentNode: CommandNode): CommandNode {
    const helpNode = CommandTree.createNode(
      { name: 'help', type: CommandItemType.FIXED },
      parentNode
    )

    const command = new Command(helpNode.commandNodePathString().substring(1))
    command.description('Print help')
    helpNode.setCommand(command)

    helpNode.addCallableRule({
      condition: new Condition(),
      callback: parentNode.printHelp.bind(this),
    })

    return helpNode
  }

  private createOrGetNextNode(
    currentNode: CommandNode,
    commandItem: CommandItem
  ): CommandNode {
    if (!this.nodeHasCommandItem(currentNode, commandItem)) {
      const node = CommandTree.createNode(commandItem, currentNode)
      currentNode.addNode(node)

      const helpNode = this.createHelpNode(node)
      node.addNode(helpNode)

      return node
    }

    return commandItem.type === CommandItemType.FIXED
      ? currentNode.children[commandItem.name]
      : currentNode.children[PARAMETER_PREFIX]
  }

  private nodeHasCommandItem(
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

  printTree(): void {
    console.log(this._printTree(this.root))
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
