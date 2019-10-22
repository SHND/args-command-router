import { expect } from 'chai'
import BooleanSwitch from '../../src/Switch/BooleanSwitch'

describe('BooleanSwitch class', () => {
  it('create for shortSwitch=null longSwitch=null', () => {
    expect(() => {
      new BooleanSwitch(null, null)
    }).throws()
  })

  it('create for shortSwitch="aa"', () => {
    expect(() => {
      new BooleanSwitch('aa', null)
    }).throws()
  })

  it('create for shortSwitch="a" longSwitch=null', () => {
    let s = new BooleanSwitch('a', null)

    expect(s).be.deep.include({
      _shortName: 'a',
      _longName: null,
      _description: '',
    })
  })

  it('create for shortSwitch=null longSwitch="long"', () => {
    let s = new BooleanSwitch(null, 'long')

    expect(s).be.deep.include({
      _shortName: null,
      _longName: 'long',
      _description: '',
    })
  })

  it('create for shortSwitch="a" longSwitch="long"', () => {
    let s = new BooleanSwitch('a', 'long')

    expect(s).be.deep.include({
      _shortName: 'a',
      _longName: 'long',
      _description: '',
    })
  })

  it('create for shortSwitch="" longSwitch="long"', () => {
    let s = new BooleanSwitch('', 'long')

    expect(s).be.deep.include({
      _shortName: null,
      _longName: 'long',
      _description: '',
    })
  })

  it('create for shortSwitch="a" longSwitch=""', () => {
    let s = new BooleanSwitch('a', '')

    expect(s).be.deep.include({
      _shortName: 'a',
      _longName: null,
      _description: '',
    })
  })

  it('create for shortSwitch="" longSwitch=""', () => {
    expect(() => {
      new BooleanSwitch('', '')
    }).throws()
  })

  it('create for description', () => {
    let s = new BooleanSwitch('a', 'long', 'description')

    expect(s).be.deep.include({
      _shortName: 'a',
      _longName: 'long',
      _description: 'description',
    })
  })

  it('get shortname', () => {
    let s = new BooleanSwitch('a', 'long', 'description')

    expect(s.shortname).equals('a')
  })

  it('get longname', () => {
    let s = new BooleanSwitch('a', 'long', 'description')

    expect(s.longname).equals('long')
  })

  it('get description', () => {
    let s = new BooleanSwitch('a', 'long', 'description')

    expect(s.description).equals('description')
  })
})
