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
  addRoute(routeString: string, callback: Function): void
  addRoute(command: Command, condition: Condition, callback: Function): void
  addRoute(
    routeOrCommandOrRoute: Route | Command | string,
    conditionOrCallback: Condition | Function,
    callback: Function = () => {}
  ): void {
    if (
      typeof routeOrCommandOrRoute === 'string' &&
      conditionOrCallback instanceof Function
    ) {
      const route = new Route(routeOrCommandOrRoute)
      this.addRoute(route, conditionOrCallback)
    } else if (
      routeOrCommandOrRoute instanceof Route &&
      conditionOrCallback instanceof Function
    ) {
      const command: Command = routeOrCommandOrRoute.command
      const condition: Condition = routeOrCommandOrRoute.condition

      this.addRoute(command, condition, conditionOrCallback)
    } else if (
      routeOrCommandOrRoute instanceof Command &&
      conditionOrCallback instanceof Condition
    ) {
      const commandItems: CommandItem[] = routeOrCommandOrRoute.getCommandItems()

      let currentNode: CommandNode = this._rootNode
      for (let commandItem of commandItems) {
        currentNode = currentNode.addNode(commandItem.name)
      }

      currentNode.addCallableRule(conditionOrCallback, callback)
    }
  }
}
