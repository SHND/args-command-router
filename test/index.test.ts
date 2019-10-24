import { expect } from 'chai'
import { argsCommandRouter } from '../src/index'

describe('index method', () => {
  it('create', () => {
    expect(() => {
      const app = argsCommandRouter()
    }).not.throws()
  })
})
