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

    this.setCommand = this.setCommand.bind(this)
    this.setParams = this.setParams.bind(this)
    this.setShortSwitches = this.setShortSwitches.bind(this)
    this.setLongSwitches = this.setLongSwitches.bind(this)
  }

  get command() {
    return this._command
  }

  setCommand(obj: Command) {
    this._command = obj
  }

  get params() {
    return this._params
  }

  setParams(obj: { [key: string]: string }) {
    this._params = obj
  }

  get shortSwitches() {
    return this._switches.short
  }

  setShortSwitches(obj: { [key: string]: string | boolean }) {
    this._switches.short = obj
  }

  get longSwitches() {
    return this._switches.long
  }

  setLongSwitches(obj: { [key: string]: string | boolean }) {
    this._switches.long = obj
  }

  get switches() {
    return { ...this._switches.short, ...this._switches.long }
  }

  get all() {
    return { ...this._params, ...this._switches.short, ...this._switches.long }
  }
}
