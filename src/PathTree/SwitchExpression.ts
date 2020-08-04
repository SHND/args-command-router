import { EQUAL_SWITCH_EXPR_SYMBOL, SINGLE_QUOTE_LITERAL, DOUBLE_QUOTE_LITERAL } from "../constants";
import { hasWhiteSpace } from "../utility";

export class SwitchExpression {
  
  constructor(expressionsStr: string) {

  }

  static parse(expressionsStr: string) {
    const output: {
      variable: string,
      value: string
    } = {
      variable: null,
      value: null
    }

    let variable = '';
    let value = null;

    // get the variable part of the expreesionStr
    let i;
    for (i=0; i<expressionsStr.length; i++) {
      let c = expressionsStr[i]

      if (c !== EQUAL_SWITCH_EXPR_SYMBOL) {
        variable += c;
      } else {
        break;
      }
    }

    variable = variable.trim();

    if (hasWhiteSpace(variable)) {
      throw Error(`Whitespaces are not allowed in SwitchExpression: "${expressionsStr}".`)
    }

    output.variable = variable;

    if (i >= expressionsStr.length) {
      return output;
    }

    // get the value part with quotes or without quotes
    value = expressionsStr.substring(i+1).trim();

    if (
      (value.startsWith(SINGLE_QUOTE_LITERAL) && value.endsWith(SINGLE_QUOTE_LITERAL)) || 
      (value.startsWith(DOUBLE_QUOTE_LITERAL) && value.endsWith(DOUBLE_QUOTE_LITERAL))
    ){
      if (value.length > 1) {
        value = value.substring(1, value.length - 1);
      }
    }

    output.value = value;

    return output;
  }

}