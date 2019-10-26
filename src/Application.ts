import { parser } from 'args-command-parser'
import { Data } from 'args-command-parser/dist/Models'
import CommandTree from './CommandTree/CommandTree'
import Route from './Route'
import Command from './Command'
import Condition from './Condition'
import CommandNode from './CommandTree/CommandNode'
import CallbackData from './CallbackData'
import {
  validateOneValueMostForEachSwitch,
  cleanSwitchValues,
  mapCommandParamNamesAndValues,
  validateNonConflictSwitches,
  validateNonConflictParamsAndSwitches,
  validateAllRequiredSwitchesPresent,
  validateInputRequiredSwitchesHaveValue,
  validateInputValuedSwitchesWithNoDefaultHaveValue,
  validateInputBooleanSwitchesDontHaveValues,
  defaultShortValuedSwitchesThatNeedsToBeAdded,
  defaultLongValuedSwitchesThatNeedsToBeAdded,
} from './helpers'

export default class Application {
  private _config: { [key: string]: any }
  private _commandTree: CommandTree
  private _middlewareCallbacks: Function[] = []
  private _norouteCallback: Function = () => {}

  constructor(config = {}) {
    this._config = config
    this._commandTree = new CommandTree()

    this.middleware = this.middleware.bind(this)
    this.route = this.route.bind(this)
    this.noroute = this.noroute.bind(this)
    this.findCommandNode = this.findCommandNode.bind(this)
    this.getCommandParamsArray = this.getCommandParamsArray.bind(this)
    this.run = this.run.bind(this)
  }

  middleware(callback: Function): Application {
    this._middlewareCallbacks.push(callback)

    return this
  }

  route(route: Route, callback: Function): Command
  route(route: string, callback: Function): Command
  route(command: string, condition: string, callback: Function): Command
  route(command: Command, condition: string, callback: Function): Command
  route(command: string, condition: Condition, callback: Function): Command
  route(command: Command, condition: Condition, callback: Function): Command
  route(
    routeOrCommandOrString: Route | Command | string,
    conditionOrStringOrCallback: Condition | Function | string,
    callback: Function = () => {}
  ): Command {
    if (
      routeOrCommandOrString instanceof Route &&
      conditionOrStringOrCallback instanceof Function
    ) {
      return this._commandTree.addRoute(
        routeOrCommandOrString,
        conditionOrStringOrCallback
      )
    } else if (
      typeof routeOrCommandOrString === 'string' &&
      conditionOrStringOrCallback instanceof Function
    ) {
      return this._commandTree.addRoute(
        routeOrCommandOrString,
        conditionOrStringOrCallback
      )
    } else if (
      typeof routeOrCommandOrString === 'string' &&
      typeof conditionOrStringOrCallback === 'string' &&
      callback instanceof Function
    ) {
      return this._commandTree.addRoute(
        routeOrCommandOrString,
        conditionOrStringOrCallback,
        callback
      )
    } else if (
      routeOrCommandOrString instanceof Command &&
      typeof conditionOrStringOrCallback === 'string' &&
      callback instanceof Function
    ) {
      return this._commandTree.addRoute(
        routeOrCommandOrString,
        conditionOrStringOrCallback,
        callback
      )
    } else if (
      typeof routeOrCommandOrString === 'string' &&
      conditionOrStringOrCallback instanceof Condition &&
      callback instanceof Function
    ) {
      return this._commandTree.addRoute(
        routeOrCommandOrString,
        conditionOrStringOrCallback,
        callback
      )
    } else if (
      routeOrCommandOrString instanceof Command &&
      conditionOrStringOrCallback instanceof Condition &&
      callback instanceof Function
    ) {
      return this._commandTree.addRoute(
        routeOrCommandOrString,
        conditionOrStringOrCallback,
        callback
      )
    }

    throw Error(
      `Incorrect parameters is passed to Application::addRoute.\nThe parameters are: "${[
        ...arguments,
      ]}"`
    )
  }

  noroute(callback: Function) {
    this._norouteCallback = callback
  }

