import { BlockPathItem } from "./BlockPathItem";
import { PATH_ITEM_DELIMITER } from "../constants";

export class RootPathItem extends BlockPathItem {
  
  constructor() {
    super();

    this.parentPathItem;
    this.description;
    this.callbacks = [];
    this.requiredSwitches = [];
    this.optionalSwitches = [];

    this.name = PATH_ITEM_DELIMITER;
    this.staticPathItems = {};
    this.dynamicPathItem;
    this.switchPathItems = [];
    this.commonRequiredSwitches = [];
    this.commonOptionalSwitches = [];

  }

  /**
   * returns a unique name for this level
   * e.g. "/"
   * @param shortForm 
   */
  public getUniqueName = (shortForm: boolean = false) => {
    return this.name;
  };

  /**
   * Returns true because this is the RootPathItem
   * This is for avoiding circular dependency issue
   * @returns true
   */
  public isRootPathItem = () => true;

  public getDynamicPathItemName: () => string | null = () => null;

}
