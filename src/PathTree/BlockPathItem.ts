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

  private _shortCommonRequiredSwitches: Record<string, Switch> = {};
  private _longCommonRequiredSwitches: Record<string, Switch> = {};
  private _shortCommonOptionalSwitches: Record<string, Switch> = {};
  private _longCommonOptionalSwitches: Record<string, Switch> = {};

  /**
   * Get a dictionary with all commonSwitch names for the current BlockPathItem
   */
  public getCommonSwitchNames = () => {
    const names: Record<string, boolean> = {};

    for (let swich of this.commonRequiredSwitches) {
      if (swich.hasShortname()) {
        names[swich.getShortname()] = true;
      }

      if (swich.hasLongname()) {
        names[swich.getLongname()] = true;
      }
    }

    for (let swich of this.commonOptionalSwitches) {
      if (swich.hasShortname()) {
        names[swich.getShortname()] = true;
      }

      if (swich.hasLongname()) {
        names[swich.getLongname()] = true;
      }
    }

    return names;
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
    staticPathItem.setParentPathItem(this);

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
    dynamicPathItem.setParentPathItem(this);

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
    switchPathItem.setParentPathItem(this);

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
   * Check if the commonRequiredSwitch with specifc shortname exists
   * @param shortname 
   */
  public hasCommonRequiredSwitchWithShortname = (shortname: string) => {
    return !!this._shortCommonRequiredSwitches[shortname];
  }

  /**
   * Check if the commonRequiredSwitch with specifc longname exists
   * @param longname 
   */
  public hasCommonRequiredSwitchWithLongname = (longname: string) => {
    return !!this._longCommonRequiredSwitches[longname];
  }

  /**
   * Add required switch
   * @param {Switch} switch to be added to required common switches
   */
  public addCommonRequiredSwitch = (swich: Switch) => {
    const dynamicNames = this.getDisAllowedSwitchNames();

    if (swich.hasShortname()) {
      const shortname = swich.getShortname();
      if (dynamicNames[shortname]) {
        throw Error(`Name "${shortname}" is already used. Use another name for the Common Required Switch shortname.`)
      }

      this._shortCommonRequiredSwitches[shortname] = swich;
    }

    if (swich.hasLongname()) {
      const longname = swich.getLongname();
      if (dynamicNames[longname]) {
        throw Error(`Name "${longname}" is already used. Use another name for the Common Required Switch longname.`)
      }

      this._longCommonRequiredSwitches[longname] = swich;
    }

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

    if (swich.hasShortname()) {
      delete this._shortCommonRequiredSwitches[swich.getShortname()];
    }

    if (swich.hasLongname()) {
      delete this._longCommonRequiredSwitches[swich.getLongname()];
    }
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
    const dynamicNames = this.getDisAllowedSwitchNames();

    if (swich.hasShortname()) {
      const shortname = swich.getShortname();
      if (dynamicNames[shortname]) {
        throw Error(`Name "${shortname}" is already used. Use another name for the Common Optional Switch shortname.`)
      }

      this._shortCommonOptionalSwitches[shortname] = swich;
    }

    if (swich.hasLongname()) {
      const longname = swich.getLongname();
      if (dynamicNames[longname]) {
        throw Error(`Name "${longname}" is already used. Use another name for the Common Optional Switch longname.`)
      }

      this._longCommonOptionalSwitches[longname] = swich;
    }

    this.commonOptionalSwitches.push(swich);
  }

  /**
   * Check if the commonOptionalSwitch with specifc shortname exists
   * @param shortname 
   */
  public hasCommonOptionalSwitchWithShortname = (shortname: string) => {
    return !!this._shortCommonOptionalSwitches[shortname];
  }

  /**
   * Check if the commonOptionalSwitch with specifc longname exists
   * @param longname 
   */
  public hasCommonOptionalSwitchWithLongname = (longname: string) => {
    return !!this._longCommonOptionalSwitches[longname];
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

    if (swich.hasShortname()) {
      delete this._shortCommonOptionalSwitches[swich.getShortname()];
    }

    if (swich.hasLongname()) {
      delete this._longCommonOptionalSwitches[swich.getLongname()];
    }
  }

}