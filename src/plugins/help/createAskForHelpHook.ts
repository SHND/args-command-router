import { Options } from "./Options";
import { STOP } from "../../constants";
import { generateHelp } from "./utilities";
import { PathTree } from "../../PathTree/PathTree";
import { PathItem } from "../../PathTree/PathItem";
import { CallbackInput, CallbackReturnType, Config } from "../../types";

const commandLineUsage = require('command-line-usage');
  
/**
 * askForHelpHook factory
 * @param helpOptions 
 * @returns createAskForHelpHook
 */
export function createAskForHelpHook(helpOptions: Options) {

    /**
     * This native hook is for checking if user is deliberately asking for viewing help.
     * This hook is designed to be set on afterTargetFound hook.
     * 
     * @param this refers to PathItem which help is getting run on
     * @param inputs passed to the application in runtime
     * @param config Application configuration
     * @param tree PathTree
     */
  return function askForHelpHook(this:PathItem, inputs: CallbackInput, config: Config, tree: PathTree): CallbackReturnType {
    const pathItem = this;
    if (helpOptions.helpType === 'switch') {
      if (inputs.shortSwitches[helpOptions.helpShortSwitch] || inputs.longSwitches[helpOptions.helpLongSwitch]) {
        if (pathItem) {
          console.log(commandLineUsage(generateHelp(pathItem, config.applicationName)));
        } else {
          const rootPathItem = tree.getRoot();

          console.log(commandLineUsage(generateHelp(rootPathItem, config.applicationName)));
        }

        return STOP;
      }
    }
  }

}
