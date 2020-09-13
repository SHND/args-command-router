import { Switch } from "../Switch";
import { PATH_ITEM_DELIMITER } from "../constants";
import { RootPathItem } from "./RootPathItem";

export abstract class PathItem {

  protected parentPathItem: PathItem;
  protected description: string;
  protected callbacks: Function[] = [];
  protected helpCallback: Function;
  protected requiredSwitches: Array<Switch> = []
  protected optionalSwitches: Array<Switch> = []

  public abstract getUniqueName: (shortForm?: boolean) => string;

  /**
   * Returns if the PathItem is a RootPathItem
   * This is for avoiding circular dependency issue
   */
  public abstract isRootPathItem: () => boolean;

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
   * Remove callback
   * @param {Function} callback to be removed
   */
  public removeCallback = (callback: Function) => {
    const index = this.callbacks.indexOf(callback);

    if (index < 0) {
      return;
    }

    this.callbacks.splice(index, 1);
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
   * Add requiredSwitch
   * @param {Switch} swich to be added
   */
  public addRequiredSwitch = (swich: Switch) => {
    if (!this.hasRequiredSwitch(swich)) {
      this.requiredSwitches.push(swich);      
    }
  }

  /**
   * Remove requireSwitch
   * @param {Switch} swich to be removed
   */
  public removeRequiredSwitch = (swich: Switch) => {
    const index = this.requiredSwitches.indexOf(swich);

    if (index < 0) {
      return;
    }

    this.requiredSwitches.splice(index, 1);
  }

  /**
   * Add optionalSwitch
   * @param {Switch} swich to be added
   */
  public addOptionalSwitch = (swich: Switch) => {
    if (!this.hasOptionalSwitch(swich)) {
      this.optionalSwitches.push(swich);
    }
  }

  /**
   * Remove optionalSwitch
   * @param {Switch} swich to be removed
   */
  public removeOptionalSwitch = (swich: Switch) => {
    const index = this.optionalSwitches.indexOf(swich);

    if (index < 0) {
      return;
    }

    this.optionalSwitches.splice(index, 1);
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

}
