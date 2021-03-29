import { Switch } from "../Switch";
import { Callback } from "../types";
import { treeToString } from "../utility";
import { PATH_ITEM_DELIMITER } from "../constants";

export abstract class PathItem {

  protected parentPathItem: PathItem;
  protected description: string;
  protected callbacks: Callback[] = [];
  protected requiredSwitches: Switch[] = [];
  protected optionalSwitches: Switch[] = [];

  private _shortRequiredSwitches: Record<string, Switch> = {};
  private _longRequiredSwitches: Record<string, Switch> = {};
  private _shortOptionalSwitches: Record<string, Switch> = {};
  private _longOptionalSwitches: Record<string, Switch> = {};

  /**
   * returns a unique name for this level
   * e.g. ":something"
   * @param shortForm 
   */
  public abstract getUniqueName: (shortForm?: boolean) => string;

  /**
   * Returns if the PathItem is a RootPathItem
   * This is for avoiding circular dependency issue
   */
  public abstract isRootPathItem: () => boolean;

  /**
   * Returns the pathItem name if it is a dynamicPathItem or null if it is not
   */
  public abstract getDynamicPathItemName: () => string | null;
  
  /**
   * Returns a dictionary of short and long common required switch names in the PathItem
   */
  public abstract getCommonRequiredSwitchNames: () => Record<string, Switch>;

  /**
   * Returns a dictionary of short and long common optional switch names in the PathItem
   */
  public abstract getCommonOptionalSwitchNames: () => Record<string, Switch>;

  /**
   * Returns a dictionary of short and long common switch names in the PathItem
   */
  public abstract getCommonSwitchNames: () => Record<string, Switch>;

  /**
   * Display help for the current PathItem
   */
  public abstract getHelp: (applicationName: string) => void;

  /**
   * Check if the pathItem is in a branch that has a RootPathItem
   */
  public isInRootPathItemBranch() {
    let current: PathItem = this;

    while (current) {
      if (current.isRootPathItem()) {
        return true;
      }

      current = current.parentPathItem;
    }

    return false;
  }
  
  /**
   * parentPathItem getter
   */
  public getParentPathItem = () => {
    return this.parentPathItem;
  }

  /**
   * parentPathItem setter
   * NOTE: Unfortunately I need to make this public, but in reality not all PathItems
   * can be a parent, so be careful when using this.
   * @param parent PathItem for the current PathItem
   */
  public setParentPathItem = (parent: PathItem) => {
    this.parentPathItem = parent;
  }

  /**
   * description getter
   */
  public getDescription = () => {
    return this.description;
  }

  public hasDescription = () => {
    return !!this.description;
  }

  /**
   * description setter
   * @param {string} description
   */
  public setDescription = (description: string) => {
    this.description = description;
  }

  /**
   * Get callbacks
   */
  public getCallbacks = () => {
    return this.callbacks;
  }

  /**
   * check if the callback exists
   * @param {Callback} callback 
   */
  public hasCallback = (callback: Callback) => {
    return this.callbacks.findIndex(cb => cb === callback) >= 0;
  }

  /**
   * Add callback
   * @param {Callback} callback to be added
   */
  public addCallback = (callback: Callback) => {
    if (!this.hasCallback(callback)) {
      this.callbacks.push(callback);
    }
  }

  /**
   * Get requiredSwitches
   */
  public getRequiredSwitches = () => {
    return this.requiredSwitches;
  }

  /**
   * check if the requiredSwitch exists
   * @param swich 
   */
  public hasRequiredSwitch = (swich: Switch) => {
    return this.requiredSwitches.findIndex(cb => cb === swich) >= 0;
  }

  /**
   * Check if the requiredSwitch with specifc shortname exists
   * @param shortname 
   */
  public hasRequiredSwitchWithShortname = (shortname: string) => {
    return !!this._shortRequiredSwitches[shortname];
  }

