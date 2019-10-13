import acp from 'args-command-parser'
import CommandTree from './CommandTree/CommandTree'
import Route from './Route'
import Command from './Command'
import Condition from './Condition'
import { Data } from 'args-command-parser/dist/Models'
import CommandNode from './CommandTree/CommandNode'
import { COMMAND_DELIMITER } from './constants'

export default class Application {
  private _commandTree: CommandTree
  private _norouteCallback: Function = () => {}

  constructor() {
    this._commandTree = new CommandTree()
  }

  route(route: Route, callback: Function): void
  route(route: string, callback: Function): void
  route(command: string, condition: string, callback: Function): void
  route(command: Command, condition: string, callback: Function): void
  route(command: string, condition: Condition, callback: Function): void
  route(command: Command, condition: Condition, callback: Function): void
  route(
    routeOrCommandOrString: Route | Command | string,
    conditionOrStringOrCallback: Condition | Function | string,
    callback: Function = () => {}
  ): void {
    if (
      routeOrCommandOrString instanceof Route &&
      conditionOrStringOrCallback instanceof Function
    ) {
      this._commandTree.addRoute(
        routeOrCommandOrString,
        conditionOrStringOrCallback
      )
    } else if (
      typeof routeOrCommandOrString === 'string' &&
      conditionOrStringOrCallback instanceof Function
    ) {
      this._commandTree.addRoute(
        routeOrCommandOrString,
        conditionOrStringOrCallback
      )
    } else if (
      typeof routeOrCommandOrString === 'string' &&
      typeof conditionOrStringOrCallback === 'string' &&
      callback instanceof Function
    ) {
      this._commandTree.addRoute(
        routeOrCommandOrString,
        conditionOrStringOrCallback,
        callback
      )
    } else if (
      routeOrCommandOrString instanceof Command &&
      typeof conditionOrStringOrCallback === 'string' &&
      callback instanceof Function
    ) {
      this._commandTree.addRoute(
        routeOrCommandOrString,
        conditionOrStringOrCallback,
        callback
      )
    } else if (
      typeof routeOrCommandOrString === 'string' &&
      conditionOrStringOrCallback instanceof Condition &&
      callback instanceof Function
    ) {
      this._commandTree.addRoute(
        routeOrCommandOrString,
        conditionOrStringOrCallback,
        callback
      )
    } else if (
      routeOrCommandOrString instanceof Command &&
      conditionOrStringOrCallback instanceof Condition &&
      callback instanceof Function
    ) {
      this._commandTree.addRoute(
        routeOrCommandOrString,
        conditionOrStringOrCallback,
        callback
      )
    }

    // return this._commandTree.addRoute(
    //   routeOrCommandOrString,
    //   conditionOrStringOrCallback,
    //   callback
    // )
  }

  noroute(callback: Function) {
    this._norouteCallback = callback
  }

  run(argv?: string[]) {
    const acpData: Data = acp(argv).data
    const { commands: commandItems, shortSwitches, longSwitches } = acpData

    const paramKeys = []

    let currentNode: CommandNode | null = this._commandTree.root

    for (let commandItem of commandItems) {
      if (!currentNode) {
        this._norouteCallback()
        return
      }

      if (currentNode.children[commandItem]) {
        currentNode = currentNode.children[commandItem]
      } else if (currentNode.parameterChild) {
        currentNode = currentNode.parameterChild
        paramKeys.push(commandItem)
      } else {
        this._norouteCallback()
        return
      }
    }

    const command: Command = currentNode.getCommand()
    if (!command) return null

    const paramValues = command.getParameters()
    if (paramKeys.length !== paramValues.length)
      throw Error(
        'Expecting to have exact same number of command parameters and values'
      )

    const parameters = {}
    for (let i = 0; i < paramKeys.length; i++)
      parameters[paramKeys[i]] = paramValues[i]

    for (let key in shortSwitches) {
      if (parameters[key])
        throw Error(
          `Conflicting parameter names on '${key}' for route '${commandItems.join(
            COMMAND_DELIMITER
          )}'`
        )
      parameters[key] = shortSwitches[key]
    }

    for (let key in longSwitches) {
      if (parameters[key])
        throw Error(
          `Conflicting parameter names on '${key}' for route '${commandItems.join(
            COMMAND_DELIMITER
          )}'`
        )
      parameters[key] = longSwitches[key]
    }

    const callback: Function | null = currentNode.firstMatchedCallable(
      parameters
    )

    if (!callback) {
      this._norouteCallback()
      return
    }

    callback()
  }
}
