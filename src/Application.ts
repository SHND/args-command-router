import { parser } from 'args-command-parser'
import { Data } from 'args-command-parser/dist/Models'
import CommandTree from './CommandTree/CommandTree'
import Route from './Route'
import Command from './Command'
import Condition from './Condition'
import CommandNode from './CommandTree/CommandNode'
import CallbackData from './CallbackData'
import RequiredSwitch from './Switch/RequiredSwitch'
import ValuedSwitch from './Switch/ValuedSwitch'
import BooleanSwitch from './Switch/BooleanSwitch'

export default class Application {
  private _config: { [key: string]: any }
  private _commandTree: CommandTree
  private _norouteCallback: Function = () => {}

  constructor(config = {}) {
    this._config = config
    this._commandTree = new CommandTree()
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

  static _validateOneValueMostForEachSwitch(acpSwitches: {
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

  static _validateNonConflictSwitches(
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

  static _validateNonConflictParamsAndSwitches(
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

  static _validateAllRequiredSwitchesPresent(
    command: Command,
    switches: { [key: string]: string | boolean }
  ): void {
    const missingSwitches: RequiredSwitch[] = []
    const requiredSwitches: RequiredSwitch[] = command.getRequiredSwitches()

    for (let s of requiredSwitches) {
      const missingShort =
        s.shortname &&
        (switches[s.shortname] === undefined || switches[s.shortname] === null)

      const missingLong =
        s.longname &&
        (switches[s.longname] === undefined || switches[s.longname] === null)

      if (missingShort && missingLong) {
        missingSwitches.push(s)
      }
    }

    if (missingSwitches.length > 0) {
      const missingSwitchesString: string = missingSwitches
        .map(s => {
          if (s.longname) return `--${s.longname}`
          return `-${s.shortname}`
        })
        .join(', ')

      throw Error(
        `There are couple of required switches missing: ${missingSwitchesString}`
      )
    }
  }

  static _validateRequiredSwitchesHaveValue(
    command: Command,
    switches: { [key: string]: string | boolean }
  ): void {
    const requiredSwitches: RequiredSwitch[] = command.getRequiredSwitches()

    for (let s of requiredSwitches) {
      if (
        s.shortname &&
        switches[s.shortname] &&
        typeof switches[s.shortname] === 'boolean'
      ) {
        throw Error(`Switch '-${s.shortname}' should have a value`)
      }

      if (
        s.longname &&
        switches[s.longname] &&
        typeof switches[s.longname] === 'boolean'
      ) {
        throw Error(`Switch '--${s.longname}' should have a value`)
      }
    }
  }

  static _validateValuedSwitchesWithNoDefaultHaveValue(
    command: Command,
    switches: { [key: string]: string | boolean }
  ): void {
    const valuedSwitches: ValuedSwitch[] = command.getValuedSwitches()

    for (let s of valuedSwitches) {
      if (
        s.shortname &&
        switches[s.shortname] &&
        typeof switches[s.shortname] === 'boolean' &&
        !s.defaultValue
      ) {
        throw Error(`Switch '-${s.shortname}' should have a value`)
      }

      if (
        s.longname &&
        switches[s.longname] &&
        typeof switches[s.longname] === 'boolean' &&
        !s.defaultValue
      ) {
        throw Error(`Switch '--${s.longname}' should have a value`)
      }
    }
  }

  static _validateBooleanSwitchesDontHaveValues(
    command: Command,
    switches: { [key: string]: string | boolean }
  ): void {
    const booleanSwitches: BooleanSwitch[] = command.getBooleanSwitches()

    for (let s of booleanSwitches) {
      if (
        s.shortname &&
        switches[s.shortname] &&
        typeof switches[s.shortname] !== 'boolean'
      ) {
        throw Error(`Switch '-${s.shortname}' does not accept a value`)
      }

      if (
        s.longname &&
        switches[s.longname] &&
        typeof switches[s.longname] !== 'boolean'
      ) {
        throw Error(`Switch '--${s.longname}' does not accept a value`)
      }
    }
  }

  static _defaultShortValuedSwitchesThatNeedsToBeAdded(
    command: Command,
    switches: { [key: string]: string | boolean }
  ): { [key: string]: string | boolean } {
    const output: { [key: string]: string | boolean } = {}
    const valuedSwitches: ValuedSwitch[] = command.getValuedSwitches()

    for (let s of valuedSwitches) {
      if (s.defaultValue) {
        if (
          s.shortname &&
          !switches[s.shortname] &&
          s.longname &&
          !switches[s.longname]
        ) {
          output[s.shortname] = s.defaultValue
        } else if (!s.longname && s.shortname && !switches[s.shortname]) {
          output[s.shortname] = s.defaultValue
        }
      }
    }

    return output
  }

  static _defaultLongValuedSwitchesThatNeedsToBeAdded(
    command: Command,
    switches: { [key: string]: string | boolean }
  ): { [key: string]: string | boolean } {
    const output: { [key: string]: string | boolean } = {}
    const valuedSwitches: ValuedSwitch[] = command.getValuedSwitches()

    for (let s of valuedSwitches) {
      if (s.defaultValue) {
        if (
          s.shortname &&
          !switches[s.shortname] &&
          s.longname &&
          !switches[s.longname]
        ) {
          output[s.longname] = s.defaultValue
        } else if (!s.shortname && s.longname && !switches[s.longname]) {
          output[s.longname] = s.defaultValue
        }
      }
    }

    return output
  }

  static _cleanSwitchValues(acpSwitches: {
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

  static _mapCommandParamNamesAndValues(
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

    try {
      Application._validateOneValueMostForEachSwitch(shortSwitches)
      Application._validateOneValueMostForEachSwitch(longSwitches)
    } catch (e) {
      console.error(e.message)
      process.exit(1)
    }

    const cleanedShortSwitches: {
      [key: string]: string | boolean
    } = Application._cleanSwitchValues(shortSwitches)

    const cleanedLongSwitches: {
      [key: string]: string | boolean
    } = Application._cleanSwitchValues(longSwitches)

    let currentNode: CommandNode | null = this.findCommandNode(commandItems)

    if (!currentNode) {
      const callbackData = new CallbackData(
        null,
        {},
        cleanedShortSwitches,
        cleanedLongSwitches
      )
      this._norouteCallback.call(new Command(''), callbackData)
      return
    }

    const commandParamValues = this.getCommandParamsArray(commandItems)

    const command: Command | null = currentNode.getCommand()

    if (!command) return null

    const commandParamNames = command.getParameters()

    const parameters: {
      [key: string]: string
    } = Application._mapCommandParamNamesAndValues(
      commandParamNames,
      commandParamValues
    )

    Application._validateNonConflictSwitches(shortSwitches, longSwitches)
    Application._validateNonConflictParamsAndSwitches(
      parameters,
      cleanedShortSwitches
    )
    Application._validateNonConflictParamsAndSwitches(
      parameters,
      cleanedLongSwitches
    )

    try {
      Application._validateAllRequiredSwitchesPresent(command, {
        ...cleanedShortSwitches,
        ...cleanedLongSwitches,
      })
      Application._validateRequiredSwitchesHaveValue(command, {
        ...cleanedShortSwitches,
        ...cleanedLongSwitches,
      })
      Application._validateValuedSwitchesWithNoDefaultHaveValue(command, {
        ...cleanedShortSwitches,
        ...cleanedLongSwitches,
      })
      Application._validateBooleanSwitchesDontHaveValues(command, {
        ...cleanedShortSwitches,
        ...cleanedLongSwitches,
      })
    } catch (e) {
      console.error(e.message)
      currentNode.printHelp()
      process.exit(1)
    }

    const shortDefaultValuesNeedsInjected = Application._defaultShortValuedSwitchesThatNeedsToBeAdded(
      command,
      {
        ...cleanedShortSwitches,
        ...cleanedLongSwitches,
      }
    )

    const longDefaultValuesNeedsInjected = Application._defaultLongValuedSwitchesThatNeedsToBeAdded(
      command,
      {
        ...cleanedShortSwitches,
        ...cleanedLongSwitches,
      }
    )

    const callback: Function | null = currentNode.firstMatchedCallable({
      ...cleanedShortSwitches,
      ...cleanedLongSwitches,
      ...parameters,
    })

    const callbackData: CallbackData = new CallbackData(
      command,
      parameters,
      { ...shortDefaultValuesNeedsInjected, ...cleanedShortSwitches },
      { ...longDefaultValuesNeedsInjected, ...cleanedLongSwitches }
    )

    if (!callback) {
      this._norouteCallback.call(command, callbackData)
      return
    }

    callback.call(command, callbackData)
  }
}
