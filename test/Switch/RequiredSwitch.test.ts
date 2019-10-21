import { expect } from 'chai'
import RequiredSwitch from '../../src/Switch/RequiredSwitch'

describe('RequiredSwitch class', () => {
  it('create for shortSwitch=null longSwitch=null', () => {
    expect(() => {
      new RequiredSwitch(null, null)
    }).throws()
  })

  it('create for shortSwitch="a" longSwitch=null', () => {
    let s = new RequiredSwitch('a', null)

    expect(s).be.deep.include({
      _shortName: 'a',
      _longName: null,
      _description: '',
    })
  })

  it('create for shortSwitch=null longSwitch="long"', () => {
    let s = new RequiredSwitch(null, 'long')

    expect(s).be.deep.include({
      _shortName: null,
      _longName: 'long',
      _description: '',
    })
  })

  it('create for shortSwitch="a" longSwitch="long"', () => {
    let s = new RequiredSwitch('a', 'long')

    expect(s).be.deep.include({
      _shortName: 'a',
      _longName: 'long',
      _description: '',
    })
  })

  it('create for shortSwitch="" longSwitch="long"', () => {
    let s = new RequiredSwitch('', 'long')

    expect(s).be.deep.include({
      _shortName: null,
      _longName: 'long',
      _description: '',
    })
  })

  it('create for shortSwitch="a" longSwitch=""', () => {
    let s = new RequiredSwitch('a', '')

    expect(s).be.deep.include({
      _shortName: 'a',
      _longName: null,
      _description: '',
    })
  })

  it('create for shortSwitch="" longSwitch=""', () => {
    expect(() => {
      new RequiredSwitch('', '')
    }).throws()
  })

  it('get shortname', () => {
    let s = new RequiredSwitch('a', 'long', 'description')

    expect(s.shortname).equals('a')
  })

  it('get longname', () => {
    let s = new RequiredSwitch('a', 'long', 'description')

    expect(s.longname).equals('long')
  })

  it('get description', () => {
    let s = new RequiredSwitch('a', 'long', 'description')

    expect(s.description).equals('description')
  })

  it('create for description', () => {
    let s = new RequiredSwitch('a', 'long', 'description')

    expect(s).be.deep.include({
      _shortName: 'a',
      _longName: 'long',
      _description: 'description',
    })
  })
})
