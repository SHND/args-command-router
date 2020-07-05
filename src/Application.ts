import { parser } from 'args-command-parser'
import { PathTree } from './PathTree/PathTree'

export default class Application {

  private _config: { [key: string]: any }
  private _tree = new PathTree();

  constructor(config = {}) {
    this._config = config
  }

  public debug() {
    console.log(this._tree.getRoot().getTreeString())
  }

}