  private findCommandNode(commandNames: string[]): CommandNode | null {
    let currentNode: CommandNode | null = this._commandTree.root

    for (let commandName of commandNames) {
      if (currentNode && currentNode.children[commandName]) {
        currentNode = currentNode.children[commandName]
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

  private _runMiddlewares(callbackData: CallbackData): boolean {
    let processNextMiddleware: boolean
    for (let i = 0; i < this._middlewareCallbacks.length; i++) {
      const next = () => {
        processNextMiddleware = true
      }

      const callback = this._middlewareCallbacks[i]
      processNextMiddleware = false
      callback.call({}, callbackData, next)
      if (!processNextMiddleware) return false
    }
    return true
  }

  private _runCallbacks(
    command: Command,
    callbacks: Function[],
    callbackData: CallbackData
  ): boolean {
    let processNextCallback: boolean
    for (let i = 0; i < callbacks.length; i++) {
      const next = () => {
        processNextCallback = true
      }

      const callback = callbacks[i]
      processNextCallback = false
      callback.call(command, callbackData, next)
      if (!processNextCallback) return false
    }
    return true
  }

  run(argv?: string[]) {
    const acpData: Data = parser(argv).data
    const { commands: commandItems, shortSwitches, longSwitches } = acpData

    try {
      validateOneValueMostForEachSwitch(shortSwitches)
      validateOneValueMostForEachSwitch(longSwitches)
    } catch (e) {
      console.error(e.message)
      process.exit(1)
    }

    const cleanedShortSwitches: {
      [key: string]: string | boolean
    } = cleanSwitchValues(shortSwitches)

    const cleanedLongSwitches: {
      [key: string]: string | boolean
    } = cleanSwitchValues(longSwitches)

    const callbackData = new CallbackData(
      null,
      {},
      cleanedShortSwitches,
      cleanedLongSwitches
    )

    const continueAfterMiddlewares = this._runMiddlewares(callbackData)
    if (!continueAfterMiddlewares) return

    let currentNode: CommandNode | null = this.findCommandNode(commandItems)

    if (!currentNode) {
      this._norouteCallback.call(new Command(''), callbackData)
      return
    }

    const commandParamValues = this.getCommandParamsArray(commandItems)

    const command: Command | null = currentNode.getCommand()

    if (!command) return null

    const commandParamNames = command.getParameters()

    const parameters: {
      [key: string]: string
    } = mapCommandParamNamesAndValues(commandParamNames, commandParamValues)

    validateNonConflictSwitches(shortSwitches, longSwitches)
    validateNonConflictParamsAndSwitches(parameters, cleanedShortSwitches)
    validateNonConflictParamsAndSwitches(parameters, cleanedLongSwitches)

    try {
      validateAllRequiredSwitchesPresent(command, {
        ...cleanedShortSwitches,
        ...cleanedLongSwitches,
      })
      validateInputRequiredSwitchesHaveValue(command, {
        ...cleanedShortSwitches,
        ...cleanedLongSwitches,
      })
      validateInputValuedSwitchesWithNoDefaultHaveValue(command, {
        ...cleanedShortSwitches,
        ...cleanedLongSwitches,
      })
      validateInputBooleanSwitchesDontHaveValues(command, {
        ...cleanedShortSwitches,
        ...cleanedLongSwitches,
      })
    } catch (e) {
      console.error(e.message)
      currentNode.printHelp()
      process.exit(1)
    }

    const shortDefaultValuesNeedsInjected = defaultShortValuedSwitchesThatNeedsToBeAdded(
      command,
      {
        ...cleanedShortSwitches,
        ...cleanedLongSwitches,
      }
    )

    const longDefaultValuesNeedsInjected = defaultLongValuedSwitchesThatNeedsToBeAdded(
      command,
      {
        ...cleanedShortSwitches,
        ...cleanedLongSwitches,
      }
    )

    const callbacks: Function[] = currentNode.allMatchedCallables({
      ...cleanedShortSwitches,
      ...cleanedLongSwitches,
      ...parameters,
    })

    callbackData.setCommand(command)
    callbackData.setParams(parameters)
    callbackData.setShortSwitches({
      ...shortDefaultValuesNeedsInjected,
      ...cleanedShortSwitches,
    })
    callbackData.setLongSwitches({
      ...longDefaultValuesNeedsInjected,
      ...cleanedLongSwitches,
    })

    if (callbacks.length === 0) {
      this._norouteCallback.call(command, callbackData)
      return
    }

    this._runCallbacks(command, callbacks, callbackData)
  }
}
