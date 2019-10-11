import CommandNode from './CommandNode'
import FixedCommandNode from './FixedCommandNode'

export default class CommandTree {
  private _rootNode: CommandNode = new FixedCommandNode('/')

  constructor(rootNode?: CommandNode) {
    if (rootNode !== undefined) this._rootNode = rootNode
  }

  get root(): CommandNode {
    return this._rootNode
  }
}
