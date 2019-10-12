import Switch from './Switch'

export default class BooleanSwitch extends Switch {
  constructor(
    shortName: string | null,
    longName: string | null,
    description: string = ''
  ) {
    super(shortName, longName, description)
  }

  getValue(): boolean {
    return true
  }
}
