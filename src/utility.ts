import { Switch } from "./Switch";
import { PathTree } from "./PathTree/PathTree";
import { PathItem } from "./PathTree/PathItem";
import { RootPathItem } from "./PathTree/RootPathItem";
import { BlockPathItem } from "./PathTree/BlockPathItem";
import { StaticPathItem } from "./PathTree/StaticPathItem";
import { SpreadPathItem } from "./PathTree/SpreadPathItem";
import { SwitchPathItem } from "./PathTree/SwitchPathItem";
import { DynamicPathItem } from "./PathTree/DynamicPathItem";
import { Callback, CallbackContext, CallbackReturnType, Config, ExternalArgsType } from "./types";
import { PATH_ITEM_DELIMITER, DYNAMIC_PATH_PREFIX, OPEN_SWITCH_EXPR_SYMBOL, CLOSE_SWITCH_EXPR_SYMBOL, SINGLE_QUOTE_LITERAL, DOUBLE_QUOTE_LITERAL, STOP, SPREAD_PATH_PREFIX } from "./constants";

/**
 * Empty (no-operation) function
 */
export const noop = function() {};

/**
 * Returns array of keys set on the object
 * @param obj Object
 */
export function objectKeys(obj: Object) {
  return Object.keys(obj);
}

/**
 * Check if passed string has whitespaces like space, tab, ...
 * @param str string to check
 */
export function hasWhiteSpace(str: string) {
  return /\s/g.test(str);
}

/**
 * Check if any of the characters specified exist in the string
 * @param str to check
 * @param chars Array of characters to check
 */
export function hasAnyOfChars(str: string, chars: string[]) {
  let hashTable: Record<string, boolean> = chars.reduce((table: Record<string, boolean>, c: string) => {
    if (c.length !== 1) {
      throw Error('hasAnyOfChars only accepts array of strings of length 1 (Characters).')
    }

    table[c] = true;
    return table;
  }, {})

  for (let c of str) {
    if (hashTable[c]) {
      return true;
    }
  }

  return false;
}

/**
 * Split the path string to BlockPathItem part and SwitchPathItem part
 * @param pathStr route to be splitted
 * @returns {[string, string]} tuple with first pathItems without pathItemSwitch, second pathItemSwitch
 */
export function splitFromSwitchPathItem(pathStr: string): [string, string] {

  const indexOfOpenSwitchSymbol = pathStr.indexOf(OPEN_SWITCH_EXPR_SYMBOL);

  if (indexOfOpenSwitchSymbol < 0) {
    return [pathStr, ''];
  }

  return [pathStr.substring(0, indexOfOpenSwitchSymbol), pathStr.substring(indexOfOpenSwitchSymbol)];
}

export function splitSwitchExpressions(switchExpressions: string) {
  const expressions = switchExpressions.trim();
  const expressionsArr = [];
  let isSingleQuoteLiteral = false;
  let isDoubleQuoteLiteral = false;
  let isInBrackets = false;
  let currentExpression = '';
  for (let c of expressions) {

    if (c === SINGLE_QUOTE_LITERAL && !isDoubleQuoteLiteral) {
      isSingleQuoteLiteral = !isSingleQuoteLiteral;
      currentExpression += c;
    } else if (c === DOUBLE_QUOTE_LITERAL && !isSingleQuoteLiteral) {
      isDoubleQuoteLiteral = !isDoubleQuoteLiteral;
      currentExpression += c;
    } else if (isSingleQuoteLiteral || isDoubleQuoteLiteral) {
      currentExpression += c;
      continue;
    } else if (c === OPEN_SWITCH_EXPR_SYMBOL) {
      if (!isInBrackets) {
        currentExpression = '';
        isInBrackets = true;
      } else {
        currentExpression += c;
      }
    } else if (c === CLOSE_SWITCH_EXPR_SYMBOL) {
      expressionsArr.push(currentExpression);

      if (isInBrackets) {
        currentExpression = '';
        isInBrackets = false;
      } else {
        throw Error(`Invalid Switch Expression "${expressions}".`);
      }
    } else {
      if (isInBrackets) {
        currentExpression += c;
      } else {
        if (!hasWhiteSpace(c)) {
          throw Error(`Invalid Switch Expression "${expressions}".`)
        }
      }
    }

  }

  return expressionsArr;
}

/**
 * Parse an string and return an array of PathItems
 * TODO: Add Expression Routes
 * @param {string} pathStr to be parsed (route string)
 * @returns {PathItem[]} pathItems objects from pathStr
 */
