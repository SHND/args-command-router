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

  public abstract getUniqueName: (shortForm: boolean) => string;

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
   * Add callback
   * @param {Function} callback to be added
   */
  public addCallback = (callback: Function) => {
    this.callbacks.push(callback);
  }

  /**
   * Remove callback
   * @param {Funciton} callback to be removed
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
   * Add requiredSwitch
   * @param {Switch} swich to be added
   */
  public addRequireSwitch = (swich: Switch) => {
    this.requiredSwitches.push(swich);
  }

  /**
   * Remove requireSwitch
   * TODO: implement this
   */
  public removeRequireSwitch = () => {}

  /**
   * Add optionalSwitch
   * @param {Switch} swich to be added
   */
  public addOptionalSwitch = (swich: Switch) => {
    this.optionalSwitches.push(swich);
  }

  /**
   * Remove optionalSwitch
   * TODO: implement this
   */
  public removeOptionalSwitch = () => {}

  /**
   * Get the path for the current PathItem
   * @param shortForm false for path with shortForm, true for longForm
   */
  public path = (shortForm: boolean) => {
    const stack = [];
    
    let current : PathItem = this;
    while (!(current instanceof RootPathItem)) {
      stack.push(current.getUniqueName(shortForm));
      current = current.parentPathItem;
    }

    return PATH_ITEM_DELIMITER + stack.reverse().join(PATH_ITEM_DELIMITER);
  }

}
