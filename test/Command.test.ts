import { expect } from 'chai'
import Command from '../src/Command'
import { CommandItemType, CommandItem } from '../src/models'

describe('Command class', () => {
  it('create with empty string', () => {
    expect(() => {
      new Command('')
    }).throws()
  })

  it('create with "item1/:item2"', () => {
    const command = new Command('item1/:item2')

    expect(command).to.be.instanceof(Command)
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

  it('parse empty string', () => {
    expect(() => {
      new Command('')
    }).throws()
  })

  it('parse string with space in it', () => {
    expect(() => {
      new Command(' ')
    }).throws()
  })

  it('parse string with "item1/:item2"', () => {
    const command = new Command('item1/:item2')

    expect(command).to.be.instanceof(Command)
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
