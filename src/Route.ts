import { Switch } from './Switch';
import { Callback } from './types';
import { parsePath } from './utility';
import { PathTree } from './PathTree/PathTree';
import { PathItem } from './PathTree/PathItem';
import { BlockPathItem } from './PathTree/BlockPathItem';
import { StaticPathItem } from './PathTree/StaticPathItem';
import { SwitchPathItem } from './PathTree/SwitchPathItem';
import { DynamicPathItem } from './PathTree/DynamicPathItem';

export class Route {

  private tree: PathTree;
  private path: string;
  private pathItems: PathItem[] = [];

  constructor(tree: PathTree, path: string) {
    this.tree = tree;
    this.path = path;
    this.pathItems = Route.matchRouteToTreePathItems(tree, path);
  }

  /**
   * By walking on the tree using the specified path, this method returns
   * an array of PathItems which is the mix of existing and newly created
   * PathItems on the tree.
   * 
   * @param tree for matching path to its PathItems
   * @param path to be matched with the specified tree
   * @returns {PathItem[]}
   */
  static matchRouteToTreePathItems(tree: PathTree, path: string): PathItem[] {
    let currentPathItem: BlockPathItem = tree.getRoot();
    const newPathItems = parsePath(path);
    const finalPathItems = [];

    for (let i=0; i<newPathItems.length; i++) {
      const newPathItem = newPathItems[i];

      if (newPathItem instanceof StaticPathItem) {
        if (currentPathItem.hasStaticPathItem(newPathItem.getName())) {
          currentPathItem = currentPathItem.getStaticPathItem(newPathItem.getName());
          finalPathItems.push(currentPathItem);
        } else {
          currentPathItem.addStaticPathItem(newPathItem);
          currentPathItem = newPathItem;
          finalPathItems.push(currentPathItem);
        }
      } else if (newPathItem instanceof DynamicPathItem) {
        if (currentPathItem.hasDynamicPathItem()) {
          currentPathItem = currentPathItem.getDynamicPathItem();
          
          if (currentPathItem.getName() !== newPathItem.getName()) {
            throw Error(`Dynamic PathItem with name "${newPathItem.getName()}" already exist with name "${currentPathItem.getName()}" in route path "${path}".`);
          }

          finalPathItems.push(currentPathItem);
        } else {
          currentPathItem.setDynamicPathItem(newPathItem);
          currentPathItem = newPathItem;
          finalPathItems.push(currentPathItem);
        }
      } else if (newPathItem instanceof SwitchPathItem) {
        const switchPathItems = currentPathItem.getSwitchPathItems();
        const switchUniqueName = newPathItem.getUniqueName();
        const existingSwitchPathItem = switchPathItems.find(swich => swich.getUniqueName() === switchUniqueName);

        if (existingSwitchPathItem) {
          finalPathItems.push(existingSwitchPathItem);
        } else {
          currentPathItem.addSwitchPathItem(newPathItem);
          finalPathItems.push(newPathItem);
        }
        
        // As soon as seeing SwitchPathItem, it should be the last thing to see
        break;
      }
    }

    return finalPathItems;
  }

  /**
   * The last pathItem object from the specified route
   */
  private lastPathItem() {
    if (this.pathItems.length > 0) {
      return this.pathItems[this.pathItems.length - 1];
    } else {
      return this.tree.getRoot();
    }
  }

  /**
   * Add a callback to be called for the current route
   * @param callback to be added for being called for the current route
   * @returns {Route} current route
   */
  callback(callback: Callback) {
    this.lastPathItem().addCallback(callback);

    return this;
  }

  /**
   * Set description text for the current route
   * @param text to be set as description
   * @returns {Route} current route
   */
  description(text: string) {
    this.lastPathItem().setDescription(text);

    return this;
  }

  /**
   * Add a required switch for this route
   * @param short one character string representing the short form of the switch
   * @param long string representing the long form of the switch
   * @param description for the switch
   * @param parameters swtich parameters
   * @returns {Route} current route
   */
  requiredSwitch(short: string, long: string, description: string, parameters: string[]) {
    const swich = new Switch(short, long, description, parameters);
    
    this.lastPathItem().addRequiredSwitch(swich);

    return this;
  }

  /**
   * Add a optional switch for this route
   * @param short one character string representing the short form of the switch
   * @param long string representing the long form of the switch
   * @param description for the switch
   * @param parameters swtich parameters
   * @returns {Route} current route
   */
  optionalSwitch(short: string, long: string, description: string, parameters: string[]) {
    const swich = new Switch(short, long, description, parameters);
    
    this.lastPathItem().addOptionalSwitch(swich);

    return this;
  }

  /**
   * Add a common required switch for this route
   * This Switch will be included to all sub-routes of the current route
   * @param short one character string representing the short form of the switch
   * @param long string representing the long form of the switch
   * @param description for the switch
   * @returns {Route} current route
   */
  commonRequiredSwitch(short: string, long: string, description: string, parameters: string[]) {
    const swich = new Switch(short, long, description, parameters);
    const last = this.lastPathItem();

    if (last instanceof BlockPathItem) {
      last.addCommonRequiredSwitch(swich);
    } else {
      throw Error('Cannot set Common Switches to non-BlockPathItems.');
    }

    return this;
  }

  /**
   * Add a common optional switch for this route
   * This Switch will be included to all sub-routes of the current route
   * @param short one character string representing the short form of the switch
   * @param long string representing the long form of the switch
   * @param description for the switch
   * @returns {Route} current route
   */
  commonOptionalSwitch(short: string, long: string, description: string, parameters: string[]) {
    const swich = new Switch(short, long, description, parameters);
    const last = this.lastPathItem();

    if (last instanceof BlockPathItem) {
      last.addCommonOptionalSwitch(swich);
    } else {
      throw Error('Cannot set Common Switches to non-BlockPathItems.');
    }

    return this;
  }

}