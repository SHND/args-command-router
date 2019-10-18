import Switch from './Switch'
export default class ValuedSwitch extends Switch {
  private _defaultValue: string | null = null

  constructor(
    shortName: string | null,
    longName: string | null,
    defaultValue: string | null,
    description: string = ''
  ) {
    super(shortName, longName, description)
    this._defaultValue = defaultValue
  }
}
