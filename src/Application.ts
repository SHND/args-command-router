import { parser } from 'args-command-parser'
import CommandTree from './CommandTree/CommandTree'
import Route from './Route'
import Command from './Command'
import Condition from './Condition'
import { Data } from 'args-command-parser/dist/Models'
import CommandNode from './CommandTree/CommandNode'
import { COMMAND_DELIMITER } from './constants'
import CallbackData from './CallbackData'

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

  private validateOneValueMostForEachSwitch(acpSwitches: {
    [key: string]: string[]
  }): void {
    const message = 'Only one value for each switch is supported.'

    for (let key in acpSwitches) {
      if (acpSwitches[key].length > 1)
        throw Error(
          message +
            `\nSwitch '${key}' has values '${acpSwitches[key].join(' ')}'.`
        )
    }
  }

  private validateNonConflictSwitches(
    acpSwitches1: {
      [key: string]: string[]
    },
    acpSwitches2: {
      [key: string]: string[]
    }
  ): void {
    const message = 'There are conflicts between short and long switch names.'

    for (let key in acpSwitches1) {
      if (acpSwitches2[key])
        throw Error(
          message +
            `\nSwitch name '${key}' is seen in both short and long switch forms.`
        )
    }
  }

  private validateNonConflictParamsAndSwitches(
    parameters: {
      [key: string]: string
    },
    acpSwitches: {
      [key: string]: string | boolean
    }
  ): void {
    const message =
      'There are conflicts between Switches and Command parameters name.'

    for (let key in parameters) {
      if (acpSwitches[key])
        throw Error(
          message +
            `\nSwitch and Command Parameter with a same name '${key}' is seen.`
        )
    }
  }

  private cleanSwitchValues(acpSwitches: {
    [key: string]: string[]
  }): { [key: string]: string | boolean } {
    const output: { [key: string]: string | boolean } = {}

    for (let key in acpSwitches)
      output[key] = acpSwitches[key].length > 0 ? acpSwitches[key][0] : true

    return output
  }

  private findCommandNode(commandValues: string[]): CommandNode | null {
    let currentNode: CommandNode | null = this._commandTree.root

    for (let commandValue of commandValues) {
      if (currentNode && currentNode.children[commandValue]) {
        currentNode = currentNode.children[commandValue]
      } else if (currentNode && currentNode.parameterChild) {
        currentNode = currentNode.parameterChild
      } else {
        return null
      }
    }

    return currentNode
  }

  private getCommandParamsArray(commandValues: string[]): string[] {
    const commandParamValues = []
    let currentNode: CommandNode | null = this._commandTree.root

    for (let commandValue of commandValues) {
      if (currentNode && currentNode.children[commandValue]) {
        currentNode = currentNode.children[commandValue]
      } else if (currentNode && currentNode.parameterChild) {
        currentNode = currentNode.parameterChild
        commandParamValues.push(commandValue)
      } else {
        return commandParamValues
      }
    }

    return commandParamValues
  }

  private mapCommandParamNamesAndValues(
    commandParamNames: string[],
    commandParamValues: string[]
  ): { [key: string]: string } {
    const parameters: { [key: string]: string } = {}

    if (commandParamValues.length !== commandParamNames.length)
      throw Error(
        'Expecting to have exact same number of command parameters and values'
      )

    for (let i = 0; i < commandParamValues.length; i++)
      parameters[commandParamNames[i]] = commandParamValues[i]

    return parameters
  }

  run(argv?: string[]) {
    const acpData: Data = parser(argv).data
    const { commands: commandItems, shortSwitches, longSwitches } = acpData

    this.validateOneValueMostForEachSwitch(shortSwitches)
    this.validateOneValueMostForEachSwitch(longSwitches)
    this.validateNonConflictSwitches(shortSwitches, longSwitches)

    const cleanedShortSwitches: {
      [key: string]: string | boolean
    } = this.cleanSwitchValues(shortSwitches)

    const cleanedLongSwitches: {
      [key: string]: string | boolean
    } = this.cleanSwitchValues(longSwitches)

    let currentNode: CommandNode | null = this.findCommandNode(commandItems)

    if (!currentNode) {
      const callbackData = new CallbackData(
        null,
        {},
        cleanedShortSwitches,
        cleanedLongSwitches
      )
      this._norouteCallback(callbackData)
      return
    }

    const commandParamValues = this.getCommandParamsArray(commandItems)

    const command: Command | null = currentNode.getCommand()

    if (!command) return null

    const commandParamNames = command.getParameters()

    const parameters: {
      [key: string]: string
    } = this.mapCommandParamNamesAndValues(
      commandParamNames,
      commandParamValues
    )

    this.validateNonConflictParamsAndSwitches(parameters, cleanedShortSwitches)
    this.validateNonConflictParamsAndSwitches(parameters, cleanedLongSwitches)

    const callback: Function | null = currentNode.firstMatchedCallable(
      parameters
    )

    const callbackData: CallbackData = new CallbackData(
      command,
      parameters,
      cleanedShortSwitches,
      cleanedLongSwitches
    )

    if (!callback) {
      this._norouteCallback(callbackData)
      return
    }

    callback(callbackData)
  }
}
