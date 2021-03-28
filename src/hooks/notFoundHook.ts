import { STOP } from "../constants";
import { PathTree } from "../PathTree/PathTree";
import { PathItem } from "../PathTree/PathItem";
import { CallbackInput, CallbackReturnType, Config } from "../types";

const commandLineUsage = require('command-line-usage');

/**
 * This native hook is for when user pass wrong arguments and commands to the Application.
 * This hook is designed to be set on noTarget, noCallback and onVerifySwitchFailure.
 * 
 * @param this refers to PathItem which help is getting run on
 * @param inputs passed to the application in runtime
 * @param config Application configuration
 * @param tree PathTree
 */
export function notFoundHook(this:PathItem, inputs: CallbackInput, config: Config, tree: PathTree): CallbackReturnType {

  const pathItem = this;
  if (config.helpType === 'switch') {
    if (pathItem) {
      
      console.log(commandLineUsage(pathItem.getHelp(config.applicationName)));
    } else {
      const rootPathItem = tree.getRoot();

      console.log(commandLineUsage(rootPathItem.getHelp(config.applicationName)));
    }
  }

}