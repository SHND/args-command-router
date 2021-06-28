import { Options } from "./Options";
import Application from "../../Application";
import { createNotFoundHook } from "./createNotFoundHook";
import { createAskForHelpHook } from "./createAskForHelpHook";
import { createSkipStrictSwitchMatchingIfAskedForHelpHook } from "./createSkipStrictSwitchMatchingIfAskedForHelpHook";

/**
 * plugin help will add some default help features to your app
 * @param options specific for setting up help plugin
 * @returns Plugin
 */
 export function help(options : Options = {}) {

  return function help(app: Application) {
    const newOptions: Options = {
      helpType: options.helpType === null ? null : 'switch',
      helpShortSwitch: options.helpShortSwitch || 'h',
      helpLongSwitch: options.helpLongSwitch || 'help',
      helpOnNoTarget: options.helpOnNoTarget === false ? false : true,
      helpOnNoCallback: options.helpOnNoCallback === false ? false : true,
      helpOnVerifySwitchFailure: options.helpOnVerifySwitchFailure === false ? false : true,
      helpOnAskedForHelp: options.helpOnAskedForHelp === false ? false : true,
    }

    app.beforeAll(createSkipStrictSwitchMatchingIfAskedForHelpHook(newOptions));

    if (newOptions.helpOnAskedForHelp) {
      app.afterTargetFound(createAskForHelpHook(newOptions));
    }

    if (newOptions.helpOnNoCallback) {
      app.noCallback(createNotFoundHook(newOptions));
    }

    if (newOptions.helpOnNoTarget) {
      app.noTarget(createNotFoundHook(newOptions));
    }

    if (newOptions.helpOnVerifySwitchFailure) {
      app.onVerifySwitchFailure(createNotFoundHook(newOptions));
    }
  }
  
}
