import { PathTree } from './PathTree/PathTree'
import { Route } from './Route';
import { parser } from 'args-command-parser';
import { PathItem } from './PathTree/PathItem';
import { Callback, CallbackContext, Config } from './types';
import { matchCommands, matchSwitches, matchCommandsGetPathParameters, noop, processCallbacks, verifySwitches } from './utility';
import { STOP } from './constants';
import { askForHelpHook } from './hooks/askForHelpHook';
import { notFoundHook } from './hooks/notFoundHook';


export default class Application {

  private _config: Config
  private _tree = new PathTree();

  private _beforeAll: Callback[] = [];
  private _afterTargetFound: Callback[] = [];
  private _afterCallbackFound: Callback[] = [];
  private _beforeCallback: Callback[] = [];
  private _afterCallback: Callback[] = [];
  private _afterAll: Callback[] = [];
  private _noTarget: Callback[] = [];
  private _noCallback: Callback[] = [];
  private _onVerifySwitchFailure: Callback[] = [];

  constructor(config: Partial<Config> = {}) {
    this._config = {
      applicationName: config.applicationName || '<App>',
      verifySwitches: config.verifySwitches === false ? false : true,
      helpType: config.helpType === null ? null : 'switch',
      helpShortSwitch: config.helpShortSwitch || 'h',
      helpLongSwitch: config.helpLongSwitch || 'help',
      helpOnNoTarget: config.helpOnNoTarget === false ? false : true,
      helpOnNoCallback: config.helpOnNoCallback === false ? false : true,
      helpOnVerifySwitchFailure: config.helpOnVerifySwitchFailure === false ? false : true,
      helpOnAskedForHelp: config.helpOnAskedForHelp === false ? false : true,
    }

    if (this._config.helpOnAskedForHelp) {
      this.afterTargetFound(askForHelpHook)
    }

    if (this._config.helpOnNoCallback) {
      this.noCallback(notFoundHook);
    }

    if (this._config.helpOnNoTarget) {
      this.noTarget(notFoundHook);
    }

    if (this._config.helpOnVerifySwitchFailure) {
      this.onVerifySwitchFailure(notFoundHook);
    }
  }

  public route(path: string) {
    return new Route(this._tree, path);
  }

  public run(argv?: string[]) {

    let context: CallbackContext = {};

    // if argv is undefined, use the arguments passed from shell
    const args = parser(argv).data;
    const root = this._tree.getRoot();

    const commands = args.commands;
    const shortSwitches = args.shortSwitches;
    const longSwitches = args.longSwitches;

    const config = this._config;
    const tree = this._tree;
    
    // ------------------ beforeAll hook ------------------
    const beforeAllResult = processCallbacks(null, context, args, {}, config, tree, this._beforeAll);
    if (beforeAllResult === STOP) return;
    else context = beforeAllResult || context;
    // ------------------------------------------------------
    
    const targetBlockPathItem = matchCommands(commands, root);

    if (targetBlockPathItem) {

      const pathParametes = matchCommandsGetPathParameters(commands, root);
      const targetSwitchPathItem = matchSwitches(shortSwitches, longSwitches, targetBlockPathItem);
      const target: PathItem = targetSwitchPathItem || targetBlockPathItem;

      // ------------------ afterTargetFound hook ------------------
      const afterTargetFoundResult = processCallbacks(target, context, args, pathParametes, config, tree, this._afterTargetFound);
      if (afterTargetFoundResult === STOP) return;
      else context = afterTargetFoundResult || context;
      // ------------------------------------------------------

      const targetCallbacks = target.getCallbacks();
      if (targetCallbacks.length > 0) {

        // ------------------ afterCallbackFound hook ------------------
        const afterCallbackFoundResult = processCallbacks(target, context, args, pathParametes, config, tree, this._afterCallbackFound);
        if (afterCallbackFoundResult === STOP) return;
        else context = afterCallbackFoundResult || context;
        // -------------------------------------------------------------

        if (config.verifySwitches) {
          try {
            verifySwitches(target, args.shortSwitches, args.longSwitches, this._config);
          } catch(error) {
            // ------------------ onVerifySwitchFailure hook ------------------
            const onVerifySwitchFailureResult = processCallbacks(target, context, args, pathParametes, config, tree, this._onVerifySwitchFailure);
            if (onVerifySwitchFailureResult === STOP) return;
            else context = onVerifySwitchFailureResult || context;
            // ----------------------------------------------------------------

            // ------------------ afterAll hook ------------------
            const afterAllResult = processCallbacks(target, context, args, pathParametes, config, tree, this._afterAll);
            if (afterAllResult === STOP) return;
            else context = afterAllResult || context;
            // ---------------------------------------------------

            return;
          }
        }

        // ------------------ beforeCallback hook ------------------
        const beforeCallbackResult = processCallbacks(target, context, args, pathParametes, config, tree, this._beforeCallback);
        if (beforeCallbackResult === STOP) return;
        else context = beforeCallbackResult || context;
        // ---------------------------------------------------------

        // ------------------ targetCallbacks ------------------
        const targetCallbacksResult = processCallbacks(target, context, args, pathParametes, config, tree, targetCallbacks);
        if (targetCallbacksResult === STOP) return;
        else context = targetCallbacksResult || context;
        // -----------------------------------------------------

        // ------------------ afterCallback hook ------------------
        const afterCallbackResult = processCallbacks(target, context, args, pathParametes, config, tree, this._afterCallback);
        if (afterCallbackResult === STOP) return;
        else context = afterCallbackResult || context;
        // --------------------------------------------------------
      } else {
        // ------------------ noCallback hook ------------------
        const noCallbackResult = processCallbacks(target, context, args, pathParametes, config, tree, this._noCallback);
        if (noCallbackResult === STOP) return;
        else context = noCallbackResult || context;
        // -----------------------------------------------------
      }
    } else {
      // ------------------ noTarget hook ------------------
      const noTargetResult = processCallbacks(null, context, args, {}, config, tree, this._noTarget);
      if (noTargetResult === STOP) return;
      else context = noTargetResult || context;
      // ---------------------------------------------------
    }

    // ------------------ afterAll hook ------------------
    const afterAllResult = processCallbacks(null, context, args, {}, config, tree, this._afterAll);
    if (afterAllResult === STOP) return;
    else context = afterAllResult || context;
    // ---------------------------------------------------
  }

  public beforeAll(hook: Callback) {
    this._beforeAll.push(hook);
  }

  public afterTargetFound(hook: Callback) {
    this._afterTargetFound.push(hook);
  }

  public afterCallbackFound(hook: Callback) {
    this._afterCallbackFound.push(hook);
  }

  public beforeCallback(hook: Callback) {
    this._beforeCallback.push(hook);
  }

  public afterCallback(hook: Callback) {
    this._afterCallback.push(hook);
  }

  public afterAll(hook: Callback) {
    this._afterAll.push(hook);
  }

  public noTarget(hook: Callback) {
    this._noTarget.push(hook);
  }

  public noCallback(hook: Callback) {
    this._noCallback.push(hook);
  }

  public onVerifySwitchFailure(hook: Callback) {
    this._onVerifySwitchFailure.push(hook);
  }

  public debug() {
    this._tree.printPathItems();
  }

}
