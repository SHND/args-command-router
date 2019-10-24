import Command from './Command'
import RequiredSwitch from './Switch/RequiredSwitch'
import ValuedSwitch from './Switch/ValuedSwitch'
import BooleanSwitch from './Switch/BooleanSwitch'

export function validateOneValueMostForEachSwitch(acpSwitches: {
  [key: string]: string[]
}): void {
  const message = 'Only one value for each switch is supported.'

  for (let key in acpSwitches) {
    if (acpSwitches[key].length > 1)
      throw Error(
        message +
          `\nSwitch '${key}' has values '${acpSwitches[key].join(' ')}'.`
      )
  }
}

export function validateNonConflictSwitches(
  acpSwitches1: {
    [key: string]: string[]
  },
  acpSwitches2: {
    [key: string]: string[]
  }
): void {
  const message = 'There are conflicts between short and long switch names.'

  for (let key in acpSwitches1) {
    if (acpSwitches2[key])
      throw Error(
        message +
          `\nSwitch name '${key}' is seen in both short and long switch forms.`
      )
  }
}

export function validateNonConflictParamsAndSwitches(
  parameters: {
    [key: string]: string
  },
  acpSwitches: {
    [key: string]: string | boolean
  }
): void {
  const message =
    'There are conflicts between Switches and Command parameters name.'

  for (let key in parameters) {
    if (acpSwitches[key] !== undefined)
      throw Error(
        message +
          `\nSwitch and Command Parameter with a same name '${key}' is seen.`
      )
  }
}

export function validateAllRequiredSwitchesPresent(
  command: Command,
  switches: { [key: string]: string | boolean }
): void {
  const missingSwitches: RequiredSwitch[] = []
  const requiredSwitches: RequiredSwitch[] = command.getRequiredSwitches()

  for (let s of requiredSwitches) {
    const missingShort =
      s.shortname &&
      (switches[s.shortname] === undefined || switches[s.shortname] === null)

    const missingLong =
      s.longname &&
      (switches[s.longname] === undefined || switches[s.longname] === null)

    if (missingShort && missingLong) {
      missingSwitches.push(s)
    }
  }

  if (missingSwitches.length > 0) {
    const missingSwitchesString: string = missingSwitches
      .map(s => {
        if (s.longname) return `--${s.longname}`
        return `-${s.shortname}`
      })
      .join(', ')

    throw Error(
      `There are couple of required switches missing: ${missingSwitchesString}`
    )
  }
}

export function validateInputRequiredSwitchesHaveValue(
  command: Command,
  switches: { [key: string]: string | boolean }
): void {
  const requiredSwitches: RequiredSwitch[] = command.getRequiredSwitches()

  for (let s of requiredSwitches) {
    if (
      s.shortname &&
      switches[s.shortname] &&
      typeof switches[s.shortname] === 'boolean'
    ) {
      throw Error(`Switch '-${s.shortname}' should have a value`)
    }

    if (
      s.longname &&
      switches[s.longname] &&
      typeof switches[s.longname] === 'boolean'
    ) {
      throw Error(`Switch '--${s.longname}' should have a value`)
    }
  }
}

export function validateInputValuedSwitchesWithNoDefaultHaveValue(
  command: Command,
  switches: { [key: string]: string | boolean }
): void {
  const valuedSwitches: ValuedSwitch[] = command.getValuedSwitches()

  for (let s of valuedSwitches) {
    if (
      s.shortname &&
      switches[s.shortname] &&
      typeof switches[s.shortname] === 'boolean' &&
      !s.defaultValue
    ) {
      throw Error(`Switch '-${s.shortname}' should have a value`)
    }

    if (
      s.longname &&
      switches[s.longname] &&
      typeof switches[s.longname] === 'boolean' &&
      !s.defaultValue
    ) {
      throw Error(`Switch '--${s.longname}' should have a value`)
    }
  }
}

export function validateInputBooleanSwitchesDontHaveValues(
  command: Command,
  switches: { [key: string]: string | boolean }
): void {
  const booleanSwitches: BooleanSwitch[] = command.getBooleanSwitches()

  for (let s of booleanSwitches) {
    if (
      s.shortname &&
      switches[s.shortname] &&
      typeof switches[s.shortname] !== 'boolean'
    ) {
      throw Error(`Switch '-${s.shortname}' does not accept a value`)
    }

    if (
      s.longname &&
      switches[s.longname] &&
      typeof switches[s.longname] !== 'boolean'
    ) {
      throw Error(`Switch '--${s.longname}' does not accept a value`)
    }
  }
}

export function defaultShortValuedSwitchesThatNeedsToBeAdded(
  command: Command,
  switches: { [key: string]: string | boolean }
): { [key: string]: string | boolean } {
  const output: { [key: string]: string | boolean } = {}
  const valuedSwitches: ValuedSwitch[] = command.getValuedSwitches()

  for (let s of valuedSwitches) {
    if (s.defaultValue) {
      if (
        s.shortname &&
        !switches[s.shortname] &&
        s.longname &&
        !switches[s.longname]
      ) {
        output[s.shortname] = s.defaultValue
      } else if (!s.longname && s.shortname && !switches[s.shortname]) {
        output[s.shortname] = s.defaultValue
      }
    }
  }

  return output
}

export function defaultLongValuedSwitchesThatNeedsToBeAdded(
  command: Command,
  switches: { [key: string]: string | boolean }
): { [key: string]: string | boolean } {
  const output: { [key: string]: string | boolean } = {}
  const valuedSwitches: ValuedSwitch[] = command.getValuedSwitches()

  for (let s of valuedSwitches) {
    if (s.defaultValue) {
      if (
        s.shortname &&
        !switches[s.shortname] &&
        s.longname &&
        !switches[s.longname]
      ) {
        output[s.longname] = s.defaultValue
      } else if (!s.shortname && s.longname && !switches[s.longname]) {
        output[s.longname] = s.defaultValue
      }
    }
  }

  return output
}

export function cleanSwitchValues(acpSwitches: {
  [key: string]: string[]
}): { [key: string]: string | boolean } {
  const output: { [key: string]: string | boolean } = {}

  for (let key in acpSwitches)
    output[key] = acpSwitches[key].length > 0 ? acpSwitches[key][0] : true

  return output
}

export function mapCommandParamNamesAndValues(
  commandParamNames: string[],
  commandParamValues: string[]
): { [key: string]: string } {
  const parameters: { [key: string]: string } = {}

  if (commandParamValues.length !== commandParamNames.length)
    throw Error(
      'Expecting to have exact same number of command parameters and values'
    )

  for (let i = 0; i < commandParamValues.length; i++)
    parameters[commandParamNames[i]] = commandParamValues[i]

  return parameters
}
