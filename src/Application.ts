import { PathTree } from './PathTree/PathTree'
import { pathParser } from './utility';
import { DynamicPathItem } from './PathTree/DynamicPathItem';
import { StaticPathItem } from './PathTree/StaticPathItem';
import { BlockPathItem } from './PathTree/BlockPathItem';

export default class Application {

  private _config: { [key: string]: any }
  private _tree = new PathTree();

  constructor(config = {}) {
    this._config = config
  }

  public route(path: string) {
    let currentPathItem: BlockPathItem = this._tree.getRoot();
    const newPathItems = pathParser(path);

    for (let i=0; i<newPathItems.length; i++) {
      const newPathItem = newPathItems[i];

      if (newPathItem instanceof StaticPathItem) {
        if (currentPathItem.hasStaticPathItem(newPathItem.getName())) {
          currentPathItem = currentPathItem.getStaticPathItem(newPathItem.getName());
        } else {
          currentPathItem.addStaticPathItem(newPathItem);
          break;
        }
      } else if (newPathItem instanceof DynamicPathItem) {
        if (currentPathItem.hasDynamicPathItem()) {
          if (currentPathItem.getName() !== newPathItem.getName()) {
            throw Error(`Dynamic PathItem with name "${newPathItem.getName()}" already exist with name "${currentPathItem.getName()}" in route path "${path}".`);
          }

          currentPathItem = currentPathItem.getDynamicPathItem();
        } else {
          currentPathItem.setDynamicPathItem(newPathItem);
          break;
        }
      }
    }

  }

  public debug() {
    this._tree.printPathItems();
  }

}
