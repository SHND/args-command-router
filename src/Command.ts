import Switch from './Switch/Switch'
import BooleanSwitch from './Switch/BooleanSwitch'
import ValuedSwitch from './Switch/ValuedSwitch'
import RequiredSwitch from './Switch/RequiredSwitch'
import { COMMAND_DELIMITER, PARAMETER_PREFIX } from './constants'

export enum CommandItemType {
  FIXED = 1,
  PARAMETER,
}

export interface CommandItem {
  name: string
  type: CommandItemType
}

export default class Command {
  private _commandItems: CommandItem[] = []
  private _description: string = ''
  private _switches: Switch[] = []

  constructor(commandPath: string)
  constructor(commandItems: CommandItem[])
  constructor(commandPathOrItems: CommandItem[] | string) {
    if (typeof commandPathOrItems === 'string') {
      const command = Command.parse(commandPathOrItems)
      this._commandItems = command._commandItems
    } else {
      this._commandItems = commandPathOrItems
    }
  }

  static parse(commandPath: string): Command {
    if (commandPath.match(/\s/))
      throw Error(`Command '${commandPath}' shouldn't contain spaces.`)

    const items = commandPath.split(COMMAND_DELIMITER)
    const commandItems = items.map(item => ({
      name: item.startsWith(PARAMETER_PREFIX) ? item.substring(1) : item,
      type: item.startsWith(PARAMETER_PREFIX)
        ? CommandItemType.PARAMETER
        : CommandItemType.FIXED,
    }))

    return new Command(commandItems)
  }

  description(description: string): Command {
    this._description = description

    return this
  }

  booleanSwitch(
    shortName: string,
    longName: string,
    description: string = ''
  ): Command {
    const s = new BooleanSwitch(shortName, longName, description)
    this._switches.push(s)

    return this
  }

  valuedSwitch(
    shortName: string,
    longName: string,
    defaultValue: string | null = null,
    description: string = ''
  ): Command {
    const s = new ValuedSwitch(shortName, longName, defaultValue, description)
    this._switches.push(s)

    return this
  }

  requiredSwitch(
    shortName: string,
    longName: string,
    description: string = ''
  ): Command {
    const s = new RequiredSwitch(shortName, longName, description)
    this._switches.push(s)

    return this
  }

  getParameters(): string[] {
    return this._commandItems
      .filter(item => item.type === CommandItemType.PARAMETER)
      .map(item => item.name)
  }

  getCommandItems(): CommandItem[] {
    return this._commandItems
  }
}
