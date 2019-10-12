import Switch from './Switch'

export default class ValuedSwitch extends Switch {
  private _value: string | null = null
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

  getValue(): string | null {
    return this._value || this._defaultValue
  }

  setValue(value: string) {
    this._value = value
  }
}
