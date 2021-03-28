import { PathItem } from "./PathItem";
import { BlockPathItem } from "./BlockPathItem";


export class StaticPathItem extends BlockPathItem {

  private _aliases: Record<string, boolean> = {};
  
  constructor(name: string, parent: PathItem) {
    super();
    
    this.parentPathItem = parent;
    this.description;
    this.callbacks = [];
    this.requiredSwitches = [];
    this.optionalSwitches = [];
    
    this.name = name;
    this.staticPathItems = {};
    this.dynamicPathItem;
    this.switchPathItems = [];
    this.commonRequiredSwitches = [];
    this.commonOptionalSwitches = [];
  }
  
  /**
   * returns a unique name for this level
   * e.g. "something"
   * @param shortForm 
   */
  public getUniqueName = (shortForm: boolean = false) => {
    return this.name;
  };

  /**
   * Returns false because StaticPathItem is not a RootPathItem
   * This is for avoiding circular dependency issue
   * @returns false
   */
  public isRootPathItem = () => false;
  
  /**
   * Returns the pathItem name if it is a dynamicPathItem or null if it is not
   */
  public getDynamicPathItemName: () => string | null = () => null;

  /**
   * Add alias to current StaticPathItem
   * @param alias to add
   */
  public addAlias = (alias: string) => {
    if (alias !== alias.trim()) {
      throw Error(`An alias "${alias}" cannot start or end with spaces`);
    }

    if (this.getName() === alias) {
      return
    }

    this._aliases[alias] = true;
  }

  /**
   * Check if current StaticPathItem has the alias
   * @param alias to check
   * @returns if the alias exist or not
   */
  public hasAlias = (alias: string): boolean => {
    return this._aliases[alias] !== undefined;
  }

  /**
   * Get aliases
   * @returns aliases
   */
  public getAliases = () => this._aliases;

}
