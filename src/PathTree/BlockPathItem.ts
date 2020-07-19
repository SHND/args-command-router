import { PathItem } from './PathItem';
import { Switch } from '../Switch';
import { StaticPathItem } from './StaticPathItem';
import { DynamicPathItem } from './DynamicPathItem';
import { SwitchPathItem } from './SwitchPathItem';

export abstract class BlockPathItem extends PathItem {

  protected name: string;
  protected staticPathItems: Record<string, StaticPathItem> = {};
  protected dynamicPathItem: DynamicPathItem;
  protected switchPathItems: Array<SwitchPathItem> = [];
  protected commonRequiredSwitches: Switch[] = [];
  protected commonOptionalSwitches: Switch[] = [];

  /**
   * name getter
   */
  public getName = () => {
    return this.name;
  }

  /**
   * name setter
   * @param {string} name
   */
  public setName = (name: string) => {
    this.name = name;
  }

  /**
   * staticPathItems getter
   */
  public getStaticPathItems = () => {
    return this.staticPathItems;
  }

  /**
   * staticPathItems getter
   */
  public getStaticPathItem = (name: string) => {
    if (!this.hasStaticPathItem(name)) {
      throw Error(`StaticPathItem with name "${name}" does not exist.`);
    }

    return this.staticPathItems[name];
  }

  /**
   * check if the staticPathItem with the specified name exist
   * @param name staticPathItem name
   */
  public hasStaticPathItem = (name: string) => {
    return this.staticPathItems.hasOwnProperty(name);
  }

  /**
   * Add staticPathItem
   * @param {StaticPathItem} staticPathItem to be added
   */
  public addStaticPathItem = (staticPathItem: StaticPathItem) => {
    this.staticPathItems[staticPathItem.getUniqueName(false)] = staticPathItem;
  }

  /**
   * Remove staticPathItem
   * @param {StaticPathItem} staticPathItem
   */
  public removeStaticPathItem = (staticPathItem: StaticPathItem) => {
    const name = staticPathItem.getUniqueName(false);

    if (this.hasStaticPathItem(name)) {
      delete this.staticPathItems[name];
    }
  }

  /**
   * dynamicPathItem getter
   */
  public getDynamicPathItem = () => {
    return this.dynamicPathItem;
  }

  /**
   * dynamicPathItem setter
   * @param {DynamicPathItem} dynamicPathItem
   */
  public setDynamicPathItem = (dynamicPathItem: DynamicPathItem) => {
    this.dynamicPathItem = dynamicPathItem;
  }

  /**
   * check if the dynamicPathItem is set
   */
  public hasDynamicPathItem = () => {
    return this.dynamicPathItem !== undefined
  }

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
    this.switchPathItems.push(switchPathItem);
  }

  /**
   * Remove switchPathItem
   * @param {SwitchPathItem} switchPathItem to be removed
   */
  public removeSwitchPathItem = (switchPathItem: SwitchPathItem) => {
    const index = this.switchPathItems.indexOf(switchPathItem);

    if (index < 0) {
      return;
    }

    this.switchPathItems.splice(index, 1);
  }

  /**
   * Get common required switch
   */
  public getCommonRequiredSwitches = () => {
    return this.commonRequiredSwitches;
  }

  /**
   * Add required switch
   * @param {Switch} switch to be added to required common switches
   */
  public addCommonRequiredSwitch = (swich: Switch) => {
    this.commonRequiredSwitches.push(swich);
  }

  /**
   * Remove required switch
   * @param {Switch} switch to be removed from required common switches
   */
  public removeCommonRequiredSwitch = (swich: Switch) => {
    const index = this.commonRequiredSwitches.indexOf(swich);

    if (index < 0) {
      return;
    }

    this.commonRequiredSwitches.splice(index, 1);
  }

  /**
   * Get common optional switch
   */
  public getCommonOptionalSwitches = () => {
    return this.commonOptionalSwitches;
  }

  /**
   * Add optional switch
   * @param {Switch} switch to be added to optional common switches
   */
  public addCommonOptionalSwitch = (swich: Switch) => {
    this.commonOptionalSwitches.push(swich);
  }

  /**
   * Remove optional switch
   * @param {Switch} switch to be removed from optional common switches
   */
  public removeCommonOptionalSwitch = (swich: Switch) => {
    const index = this.commonOptionalSwitches.indexOf(swich);

    if (index < 0) {
      return;
    }

    this.commonOptionalSwitches.splice(index, 1);
  }

}