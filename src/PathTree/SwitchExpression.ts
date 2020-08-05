import { EQUAL_SWITCH_EXPR_SYMBOL, SINGLE_QUOTE_LITERAL, DOUBLE_QUOTE_LITERAL } from "../constants";
import { hasWhiteSpace } from "../utility";

export class SwitchExpression {
  
  /**
   * Switch Identifier e.g. "ab" in "ab" or "ab=12"
   */
  private _switchId: string;

  /**
   * Switch Value e.g. "12" in ab=12"
   * Null for Switch Value means value does is not specified e.g. "ab".
   */
  private _switchValue?: string;

  /**
   * @param expressionsStr SwitchExpression string to be parsed
   */
  constructor(expressionsStr: string) {
    const {
      variable,
      value
    } = SwitchExpression.parse(expressionsStr);

    this._switchId = variable;
    this._switchValue = value;
  }

  /**
   * Getter for Switch Identifier e.g. "ab" in "ab" or "ab=1"
   * If the expressionsStr is empty or starts with equal, Switch Id will be empty e.g. "" or "=1"
   * @returns {string}
   */
  getSwitchId = () => {
    return this._switchId;
  }

  /**
   * Getter for SwitchValue.
   * if value is not specified in the SwitchExpression returns null.
   * @returns {string | null} 
   */
  getSwitchValue = () => {
    return this._switchValue;
  }

  /**
   * Check if the SwitchExpression contains value
   * @returns {boolean} true if value specified in the SwitchExpression
   */
  isValuedSwitch = () => {
    return this._switchValue !== null;
  }

  /**
   * Parse SwitchExpression strings like "ab" or "ab=1"
   * @param expressionsStr to be parsed 
   */
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