import Command from './Command'
import { StringOrBooleanMap, StringMap } from './models'

export default class CallbackData {
  private _command: Command | null
  private _params: StringMap = {}
  private _switches: {
    short: StringOrBooleanMap
    long: StringOrBooleanMap
  } = {
    short: {},
    long: {},
  }

  constructor(
    command: Command | null,
    params: StringMap,
    shortSwitches: StringOrBooleanMap,
    longSwitches: StringOrBooleanMap
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

  setParams(obj: StringMap) {
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
