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

  public getUniqueName = (shortForm?: boolean) => {
    if (shortForm) {
      return this.name;
    }

    return `...${this.name}`;
  }

  public isRootPathItem: () => boolean = () => false;

  public getDynamicPathItemName: () => string | null = () => null;

  public getCommonRequiredSwitchNames: () => Record<string, Switch> = () => ({});

  public getCommonOptionalSwitchNames: () => Record<string, Switch> = () => ({});

  public getCommonSwitchNames: () => Record<string, Switch> = () => ({});

  public getDownwardCommonSwitchNames: () => Record<string, Switch> = () => ({});

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
  
}
