import commandLineUsage, { OptionDefinition, Section } from 'command-line-usage'
import Command from '../Command'
import Condition from '../Condition'
import BooleanSwitch from '../Switch/BooleanSwitch'
import RequiredSwitch from '../Switch/RequiredSwitch'
import ValuedSwitch from '../Switch/ValuedSwitch'
import { PARAMETER_PREFIX, COMMAND_DELIMITER } from '../constants'
import { NodeChildrenType } from './models'

export interface CallbackRule {
  condition: Condition
  callback: Function
}

export default abstract class CommandNode {
  private _parentNode: CommandNode | null = null
  private _command: Command | null = null
  private _callbackRules: CallbackRule[] = []
  private _children: NodeChildrenType = {}

  constructor(private _name: string, _parentNode: CommandNode | null) {
    this._parentNode = _parentNode

    this.printHelp = this.printHelp.bind(this)
  }

  get name(): string {
    return this._name
  }

  get parent(): CommandNode | null {
    return this._parentNode
  }

  hasNode(str: string): boolean
  hasNode(node: CommandNode): boolean
  hasNode(nodeOrString: CommandNode | string): boolean {
    if (nodeOrString instanceof CommandNode) {
      return this._children[nodeOrString.name] !== undefined
    } else {
      const nodeName = nodeOrString.startsWith(PARAMETER_PREFIX)
        ? PARAMETER_PREFIX
        : nodeOrString

      return this._children[nodeName] !== undefined
    }
  }

  addNode(nodeOrString: CommandNode): CommandNode {
    if (!this.hasNode(nodeOrString)) {
      this._children[nodeOrString.name] = nodeOrString
      return nodeOrString
    }

    return this._children[nodeOrString.name]
  }

  hasCommand(): boolean {
    return !!this._command
  }

  setCommand(command: Command): CommandNode {
    this._command = command

    return this
  }

  getCommand(): Command | null {
    return this._command
  }

  get children(): NodeChildrenType {
    return this._children
  }

  get parameterChild(): CommandNode | null {
    return this._children[PARAMETER_PREFIX]
  }

  matchChild(name: string): CommandNode | null {
    return this._children[name]
      ? this._children[name]
      : this._children[PARAMETER_PREFIX]
  }

  addCallableRule(callableRule: CallbackRule): CommandNode
  addCallableRule(condition: Condition, callback: Function): CommandNode
  addCallableRule(condition: string, callback: Function): CommandNode
  addCallableRule(
    policyOrCondition: CallbackRule | Condition | string,
    callback: Function = () => {}
  ): CommandNode {
    let policy: CallbackRule
    if (policyOrCondition instanceof Condition) {
      policy = { condition: policyOrCondition, callback }
    } else if (typeof policyOrCondition === 'string') {
      policy = { condition: new Condition(policyOrCondition), callback }
    } else {
      policy = policyOrCondition
    }
    this._callbackRules = [policy, ...this._callbackRules]

    return this
  }

  /**
   * Find the first callableRule which its condition evaluates to true;
   * @param values these are values passed in run-time. it can be parameter or switch values without ':', '-' or '--'
   * @returns first match callableRule function or null
   */
  firstMatchedCallable(args: {
    [key: string]: string | boolean
  }): Function | null {
    for (let i = 0; i < this._callbackRules.length; i++) {
      const rule = this._callbackRules[i]

      if (rule.condition.evaluate(args)) return rule.callback
    }

    return null
  }

  commandNodePath(): CommandNode[] {
    const commandNodes: CommandNode[] = []
    let currentNode: CommandNode | null = this
    while (currentNode) {
      commandNodes.push(currentNode)
      currentNode = currentNode.parent
    }

    return commandNodes.reverse()
  }

  commandNodePathNames(): string[] {
    return this.commandNodePath().map(cn => cn.name)
  }

  commandNodePathString(): string {
    return this.commandNodePathNames().join(COMMAND_DELIMITER)
  }

  printHelp(): void {
    const command: Command | null = this.getCommand()

    const pathNames = this.commandNodePathNames()
    if (pathNames.length > 0) pathNames[0] = '<APP>'
    pathNames.push('[COMMAND]')

    const usageContent: any[] = []
    for (let childNodeName in this.children) {
      const childNode = this.children[childNodeName]
      const childCommand = childNode.getCommand()

      usageContent.push({
        name: childNode.name,
        summary: childCommand ? childCommand.getDescription() : '',
      })
    }

    if (!command) {
      const usage = commandLineUsage([
        {
          header: 'Usage',
          content: pathNames.join(' '),
        },
        {
          header: 'Command List',
          content: usageContent,
        },
      ])
      console.log(usage)
    } else {
      let requiredOptionList: OptionDefinition[] = []
      let optionalOptionList: OptionDefinition[] = []

      const booleanSwitches: BooleanSwitch[] = command.getBooleanSwitches()
      const requiredSwitches: RequiredSwitch[] = command.getRequiredSwitches()
      const valuedSwitches: ValuedSwitch[] = command.getValuedSwitches()

      // command.getSwitches().forEach(s => {
      //   if (s instanceof RequiredSwitch) {
      //     requiredSwitches.push(s)
      //   } else if (s instanceof BooleanSwitch) {
      //     booleanSwitches.push(s)
      //   } else if (s instanceof ValuedSwitch) {
      //     valuedSwitches.push(s)
      //   }
      // })

      requiredOptionList = requiredOptionList.concat(
        requiredSwitches.map(
          (s: RequiredSwitch): OptionDefinition => ({
            name: s.longname || '\b\b\b\b', // because name is required
            description: s.description,
            alias: s.shortname || undefined,
            // because name is required and typeLabel needs to be aligned
            typeLabel: `{underline value}${!s.longname ? '    ' : ''}`,
          })
        )
      )

      optionalOptionList = optionalOptionList.concat(
        booleanSwitches.map(
          (s: BooleanSwitch): OptionDefinition => ({
            name: s.longname || '',
            description: s.description,
            alias: s.shortname || '',
            type: Boolean,
          })
        )
      )

      optionalOptionList = optionalOptionList.concat(
        valuedSwitches.map(
          (s: ValuedSwitch): OptionDefinition => ({
            name: s.longname || '',
            description: s.description,
            alias: s.shortname || '',
            typeLabel: '{underline value}',
          })
        )
      )

      const commandLineUsageOptions: Section[] = [
        {
          header: 'Usage',
          content: pathNames.join(' '),
        },
        {
          header: 'Command List',
          content: usageContent,
        },
      ]

      if (requiredOptionList.length > 0) {
        commandLineUsageOptions.push({
          header: 'Required Options',
          optionList: requiredOptionList,
        })
      }

      if (optionalOptionList.length > 0) {
        commandLineUsageOptions.push({
          header: 'Required Options',
          optionList: optionalOptionList,
        })
      }

      const usage = commandLineUsage(commandLineUsageOptions)

      console.log(usage)
    }
  }
}
