import { PathItem } from "./PathItem";
import { SwitchExpression } from "./SwitchExpression";
import { splitSwitchExpressions } from "../utility";

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
   * e.g. TODO
   * @param shortForm 
   */
  public getUniqueName = (shortForm: boolean = false) => {
    return "TODO";
  };

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
  private static parse(switchExpressionStr: string) {
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
  
}
