import { expect } from 'chai'
import ValuedSwitch from '../../src/Switch/ValuedSwitch'

describe('ValuedSwitch class', () => {
  it('create for shortSwitch=null longSwitch=null', () => {
    expect(() => {
      new ValuedSwitch(null, null, null)
    }).throws()
  })

  it('create for shortSwitch="a" longSwitch=null', () => {
    let s = new ValuedSwitch('a', null, null)

    expect(s).be.deep.include({
      _shortName: 'a',
      _longName: null,
      _defaultValue: null,
      _description: '',
    })
  })

  it('create for shortSwitch=null longSwitch="long"', () => {
    let s = new ValuedSwitch(null, 'long', null)

    expect(s).be.deep.include({
      _shortName: null,
      _longName: 'long',
      _defaultValue: null,
      _description: '',
    })
  })

  it('create for shortSwitch="a" longSwitch="long"', () => {
    let s = new ValuedSwitch('a', 'long', null)

    expect(s).be.deep.include({
      _shortName: 'a',
      _longName: 'long',
      _defaultValue: null,
      _description: '',
    })
  })

  it('create for shortSwitch="" longSwitch="long"', () => {
    let s = new ValuedSwitch('', 'long', null)

    expect(s).be.deep.include({
      _shortName: null,
      _longName: 'long',
      _defaultValue: null,
      _description: '',
    })
  })

  it('create for shortSwitch="a" longSwitch=""', () => {
    let s = new ValuedSwitch('a', '', null)

    expect(s).be.deep.include({
      _shortName: 'a',
      _longName: null,
      _defaultValue: null,
      _description: '',
    })
  })

  it('create for shortSwitch="" longSwitch=""', () => {
    expect(() => {
      new ValuedSwitch('', '', null)
    }).throws()
  })

  it('create for description', () => {
    let s = new ValuedSwitch('a', 'long', null, 'description')

    expect(s).be.deep.include({
      _shortName: 'a',
      _longName: 'long',
      _defaultValue: null,
      _description: 'description',
    })
  })

  it('create for default value', () => {
    let s = new ValuedSwitch('a', 'long', 'val1', 'description')

    expect(s).be.deep.include({
      _shortName: 'a',
      _longName: 'long',
      _defaultValue: 'val1',
      _description: 'description',
    })
  })

  it('get shortname', () => {
    let s = new ValuedSwitch('a', 'long', 'val1', 'description')

    expect(s.shortname).equals('a')
  })

  it('get longname', () => {
    let s = new ValuedSwitch('a', 'long', 'val1', 'description')

    expect(s.longname).equals('long')
  })

  it('get description', () => {
    let s = new ValuedSwitch('a', 'long', 'val1', 'description')

    expect(s.description).equals('description')
  })

  it('get defaultValue', () => {
    let s = new ValuedSwitch('a', 'long', 'val1', 'description')

    expect(s.defaultValue).equals('val1')
  })
})
