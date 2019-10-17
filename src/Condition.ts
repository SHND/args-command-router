import { Parser, Expression } from 'expr-eval'

export default class Condition {
  private _expressionStr: string
  private _expression: Expression | null

  constructor(expression?: string) {
    if (expression) {
      this._expressionStr = expression
      try {
        this._expression = Parser.parse(expression)
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

  evaluate(values: { [key: string]: string | boolean }): boolean {
    const newValues: { [key: string]: string } = {}

    if (this._expression) {
      for (let key of this._expression.variables())
        newValues[key] = String(values[key])

      return this._expression.evaluate(newValues)
    }

    return true
  }
}
