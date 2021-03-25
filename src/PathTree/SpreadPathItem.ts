import { Switch } from "../Switch";
import { PathItem } from "./PathItem";
import { SwitchPathItem } from "./SwitchPathItem";
import { PATH_ITEM_DELIMITER } from "../constants";

const commandLineUsage = require('command-line-usage');

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
