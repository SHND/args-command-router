import { BlockPathItem } from "./BlockPathItem";
import { PATH_ITEM_DELIMITER } from "../constants";

export class RootPathItem extends BlockPathItem {
  
  constructor() {
    super();

    this.parentPathItem;
    this.description;
    this.callbacks = [];
    this.helpCallback;
    this.requiredSwitches = [];
    this.optionalSwitches = [];

    this.name = PATH_ITEM_DELIMITER;
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
  }

  public getTreeString = () => {
    let output = '';

    function _getTreeString(pathItem: BlockPathItem, indent: number) {
      for (let childPathItem of Object.values(pathItem.getStaticPathItems())) {
        output += (new Array(indent)).fill(' ') + childPathItem.getUniqueName();
        
        _getTreeString(childPathItem, indent + 1);
      }

      if (pathItem.getDynamicPathItem()) {
        output += (new Array(indent)).fill(' ') + pathItem.getDynamicPathItem().getUniqueName(false);
        _getTreeString(pathItem.getDynamicPathItem(), indent + 1);          
      }
    }

    return _getTreeString(this, 0);
  }

}
