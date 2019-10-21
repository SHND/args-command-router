import CommandNode from './CommandNode'
import Condition from '../Condition'

export interface NodeChildrenType {
  [key: string]: CommandNode
}

export interface CallbackRule {
  condition: Condition
  callback: Function
}
