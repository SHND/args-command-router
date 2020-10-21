import { PathItem } from './PathItem';
import { Switch } from '../Switch';
import { StaticPathItem } from './StaticPathItem';
import { DynamicPathItem } from './DynamicPathItem';
import { SwitchPathItem } from './SwitchPathItem';
import { PATH_ITEM_DELIMITER } from '../constants';

const commandLineUsage = require('command-line-usage');

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

  private downwardCommonRequiredSwitches: Switch[] = [];
  private downwardCommonOptionalSwitches: Switch[] = [];

  private _downwardShortCommonRequiredSwitches: Record<string, Switch> = {};
  private _downwardLongCommonRequiredSwitches: Record<string, Switch> = {};
  private _downwardShortCommonOptionalSwitches: Record<string, Switch> = {};
  private _downwardLongCommonOptionalSwitches: Record<string, Switch> = {};

  /**
   * Add the common required switch to the 
   * current pathItem and update (inform) all 
   * the parent pathItems with this change, so 
   * now all the parent know that this common switch 
   * already exist somewhere in the children.
   * @param swich that the current and parents should be aware of
   */
  public addDownwardCommonRequiredSwitchesAndUpdateParents = (swich: Switch) => {
    let current: PathItem = this;
    while (current) {
      if (!(current instanceof BlockPathItem)) {
        break;
      }

      if (swich.hasShortname()) {
        const name = swich.getShortname();
        if (current._downwardShortCommonRequiredSwitches[name] || current._downwardShortCommonOptionalSwitches[name]) {
          throw Error(`Switch name "${name}" is already used in the subtree of pathItem "${current.path(false)}".`)
        }
  
        current._downwardShortCommonRequiredSwitches[name] = swich;
      }
  
      if (swich.hasLongname()) {
        const name = swich.getLongname();
        if (current._downwardLongCommonRequiredSwitches[name] || current._downwardLongCommonOptionalSwitches[name]) {
          throw Error(`Switch name "${name}" is already used in the subtree of pathItem "${current.path(false)}".`)
        }
  
        current._downwardLongCommonRequiredSwitches[swich.getLongname()] = swich;
      }
  
      current.downwardCommonRequiredSwitches.push(swich);
      current = current.parentPathItem;
    }
  }

  public getDownwardCommonRequiredSwitches = () => this.downwardCommonRequiredSwitches;
  public getDownwardShortCommonRequiredSwitches = () => this._downwardShortCommonRequiredSwitches;
  public getDownwardLongCommonRequiredSwitches = () => this._downwardLongCommonRequiredSwitches;

  /**
   * Add the common optional switch to the 
   * current pathItem and update (inform) all 
   * the parent pathItems with this change, so 
   * now all the parent know that this common switch 
   * already exist somewhere in the children.
   * @param swich that the current and parents should be aware of
   */
  public addDownwardCommonOptionalSwitchesAndUpdateParents = (swich: Switch) => {
    let current: PathItem = this;
    while(current) {
      if (!(current instanceof BlockPathItem)) {
        break;
      }

      if (swich.hasShortname()) {
        const name = swich.getShortname();
        if (current._downwardShortCommonOptionalSwitches[name] || current._downwardShortCommonRequiredSwitches[name]) {
          throw Error(`Switch name "${name}" is already used in the subtree of pathItem "${current.path(false)}".`)
        }
  
        current._downwardShortCommonOptionalSwitches[name] = swich;
      }
  
      if (swich.hasLongname()) {
        const name = swich.getLongname();
        if (current._downwardLongCommonOptionalSwitches[name] || current._downwardLongCommonRequiredSwitches[name]) {
          throw Error(`Switch name "${name}" is already used in the subtree of pathItem "${current.path(false)}".`)
        }
  
        current._downwardLongCommonOptionalSwitches[swich.getLongname()] = swich;
      }
  
      current.downwardCommonOptionalSwitches.push(swich);
      current = current.parentPathItem;
    }
  }

  public getDownwardCommonOptionalSwitches = () => this.downwardCommonOptionalSwitches;
  public getDownwardShortCommonOptionalSwitches = () => this._downwardShortCommonOptionalSwitches;
  public getDownwardLongCommonOptionalSwitches = () => this._downwardLongCommonOptionalSwitches;

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
    const disAllowedSwitchNames = this.getDisAllowedSwitchNames();
    if (swich.hasShortname()) {
      const name = swich.getShortname();
      if (disAllowedSwitchNames[name]) {
        throw Error(`Name "${name}" is already used. Use another name for the Common Required Switch shortname.`);
      }

      this._shortCommonRequiredSwitches[name] = swich;
    }

    if (swich.hasLongname()) {
      const name = swich.getLongname();
      if (disAllowedSwitchNames[name]) {
        throw Error(`Name "${name}" is already used. Use another name for the Common Required Switch longname.`);
      }

      this._longCommonRequiredSwitches[name] = swich;
    }
   
    const parent = this.getParentPathItem();
    if (parent && parent instanceof BlockPathItem) {
      parent.addDownwardCommonRequiredSwitchesAndUpdateParents(swich);
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
    const disAllowedSwitchNames = this.getDisAllowedSwitchNames();

    if (swich.hasShortname()) {
      const shortname = swich.getShortname();
      if (disAllowedSwitchNames[shortname]) {
        throw Error(`Name "${shortname}" is already used. Use another name for the Common Optional Switch shortname.`)
      }

      this._shortCommonOptionalSwitches[shortname] = swich;
    }

    if (swich.hasLongname()) {
      const longname = swich.getLongname();
      if (disAllowedSwitchNames[longname]) {
        throw Error(`Name "${longname}" is already used. Use another name for the Common Optional Switch longname.`)
      }

      this._longCommonOptionalSwitches[longname] = swich;
    }

    const parent = this.getParentPathItem();
    if (parent && parent instanceof BlockPathItem) {
      parent.addDownwardCommonOptionalSwitchesAndUpdateParents(swich);
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
   * Get a dictionary of all Common Switch names 
   * (optional and required) in children pathItems 
   * in a form of string => boolean lookup table. Notice 
   * that this method won't include the current pathItem commonSwitch names.
   */
  public getDownwardCommonSwitchNames = () => {
    const switches = {
      ...this._downwardShortCommonRequiredSwitches,
      ...this._downwardLongCommonRequiredSwitches,
      ...this._downwardShortCommonOptionalSwitches,
      ...this._downwardLongCommonOptionalSwitches
    }

    return Object.keys(switches).reduce((acc: Record<string, Switch>, cur) => {
      acc[cur] = switches[cur];
      return acc;
    }, {});
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

    if (subPathItemNames.length > 0) {
      sections.push({
        header: 'SubCommands',
        content: subPathItemNames.map(name => ({ name }))
      })
    }

    const upwardCommonRequiredSwitches: Record<string, Switch> = {};
    Object.values(this.getUpwardCommonRequiredSwitchNames()).forEach(swich => {
      const key = `${swich.getShortname()},${swich.getLongname()}`;
      if (!upwardCommonRequiredSwitches[key]) {
        upwardCommonRequiredSwitches[key] = swich;
      }
    });

    const upwardCommonOptionalSwitches: Record<string, Switch> = {};
    Object.values(this.getUpwardCommonOptionalSwitchNames()).forEach(swich => {
      const key = `${swich.getShortname()},${swich.getLongname()}`;
      if (!upwardCommonOptionalSwitches[key]) {
        upwardCommonOptionalSwitches[key] = swich;
      }
    });

    const requiredSwitches = [
      ...this.getRequiredSwitches(),
      ...Object.values(upwardCommonRequiredSwitches)
    ];

    const optionalSwitches = [
      ...this.getOptionalSwitches(),
      ...Object.values(upwardCommonOptionalSwitches)
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