export function parsePath(pathStr: string): PathItem[] {
  const output = [];
  let path = pathStr.trim();

  // if path starts with '/' remove it
  if (path.startsWith(PATH_ITEM_DELIMITER)) {
    path = path.substring(1);
  }

  let [pathItemsPart, switchPathItemPart] = splitFromSwitchPathItem(path);
  let pathItemsStr = pathItemsPart.split(PATH_ITEM_DELIMITER);

  const newRoot: BlockPathItem = new RootPathItem();
  let parent: PathItem = newRoot;

  if (
    (pathItemsStr.length > 1) || 
    (pathItemsStr.length === 1 && pathItemsStr[0].trim() !== '')) 
  {

    // iterate over all pathItems before switchExpression
    for (let i=0; i<pathItemsStr.length; i++) {
      const pathItemStr = pathItemsStr[i].trim();

      if (pathItemStr === '' || hasWhiteSpace(pathItemStr)) {
        throw Error(`The path "${pathStr}" contains whitespace in pathItem(${pathItemsStr[i]}).`);
      }

      let pathItem;

      // Dynamic PathItem
      if (pathItemStr.startsWith(DYNAMIC_PATH_PREFIX)) {
        pathItem = new DynamicPathItem(pathItemStr.substring(DYNAMIC_PATH_PREFIX.length), parent);
        parent instanceof BlockPathItem && parent.setDynamicPathItem(pathItem);
      } 
      // Spread PathItem
      else if (pathItemStr.startsWith(SPREAD_PATH_PREFIX)) {
        pathItem = new SpreadPathItem(pathItemStr.substring(SPREAD_PATH_PREFIX.length), parent);
        parent instanceof BlockPathItem && parent.setSpreadPathItem(pathItem);
      }
      // Static PathItem
      else {
        pathItem = new StaticPathItem(pathItemStr, parent);
        parent instanceof BlockPathItem && parent.addStaticPathItem(pathItem);
      }

      // Add to output
      output.push(pathItem);

      if (pathItem instanceof SpreadPathItem && i !== pathItemsStr.length-1) {
        throw Error(`The path "${pathStr}" contains spread pathItem "${pathItem.getUniqueName(true)}" not at the end.`);
      }

      // parent is the created pathItem
      parent = pathItem;
    }

  }

  // now that pathItems before switchExpression is parse it's time for switchExpression
  if (switchPathItemPart.trim() !== '') {
    const switchPathItem = new SwitchPathItem(switchPathItemPart, parent);
    output.push(switchPathItem);
  }

  return output;
}

/**
 * Find the actual passed values (Commands) with the PathItems in the tree
 * and return the matched BlockPathItem or SpreadPathItem or null.
 * @param commands which are actual values passed as BlockPathItem in run time
 * @param node which is a starting point in PathItem as tree to find the match
 */
export function matchCommands(commands: string[], node: BlockPathItem): BlockPathItem | SpreadPathItem {
  let lastBlockPathItem: BlockPathItem | SpreadPathItem = node;
  if (commands.length > commands.length) {
    return null;
  }

  for (let command of commands) {
    if (lastBlockPathItem instanceof BlockPathItem && lastBlockPathItem.hasStaticPathItem(command)) {
      lastBlockPathItem = lastBlockPathItem.getStaticPathItem(command);
    } else if (lastBlockPathItem instanceof BlockPathItem && lastBlockPathItem.hasDynamicPathItem()) {
      lastBlockPathItem = lastBlockPathItem.getDynamicPathItem();
    } else if (lastBlockPathItem instanceof BlockPathItem && lastBlockPathItem.hasSpreadPathItem()) {
      lastBlockPathItem = lastBlockPathItem.getSpreadPathItem();
      break;
    } else {
      return null;
    }
  }

  return lastBlockPathItem;
}

/**
 * Collect Dynamic PathItems and create a dictionary of DynamicPathItem name and command value
 * @param commands which are actual values passed as BlockPathItem in run time
 * @param node which is a starting point in PathItem as tree to find the match
 * @throws when a match for commands is not found in the node tree
 */
export function matchCommandsGetPathParameters(commands: string[], node: BlockPathItem): Record<string, string | string[]> {
  let output: Record<string, string | string[]> = {};
  let lastBlockPathItem: BlockPathItem = node;
  if (commands.length > commands.length) {
    throw Error(`Failed to match commands "${commands}" and node tree`)
  }

  for (let i=0; i<commands.length; i++) {
    const command = commands[i];

    if (lastBlockPathItem.hasStaticPathItem(command)) {
      lastBlockPathItem = lastBlockPathItem.getStaticPathItem(command);
    } else if (lastBlockPathItem.hasDynamicPathItem()) {
      lastBlockPathItem = lastBlockPathItem.getDynamicPathItem();

      output[lastBlockPathItem.getUniqueName(true)] = command;
    } else if (lastBlockPathItem.hasSpreadPathItem()) {
      const spreadPathItem = lastBlockPathItem.getSpreadPathItem();

      output[spreadPathItem.getUniqueName(true)] = commands.slice(i);

      return output;
    } else {
      throw Error(`Failed to match commands and node tree on command "${command}" of commands "${commands}"`);
    }
  }

  return output;
}

