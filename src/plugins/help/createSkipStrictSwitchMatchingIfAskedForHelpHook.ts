import { Options } from "./Options";
import { PathTree } from "../../PathTree/PathTree";
import { PathItem } from "../../PathTree/PathItem";
import { CallbackInput, Config } from "../../types";
import { SKIP_matchRuntimeAndDefinedSwitches } from '../../constants';

/**
 * skipStrictSwitchMatchingIfAskedForHelpHook factory
 * @param helpOptions 
 * @returns skipStrictSwitchMatchingIfAskedForHelpHook
 */
export function createSkipStrictSwitchMatchingIfAskedForHelpHook(helpOptions: Options) {
  
  /**
   * This native hook is for hinting Application to skip matchRuntimeAndDefinedSwitches method.
   * This hook is designed to be set on beforeAll.
   * The reason behind this is that application does not fail when: 
   * - helpType is 'switch'
   * - any of help switches are observed in input
   * 
   * @param this refers to PathItem which help is getting run on
   * @param inputs passed to the application in runtime
   * @param config Application configuration
   * @param tree PathTree
   */
  return function skipStrictSwitchMatchingIfAskedForHelpHook(this:PathItem, inputs: CallbackInput, config: Config, tree: PathTree) {
    const { 
      helpType,
      helpShortSwitch,
      helpLongSwitch
     } = helpOptions;

    const {
      shortSwitches,
      longSwitches
    } = inputs;

    if (helpType !== 'switch') {
      return;
    }
    
    if (shortSwitches[helpShortSwitch] || longSwitches[helpLongSwitch]) {
      inputs.context[SKIP_matchRuntimeAndDefinedSwitches] = true;
    }
  }

}
