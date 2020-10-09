import { Switch } from "../Switch";
import { PATH_ITEM_DELIMITER } from "../constants";

export abstract class PathItem {

  protected parentPathItem: PathItem;
  protected description: string;
  protected callbacks: Function[] = [];
  protected helpCallback: Function;
  protected requiredSwitches: Switch[] = [];
  protected optionalSwitches: Switch[] = [];

  private _shortRequiredSwitches: Record<string, Switch> = {};
  private _longRequiredSwitches: Record<string, Switch> = {};
  private _shortOptionalSwitches: Record<string, Switch> = {};
  private _longOptionalSwitches: Record<string, Switch> = {};

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
   * Returns a dictionary of short and long common switch names in the PathItem
   */
  public abstract getCommonSwitchNames: () => Record<string, boolean>;

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
   * @param callback 
   */
  public hasCallback = (callback: Function) => {
    return this.callbacks.findIndex(cb => cb === callback) >= 0;
  }

  /**
   * Add callback
   * @param {Function} callback to be added
   */
  public addCallback = (callback: Function) => {
    if (!this.hasCallback(callback)) {
      this.callbacks.push(callback);
    }
  }

  /**
   * helpCallback getter
   */
  public getHelpCallback = () => {
    return this.helpCallback;
  }

  /**
   * helpCallback setter
   * @param {Function} callback to be added
   */
  public setHelpCallback = (callback: Function) => {
    this.helpCallback = callback;
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
    const dynamicNames = this.getDisAllowedSwitchNames();

    if (swich.hasShortname()) {
      const shortname = swich.getShortname();
      if (dynamicNames[shortname]) {
        throw Error(`Name "${shortname}" is already used. Use another name for the Required Switch shortname.`)
      }

      this._shortRequiredSwitches[shortname] = swich;
    }
 
    if (swich.hasLongname()) {
      const longname = swich.getLongname();
      if (dynamicNames[longname]) {
        throw Error(`Name "${longname}" is already used. Use another name for the Required Switch longname.`)
      }

      this._longRequiredSwitches[longname] = swich;
    }

    this.requiredSwitches.push(swich);
  }

  /**
   * Add optionalSwitch
   * @param {Switch} swich to be added
   */
  public addOptionalSwitch = (swich: Switch) => {
    const dynamicNames = this.getDisAllowedSwitchNames();

    if (swich.hasShortname()) {
      const shortname = swich.getShortname();
      if (dynamicNames[shortname]) {
        throw Error(`Name "${shortname}" is already used. Use another name for the Optional Switch shortname.`)
      }

      this._shortOptionalSwitches[shortname] = swich;
    }
 
    if (swich.hasLongname()) {
      const longname = swich.getLongname();
      if (dynamicNames[longname]) {
        throw Error(`Name "${longname}" is already used. Use another name for the Optional Switch longname.`)
      }

      this._longOptionalSwitches[longname] = swich;
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
    const output: Record<string, boolean> = {};

    let current: PathItem = this;
    while (current) {
      const name = current.getDynamicPathItemName();

      if (name !== null) {
        output[name] = true;
      }

      current = current.getParentPathItem();
    }

    return output;
  }

  /**
   * Get all branch commonSwitch short and long names in a dictionary
   */
  public getUpwardCommonSwitchNames() {
    const output: Record<string, boolean> = {};

    let current: PathItem = this;
    while (current) {
      const names = Object.keys(current.getCommonSwitchNames());

      for (let name of names) {
        output[name] = true;;
      }

      current = current.getParentPathItem();
    }

    return output;
  }

  public abstract getDownwardCommonSwitchNames: () => Record<string, boolean>;

  /**
   * Get all names that are disallowed to be used for DynamicPathItem.
   */
  public getDisAllowedDynamicPathItemNames = () => {
    return this.getBranchDynamicPathItemNames();
  }

  /**
   * Get all names that are disallowed to be used for switch names
   */
  public getDisAllowedSwitchNames = () => {
    const commonSwitchNames = { ...this.getUpwardCommonSwitchNames(), ...this.getDownwardCommonSwitchNames() };
    
    Object.keys(this._shortRequiredSwitches).forEach(name => commonSwitchNames[name] = true);
    Object.keys(this._shortOptionalSwitches).forEach(name => commonSwitchNames[name] = true);
    Object.keys(this._longRequiredSwitches).forEach(name => commonSwitchNames[name] = true);
    Object.keys(this._longOptionalSwitches).forEach(name => commonSwitchNames[name] = true);

    return commonSwitchNames;
  }

}
