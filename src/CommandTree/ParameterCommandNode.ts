import CommandNode from './CommandNode'
import { PARAMETER_PREFIX } from '../constants'

export default class ParameterCommandNode extends CommandNode {
  constructor(parentNode: CommandNode | null) {
    super(PARAMETER_PREFIX, parentNode)
  }
}
