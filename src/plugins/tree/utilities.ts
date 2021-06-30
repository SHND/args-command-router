import { Visibility } from "../../enums";
import { PathItem } from "../../PathTree/PathItem";
import { BlockPathItem } from "../../PathTree/BlockPathItem";

/**
 * Returns a string representing the tree of pathItems
 * @param pathItem root of the tree
 * @returns string representing the tree
 */
 export function treeToString(pathItem: PathItem) {
  let output = '';
  
  _treeToString(pathItem, 0, []);

  return output;
  
  function _treeToString(pathItem: PathItem, indent: number, indentsDone: boolean[]) {

    const _indentsDone = [...indentsDone];

    let text = pathItem.getUniqueName(false);
    if (pathItem.getVisibility() === Visibility.PRIVATE) {
      text = `${text} (PRIVATE)`;
    }

    output += line(text, indent, _indentsDone);

    if (pathItem instanceof BlockPathItem) {
      if (pathItem.hasSpreadPathItem()) {
        const subPathItem = pathItem.getSpreadPathItem();
        
        if (Object.keys(pathItem.getStaticPathItems()).length === 0 && pathItem.getSwitchPathItems.length === 0 && !pathItem.hasDynamicPathItem()) {
          // last child
          _indentsDone[indent] = true;
        } else {
          // middle child
          _indentsDone[indent] = false;
        }

        _treeToString(subPathItem, indent+1, _indentsDone);
      }

      if (pathItem.hasDynamicPathItem()) {
        const subPathItem = pathItem.getDynamicPathItem();
        
        if (Object.keys(pathItem.getStaticPathItems()).length === 0 && pathItem.getSwitchPathItems.length === 0) {
          // last child
          _indentsDone[indent] = true;
        } else {
          // middle child
          _indentsDone[indent] = false;
        }

        _treeToString(subPathItem, indent+1, _indentsDone);
      }

      const subSwitchPathItems = pathItem.getSwitchPathItems();
      for (let i=0; i<subSwitchPathItems.length; i++) {
        const subPathItem = subSwitchPathItems[i];
        if (Object.keys(pathItem.getStaticPathItems()).length === 0 && i === subSwitchPathItems.length - 1) {
          // last child
          _indentsDone[indent] = true;
        } else {
          // middle child
          _indentsDone[indent] = false;
        }

        _treeToString(subPathItem, indent+1, _indentsDone);
      }

      const subStaticPathItems = Object.values(pathItem.getStaticPathItems());
      for (let i=0; i<subStaticPathItems.length; i++) {
        const subPathItem = subStaticPathItems[i];
        if (i === subStaticPathItems.length - 1) {
          // last child
          _indentsDone[indent] = true;
        } else {
          // middle child
          _indentsDone[indent] = false;
        }

        _treeToString(subPathItem, indent+1, _indentsDone);
      }
    } // ENDOF if (pathItem instanceof BlockPathItem)

  }

  function line(text: string, indent: number, indentsDone: boolean[]) {
    let output = '';
    for (let i=0; i<indent-1; i++) {
      if (indentsDone[i]) {
        output += '    ';
      } else {
        output += '│   '
      }
    }

    if (indent > 0) {
      if (indentsDone[indent-1]) {
        output += '└──';
      } else {
        output += '├──'
      }
    }
    
    return `${output}${indent > 0 ? ' ' : ''}${text}\n`;
  }
}
