import { BlockPathItem } from "./BlockPathItem";
import { PathItem } from "./PathItem";


export class StaticPathItem extends BlockPathItem {
  
  constructor(name: string, parent: PathItem) {
    super();
    
    this.parentPathItem = parent;
    this.description;
    this.callbacks = [];
    this.helpCallback;
    this.requiredSwitches = [];
    this.optionalSwitches = [];
    
    this.name = name;
    this.staticPathItems = {};
    this.dynamicPathItem;
    this.switchPathItems = [];
    this.commonRequiredSwitches = [];
    this.commonOptionalSwitches = [];
  }
  
  /**
   * returns a unique name for this level
   * e.g. "something"
   * @param shortForm 
   */
  public getUniqueName = (shortForm: boolean = false) => {
    return this.name;
  };

  /**
   * Returns false because StaticPathItem is not a RootPathItem
   * This is for avoiding circular dependency issue
   * @returns false
   */
  public isRootPathItem = () => false;
}
