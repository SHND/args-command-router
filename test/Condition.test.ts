import { expect } from 'chai'
import { Parser, Expression } from 'expr-eval'
import Condition from '../src/Condition'

describe('Condition class', () => {
  it('create with no names', () => {
    expect(() => {
      const condition = new Condition()
    }).does.not.throws

    const condition = new Condition()
    expect(condition).deep.include({
      _expressionStr: '',
      _expression: null,
    })
  })

  it('create with "true"', () => {
    expect(() => {
      const condition = new Condition('true')
    }).does.not.throws

    const condition = new Condition('true')
    const parser = condition['_parser']
    const expression = condition['_expression']
    const expressionStr = condition['_expressionStr']

    expect(parser).instanceof(Parser)
    expect(expression).instanceof(Object)
    expect(expressionStr).eql('true')
  })

  it('incorrect expression throws error', () => {
    expect(() => {
      const condition = new Condition('what')
    }).throws
  })

  it('variables() for when no expression is passed', () => {
    const condition = new Condition()
    const vars = condition.variables()
    expect(vars.length).eql(0)
  })
  it('variables() for expressions without variables', () => {
    const condition = new Condition('true')
    const vars = condition.variables()
    expect(vars.length).eql(0)
  })

  it('variables() for expressions with variables', () => {
    const condition = new Condition('a==b')
    const vars = condition.variables()
    expect(vars.length).eql(2)
    expect(vars).eql(['a', 'b'])
  })

  it('evaluate() with no variables', () => {
    const condition1 = new Condition()
    expect(condition1.evaluate({})).eql(true)

    const condition2 = new Condition('true')
    expect(condition2.evaluate({})).eql(true)

    const condition3 = new Condition('false')
    expect(condition3.evaluate({})).eql(false)
  })

  it('evaluate() with variables', () => {
    const condition1 = new Condition('a == "1"')
    expect(condition1.evaluate({ a: '1' })).eql(true)

    expect(condition1.evaluate({ a: '2' })).eql(false)

    expect(condition1.evaluate({})).eql(false)
  })
})
