import { Data } from "args-command-parser/dist/Models";

/**
 * Data type from args-command-parser
 */
export type ExternalArgsType = Data;

/**
 * Configuration for the application
 */
export interface Config {
  applicationName: string,
  verifySwitches: boolean,
  helpType: 'switch' | null,
  helpShortSwitch: string,
  helpLongSwitch: string,
  helpOnNoTarget: boolean,
  helpOnNoCallback: boolean,
  helpOnVerifySwitchFailure: boolean;
  helpOnAskedForHelp: boolean,
}

/**
 * Callback context base object type
 */
export interface CallbackContextBase {
  commands: string[]
  pathParams: Record<string, string>
  shortSwitches: Record<string, string[]>
  longSwitches: Record<string, string[]>
  switches: Record<string, string[]>
}

/**
 * Callback return type
 */
export type CallbackReturnType = Exclude<Record<string, any>, keyof CallbackContextBase> | void | 'stop'

/**
 * Callback context should include CallbackContextBase plus anything passed to it
 */
export type CallbackContext = CallbackContextBase & CallbackReturnType;

/**
 * Callback type for middlewares and main PathItem callback
 */
export type Callback = (context: CallbackContext) => CallbackReturnType;
