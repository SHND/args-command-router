import { expect } from 'chai'
import Command from '../src/Command'
import { CommandItemType, CommandItem } from '../src/models'

describe('Command class', () => {
  it('create with empty string', () => {
    const command = new Command('')

    expect(command['_commandItems'].length).is.equal(0)
  })

  it('create with "item1/:item2"', () => {
    const command = new Command('item1/:item2')

    expect(command['_commandItems'].length).is.equal(2)
    expect(command['_commandItems'][0]).deep.include({
      name: 'item1',
      type: CommandItemType.FIXED,
    })

    expect(command['_commandItems'][1]).deep.include({
      name: 'item2',
      type: CommandItemType.PARAMETER,
    })
  })

  it('create with CommandItems of "item1/:item2"', () => {
    const commandItems = [
      {
        name: 'item1',
        type: CommandItemType.FIXED,
      },
      {
        name: 'item2',
        type: CommandItemType.PARAMETER,
      },
    ]
    const command = new Command(commandItems)

    expect(command['_commandItems'].length).is.equal(2)
    expect(command['_commandItems'][0]).deep.include({
      name: 'item1',
      type: CommandItemType.FIXED,
    })

    expect(command['_commandItems'][1]).deep.include({
      name: 'item2',
      type: CommandItemType.PARAMETER,
    })
  })

  it('create with empty array of CommandItems', () => {
    const commandItems: CommandItem[] = []
    const command = new Command(commandItems)
    expect(command['_commandItems'].length).is.equal(0)
  })

  it('create with array of CommandItems', () => {
    const commandItems: CommandItem[] = [
      {
        name: 'item1',
        type: CommandItemType.FIXED,
      },
      {
        name: 'item2',
        type: CommandItemType.PARAMETER,
      },
    ]
    const command = new Command(commandItems)
    expect(command['_commandItems'].length).is.equal(2)
    expect(command['_commandItems']).eqls(commandItems)
  })

  it('parse " "', () => {
    expect(() => {
      new Command(' ')
    }).throws()
  })

  it('parse ""', () => {
    const command = new Command('')
    expect(command['_commandItems'].length).is.equal(0)
  })

  it('parse "/"', () => {
    const command = new Command('/')
    expect(command['_commandItems'].length).is.equal(0)
  })

  it('parse "//"', () => {
    expect(() => {
      const command = new Command('//')
    }).throws()
  })

  it('parse "cmd1//"', () => {
    expect(() => {
      const command = new Command('//')
    }).throws()
  })

  it('parse "cmd1"', () => {
    const command = new Command('cmd1')
    expect(command['_commandItems'].length).is.equal(1)
    expect(command['_commandItems'][0]).deep.equal({
      name: 'cmd1',
      type: CommandItemType.FIXED,
    })
  })

  it('parse "/cmd1"', () => {
    const command = new Command('/cmd1')
    expect(command['_commandItems'].length).is.equal(1)
    expect(command['_commandItems'][0]).deep.equal({
      name: 'cmd1',
      type: CommandItemType.FIXED,
    })
  })

  it('parse string with "cmd1/:param1"', () => {
    const command = new Command('cmd1/:param1')

    expect(command['_commandItems'].length).is.equal(2)
    expect(command['_commandItems'][0]).deep.include({
      name: 'cmd1',
      type: CommandItemType.FIXED,
    })

    expect(command['_commandItems'][1]).deep.include({
      name: 'param1',
      type: CommandItemType.PARAMETER,
    })
  })

  it('parse string with "/cmd1/:param1"', () => {
    const command = new Command('/cmd1/:param1')

    expect(command['_commandItems'].length).is.equal(2)
    expect(command['_commandItems'][0]).deep.include({
      name: 'cmd1',
      type: CommandItemType.FIXED,
    })

    expect(command['_commandItems'][1]).deep.include({
      name: 'param1',
      type: CommandItemType.PARAMETER,
    })
  })

  it('description()', () => {
    const command = new Command('item1/:item2')

    command.description('description')
    expect(command['_description']).is.equal('description')
  })

  it('getDescription()', () => {
    const command = new Command('item1/:item2')

    command.description('description')
    expect(command.getDescription()).is.equal('description')
  })

  it('booleanSwitch()', () => {
    const command = new Command('item1/:item2')

    expect(command['_switches'].length).is.equal(0)
    command.booleanSwitch('b', 'boolean', 'description')
    expect(command['_switches'].length).is.equal(1)

    expect(command['_switches'][0]).deep.include({
      _shortName: 'b',
      _longName: 'boolean',
      _description: 'description',
    })
  })

  it('valuedSwitch()', () => {
    const command = new Command('item1/:item2')

    expect(command['_switches'].length).is.equal(0)
    command.valuedSwitch('v', 'valued', 'val1', 'description')
    expect(command['_switches'].length).is.equal(1)

    expect(command['_switches'][0]).deep.include({
      _shortName: 'v',
      _longName: 'valued',
      _defaultValue: 'val1',
      _description: 'description',
    })
  })

  it('requiredSwitch()', () => {
    const command = new Command('item1/:item2')

    expect(command['_switches'].length).is.equal(0)
    command.requiredSwitch('r', 'required', 'description')
    expect(command['_switches'].length).is.equal(1)

    expect(command['_switches'][0]).deep.include({
      _shortName: 'r',
      _longName: 'required',
      _description: 'description',
    })
  })

  it('getBooleanSwitches() when no booleanSwitch exist', () => {
    const command = new Command('item1/:item2')

    const booleanSwitches = command.getBooleanSwitches()

    expect(booleanSwitches.length).equal(0)
  })

  it('getBooleanSwitches()', () => {
    const command = new Command('item1/:item2')

    command.booleanSwitch('b', 'boolean', 'description')
    command.valuedSwitch('v', 'valued', 'val1', 'description')
    command.requiredSwitch('r', 'required', 'description')

    const booleanSwitches = command.getBooleanSwitches()
    expect(booleanSwitches.length).equal(1)
    expect(booleanSwitches[0]).deep.equal({
      _shortName: 'b',
      _longName: 'boolean',
      _description: 'description',
    })
  })

  it('getValuedSwitches() when no valuedSwitch exist', () => {
    const command = new Command('item1/:item2')

    const valuedSwitch = command.getValuedSwitches()

    expect(valuedSwitch.length).equal(0)
  })

  it('getValuedSwitches()', () => {
    const command = new Command('item1/:item2')

    command.booleanSwitch('b', 'boolean', 'description')
    command.valuedSwitch('v', 'valued', 'val1', 'description')
    command.requiredSwitch('r', 'required', 'description')

    const valuedSwitch = command.getValuedSwitches()
    expect(valuedSwitch.length).equal(1)
    expect(valuedSwitch[0]).deep.equal({
      _shortName: 'v',
      _longName: 'valued',
      _defaultValue: 'val1',
      _description: 'description',
    })
  })

  it('getRequiredSwitches() when no requiedSwitch exist', () => {
    const command = new Command('item1/:item2')

    const requiredSwitch = command.getRequiredSwitches()

    expect(requiredSwitch.length).equal(0)
  })

  it('getRequiredSwitches()', () => {
    const command = new Command('item1/:item2')

    command.booleanSwitch('b', 'boolean', 'description')
    command.valuedSwitch('v', 'valued', 'val1', 'description')
    command.requiredSwitch('r', 'required', 'description')

    const requiredSwitch = command.getRequiredSwitches()
    expect(requiredSwitch.length).equal(1)
    expect(requiredSwitch[0]).deep.equal({
      _shortName: 'r',
      _longName: 'required',
      _description: 'description',
    })
  })

  it('getParameters()', () => {
    const command = new Command('item1/:item2/item3/:item4')

    const params = command.getParameters()
    expect(params.length).is.equal(2)
    expect(params).eql(['item2', 'item4'])
  })

  it('getCommandItems()', () => {
    const command = new Command('item1/:item2/item3/:item4')

    const commandItems = command.getCommandItems()
    expect(commandItems.length).is.equal(4)
    expect(commandItems).eql([
      { name: 'item1', type: CommandItemType.FIXED },
      { name: 'item2', type: CommandItemType.PARAMETER },
      { name: 'item3', type: CommandItemType.FIXED },
      { name: 'item4', type: CommandItemType.PARAMETER },
    ])
  })
})
