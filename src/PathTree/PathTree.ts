// import { PathItem } from "./PathItem";
import { RootPathItem } from "./RootPathItem";

export class PathTree {
  
  private _root: RootPathItem;

  constructor(root?: RootPathItem) {
    if (root) {
      this._root = root;
    } else {
      this._root = new RootPathItem();
    }
  }

  public getRoot = () => {
    return this._root
  }

}