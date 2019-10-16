import Command from './Command'

export default class CallbackData {
  private _command: Command | null
  private _params: { [key: string]: string } = {}
  private _switches: {
    short: { [key: string]: string | boolean }
    long: { [key: string]: string | boolean }
  } = {
    short: {},
    long: {},
  }

  constructor(
    command: Command | null,
    params: { [key: string]: string },
    shortSwitches: { [key: string]: string | boolean },
    longSwitches: { [key: string]: string | boolean }
  ) {
    this._command = command
    this._params = params
    this._switches.short = shortSwitches
    this._switches.long = longSwitches
  }

  get command() {
    return this._command
  }

  get params() {
    return this._params
  }

  get shortSwitches() {
    return this._switches.short
  }

  get longSwitches() {
    return this._switches.short
  }

  get switches() {
    return { ...this._switches.short, ...this._switches.long }
  }

  get all() {
    return { ...this._params, ...this._switches.short, ...this._switches.long }
  }
}