  /**
   * Check if the requiredSwitch with specifc longname exists
   * @param longname 
   */
  public hasRequiredSwitchWithLongname = (longname: string) => {
    return !!this._longRequiredSwitches[longname];
  }

  /**
   * Add requiredSwitch
   * @param {Switch} swich to be added
   */
  public addRequiredSwitch = (swich: Switch) => {

    if (swich.hasShortname()) {
      this._shortRequiredSwitches[swich.getShortname()] = swich;
    }
 
    if (swich.hasLongname()) {
      this._longRequiredSwitches[swich.getLongname()] = swich;
    }

    this.requiredSwitches.push(swich);
  }

  /**
   * Add optionalSwitch
   * @param {Switch} swich to be added
   */
  public addOptionalSwitch = (swich: Switch) => {

    if (swich.hasShortname()) {
      this._shortOptionalSwitches[swich.getShortname()] = swich;
    }
 
    if (swich.hasLongname()) {
      this._longOptionalSwitches[swich.getLongname()] = swich;
    }
    
    this.optionalSwitches.push(swich);
  }

  /**
   * Get optionalSwitches
   */
  public getOptionalSwitches = () => {
    return this.optionalSwitches;
  }

  /**
   * check if the optionalSwitch exists
   * @param swich 
   */
  public hasOptionalSwitch = (swich: Switch) => {
    return this.optionalSwitches.findIndex(cb => cb === swich) >= 0;
  }

  /**
   * Check if the optionalSwitch with specifc shortname exists
   * @param shortname 
   */
  public hasOptionalSwitchWithShortname = (shortname: string) => {
    return !!this._shortOptionalSwitches[shortname];
  }

  /**
   * Check if the optionalSwitch with specifc longname exists
   * @param longname 
   */
  public hasOptionalSwitchWithLongname = (longname: string) => {
    return !!this._longOptionalSwitches[longname];
  }

  /**
   * Get the path for the current PathItem
   * @param shortForm false for path with shortForm, true for longForm
   */
  public path = (shortForm: boolean) => {
    const stack = [];
    
    let current : PathItem = this;
    while (current && !current.isRootPathItem()) {
      stack.push(current.getUniqueName(shortForm));
      current = current.parentPathItem;
    }

    return PATH_ITEM_DELIMITER + stack.reverse().join(PATH_ITEM_DELIMITER);
  }

   /**
   * Get all branch DynamicPathItem names
   */
  public getBranchDynamicPathItemNames() {
    const output: Record<string, PathItem> = {};

    let current: PathItem = this;
    while (current) {
      const name = current.getDynamicPathItemName();

      if (name !== null) {
        output[name] = current;
      }

      current = current.getParentPathItem();
    }

    return output;
  }

  /**
   * Get all branch commonRequiredSwitch short and long names in a dictionary
   */
  public getInheritedCommonRequiredSwitchNames() {
    const output: Record<string, Switch> = {};

    let current: PathItem = this;
    while (current) {
      const commonSwitchNames = current.getCommonRequiredSwitchNames();
      const names = Object.keys(commonSwitchNames);

      for (let name of names) {
        output[name] = commonSwitchNames[name];
      }

      current = current.getParentPathItem();
    }

    return output;
  }

  /**
   * Get all branch commonOptionalSwitch short and long names in a dictionary
   */
  public getInheritedCommonOptionalSwitchNames() {
    const output: Record<string, Switch> = {};

    let current: PathItem = this;
    while (current) {
      const commonSwitchNames = current.getCommonOptionalSwitchNames();
      const names = Object.keys(commonSwitchNames);

      for (let name of names) {
        output[name] = commonSwitchNames[name];
      }

      current = current.getParentPathItem();
    }

    return output;
  }

  /**
   * Get all names that are disallowed to be used for DynamicPathItem.
   */
  public getDisAllowedDynamicPathItemNames = () => {
    return this.getBranchDynamicPathItemNames();
  }

  public toString = (shortForm: boolean = false) => {
    return treeToString(this, shortForm);
  }

}
