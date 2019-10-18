import CommandNode from './CommandNode'
import { PARAMETER_PREFIX } from '../constants'

export default class FixedCommandNode extends CommandNode {
  constructor(name: string, parentNode: CommandNode | null) {
    if (name === PARAMETER_PREFIX)
      throw Error(`FixedCommandNode cannot have a name "${PARAMETER_PREFIX}"`)
    super(name, parentNode)
  }
}
