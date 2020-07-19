import { PathItem } from "./PathItem";
import { SwitchExpression } from "./SwitchExpression";

export class SwitchPathItem extends PathItem {
  
  protected switchExpressions: SwitchExpression[] = [];

  constructor(parent: PathItem) {
    super();
    
    this.parentPathItem = parent;
    this.description;
    this.callbacks = [];
    this.helpCallback;
    this.requiredSwitches = [];
    this.optionalSwitches = [];

  }
  
  /**
   * returns a unique name for this level
   * e.g. TODO
   * @param shortForm 
   */
  public getUniqueName = (shortForm: boolean) => {
    return "TODO";
  };
  
}
