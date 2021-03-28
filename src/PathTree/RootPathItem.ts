import { PathItem } from "./PathItem";
import { BlockPathItem } from "./BlockPathItem";
import { PATH_ITEM_DELIMITER } from "../constants";

export class RootPathItem extends BlockPathItem {
  
  constructor() {
    super();

    this.parentPathItem;
    this.description;
    this.callbacks = [];
    this.requiredSwitches = [];
    this.optionalSwitches = [];

    this.name = PATH_ITEM_DELIMITER;
    this.staticPathItems = {};
    this.dynamicPathItem;
    this.switchPathItems = [];
    this.commonRequiredSwitches = [];
    this.commonOptionalSwitches = [];

  }

  /**
   * returns a unique name for this level
   * e.g. "/"
   * @param shortForm 
   */
  public getUniqueName = (shortForm: boolean = false) => {
    return this.name;
  };

  /**
   * Returns true because this is the RootPathItem
   * This is for avoiding circular dependency issue
   * @returns true
   */
  public isRootPathItem = () => true;

  /**
   * Returns a string representing the tree of pathItems
   * @param shortForm of pathItem names
   * @returns string representing the tree
   */
  public listPathItems = (shortForm: boolean = false) => {
    let output = '';
    
    _listPathItems(this, 0, []);

    return output;
    
    function _listPathItems(pathItem: PathItem, indent: number, indentsDone: boolean[]) {

      const _indentsDone = [...indentsDone];
      output += line(pathItem.getUniqueName(false), indent, _indentsDone);

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

          _listPathItems(subPathItem, indent+1, _indentsDone);
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

          _listPathItems(subPathItem, indent+1, _indentsDone);
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

          _listPathItems(subPathItem, indent+1, _indentsDone);
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

          _listPathItems(subPathItem, indent+1, _indentsDone);
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

  public getDynamicPathItemName: () => string | null = () => null;

}
