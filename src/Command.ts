import Switch from './Switch/Switch'
import BooleanSwitch from './Switch/BooleanSwitch'
import ValuedSwitch from './Switch/ValuedSwitch'
import RequiredSwitch from './Switch/RequiredSwitch'
import { CommandItem, CommandItemType } from './models'
import { COMMAND_DELIMITER, PARAMETER_PREFIX } from './constants'

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

  /**
   * Parse an string command path and returns a Command object
   * This string doesn't contain conditions and shouldn't be
   * confused by routePaths
   * @param commandPath string path for the command
   */
  static parse(commandPath: string): Command {
    if (commandPath.match(/\s/))
      throw Error(`Command '${commandPath}' shouldn't contain spaces.`)

    if (commandPath === '') throw Error('Command cannot be an empty string.')

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

  getDescription(): string {
    return this._description
  }

  getSwitches(): Switch[] {
    return this._switches
  }

  getBooleanSwitches(): BooleanSwitch[] {
    return <BooleanSwitch[]>(
      this._switches.filter(s => s instanceof BooleanSwitch)
    )
  }

  getRequiredSwitches(): RequiredSwitch[] {
    return <RequiredSwitch[]>(
      this._switches.filter(s => s instanceof RequiredSwitch)
    )
  }

  getValuedSwitches(): ValuedSwitch[] {
    return <ValuedSwitch[]>this._switches.filter(s => s instanceof ValuedSwitch)
  }

  booleanSwitch(
    shortName: string | null,
    longName: string | null,
    description: string = ''
  ): Command {
    const s = new BooleanSwitch(shortName, longName, description)
    this._switches.push(s)

    return this
  }

  valuedSwitch(
    shortName: string | null,
    longName: string | null,
    defaultValue: string | null = null,
    description: string = ''
  ): Command {
    const s = new ValuedSwitch(shortName, longName, defaultValue, description)
    this._switches.push(s)

    return this
  }

  requiredSwitch(
    shortName: string | null,
    longName: string | null,
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
