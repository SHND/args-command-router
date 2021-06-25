import { Switch } from "../Switch";
import { PathItem } from "./PathItem";
import { SwitchPathItem } from "./SwitchPathItem";

export class SpreadPathItem extends PathItem {

  protected name: string;
  protected switchPathItems: Array<SwitchPathItem> = [];

  constructor(name: string, parent: PathItem) {
    super();

    this.parentPathItem = parent;
    this.description;
    this.callbacks = [];
    this.requiredSwitches = [];
    this.optionalSwitches = [];

    this.name = name;    
    this.switchPathItems = [];
  }

  /**
   * returns a unique name for this level
   * e.g. "...something"
   * @param shortForm 
   */
  public getUniqueName = (shortForm?: boolean) => {
    if (shortForm) {
      return this.name;
    }

    return `...${this.name}`;
  }

  /**
   * Returns false because SpreadPathItem is not a RootPathItem
   * This is for avoiding circular dependency issue
   * @returns false
   */
  public isRootPathItem: () => boolean = () => false;

  /**
   * Returns the pathItem name if it is a dynamicPathItem or null if it is not
   */
  public getDynamicPathItemName: () => string | null = () => null;

  /**
   * Get switchPathItems
   */
   public getSwitchPathItems = () => {
    return this.switchPathItems;
  }

  /**
   * Add switchPathItem
   * @param {SwitchPathItem} switchPathItem to be added
   */
  public addSwitchPathItem = (switchPathItem: SwitchPathItem) => {
    switchPathItem.setParentPathItem(this);

    this.switchPathItems.push(switchPathItem);
  }

  /**
   * Returns a dictionary of short and long common required switch names in the PathItem
   * SpreadPathItems could not have any common switches
   */
  public getCommonRequiredSwitchNames: () => Record<string, Switch> = () => ({});

  /**
   * Returns a dictionary of short and long common optional switch names in the PathItem
   * SpreadPathItems could not have any common switches
   */
  public getCommonOptionalSwitchNames: () => Record<string, Switch> = () => ({});

  /**
   * Get a dictionary with all commonSwitch names for the current PathItem
   * SpreadPathItems could not have any common switches
   */
  public getCommonSwitchNames: () => Record<string, Switch> = () => ({});
  
}
