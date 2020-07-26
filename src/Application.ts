import { PathTree } from './PathTree/PathTree'
import { Route } from './Route';

export default class Application {

  private _config: { [key: string]: any }
  private _tree = new PathTree();

  constructor(config = {}) {
    this._config = config
  }

  public route(path: string) {
    return new Route(this._tree, path);
  }

  public debug() {
    this._tree.printPathItems();
  }

}
