import { Route } from './Route';
import { STOP } from './constants';
import { parser } from 'args-command-parser';
import { PathTree } from './PathTree/PathTree'
import { PathItem } from './PathTree/PathItem';
import { notFoundHook } from './hooks/notFoundHook';
import { askForHelpHook } from './hooks/askForHelpHook';
import { Callback, CallbackContext, Config } from './types';
import { 
  matchCommands, 
  matchSwitches, 
  matchCommandsGetPathParameters, 
  processCallbacks, 
  matchRuntimeAndDefinedSwitches, 
  checkSwitchNameConflicts, 
  shellSuggestions
} from './utility';


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
      checkForSwitchConflicts: config.checkForSwitchConflicts === false ? false : true,
      strictSwitchMatching: config.strictSwitchMatching === false ? false : true,
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

  /**
   * Create a path in the PathTree and returns a route builder to 
   * add functionality for path (pathItem in the leaf of that path)
   * @param path of commands representing the path in PathTree
   */
  public route(path: string) {
    return new Route(this._tree, path);
  }

  /**
   * Run the Application with specified arguments.
   * If argv is not set, the Application will run with
   * arguments passed to the Application in the console.
   * @param argv runtime arguments passed to the application
   */
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

    if (config.checkForSwitchConflicts) {
      checkSwitchNameConflicts(tree.getRoot());
    }
    
    // ------------------ beforeAll hook ------------------
    const beforeAllResult = processCallbacks(null, context, args, {}, config, tree, this._beforeAll);
    if (beforeAllResult === STOP) return;
    else context = beforeAllResult || context;
    // ------------------------------------------------------
    
    const targetPathItem = matchCommands(commands, root);

    if (targetPathItem) {

      const pathParametes = matchCommandsGetPathParameters(commands, root);
      const targetSwitchPathItem = matchSwitches(shortSwitches, longSwitches, targetPathItem);
      const target: PathItem = targetSwitchPathItem || targetPathItem;

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

        if (config.strictSwitchMatching) {
          try {
            matchRuntimeAndDefinedSwitches(target, args.shortSwitches, args.longSwitches, this._config);
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

  public appName() {
    return this._config.applicationName;
  }

  public autoComplete(commands: string[]) {
    return shellSuggestions(this._tree, commands);
  }

  /**
   * Add a callback to beforeAll hook
   * @param {Callback} hook
   */
  public beforeAll(hook: Callback) {
    this._beforeAll.push(hook);
  }

  /**
   * Add a callback to afterTargetFound hook
   * @param {Callback} hook
   */
  public afterTargetFound(hook: Callback) {
    this._afterTargetFound.push(hook);
  }

  /**
   * Add a callback to afterCallbackFound hook
   * @param {Callback} hook
   */
  public afterCallbackFound(hook: Callback) {
    this._afterCallbackFound.push(hook);
  }

  /**
   * Add a callback to beforeCallback hook
   * @param {Callback} hook
   */
  public beforeCallback(hook: Callback) {
    this._beforeCallback.push(hook);
  }

  /**
   * Add a callback to afterCallback hook
   * @param {Callback} hook
   */
  public afterCallback(hook: Callback) {
    this._afterCallback.push(hook);
  }

  /**
   * Add a callback to afterAll hook
   * @param {Callback} hook
   */
  public afterAll(hook: Callback) {
    this._afterAll.push(hook);
  }

  /**
   * Add a callback to noTarget hook
   * @param {Callback} hook
   */
  public noTarget(hook: Callback) {
    this._noTarget.push(hook);
  }

  /**
   * Add a callback to noCallback hook
   * @param {Callback} hook
   */
  public noCallback(hook: Callback) {
    this._noCallback.push(hook);
  }

  /**
   * Add a callback to onVerifySwitchFailure hook
   * @param {Callback} hook
   */
  public onVerifySwitchFailure(hook: Callback) {
    this._onVerifySwitchFailure.push(hook);
  }

  /**
   * Prints the tree to the terminal
   */
  public debug() {
    console.log(this._tree.toString());
  }

}
