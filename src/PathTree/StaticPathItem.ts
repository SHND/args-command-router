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
    this.commonSwitches = {
      requiredSwitches: [],
      optionalSwitches: []
    }
  }
  
  /**
   * returns a unique name for this level
   * e.g. "something"
   * @param shortForm 
   */
  public getUniqueName = (shortForm: boolean) => {
    return this.name;
  };

}
