import Condition from './Condition'
import Command from './Command'
import { CONDITION_EXPR_TRUE } from './constants'

export default class Route {
  private _command: Command
  private _condition: Condition

  constructor(route: string)
  constructor(command: Command, condition: Condition)
  constructor(routeOrCommand: Command | string, condition?: Condition) {
    if (typeof routeOrCommand === 'string' && condition === undefined) {
      const route = Route.parse(routeOrCommand)
      this._command = route.command
      this._condition = route.condition
    } else if (
      routeOrCommand instanceof Command &&
      condition instanceof Condition
    ) {
      this._command = routeOrCommand
      this._condition = condition
    } else {
      throw Error('This path in Route constructor should never happen.')
    }
  }

  static parse(route: string): Route {
    route = route.trim()

    let commandString = ''
    let conditionString = ''

    const conditionStartingIndex = route.indexOf('[')
    if (conditionStartingIndex >= 0) {
      const conditionEndingIndex = route.indexOf(']')
      if (conditionEndingIndex < 0) throw Error('Failed to parse route')
      commandString = route.substring(0, conditionStartingIndex).trim()
      conditionString = route
        .substring(conditionStartingIndex + 1, conditionEndingIndex)
        .trim()
    } else {
      commandString = route
      conditionString = CONDITION_EXPR_TRUE
    }
    const command = new Command(commandString)
    const condition = new Condition(conditionString)

    return new Route(command, condition)
  }

  get command(): Command {
    return this._command
  }

  get condition(): Condition {
    return this._condition
  }
}
