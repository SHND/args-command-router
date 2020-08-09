import { PATH_ITEM_DELIMITER, DYNAMIC_PATH_PREFIX, OPEN_SWITCH_EXPR_SYMBOL, CLOSE_SWITCH_EXPR_SYMBOL, SINGLE_QUOTE_LITERAL, DOUBLE_QUOTE_LITERAL } from "./constants";
import { RootPathItem } from "./PathTree/RootPathItem";
import { DynamicPathItem } from "./PathTree/DynamicPathItem";
import { StaticPathItem } from "./PathTree/StaticPathItem";
import { BlockPathItem } from "./PathTree/BlockPathItem";
import { PathItem } from "./PathTree/PathItem";
import { SwitchPathItem } from "./PathTree/SwitchPathItem";

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

  // now that pathItems before switchExpression is parse it's time for switchExpreesion
  if (switchPathItemPart.trim() !== '') {
    const switchPathItem = new SwitchPathItem(switchPathItemPart, parent);
    output.push(switchPathItem);
  }

  return output;
}