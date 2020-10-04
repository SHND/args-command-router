import { PathItem } from "./PathItem";
import { SwitchExpression } from "./SwitchExpression";
import { splitSwitchExpressions } from "../utility";
import { OPEN_SWITCH_EXPR_SYMBOL, CLOSE_SWITCH_EXPR_SYMBOL } from "../constants";

export class SwitchPathItem extends PathItem {
  
  protected switchExpressions: SwitchExpression[] = [];

  constructor(switchExpressionStr: string, parent: PathItem) {
    super();
    
    this.parentPathItem = parent;
    this.description;
    this.callbacks = [];
    this.helpCallback;
    this.requiredSwitches = [];
    this.optionalSwitches = [];

    this.switchExpressions = SwitchPathItem.parse(switchExpressionStr);
  }
  
  /**
   * returns a unique name for this level
   * @param shortForm 
   */
  public getUniqueName = (shortForm: boolean = false) => {
    return this.switchExpressions.reduce((str, switchExpr) => `${str}${OPEN_SWITCH_EXPR_SYMBOL}${switchExpr.toString()}${CLOSE_SWITCH_EXPR_SYMBOL}`, '');
  };

  /**
   * Returns false because SwitchPathItem is not a RootPathItem
   * This is for avoiding circular dependency issue
   * @returns false
   */
  public isRootPathItem = () => false;

  /**
   * Getter for list of switch expressions
   */
  getSwitchExpressions = () => {
    return this.switchExpressions;
  }

  /**
   * Parse Switch Expression string e.g. [ab][cd=1]
   * @param switchExpressionStr to be parsed
   */
  private static parse(switchExpressionStr: string): SwitchExpression[] {
    const str = switchExpressionStr.trim();

    const expressionStrings = splitSwitchExpressions(str);
    
    let expressions: SwitchExpression[] = [];

    try {
      expressions = expressionStrings.map(expStr => new SwitchExpression(expStr));
    } catch(e) {
      throw Error(`SwitchExpressions in SwitchPathItems "" has problem. ${e}`)
    }
    
    if (expressions.find(expr => expr.getSwitchId().length === 0)) {
      throw Error(`SwitchExpressions in SwitchPathItems "${switchExpressionStr}" cannot have empty expression Id.`);
    }

    return expressions;
  }

  public getDynamicPathItemName: () => string | null = () => null;

  public getCommonSwitchNames = () => ({});
  
}
