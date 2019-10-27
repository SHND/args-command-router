import { Parser, Expression } from 'expr-eval'
import { StringOrBooleanMap } from './models'

const exprEvalOptions = {
  operators: {
    // These default to true, but are included to be explicit
    add: false,
    concatenate: false,
    conditional: false,
    divide: false,
    factorial: false,
    multiply: false,
    power: false,
    remainder: false,
    subtract: false,

    // Disable and, or, not, <, ==, !=, etc.
    logical: true,
    comparison: true,

    // Disable 'in' and = operators
    in: false,
    assignment: false,
  },
}

export default class Condition {
  private _parser: Parser
  private _expressionStr: string
  private _expression: Expression | null

  constructor(expression?: string) {
    this._parser = new Parser(exprEvalOptions)
    if (expression) {
      this._expressionStr = expression
      try {
        this._expression = this._parser.parse(expression)
      } catch {
        throw Error(`Failed to parse expression '${expression}'.`)
      }
    } else {
      this._expressionStr = ''
      this._expression = null
    }
  }

  variables(): string[] {
    if (this._expression) return this._expression.variables()
    else return []
  }

  evaluate(values: StringOrBooleanMap): boolean {
    if (!this._expression) return true

    // Creating function out of expression to be abale to evaluate expression with undefined variables
    const inputs = this._expression.variables().sort()
    const inputsStr = inputs.join(',')
    const evaluate = this._expression.toJSFunction(inputsStr)

    const newValueList = []
    for (let key of inputs) newValueList.push(values[key])

    return Boolean(evaluate(...newValueList))
  }
}
