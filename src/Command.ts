import Switch from './Switch/Switch'
import BooleanSwitch from './Switch/BooleanSwitch'
import ValuedSwitch from './Switch/ValuedSwitch'
import RequiredSwitch from './Switch/RequiredSwitch'
import { CommandItem, CommandItemType } from './models'
import {
  COMMAND_DELIMITER,
  PARAMETER_PREFIX,
  ROOT_COMMAND_NAME,
} from './constants'

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

    this.description = this.description.bind(this)
    this.getCommandItemNames = this.getCommandItemNames.bind(this)
    this.getPath = this.getPath.bind(this)
    this.getDescription = this.getDescription.bind(this)
    this.getSwitches = this.getSwitches.bind(this)
    this.getBooleanSwitches = this.getBooleanSwitches.bind(this)
    this.getRequiredSwitches = this.getRequiredSwitches.bind(this)
    this.getValuedSwitches = this.getValuedSwitches.bind(this)
    this.booleanSwitch = this.booleanSwitch.bind(this)
    this.valuedSwitch = this.valuedSwitch.bind(this)
    this.requiredSwitch = this.requiredSwitch.bind(this)
    this.getParameters = this.getParameters.bind(this)
    this.getCommandItems = this.getCommandItems.bind(this)
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

    /**
     * '/' -> ''
     * '/something' -> 'something
     */
    if (commandPath.startsWith(ROOT_COMMAND_NAME))
      commandPath = commandPath.slice(1)

    const items = commandPath.split(COMMAND_DELIMITER)

    let commandItems: CommandItem[] = []
    if (items.length === 1 && items[0] === '') {
      commandItems = []
    } else {
      if (items.findIndex(item => item === '') >= 0)
        throw Error(`Empty commandItem is allowed in routes: '${commandPath}'`)

      commandItems = items.map(item => ({
        name: item.startsWith(PARAMETER_PREFIX) ? item.substring(1) : item,
        type: item.startsWith(PARAMETER_PREFIX)
          ? CommandItemType.PARAMETER
          : CommandItemType.FIXED,
      }))
    }

    return new Command(commandItems)
  }

  description(description: string): Command {
    this._description = description

    return this
  }

  getCommandItemNames(): string[] {
    return this._commandItems.map(item => {
      if (item.type === CommandItemType.FIXED) {
        return item.name
      } else if (item.type === CommandItemType.PARAMETER) {
        return PARAMETER_PREFIX + item.name
      } else return 'UNKNOWN'
    })
  }

  getPath(): string {
    return this.getCommandItemNames().join(COMMAND_DELIMITER)
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
