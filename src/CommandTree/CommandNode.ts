import commandLineUsage, { OptionDefinition, Section } from 'command-line-usage'
import Command from '../Command'
import Condition from '../Condition'
import BooleanSwitch from '../Switch/BooleanSwitch'
import RequiredSwitch from '../Switch/RequiredSwitch'
import ValuedSwitch from '../Switch/ValuedSwitch'
import { PARAMETER_PREFIX, COMMAND_DELIMITER } from '../constants'
import { NodeChildrenType, CallbackRule } from './models'

export default abstract class CommandNode {
  protected _parentNode: CommandNode | null = null
  private _command: Command | null = null
  private _callbackRules: CallbackRule[] = []
  private _children: NodeChildrenType = {}

  constructor(private _name: string) {
    this.printHelp = this.printHelp.bind(this)

    this.hasNode = this.hasNode.bind(this)
    this.addNode = this.addNode.bind(this)
    this.hasCommand = this.hasCommand.bind(this)
    this.setCommand = this.setCommand.bind(this)
    this.getCommand = this.getCommand.bind(this)
    this.appendCallableRule = this.appendCallableRule.bind(this)
    this.firstMatchedCallable = this.firstMatchedCallable.bind(this)
    this.commandNodePath = this.commandNodePath.bind(this)
    this.commandNodePathString = this.commandNodePathString.bind(this)
    this.getCommandPathForHelp = this.getCommandPathForHelp.bind(this)
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

  addNode(node: CommandNode): CommandNode {
    if (!this.hasNode(node)) {
      this._children[node.name] = node
      node._parentNode = this
      return node
    }

    return this._children[node.name]
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
    return this._children[PARAMETER_PREFIX] || null
  }

  matchChild(name: string): CommandNode | null {
    return this._children[name]
      ? this._children[name]
      : this._children[PARAMETER_PREFIX]
  }

  prependCallableRule(callableRule: CallbackRule): CommandNode
  prependCallableRule(condition: Condition, callback: Function): CommandNode
  prependCallableRule(condition: string, callback: Function): CommandNode
  prependCallableRule(
    policyOrCondition: CallbackRule | Condition | string,
    callback: Function = () => {}
  ): CommandNode {
    let policy: CallbackRule
    if (policyOrCondition instanceof Condition) {
      policy = { condition: policyOrCondition, callback }
    } else if (typeof policyOrCondition === 'string') {
      policy = {
        condition: new Condition(policyOrCondition),
        callback,
      }
    } else {
      policy = policyOrCondition
    }
    this._callbackRules = [policy, ...this._callbackRules]

    return this
  }

  appendCallableRule(callableRule: CallbackRule): CommandNode
  appendCallableRule(condition: Condition, callback: Function): CommandNode
  appendCallableRule(condition: string, callback: Function): CommandNode
  appendCallableRule(
    policyOrCondition: CallbackRule | Condition | string,
    callback: Function = () => {}
  ): CommandNode {
    let policy: CallbackRule
    if (policyOrCondition instanceof Condition) {
      policy = { condition: policyOrCondition, callback }
    } else if (typeof policyOrCondition === 'string') {
      policy = {
        condition: new Condition(policyOrCondition),
        callback,
      }
    } else {
      policy = policyOrCondition
    }
    this._callbackRules.push(policy)

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

  commandNodePathString(): string {
    const command: Command | null = this.getCommand()

    if (command) {
      return command.getCommandItemNames().join(COMMAND_DELIMITER)
    } else {
      return this.commandNodePath()
        .slice(1)
        .map(node => node.name)
        .join(COMMAND_DELIMITER)
    }
  }

  getCommandPathForHelp(): string[] {
    let output = []
    const command: Command | null = this.getCommand()

    if (command) {
      output.push('<APP>')
      output = output.concat(command.getCommandItemNames())
      output.push('[COMMAND]')
    } else {
      output = this.commandNodePath().map(node => node.name)
      output[0] = '<APP>'
      output.push('<COMMAND>')
    }
    return output
  }

  printHelp(): void {
    const command: Command | null = this.getCommand()

    if (command) {
      console.log(commandLineUsage(this._createHelpByCommand()))
    } else {
      console.log(commandLineUsage(this._createHelpByNodes()))
    }
  }

  private _createHelpByNodes() {
    const pathNames: string[] = this.getCommandPathForHelp()

    const usageContent: any[] = []
    for (let childNodeName in this.children) {
      const childNode = this.children[childNodeName]
      const childCommand = childNode.getCommand()

      usageContent.push({
        name: childNode.name,
        summary: childCommand ? childCommand.getDescription() : '',
      })
    }

    return [
      {
        header: 'Usage',
        content: pathNames.join(' '),
      },
      {
        header: 'Command List',
        content: usageContent,
      },
    ]
  }

  private _createHelpByCommand() {
    const command: Command | null = this.getCommand()

    if (!command)
      throw Error(
        '_createHelpByCommand() expects command to exist on the current node'
      )

    const pathNames: string[] = this.getCommandPathForHelp()

    const usageContent: any[] = []
    for (let childNodeName in this.children) {
      const childNode = this.children[childNodeName]
      const childCommand = childNode.getCommand()

      usageContent.push({
        name: childNode.name,
        summary: childCommand ? childCommand.getDescription() : '',
      })
    }

    let requiredOptionList: OptionDefinition[] = []
    let optionalOptionList: OptionDefinition[] = []

    const booleanSwitches: BooleanSwitch[] = command.getBooleanSwitches()
    const requiredSwitches: RequiredSwitch[] = command.getRequiredSwitches()
    const valuedSwitches: ValuedSwitch[] = command.getValuedSwitches()

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
          name: s.longname || '\b\b\b\b    ',
          description: s.description,
          alias: s.shortname || '',
          type: Boolean,
        })
      )
    )

    optionalOptionList = optionalOptionList.concat(
      valuedSwitches.map(
        (s: ValuedSwitch): OptionDefinition => ({
          name: s.longname || '\b\b\b\b', // because name is required
          description: s.description,
          alias: s.shortname || '',
          // because name is required and typeLabel needs to be aligned
          typeLabel: `{underline value}${!s.longname ? '    ' : ''}`,
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
        header: 'Optional Options',
        optionList: optionalOptionList,
      })
    }

    return commandLineUsageOptions
  }
}