/**
 * Find the actual swiches passed with SwitchPathItems on the node 
 * and return the matched SwitchPathItem or null.
 * @param shortSwitches passed in runtime
 * @param longSwitches passed in runtime
 * @param node which is a starting point in PathItem as tree to find the match
 */
export function matchSwitches(
  shortSwithes: Record<string, string[]>, 
  longSwitches: Record<string, string[]>, 
  node: BlockPathItem | SpreadPathItem
): SwitchPathItem {
  const switchPathItems = node.getSwitchPathItems();

  if (objectKeys(shortSwithes).length === 0 && objectKeys(longSwitches).length === 0) {
    return null;
  }

  outerLoop:
  for (let switchPathItem of switchPathItems) {
    const switchExpressions = switchPathItem.getSwitchExpressions();

    if (objectKeys(shortSwithes).length + objectKeys(longSwitches).length < switchExpressions.length) {
      continue outerLoop;
    }

    let switches = {...shortSwithes, ...longSwitches};

    for (let switchExpr of switchExpressions) {
      const switchExprId = switchExpr.getSwitchId()
      const switchExprValue = switchExpr.getSwitchValue()

      if (!switches.hasOwnProperty(switchExprId)) {
        continue outerLoop;
      }

      const passedValues = switches[switchExprId];

      if (switchExpr.isValuedSwitch() && (passedValues.length < 1 || passedValues[0] !== switchExpr.getSwitchValue())) {
        continue outerLoop;
      } else {
        delete switches[switchExprId];
      }
    }

    return switchPathItem;
  }
  
  return null;
}

/**
 * Calling callbacks and return the partial context.
 * The callbacks can be any before, after, noRoute, help or main callbacks.
 * @param targetPathItem which the callbacks are being run in their context
 * @param forwardedPartialContext Partial context which is being passed through the callbacks
 * @param args args-command-parser parsed arguments
 * @param pathParameters Dictionary of dynamic pathItem names and their real values
 * @param callbacks to be run
 */
export function processCallbacks(targetPathItem: PathItem, forwardedContext: CallbackContext, args: ExternalArgsType, pathParameters: Record<string, string | string[]>, config: Config, tree: PathTree, callbacks: Callback[]): CallbackReturnType {
  
  let context = { ...forwardedContext };

  for (let callback of callbacks) {
    const output = callback.call(targetPathItem, {
      commands: args.commands,
      pathParams: pathParameters,
      shortSwitches: args.shortSwitches,
      longSwitches: args.longSwitches,
      switches: { ...args.shortSwitches, ...args.longSwitches },
      context
    }, config, tree);

    if (output === undefined) {
      // continue with previous forwardedContext
    } else if (typeof output === 'string' && output === STOP) {
      return STOP;
    } else if (typeof output === 'object') {
      context = { ...context, ...output };
    } else {
      throw Error('Callbacks can only return simple objects, string "stop" or not returning anything at all.');
    }
  }

  return context;
}

/**
 * Verify if the passed Switches are matched with defined switches on the pathItem
 * @param pathItem for the passed switches to be verified by
 * @param argsShortSwitches passed short switches
 * @param argsLongSwitches passed long switches
 * @returns {void}
 */
