import { Switch } from '../Switch';
import { PathItem } from './PathItem';
import { StaticPathItem } from './StaticPathItem';
import { SpreadPathItem } from './SpreadPathItem';
import { SwitchPathItem } from './SwitchPathItem';
import { PATH_ITEM_DELIMITER } from '../constants';
import { DynamicPathItem } from './DynamicPathItem';

const commandLineUsage = require('command-line-usage');

export abstract class BlockPathItem extends PathItem {

  protected name: string;
  protected staticPathItems: Record<string, StaticPathItem> = {};
  protected dynamicPathItem: DynamicPathItem;
  protected spreadPathItem: SpreadPathItem;
  protected switchPathItems: Array<SwitchPathItem> = [];
  protected commonRequiredSwitches: Switch[] = [];
  protected commonOptionalSwitches: Switch[] = [];

  private _shortCommonRequiredSwitches: Record<string, Switch> = {};
  private _longCommonRequiredSwitches: Record<string, Switch> = {};
  private _shortCommonOptionalSwitches: Record<string, Switch> = {};
  private _longCommonOptionalSwitches: Record<string, Switch> = {};

  /**
   * Returns a dictionary of short and long common required switch names in the PathItem
   */
  public getCommonRequiredSwitchNames = () => {
    const names: Record<string, Switch> = {};

    for (let swich of this.commonRequiredSwitches) {
      if (swich.hasShortname()) {
        names[swich.getShortname()] = swich;
      }

      if (swich.hasLongname()) {
        names[swich.getLongname()] = swich;
      }
    }

    return names;
  };

  /**
   * Returns a dictionary of short and long common optional switch names in the PathItem
   */
  public getCommonOptionalSwitchNames = () => {
    const names: Record<string, Switch> = {};

    for (let swich of this.commonOptionalSwitches) {
      if (swich.hasShortname()) {
        names[swich.getShortname()] = swich;
      }

      if (swich.hasLongname()) {
        names[swich.getLongname()] = swich;
      }
    }

    return names;
  };

  /**
   * Get a dictionary with all commonSwitch names for the current BlockPathItem
   */
  public getCommonSwitchNames = () => {
    return { 
      ...this.getCommonRequiredSwitchNames(), 
      ...this.getCommonOptionalSwitchNames()
    };
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
   * spreadPathItem getter
   */
  public getSpreadPathItem = () => {
    return this.spreadPathItem;
  }

  /**
   * spreadPathItem setter
   */
  public hasSpreadPathItem = () => {
    return this.spreadPathItem !== undefined;
  }

  /**
   * check if the spreadPathItem is set
   * @param {SpreadPathItem} spreadPathItem
   */
  public setSpreadPathItem = (spreadPathItem: SpreadPathItem) => {
    spreadPathItem.setParentPathItem(this);

    this.spreadPathItem = spreadPathItem;
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

    if (swich.hasShortname()) {
      this._shortCommonRequiredSwitches[swich.getShortname()] = swich;
    }

    if (swich.hasLongname()) {
      this._longCommonRequiredSwitches[swich.getLongname()] = swich;
    }
    
    this.commonRequiredSwitches.push(swich);
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

    if (swich.hasShortname()) {
      this._shortCommonOptionalSwitches[swich.getShortname()] = swich;
    }

    if (swich.hasLongname()) {
      this._longCommonOptionalSwitches[swich.getLongname()] = swich;
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
   * Display help for the current PathItem
   */
  public showHelp = (applicationName: string) => {
    const sections = [];
    
    sections.push({
      header: 'Name',
      content: applicationName + this.path(false).split(PATH_ITEM_DELIMITER).join(' ')
    });

    if (this.hasDescription()) {
      sections.push({
        header: 'Description',
        content: this.getDescription()
      });
    };

    const subPathItemNames = [];

    if (this.hasSpreadPathItem()) {
      subPathItemNames.push(
        applicationName +
        this
          .getSpreadPathItem()
          .path(false)
          .split(PATH_ITEM_DELIMITER)
          .join(' ')
      )
    }
    
    if (this.hasDynamicPathItem()) {
      subPathItemNames.push(
        applicationName +
        this
          .getDynamicPathItem()
          .path(false)
          .split(PATH_ITEM_DELIMITER)
          .join(' ')
      );
    }

    if (this.getSwitchPathItems().length > 0) {
      subPathItemNames.push(
        ...Object.values(this.getSwitchPathItems())
          .map(subPathItem => 
            subPathItem
              .path(false)
              .split(PATH_ITEM_DELIMITER).join(' ')
            )
      )
    }

    subPathItemNames.push(
      ...Object.values(this.getStaticPathItems())
        .map(subPathItem => 
          applicationName +
          subPathItem
            .path(false)
            .split(PATH_ITEM_DELIMITER)
            .join(' ')
        )
    )

    if (subPathItemNames.length > 0) {
      sections.push({
        header: 'SubCommands',
        content: subPathItemNames.map(name => ({ name }))
      })
    }

    const inheritedCommonRequiredSwitches: Record<string, Switch> = {};
    Object.values(this.getInheritedCommonRequiredSwitchNames()).forEach(swich => {
      const key = `${swich.getShortname()},${swich.getLongname()}`;
      if (!inheritedCommonRequiredSwitches[key]) {
        inheritedCommonRequiredSwitches[key] = swich;
      }
    });

    const inheritedCommonOptionalSwitches: Record<string, Switch> = {};
    Object.values(this.getInheritedCommonOptionalSwitchNames()).forEach(swich => {
      const key = `${swich.getShortname()},${swich.getLongname()}`;
      if (!inheritedCommonOptionalSwitches[key]) {
        inheritedCommonOptionalSwitches[key] = swich;
      }
    });

    const requiredSwitches = [
      ...this.getRequiredSwitches(),
      ...Object.values(inheritedCommonRequiredSwitches)
    ];

    const optionalSwitches = [
      ...this.getOptionalSwitches(),
      ...Object.values(inheritedCommonOptionalSwitches)
    ];

    const requiredDefinitions = [];
    requiredDefinitions.push(...requiredSwitches.map(swich => ({
      name: swich.getLongname(),
      alias: swich.getShortname(),
      description: swich.getDescription(),
      type: swich.getParameters().length === 0 ? Boolean : undefined,
      typeLabel: swich.getParameters().length > 0 && swich.getParameters().map(param => `{underline ${param}}`).join(' ')
    })));

    const optionalDefinitions = [];
    optionalDefinitions.push(...optionalSwitches.map(swich => ({
      name: swich.getLongname(),
      alias: swich.getShortname(),
      description: swich.getDescription(),
      type: swich.getParameters().length === 0 ? Boolean : undefined,
      typeLabel: swich.getParameters().length > 0 && swich.getParameters().map(param => `{underline ${param}}`).join(' ')
    })));

    if (requiredDefinitions.length > 0) {
      sections.push({
        header: 'Required Options',
        optionList: requiredDefinitions,
      });
    }

    if (optionalDefinitions.length > 0) {
      sections.push({
        header: 'Optional Options',
        optionList: optionalDefinitions,
      });
    }

    console.log(commandLineUsage(sections));
  };

}