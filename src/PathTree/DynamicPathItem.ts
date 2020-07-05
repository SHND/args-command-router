import { PathItem } from "./PathItem";
import { BlockPathItem } from "./BlockPathItem";
import { DYNAMIC_PATH_PREFIX } from "../constants";

export class DynamicPathItem extends BlockPathItem {
  
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
  
  public getUniqueName = (shortForm: boolean) => {
    if (shortForm) {
      return this.name;
    }

    return DYNAMIC_PATH_PREFIX + this.name;
  };
  
}
