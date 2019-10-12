import CommandNode from './CommandNode'
import FixedCommandNode from './FixedCommandNode'
import Command from '../Command'
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

  // addRoute(route: string)
  // addRoute(command: Command, condition: Condition)
  // addRoute(routeOrCommand: Command | string, condition?: Condition) {
  //   if (
  //     typeof routeOrCommand === 'string' &&
  //     typeof condition === 'undefined'
  //   ) {
  //     const route = new Route(routeOrCommand)

  //   } else if (
  //     routeOrCommand instanceof Command &&
  //     condition instanceof Condition
  //   ) {
  //   } else {
  //     throw Error("This path shouldn't happen")
  //   }
  // }
}
