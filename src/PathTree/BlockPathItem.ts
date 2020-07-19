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
  protected commonSwitches: {
    requiredSwitches: Switch[],
    optionalSwitches: Switch[]
  } = {
    requiredSwitches: [],
    optionalSwitches: []
  }

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
    return this.staticPathItems[name];
  }

  /**
   * check if the staticPathItem with the specified name exist
   * @param name staticPathItem name
   */
  public hasStaticPathItem = (name: string) => {
    return this.staticPathItems[name] !== undefined;
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

    if (this.staticPathItems[name]) {
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
   * Add required switch
   * @param {Switch} switch to be added to required common switches
   */
  public addCommonRequiredSwitch = (swich: Switch) => {
    this.commonSwitches.requiredSwitches.push(swich);
  }

  /**
   * Remove required switch
   * @param {Switch} switch to be removed from required common switches
   */
  public removeCommonRequiredSwitch = (swich: Switch) => {
    const index = this.commonSwitches.requiredSwitches.indexOf(swich);

    if (index < 0) {
      return;
    }

    this.commonSwitches.requiredSwitches.splice(index, 1);
  }

  /**
   * Add optional switch
   * @param {Switch} switch to be added to optional common switches
   */
  public addCommonOptionalSwitch = (swich: Switch) => {
    this.commonSwitches.optionalSwitches.push(swich);
  }

  /**
   * Remove optional switch
   * @param {Switch} switch to be removed from optional common switches
   */
  public removeCommonOptionalSwitch = (swich: Switch) => {
    const index = this.commonSwitches.optionalSwitches.indexOf(swich);

    if (index < 0) {
      return;
    }

    this.commonSwitches.optionalSwitches.splice(index, 1);
  }

}