// import { PathItem } from "./PathItem";
import { BlockPathItem } from "./BlockPathItem";
import { RootPathItem } from "./RootPathItem";

export class PathTree {
  
  private _root: RootPathItem;

  constructor() {
    this._root = new RootPathItem();
  }

  public getRoot = () => {
    return this._root
  }

}