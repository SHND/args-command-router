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

  /**
   * returns a unique name for this level
   * e.g. "/"
   * @param shortForm 
   */
  public getUniqueName = () => {
    return this.name;
  }

  public listPathItems = (shortForm: boolean = false) => {
    let output = {value: ''};
    
    _listPathItems(this, 0, output);

    return output.value;
    
    function _listPathItems(pathItem: BlockPathItem, indent = 0, output: {value: string}) {
      for (let staticChild of Object.values(pathItem.getStaticPathItems())) {
        output.value += Array(indent*2).fill('. ').join('') + staticChild.getUniqueName(shortForm) + '\n';
        _listPathItems(staticChild, indent+1, output);
      }

      const dynamicChild = pathItem.getDynamicPathItem();
      if (dynamicChild) {
        output.value += Array(indent*2).fill('. ').join('') + dynamicChild.getUniqueName(shortForm) + '\n';
        _listPathItems(dynamicChild, indent+1, output);
      }
    }
  }

}
