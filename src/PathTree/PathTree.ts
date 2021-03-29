// import { PathItem } from "./PathItem";
import { treeToString } from "../utility";
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

  public toString = (shortForm: boolean = false) => {
    return treeToString(this.getRoot(), shortForm);
  }

}