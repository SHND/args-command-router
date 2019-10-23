import { expect } from 'chai'
import Route from '../src/Route'
import Command from '../src/Command'
import { CommandItemType } from '../src/models'
import Condition from '../src/Condition'

describe('Route class', () => {
  it('create with string "cmd1[true]"', () => {
    expect(() => {
      const route = new Route('cmd1[true]')
    }).not.throws()
  })

  it('create with Command and Condition', () => {
    expect(() => {
      const command = new Command('cmd1')
      const condition = new Condition('true')
      const route = new Route(command, condition)
    }).not.throws()
  })

  it('parse empty string', () => {
    const route = Route.parse('')
    const commandItems = route.command.getCommandItems()

    expect(commandItems.length).is.equals(0)
  })

  it('parse ""', () => {
    const route = Route.parse('')
    const commandItems = route.command.getCommandItems()

    expect(commandItems.length).is.equal(0)
  })

  it('parse " "', () => {
    const route = Route.parse('')
    const commandItems = route.command.getCommandItems()

    expect(commandItems.length).is.equal(0)
  })

  it('parse "/"', () => {
    const route = Route.parse('/')
    const commandItems = route.command.getCommandItems()

    expect(commandItems.length).is.equal(0)
  })

  it('parse "//"', () => {
    expect(() => {
      Route.parse('//')
    }).throws()
  })

  it('parse "cmd1"', () => {
    const route = Route.parse('cmd1')
    const commandItems = route.command.getCommandItems()

    expect(commandItems.length).is.equal(1)
    expect(commandItems[0]).deep.equals({
      name: 'cmd1',
      type: CommandItemType.FIXED,
    })
  })

  it('parse "/cmd1"', () => {
    const route = Route.parse('/cmd1')
    const commandItems = route.command.getCommandItems()

    expect(commandItems.length).is.equal(1)
    expect(commandItems[0]).deep.equals({
      name: 'cmd1',
      type: CommandItemType.FIXED,
    })
  })

  it('parse "  /cmd1"  ', () => {
    const route = Route.parse('  /cmd1  ')
    const commandItems = route.command.getCommandItems()

    expect(commandItems.length).is.equal(1)
    expect(commandItems[0]).deep.equals({
      name: 'cmd1',
      type: CommandItemType.FIXED,
    })
  })

  it('parse "/ cmd1"', () => {
    expect(() => {
      const route = Route.parse('/ cmd1')
    }).throws()
  })

  it('parse "cmd1/cmd2"', () => {
    const route = Route.parse('cmd1/cmd2')
    const commandItems = route.command.getCommandItems()

    expect(commandItems.length).is.equal(2)
    expect(commandItems).deep.equals([
      {
        name: 'cmd1',
        type: CommandItemType.FIXED,
      },
      {
        name: 'cmd2',
        type: CommandItemType.FIXED,
      },
    ])
  })

  it('parse "cmd1/:param1"', () => {
    const route = Route.parse('cmd1/:param1')
    const commandItems = route.command.getCommandItems()

    expect(commandItems.length).is.equal(2)
    expect(commandItems).deep.equals([
      {
        name: 'cmd1',
        type: CommandItemType.FIXED,
      },
      {
        name: 'param1',
        type: CommandItemType.PARAMETER,
      },
    ])
  })

  it('parse "[true]"', () => {
    const route = Route.parse('[true]')
    const condition = route['_condition']
    const commandItems = route.command.getCommandItems()

    expect(condition['_expressionStr']).is.equals('true')
    expect(commandItems.length).is.equal(0)
  })

  it('parse "/[true]"', () => {
    const route = Route.parse('/[true]')
    const condition = route['_condition']
    const commandItems = route.command.getCommandItems()

    expect(condition['_expressionStr']).is.equals('true')
    expect(commandItems.length).is.equal(0)
  })

  it('parse "cmd1[true]"', () => {
    const route = Route.parse('cmd1[true]')
    const condition = route['_condition']
    const commandItems = route.command.getCommandItems()

    expect(condition['_expressionStr']).is.equals('true')
    expect(commandItems.length).is.equal(1)
    expect(commandItems).deep.equals([
      {
        name: 'cmd1',
        type: CommandItemType.FIXED,
      },
    ])
  })

  it('parse "  cmd1  [true]  "', () => {
    const route = Route.parse('  cmd1  [true]  ')
    const condition = route['_condition']
    const commandItems = route.command.getCommandItems()

    expect(condition['_expressionStr']).is.equals('true')
    expect(commandItems.length).is.equal(1)
    expect(commandItems).deep.equals([
      {
        name: 'cmd1',
        type: CommandItemType.FIXED,
      },
    ])
  })

  it('parse "cmd1/:param1[true]"', () => {
    const route = Route.parse('cmd1/:param1[true]')
    const condition = route['_condition']
    const commandItems = route.command.getCommandItems()

    expect(condition['_expressionStr']).is.equals('true')
    expect(commandItems.length).is.equal(2)
    expect(commandItems).deep.equals([
      {
        name: 'cmd1',
        type: CommandItemType.FIXED,
      },
      {
        name: 'param1',
        type: CommandItemType.PARAMETER,
      },
    ])
  })

  it('parse "   cmd1/:param1   [true]   "', () => {
    const route = Route.parse('   cmd1/:param1   [true]   ')
    const condition = route['_condition']
    const commandItems = route.command.getCommandItems()

    expect(condition['_expressionStr']).is.equals('true')
    expect(commandItems.length).is.equal(2)
    expect(commandItems).deep.equals([
      {
        name: 'cmd1',
        type: CommandItemType.FIXED,
      },
      {
        name: 'param1',
        type: CommandItemType.PARAMETER,
      },
    ])
  })

  it('parse "   cmd1/:param1   [a and (b == "12" or (a > b))]   "', () => {
    const route = Route.parse(
      '   cmd1/:param1   [a and (b == "12" or (a > b))]   '
    )
    const condition = route['_condition']
    const commandItems = route.command.getCommandItems()

    expect(condition['_expressionStr']).is.equals(
      'a and (b == "12" or (a > b))'
    )
    expect(commandItems.length).is.equal(2)
    expect(commandItems).deep.equals([
      {
        name: 'cmd1',
        type: CommandItemType.FIXED,
      },
      {
        name: 'param1',
        type: CommandItemType.PARAMETER,
      },
    ])
  })

  it('get command()', () => {
    const command = new Command('cmd1')
    const condition = new Condition('true')
    const route = new Route(command, condition)

    expect(route.command).is.eql(command)
  })

  it('get condition()', () => {
    const command = new Command('cmd1')
    const condition = new Condition('true')
    const route = new Route(command, condition)

    expect(route.condition).is.eql(condition)
  })
})
