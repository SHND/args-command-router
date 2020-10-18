import { PATH_ITEM_DELIMITER, DYNAMIC_PATH_PREFIX, OPEN_SWITCH_EXPR_SYMBOL, CLOSE_SWITCH_EXPR_SYMBOL, SINGLE_QUOTE_LITERAL, DOUBLE_QUOTE_LITERAL, STOP } from "./constants";
import { RootPathItem } from "./PathTree/RootPathItem";
import { DynamicPathItem } from "./PathTree/DynamicPathItem";
import { StaticPathItem } from "./PathTree/StaticPathItem";
import { BlockPathItem } from "./PathTree/BlockPathItem";
import { PathItem } from "./PathTree/PathItem";
import { SwitchPathItem } from "./PathTree/SwitchPathItem";
import { Callback, CallbackReturnType, ExternalArgsType } from "./types";

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
  let parent = newRoot;

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
        parent.setDynamicPathItem(pathItem);
      } 
      // Static PathItem
      else {
        pathItem = new StaticPathItem(pathItemStr, parent);
        parent.addStaticPathItem(pathItem);
      }

      // Add to output
      output.push(pathItem);

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
 * and return the matched BlockPathItem or null.
 * @param commands which are actual values passed as BlockPathItem in run time
 * @param node which is a starting point in PathItem as tree to find the match
 */
export function matchCommands(commands: string[], node: BlockPathItem): BlockPathItem {
  let lastBlockPathItem: BlockPathItem = node;
  if (commands.length > commands.length) {
    return null;
  }

  for (let command of commands) {
    if (lastBlockPathItem.hasStaticPathItem(command)) {
      lastBlockPathItem = lastBlockPathItem.getStaticPathItem(command);
    } else if (lastBlockPathItem.hasDynamicPathItem()) {
      lastBlockPathItem = lastBlockPathItem.getDynamicPathItem();
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
export function matchCommandsGetPathParameters(commands: string[], node: BlockPathItem): Record<string, string> {
  let output: Record<string, string> = {};
  let lastBlockPathItem: BlockPathItem = node;
  if (commands.length > commands.length) {
    throw Error(`Failed to match commands "${commands}" and node tree`)
  }

  for (let command of commands) {
    if (lastBlockPathItem.hasStaticPathItem(command)) {
      lastBlockPathItem = lastBlockPathItem.getStaticPathItem(command);
    } else if (lastBlockPathItem.hasDynamicPathItem()) {
      lastBlockPathItem = lastBlockPathItem.getDynamicPathItem();

      output[lastBlockPathItem.getUniqueName(true)] = command;
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
  node: BlockPathItem
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
export function processCallbacks(targetPathItem: PathItem, forwardedPartialContext: CallbackReturnType, args: ExternalArgsType, pathParameters: Record<string, string>, callbacks: Callback[]): CallbackReturnType {
  if (forwardedPartialContext === STOP) {
    return;
  }
  
  let partialContext = { ...forwardedPartialContext };

  for (let callback of callbacks) {
    const output = callback.call(targetPathItem, {
      ...partialContext,
      commands: args.commands,
      pathParams: pathParameters,
      shortSwitches: args.shortSwitches,
      longSwitches: args.longSwitches,
      switches: { ...args.shortSwitches, ...args.longSwitches }
    });

    if (output === undefined) {
      // continue with previous forwardedContext
    } else if (typeof output === 'string' && output === STOP) {
      return STOP;
    } else if (typeof output === 'object') {
      if (output.hasOwnProperty('commands'))  throw Error('The "command" keyword is reserved and it cannot be returned from callbacks.');
      if (output.hasOwnProperty('pathParams'))  throw Error('The "pathParams" keyword is reserved and it cannot be returned from callbacks.');
      if (output.hasOwnProperty('shortSwitches'))  throw Error('The "shortSwitches" keyword is reserved and it cannot be returned from callbacks.');
      if (output.hasOwnProperty('longSwitches'))  throw Error('The "longSwitches" keyword is reserved and it cannot be returned from callbacks.');
      if (output.hasOwnProperty('switches'))  throw Error('The "switches" keyword is reserved and it cannot be returned from callbacks.');

      partialContext = { ...partialContext, ...output };
    } else {
      throw Error('Callbacks can only return simple objects or not returning anything at all.');
    }
  }

  return partialContext;
}