export function matchRuntimeAndDefinedSwitches(pathItem: PathItem, argsShortSwitches: Record<string, string[]>, argsLongSwitches: Record<string, string[]>, config: Config) {

  /*********************************************************************
   * Check if helpType is switch and help switch exists                *
   *********************************************************************/

  if (config.helpType === 'switch') {
    if (argsShortSwitches[config.helpShortSwitch] || argsLongSwitches[config.helpLongSwitch]) {
      return;
    }
  }

  /*********************************************************************
   * Prepare required swiches lookup table for short and long switches *
   *********************************************************************/

  const inheritedRequiredCommonSwitches = pathItem.getInheritedCommonRequiredSwitchNames();
  const pathItemRequiredSwitches = pathItem.getRequiredSwitches().reduce((dict: Record<string, Switch>, swich: Switch) => {
    dict[swich.getShortname()] = swich;
    dict[swich.getLongname()] = swich;

    return dict;
  }, {});

  const allRequired = { ...inheritedRequiredCommonSwitches, ...pathItemRequiredSwitches };
  const requiredShort = Object.values(allRequired).reduce((dict: Record<string, Switch>, swich: Switch) => {
    if (swich.hasShortname()) {
      dict[swich.getShortname()] = swich;
    }
    
    return dict;
  }, {});
  const requiredLong = Object.values(allRequired).reduce((dict: Record<string, Switch>, swich: Switch) => {
    if (swich.hasLongname()) {
      dict[swich.getLongname()] = swich;
    }
    
    return dict;
  }, {});

  /*********************************************************************
   * Prepare optional swiches lookup table for short and long switches *
   *********************************************************************/

  const inheritedOptionalCommonSwitches = pathItem.getInheritedCommonOptionalSwitchNames();
  const pathItemOptionalSwitches = pathItem.getOptionalSwitches().reduce((dict: Record<string, Switch>, swich: Switch) => {
    dict[swich.getShortname()] = swich;
    dict[swich.getLongname()] = swich;

    return dict;
  }, {});

  const allOptional = { ...inheritedOptionalCommonSwitches, ...pathItemOptionalSwitches };
  const optionalShort = Object.values(allOptional).reduce((dict: Record<string, Switch>, swich: Switch) => {
    if (swich.hasShortname()) {
      dict[swich.getShortname()] = swich;
    }
    
    return dict;
  }, {});
  const optionalLong = Object.values(allOptional).reduce((dict: Record<string, Switch>, swich: Switch) => {
    if (swich.hasLongname()) {
      dict[swich.getLongname()] = swich;
    }
    
    return dict;
  }, {});

  /*********************************************************************
   * Check for all passed short switches for:
   * - if a long switch of the same passed short switch is 
   *   also passed.
   * - if the passsed short switch is not defined in pathItem or
   *   in the common switches.
   * - delete the existing short and long switches from the prepare 
   *   look up table from the previous steps so we can figure out
   *   which required switches are missing from the passed switches.
   *********************************************************************/

  for (let shortArg of Object.keys(argsShortSwitches)) {
    if (requiredShort[shortArg]) {
      const swich = requiredShort[shortArg];

      if (swich.hasLongname() && argsLongSwitches[swich.getLongname()]) {
        throw Error(`Only one of "-${swich.getShortname()}" or "--${swich.getLongname()}" can be passed at the same time.`);
      }

      if (swich.hasLongname()) {
        delete requiredLong[swich.getLongname()];
      }

      delete requiredShort[shortArg];
    } else if (optionalShort[shortArg]) {
      const swich = optionalShort[shortArg];

      if (swich.hasLongname() &&  argsLongSwitches[swich.getLongname()]) {
        throw Error(`Only one of "-${swich.getShortname()}" or "--${swich.getLongname()}" can be passed at the same time.`);
      }

      if (swich.hasLongname()) {
        delete optionalLong[swich.getLongname()];
      }

      delete optionalShort[shortArg];
    } else {
      throw Error(`Switch "-${shortArg}" is not recognized.`)
    }
  }

  /*********************************************************************
   * Check for all passed long switches for:
   * - if a short switch of the same passed long switch is 
   *   also passed.
   * - if the passsed long switch is not defined in pathItem or
   *   in the common switches.
   * - delete the existing short and long switches from the prepare 
   *   look up table from the previous steps so we can figure out
   *   which required switches are missing from the passed switches.
   *********************************************************************/

  for (let longArg of Object.keys(argsLongSwitches)) {
    if (requiredLong[longArg]) {
      const swich = requiredLong[longArg];

      if (swich.hasShortname() && argsShortSwitches[swich.getShortname()]) {
        throw Error(`Either "-${swich.getShortname()}" or "--${swich.getLongname()}" can be passed at the same time.`);
      }

      if (swich.hasShortname()) {
        delete requiredShort[swich.getShortname()];
      }

      delete requiredLong[longArg];
    } else if (optionalLong[longArg]) {
      const swich = optionalLong[longArg];

      if (swich.hasShortname() &&  argsShortSwitches[swich.getShortname()]) {
        throw Error(`Either "-${swich.getShortname()}" or "--${swich.getLongname()}" can be passed at the same time.`);
      }

      if (swich.hasShortname()) {
        delete optionalShort[swich.getShortname()];
      }

      delete optionalLong[longArg];
    } else {
      throw Error(`Switch "--${longArg}" is not recognized.`)
    }
  }

  /*********************************************************************
   * Check for missing required switches
   *********************************************************************/

   if (Object.keys(requiredShort).length > 0 || Object.keys(requiredLong).length > 0) {
    const firstMissingSwitch = Object.values(requiredShort)[0];

    throw Error(`Switch "-${firstMissingSwitch.getShortname()}" or "--${firstMissingSwitch.getLongname()}" is required.`);
  }

}