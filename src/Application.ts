import { parser } from 'args-command-parser'
import CommandTree from './CommandTree/CommandTree'
import Route from './Route'
import Command from './Command'
import Condition from './Condition'
import { Data } from 'args-command-parser/dist/Models'
import CommandNode from './CommandTree/CommandNode'
import CallbackData from './CallbackData'
import RequiredSwitch from './Switch/RequiredSwitch'

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

  validateAllRequiredSwitchesPresent(
    command: Command,
    switches: { [key: string]: string | boolean }
  ): void {
    console.log(switches)
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

    try {
      this.validateOneValueMostForEachSwitch(shortSwitches)
      this.validateOneValueMostForEachSwitch(longSwitches)
    } catch (e) {
      console.error(e.message)
      process.exit(1)
    }

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

    this.validateNonConflictSwitches(shortSwitches, longSwitches)
    this.validateNonConflictParamsAndSwitches(parameters, cleanedShortSwitches)
    this.validateNonConflictParamsAndSwitches(parameters, cleanedLongSwitches)

    try {
      this.validateAllRequiredSwitchesPresent(command, {
        ...cleanedShortSwitches,
        ...cleanedLongSwitches,
      })
    } catch (e) {
      console.error(e.message)
      currentNode.printHelp()
      process.exit(1)
    }

    const callback: Function | null = currentNode.firstMatchedCallable({
      ...cleanedShortSwitches,
      ...cleanedLongSwitches,
      ...parameters,
    })

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
