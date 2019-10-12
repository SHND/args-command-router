import ValuedSwitch from './ValuedSwitch'

export default class RequiredSwitch extends ValuedSwitch {
  constructor(
    shortName: string | null,
    longName: string | null,
    description: string = ''
  ) {
    super(shortName, longName, null, description)
  }
}
