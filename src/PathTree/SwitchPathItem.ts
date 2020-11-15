import { Switch } from "../Switch";
import { PathItem } from "./PathItem";
import { splitSwitchExpressions } from "../utility";
import { SwitchExpression } from "./SwitchExpression";
import { OPEN_SWITCH_EXPR_SYMBOL, CLOSE_SWITCH_EXPR_SYMBOL, PATH_ITEM_DELIMITER } from "../constants";

const commandLineUsage = require('command-line-usage');

export class SwitchPathItem extends PathItem {
  
  protected switchExpressions: SwitchExpression[] = [];

  constructor(switchExpressionStr: string, parent: PathItem) {
    super();
    
    this.parentPathItem = parent;
    this.description;
    this.callbacks = [];
    this.requiredSwitches = [];
    this.optionalSwitches = [];

    this.switchExpressions = SwitchPathItem.parse(switchExpressionStr);
  }

  /**
   * returns a unique name for this level
   * @param shortForm 
   */
  public getUniqueName = (shortForm: boolean = false) => {
    return this.switchExpressions.reduce((str, switchExpr) => `${str}${OPEN_SWITCH_EXPR_SYMBOL}${switchExpr.toString()}${CLOSE_SWITCH_EXPR_SYMBOL}`, '');
  };

  /**
   * Returns false because SwitchPathItem is not a RootPathItem
   * This is for avoiding circular dependency issue
   * @returns false
   */
  public isRootPathItem = () => false;

  /**
   * Getter for list of switch expressions
   */
  getSwitchExpressions = () => {
    return this.switchExpressions;
  }

  /**
   * Parse Switch Expression string e.g. [ab][cd=1]
   * @param switchExpressionStr to be parsed
   */
  private static parse(switchExpressionStr: string): SwitchExpression[] {
    const str = switchExpressionStr.trim();

    const expressionStrings = splitSwitchExpressions(str);
    
    let expressions: SwitchExpression[] = [];

    try {
      expressions = expressionStrings.map(expStr => new SwitchExpression(expStr));
    } catch(e) {
      throw Error(`SwitchExpressions in SwitchPathItems "" has problem. ${e}`)
    }
    
    if (expressions.find(expr => expr.getSwitchId().length === 0)) {
      throw Error(`SwitchExpressions in SwitchPathItems "${switchExpressionStr}" cannot have empty expression Id.`);
    }

    return expressions;
  }

  public getDynamicPathItemName: () => string | null = () => null;

  /**
   * Returns a dictionary of short and long common required switch names in the PathItem
   */
  public getCommonRequiredSwitchNames = () => ({});

  /**
   * Returns a dictionary of short and long common optional switch names in the PathItem
   */
  public getCommonOptionalSwitchNames = () => ({});

  /**
   * Returns a dictionary of short and long common switch names in the PathItem
   */
  public getCommonSwitchNames = () => ({});

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
