import Switch from './Switch'

export default class RequiredSwitch extends Switch {
  constructor(
    shortName: string | null,
    longName: string | null,
    description: string = ''
  ) {
    super(shortName, longName, description)
  }
}
