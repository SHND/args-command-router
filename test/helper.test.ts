import { expect } from 'chai'
import Command from '../src/Command'
import {
  validateOneValueMostForEachSwitch,
  validateNonConflictSwitches,
  validateNonConflictParamsAndSwitches,
  validateAllRequiredSwitchesPresent,
  validateInputRequiredSwitchesHaveValue,
  validateInputValuedSwitchesWithNoDefaultHaveValue,
  validateInputBooleanSwitchesDontHaveValues,
  defaultShortValuedSwitchesThatNeedsToBeAdded,
  defaultLongValuedSwitchesThatNeedsToBeAdded,
  cleanSwitchValues,
  mapCommandParamNamesAndValues,
} from '../src/helpers'

describe('helper methods', () => {
  it('validateOneValueMostForEachSwitch() if no more than one value exist', () => {
    const acpSwitches = {
      a: [],
      b: ['cmd1'],
      c: ['cmd2'],
    }

    expect(() => {
      validateOneValueMostForEachSwitch(acpSwitches)
    }).not.throws()
  })

  it('validateOneValueMostForEachSwitch() when more than one value exist', () => {
    const acpSwitches = {
      a: [],
      b: ['cmd1'],
      c: ['cmd2', 'cmd3'],
    }

    expect(() => {
      validateOneValueMostForEachSwitch(acpSwitches)
    }).throws()
  })

  it('validateNonConflictSwitches() when no conflict exist', () => {
    const acpSwitches1 = {
      a: [],
      b: ['cmd1'],
      c: ['cmd2', 'cmd3'],
    }

    const acpSwitches2 = {
      d: [],
      e: ['cmd1'],
      f: ['cmd2', 'cmd3'],
    }

    expect(() => {
      validateNonConflictSwitches(acpSwitches1, acpSwitches2)
    }).not.throws()
  })

  it('validateNonConflictSwitches() when conflict exist', () => {
    const acpSwitches1 = {
      a: [],
      b: ['cmd1'],
      c: ['cmd2', 'cmd3'],
    }

    const acpSwitches2 = {
      d: [],
      e: ['cmd1'],
      b: ['cmd2', 'cmd3'],
    }

    expect(() => {
      validateNonConflictSwitches(acpSwitches1, acpSwitches2)
    }).throws()
  })

  it('validateNonConflictParamsAndSwitches() when no conflict exist', () => {
    const params1 = {
      a: '',
      b: 'a',
      c: 'b',
    }

    const acpSwitches2 = {
      d: '',
      e: true,
      f: 'f',
    }

    expect(() => {
      validateNonConflictParamsAndSwitches(params1, acpSwitches2)
    }).not.throws()
  })

  it('validateNonConflictParamsAndSwitches() when conflict exist', () => {
    const params1 = {
      a: '',
      b: 'a',
      c: 'b',
    }

    const acpSwitches2 = {
      a: '',
      e: true,
      f: 'f',
    }

    expect(() => {
      validateNonConflictParamsAndSwitches(params1, acpSwitches2)
    }).throws()
  })

  it('validateAllRequiredSwitchesPresent() when short required switches does not exist', () => {
    const command = new Command('/cmd1/:param1')
    command.requiredSwitch('a', 'long')

    const acpSwitches = {
      e: true,
      f: 'f',
    }

    expect(() => {
      validateAllRequiredSwitchesPresent(command, acpSwitches)
    }).throws()
  })

  it('validateAllRequiredSwitchesPresent() when short required switches exist', () => {
    const command = new Command('/cmd1/:param1')
    command.requiredSwitch('a', 'long')

    const acpSwitches = {
      a: '',
      e: true,
      f: 'f',
    }

    expect(() => {
      validateAllRequiredSwitchesPresent(command, acpSwitches)
    }).not.throws()
  })

  it('validateAllRequiredSwitchesPresent() when long required switches does not exist', () => {
    const command = new Command('/cmd1/:param1')
    command.requiredSwitch('a', 'long')

    const acpSwitches = {
      longer: true,
      longest: 'f',
    }

    expect(() => {
      validateAllRequiredSwitchesPresent(command, acpSwitches)
    }).throws()
  })

  it('validateAllRequiredSwitchesPresent() when long required switches exist', () => {
    const command = new Command('/cmd1/:param1')
    command.requiredSwitch('a', 'long')

    const acpSwitches = {
      long: '',
      longer: true,
      longest: 'f',
    }

    expect(() => {
      validateAllRequiredSwitchesPresent(command, acpSwitches)
    }).not.throws()
  })

  it('validateInputRequiredSwitchesHaveValue() when required short switches does not have a value', () => {
    const command = new Command('/cmd1/:param1')
    command.requiredSwitch('e', 'long')

    const acpSwitches = {
      a: '',
      e: true,
      f: 'f',
    }

    expect(() => {
      validateInputRequiredSwitchesHaveValue(command, acpSwitches)
    }).throws()
  })

  it('validateInputRequiredSwitchesHaveValue() when required short switches are not present', () => {
    const command = new Command('/cmd1/:param1')
    command.requiredSwitch('z', 'long')

    const acpSwitches = {
      a: '',
      e: true,
      f: 'f',
    }

    // because 'z' is not present in the switches
    expect(() => {
      validateInputRequiredSwitchesHaveValue(command, acpSwitches)
    }).not.throws()
  })

  it('validateInputRequiredSwitchesHaveValue() when required short switches are empty string', () => {
    const command = new Command('/cmd1/:param1')
    command.requiredSwitch('a', 'long')

    const acpSwitches = {
      a: '',
      e: true,
      f: 'f',
    }

    // because 'a' has a empty string value
    expect(() => {
      validateInputRequiredSwitchesHaveValue(command, acpSwitches)
    }).not.throws()
  })

  it('validateInputRequiredSwitchesHaveValue() when required short switches are boolean', () => {
    const command = new Command('/cmd1/:param1')
    command.requiredSwitch('e', 'long')

    const acpSwitches = {
      a: '',
      e: true,
      f: 'f',
    }

    // because 'e' doesn't a value
    expect(() => {
      validateInputRequiredSwitchesHaveValue(command, acpSwitches)
    }).throws()
  })

  it('validateInputRequiredSwitchesHaveValue() when required short switches have a value', () => {
    const command = new Command('/cmd1/:param1')
    command.requiredSwitch('f', 'long')

    const acpSwitches = {
      a: '',
      e: true,
      f: 'f',
    }

    // because 'f' has value it doens't throw error
    expect(() => {
      validateInputRequiredSwitchesHaveValue(command, acpSwitches)
    }).not.throws()
  })

  it('validateInputRequiredSwitchesHaveValue() when required long switches does not have a value', () => {
    const command = new Command('/cmd1/:param1')
    command.requiredSwitch('e', 'longer')

    const acpSwitches = {
      long: '',
      longer: true,
      longest: 'f',
    }

    expect(() => {
      validateInputRequiredSwitchesHaveValue(command, acpSwitches)
    }).throws()
  })

  it('validateInputRequiredSwitchesHaveValue() when required long switches are not present', () => {
    const command = new Command('/cmd1/:param1')
    command.requiredSwitch('z', 'longy')

    const acpSwitches = {
      long: '',
      longer: true,
      longest: 'f',
    }

    // because 'z' is not present in the switches
    expect(() => {
      validateInputRequiredSwitchesHaveValue(command, acpSwitches)
    }).not.throws()
  })

  it('validateInputRequiredSwitchesHaveValue() when required long switches are empty string', () => {
    const command = new Command('/cmd1/:param1')
    command.requiredSwitch('a', 'long')

    const acpSwitches = {
      long: '',
      longer: true,
      longest: 'f',
    }

    // because 'a' has a empty string value
    expect(() => {
      validateInputRequiredSwitchesHaveValue(command, acpSwitches)
    }).not.throws()
  })

  it('validateInputRequiredSwitchesHaveValue() when required long switches are boolean', () => {
    const command = new Command('/cmd1/:param1')
    command.requiredSwitch('e', 'longer')

    const acpSwitches = {
      long: '',
      longer: true,
      longest: 'f',
    }

    // because 'e' doesn't a value
    expect(() => {
      validateInputRequiredSwitchesHaveValue(command, acpSwitches)
    }).throws()
  })

  it('validateInputRequiredSwitchesHaveValue() when required long switches have a value', () => {
    const command = new Command('/cmd1/:param1')
    command.requiredSwitch('f', 'longest')

    const acpSwitches = {
      long: '',
      longer: true,
      longest: 'f',
    }

    // because 'f' has value it doens't throw error
    expect(() => {
      validateInputRequiredSwitchesHaveValue(command, acpSwitches)
    }).not.throws()
  })

  it('validateInputValuedSwitchesWithNoDefaultHaveValue() when short switch value exist', () => {
    const command = new Command('/cmd1/:param1')
    command.valuedSwitch('f', 'long', null)

    const acpSwitches = {
      a: '',
      e: true,
      f: 'f',
    }

    expect(() => {
      validateInputValuedSwitchesWithNoDefaultHaveValue(command, acpSwitches)
    }).not.throws()
  })

  it('validateInputValuedSwitchesWithNoDefaultHaveValue() when short switch value not exist', () => {
    const command = new Command('/cmd1/:param1')
    command.valuedSwitch('e', 'long', null)

    const acpSwitches = {
      a: '',
      e: true,
      f: 'f',
    }

    expect(() => {
      validateInputValuedSwitchesWithNoDefaultHaveValue(command, acpSwitches)
    }).throws()
  })

  it('validateInputValuedSwitchesWithNoDefaultHaveValue() when long switch value exist', () => {
    const command = new Command('/cmd1/:param1')
    command.valuedSwitch('f', 'longest', null)

    const acpSwitches = {
      long: '',
      longer: true,
      longest: 'f',
    }

    expect(() => {
      validateInputValuedSwitchesWithNoDefaultHaveValue(command, acpSwitches)
    }).not.throws()
  })

  it('validateInputValuedSwitchesWithNoDefaultHaveValue() when long switch value not exist', () => {
    const command = new Command('/cmd1/:param1')
    command.valuedSwitch('e', 'longer', null)

    const acpSwitches = {
      long: '',
      longer: true,
      longest: 'f',
    }

    expect(() => {
      validateInputValuedSwitchesWithNoDefaultHaveValue(command, acpSwitches)
    }).throws()
  })

  it('validateInputBooleanSwitchesDontHaveValues() when short switch value exist', () => {
    const command = new Command('/cmd1/:param1')
    command.booleanSwitch('e', 'long')

    const acpSwitches = {
      a: '',
      e: true,
      f: 'f',
    }

    expect(() => {
      validateInputBooleanSwitchesDontHaveValues(command, acpSwitches)
    }).not.throws()
  })

  it('validateInputBooleanSwitchesDontHaveValues() when short switch value not exist', () => {
    const command = new Command('/cmd1/:param1')
    command.booleanSwitch('f', 'long')

    const acpSwitches = {
      a: '',
      e: true,
      f: 'f',
    }

    expect(() => {
      validateInputBooleanSwitchesDontHaveValues(command, acpSwitches)
    }).throws()
  })

  it('validateInputBooleanSwitchesDontHaveValues() when long switch value exist', () => {
    const command = new Command('/cmd1/:param1')
    command.booleanSwitch('e', 'longer')

    const acpSwitches = {
      long: '',
      longer: true,
      longest: 'f',
    }

    expect(() => {
      validateInputBooleanSwitchesDontHaveValues(command, acpSwitches)
    }).not.throws()
  })

  it('validateInputBooleanSwitchesDontHaveValues() when long switch value not exist', () => {
    const command = new Command('/cmd1/:param1')
    command.booleanSwitch('f', 'longest')

    const acpSwitches = {
      long: '',
      longer: true,
      longest: 'f',
    }

    expect(() => {
      validateInputBooleanSwitchesDontHaveValues(command, acpSwitches)
    }).throws()
  })

  it('defaultShortValuedSwitchesThatNeedsToBeAdded() value exist', () => {
    const command = new Command('/cmd1/:param1')
    command.valuedSwitch('f', 'long', 'defaultValue')

    const acpSwitches = {
      a: '',
      e: true,
      f: 'f',
    }

    const switches = defaultShortValuedSwitchesThatNeedsToBeAdded(
      command,
      acpSwitches
    )

    expect(switches).eql({})
  })

  it('defaultShortValuedSwitchesThatNeedsToBeAdded() switch exist but does not have value', () => {
    const command = new Command('/cmd1/:param1')
    command.valuedSwitch('e', 'long', 'defaultValue')

    const acpSwitches = {
      a: '',
      e: true,
      f: 'f',
    }

    const switches = defaultShortValuedSwitchesThatNeedsToBeAdded(
      command,
      acpSwitches
    )

    // figuring out if valuedSwitches should have value is responsibility of other helper methods
    expect(switches).eql({})
  })

  it('defaultShortValuedSwitchesThatNeedsToBeAdded() value not exist', () => {
    const command = new Command('/cmd1/:param1')
    command.valuedSwitch('c', 'long', 'defaultValue')

    const acpSwitches = {
      a: '',
      e: true,
      f: 'f',
    }

    const switches = defaultShortValuedSwitchesThatNeedsToBeAdded(
      command,
      acpSwitches
    )

    expect(switches).eql({ c: 'defaultValue' })
  })

  it('defaultShortValuedSwitchesThatNeedsToBeAdded() value exit but for long switch', () => {
    const command = new Command('/cmd1/:param1')
    command.valuedSwitch('c', 'long', 'defaultValue')

    const acpSwitches = {
      a: '',
      e: true,
      f: 'f',
      long: 'val',
    }

    const switches = defaultShortValuedSwitchesThatNeedsToBeAdded(
      command,
      acpSwitches
    )

    expect(switches).eql({})
  })

  //------------

  it('defaultLongValuedSwitchesThatNeedsToBeAdded() value exist', () => {
    const command = new Command('/cmd1/:param1')
    command.valuedSwitch('f', 'long', 'defaultValue')

    const acpSwitches = {
      long: 'x',
      longer: true,
    }

    const switches = defaultLongValuedSwitchesThatNeedsToBeAdded(
      command,
      acpSwitches
    )

    expect(switches).eql({})
  })

  it('defaultLongValuedSwitchesThatNeedsToBeAdded() switch exist but does not have value', () => {
    const command = new Command('/cmd1/:param1')
    command.valuedSwitch('e', 'longer', 'defaultValue')

    const acpSwitches = {
      long: 'x',
      longer: true,
    }

    const switches = defaultLongValuedSwitchesThatNeedsToBeAdded(
      command,
      acpSwitches
    )

    // figuring out if valuedSwitches should have value is responsibility of other helper methods
    expect(switches).eql({})
  })

  it('defaultLongValuedSwitchesThatNeedsToBeAdded() value not exist', () => {
    const command = new Command('/cmd1/:param1')
    command.valuedSwitch('c', 'longest', 'defaultValue')

    const acpSwitches = {
      long: 'x',
      longer: true,
    }

    const switches = defaultLongValuedSwitchesThatNeedsToBeAdded(
      command,
      acpSwitches
    )

    expect(switches).eql({ longest: 'defaultValue' })
  })

  it('defaultLongValuedSwitchesThatNeedsToBeAdded() value exit but for short switch', () => {
    const command = new Command('/cmd1/:param1')
    command.valuedSwitch('c', 'longest', 'defaultValue')

    const acpSwitches = {
      long: 'x',
      longer: true,
      c: 'val',
    }

    const switches = defaultLongValuedSwitchesThatNeedsToBeAdded(
      command,
      acpSwitches
    )

    expect(switches).eql({})
  })

  it('cleanSwitchValues()', () => {
    const acpSwitches = {
      a: [],
      b: ['cmd1'],
      c: ['cmd2'],
    }

    expect(cleanSwitchValues(acpSwitches)).eql({
      a: true,
      b: 'cmd1',
      c: 'cmd2',
    })
  })

  it('mapCommandParamNamesAndValues() when inputs have differnt length', () => {
    const commandParamNames = ['param1']
    const commandParamValues = ['val1', 'val2']

    expect(() => {
      mapCommandParamNamesAndValues(commandParamNames, commandParamValues)
    }).throws()
  })

  it('mapCommandParamNamesAndValues()', () => {
    const commandParamNames = ['param1', 'param2']
    const commandParamValues = ['val1', 'val2']

    expect(
      mapCommandParamNamesAndValues(commandParamNames, commandParamValues)
    ).eql({ param1: 'val1', param2: 'val2' })
  })
})
