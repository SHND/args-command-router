import { Data } from "args-command-parser/dist/Models";
import { PathItem } from "./PathTree/PathItem";
import { PathTree } from "./PathTree/PathTree";

/**
 * Data type from args-command-parser
 */
export type ExternalArgsType = Data;

/**
 * Configuration for the application
 */
export interface Config {
  applicationName: string,
  checkForSwitchConflicts: boolean,
  strictSwitchMatching: boolean,
}

/**
 * This is a placeholder for hooks to add custom stuff to be passed to next hooks and callbacks
 */
export type CallbackContext = Record<string, any>;

/**
 * Callback input type that is passed to callbacks
 */
export interface CallbackInput {
  commands: string[]
  pathParams: Record<string, string | string[]>
  shortSwitches: Record<string, string[]>
  longSwitches: Record<string, string[]>
  switches: Record<string, string[]>
  context: CallbackContext
}

/**
 * Callback return type
 */
export type CallbackReturnType = CallbackContext | void | 'stop'

/**
 * Callback type for hooks and main PathItem callback
 */
export type Callback = (this: PathItem, input: CallbackInput, config: Config, tree: PathTree) => CallbackReturnType;
