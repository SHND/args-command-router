import { PathItem } from './PathTree/PathItem';
import { BlockPathItem } from './PathTree/BlockPathItem';
import { parsePath } from './utility';
import { Switch } from './Switch';
import { PathTree } from './PathTree/PathTree';
import { StaticPathItem } from './PathTree/StaticPathItem';
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
   * PathItems.
   * 
   * This method is pure and it's not changing the state of tree.
   * 
   * @param tree for matching path to its PathItems
   * @param path to be matched with the specified tree
   * @returns {PathItem[]}
   */
  static matchRouteToTreePathItems(tree: PathTree, path: string) {
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
          finalPathItems.push(newPathItem);
          break;
        }
      } else if (newPathItem instanceof DynamicPathItem) {
        if (currentPathItem.hasDynamicPathItem()) {
          if (currentPathItem.getName() !== newPathItem.getName()) {
            throw Error(`Dynamic PathItem with name "${newPathItem.getName()}" already exist with name "${currentPathItem.getName()}" in route path "${path}".`);
          }

          currentPathItem = currentPathItem.getDynamicPathItem();
          finalPathItems.push(currentPathItem);
        } else {
          currentPathItem.setDynamicPathItem(newPathItem);
          finalPathItems.push(newPathItem);
          break;
        }
      }
    }

    return finalPathItems;
  }

  /**
   * The last pathItem object from the specified route
   */
  private lastPathItem() {
    return this.pathItems[this.pathItems.length - 1];
  }

  /**
   * Add a callback to be called for the current route
   * @param callback to be added for being called for the current route
   * @returns {Route} current route
   */
  callback(callback: Function) {
    this.lastPathItem().addCallback(callback);

    return this;
  }

  /**
   * Set callback which is responsible for returning the help text for the current route
   * @param callback help
   * @returns {Route} current route
   */
  help(callback: Function) {
    this.lastPathItem().setHelpCallback(callback);

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
   * @returns {Route} current route
   */
  requiredSwitch(short: string, long: string, description: string) {
    const swich = new Switch(short, long, description);
    
    this.lastPathItem().addRequiredSwitch(swich);

    return this;
  }

  /**
   * Add a optional switch for this route
   * @param short one character string representing the short form of the switch
   * @param long string representing the long form of the switch
   * @param description for the switch
   * @returns {Route} current route
   */
  optionalSwitch(short: string, long: string, description: string) {
    const swich = new Switch(short, long, description);
    
    this.lastPathItem().addRequiredSwitch(swich);

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
  commonRequiredSwitch(short: string, long: string, description: string) {
    const swich = new Switch(short, long, description);
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
  commonOptionalSwitch(short: string, long: string, description: string) {
    const swich = new Switch(short, long, description);
    const last = this.lastPathItem();

    if (last instanceof BlockPathItem) {
      last.addCommonOptionalSwitch(swich);
    } else {
      throw Error('Cannot set Common Switches to non-BlockPathItems.');
    }

    return this;
  }

}