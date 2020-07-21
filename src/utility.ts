import { PATH_ITEM_DELIMITER, DYNAMIC_PATH_PREFIX, OPEN_SWITCH_EXPR_SYMBOL } from "./constants";
import { RootPathItem } from "./PathTree/RootPathItem";
import { DynamicPathItem } from "./PathTree/DynamicPathItem";
import { StaticPathItem } from "./PathTree/StaticPathItem";
import { BlockPathItem } from "./PathTree/BlockPathItem";
import { PathItem } from "./PathTree/PathItem";

export function objectKeys(obj: Object) {
  return Object.keys(obj);
}

/**
 * Parse an string and return an array of PathItems
 * TODO: Add Expression Routes
 * @param {string} path to be parsed
 */
export function parsePath(path: string): PathItem[] {
  const output = [];
  let pathItemsStr = path.trim().split(PATH_ITEM_DELIMITER);

  // if path starts with '/'
  if (pathItemsStr[0] === '') {
    pathItemsStr = pathItemsStr.splice(1);
  }

  const newRoot: BlockPathItem = new RootPathItem();
  let parent = newRoot;

  // iterate over all pathItems except the last
  for (let i=0; i<pathItemsStr.length - 1; i++) {
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

  const lastPathItemRaw = pathItemsStr[pathItemsStr.length - 1];
  const lastPathItemLastIndex = lastPathItemRaw.indexOf(OPEN_SWITCH_EXPR_SYMBOL);
  let lastPathItemStr;

  // No Switch Expressions
  if (lastPathItemLastIndex < 0) {
    lastPathItemStr = lastPathItemRaw;
  }
  // Switch Expressions Present
  else {
    lastPathItemStr = lastPathItemRaw.substring(0, lastPathItemLastIndex);
  }

  let lastPathItem;

  // Dynamic PathItem
  if (lastPathItemStr.startsWith(DYNAMIC_PATH_PREFIX)) {
    lastPathItem = new DynamicPathItem(lastPathItemStr.substring(DYNAMIC_PATH_PREFIX.length), parent);
    parent.setDynamicPathItem(lastPathItem);
  } 
  // Static PathItem
  else {
    lastPathItem = new StaticPathItem(lastPathItemStr, parent);
    parent.addStaticPathItem(lastPathItem);
  }

  // Add to output
  output.push(lastPathItem);

  if (lastPathItemLastIndex >= 0) {
    console.log('parse expressions routes')
  }

  return output;
}