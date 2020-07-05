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
  
  public getUniqueName = () => {
    return this.name;
  };

}
