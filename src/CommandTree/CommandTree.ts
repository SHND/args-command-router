import CommandNode from './CommandNode'
import FixedCommandNode from './FixedCommandNode'
import Command, { CommandItem } from '../Command'
import Condition from '../Condition'
import Route from '../Route'

export default class CommandTree {
  private _rootNode: CommandNode = new FixedCommandNode('/')

  constructor(rootNode?: CommandNode) {
    if (rootNode !== undefined) this._rootNode = rootNode
  }

  get root(): CommandNode {
    return this._rootNode
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
      routeOrCommandOrString instanceof Route &&
      conditionOrStringOrCallback instanceof Function
    ) {
      const command: Command = routeOrCommandOrString.command
      const condition: Condition = routeOrCommandOrString.condition

      this.addRoute(command, condition, conditionOrStringOrCallback)
    } else if (
      routeOrCommandOrString instanceof Command &&
      conditionOrStringOrCallback instanceof Condition
    ) {
      const commandItems: CommandItem[] = routeOrCommandOrString.getCommandItems()

      let currentNode: CommandNode = this._rootNode
      for (let commandItem of commandItems) {
        currentNode = currentNode.addNode(commandItem.name)
      }

      currentNode.addCallableRule(conditionOrStringOrCallback, callback)
    }
  }
}
