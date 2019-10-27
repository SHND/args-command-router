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
import { StringOrBooleanMap, StringMap } from './models'

export default class Application {
  private _config: { [key: string]: any }
  private _commandTree: CommandTree
  private _beforeHooks: Function[] = []
  private _afterHooks: Function[] = []
  private _norouteHooks: Function[] = []

  constructor(config = {}) {
    this._config = config
    this._commandTree = new CommandTree()

    this.before = this.before.bind(this)
    this.route = this.route.bind(this)
    this.noroute = this.noroute.bind(this)
    this.findCommandNode = this.findCommandNode.bind(this)
    this.getCommandParamsArray = this.getCommandParamsArray.bind(this)
    this._runBeforeHooks = this._runBeforeHooks.bind(this)
    this._runAfterHooks = this._runAfterHooks.bind(this)
    this._runCommandCallbacks = this._runCommandCallbacks.bind(this)
    this.run = this.run.bind(this)
  }

  before(callback: Function): Application {
    this._beforeHooks.push(callback)

    return this
  }

  after(callback: Function): Application {
    this._afterHooks.push(callback)

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

  noroute(callback: Function): Application {
    this._norouteHooks.push(callback)

    return this
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

  private _runBeforeHooks(callbackData: CallbackData) {
    let processNextMiddleware: boolean
    for (let i = 0; i < this._beforeHooks.length; i++) {
      const next = () => {
        processNextMiddleware = true
      }

      const callback = this._beforeHooks[i]
      processNextMiddleware = false
      callback.call({}, callbackData, next)
      if (!processNextMiddleware) return
    }
    return
  }

  private _runAfterHooks(callbackData: CallbackData) {
    let processNextMiddleware: boolean
    for (let i = 0; i < this._afterHooks.length; i++) {
      const next = () => {
        processNextMiddleware = true
      }

      const callback = this._afterHooks[i]
      processNextMiddleware = false
      callback.call({}, callbackData, next)
      if (!processNextMiddleware) return
    }
    return
  }

  private _runCommandCallbacks(
    callbackData: CallbackData,
    callbacks: Function[],
    command: Command
  ) {
    let processNextCallback: boolean
    for (let i = 0; i < callbacks.length; i++) {
      const next = () => {
        processNextCallback = true
      }

      const callback = callbacks[i]
      processNextCallback = false
      callback.call(command, callbackData, next)
      if (!processNextCallback) return
    }
    return
  }

  private _runNoRouteHooks(callbackData: CallbackData) {
    let processNextMiddleware: boolean
    for (let i = 0; i < this._norouteHooks.length; i++) {
      const next = () => {
        processNextMiddleware = true
      }

      const callback = this._norouteHooks[i]
      processNextMiddleware = false
      callback.call({}, callbackData, next)
      if (!processNextMiddleware) return
    }
    return
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

    const cleanedShortSwitches: StringOrBooleanMap = cleanSwitchValues(
      shortSwitches
    )

    const cleanedLongSwitches: StringOrBooleanMap = cleanSwitchValues(
      longSwitches
    )

    const callbackData = new CallbackData(
      null,
      {},
      cleanedShortSwitches,
      cleanedLongSwitches
    )

    this._runBeforeHooks(callbackData)

    let currentNode: CommandNode | null = this.findCommandNode(commandItems)

    if (!currentNode) {
      this._runNoRouteHooks(callbackData)
      this._runAfterHooks(callbackData)
      return
    }

    const commandParamValues = this.getCommandParamsArray(commandItems)

    const command: Command | null = currentNode.getCommand()

    if (!command) return null

    const commandParamNames = command.getParameters()

    const parameters: StringMap = mapCommandParamNamesAndValues(
      commandParamNames,
      commandParamValues
    )

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
      this._runNoRouteHooks(callbackData)
    } else {
      this._runCommandCallbacks(callbackData, callbacks, command)
    }

    this._runAfterHooks(callbackData)
  }
}
