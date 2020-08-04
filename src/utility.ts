import { PATH_ITEM_DELIMITER, DYNAMIC_PATH_PREFIX, OPEN_SWITCH_EXPR_SYMBOL, CLOSE_SWITCH_EXPR_SYMBOL, SINGLE_QUOTE_LITERAL, DOUBLE_QUOTE_LITERAL } from "./constants";
import { RootPathItem } from "./PathTree/RootPathItem";
import { DynamicPathItem } from "./PathTree/DynamicPathItem";
import { StaticPathItem } from "./PathTree/StaticPathItem";
import { BlockPathItem } from "./PathTree/BlockPathItem";
import { PathItem } from "./PathTree/PathItem";

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

export function splitSwitchExpressions(expressions: string) {
  const expressionsArr = [];
  let isSingleQuoteLiteral = false;
  let isDoubleQuoteLiteral = false;
  let isInBrackets = false;
  let currentExpression = '';
  for (let c of expressions) {

    if (c === SINGLE_QUOTE_LITERAL) {
      isSingleQuoteLiteral = !isSingleQuoteLiteral;
    } else if (c === DOUBLE_QUOTE_LITERAL) {
      isDoubleQuoteLiteral = !isDoubleQuoteLiteral;
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
        throw Error(`Invalid Switch Expression "${expressions}".`)
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
  let path = pathStr;

  // if path starts with '/' remove it
  if (path.startsWith(PATH_ITEM_DELIMITER)) {
    path = path.substring(1);
  }

  // if after removing the first '/' we get empty string we want the root PathItem
  if (path === '') {
    return [];
  }

  let [pathItemsPart, switchPathItemPart] = splitFromSwitchPathItem(path);
  let pathItemsStr = pathItemsPart.split(PATH_ITEM_DELIMITER);

  // check if any of the pathItem strings has whitespace or is empty string
  const hasWhiteSpace = pathItemsStr.reduce((hasWhiteSpace, pathItem) => hasWhiteSpace || (/\s|^$/).test(pathItem), false);
  if (hasWhiteSpace) {
    throw Error(`The path "${pathStr}" contains whitespace.`);
  }

  const newRoot: BlockPathItem = new RootPathItem();
  let parent = newRoot;

  // iterate over all pathItems before switchExpression
  for (let i=0; i<pathItemsStr.length; i++) {
    const pathItemStr = pathItemsStr[i];
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

  //TODO: now that pathItems before switchExpression is parse it's time for switchExpreesion

  return output;
}