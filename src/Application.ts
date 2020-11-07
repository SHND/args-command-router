import { PathTree } from './PathTree/PathTree'
import { Route } from './Route';
import { parser } from 'args-command-parser';
import { PathItem } from './PathTree/PathItem';
import { Callback, CallbackReturnType, Config } from './types';
import { matchCommands, matchSwitches, matchCommandsGetPathParameters, noop, processCallbacks, verifySwitches } from './utility';
import { STOP } from './constants';


export default class Application {

  private _config: Config
  private _tree = new PathTree();
  
  private _norouteCallback: Callback = noop;

  private _beforeTargetCallbacks: Callback[] = [];
  private _afterTargetCallbacks: Callback[] = [];

  private _beforeAllCallbacks: Callback[] = [];
  private _afterAllCallbacks: Callback[] = [];

  constructor(config: Partial<Config> = {}) {
    this._config = {
      applicationName: config.applicationName || '<App>',
      applyMiddlewareOnNoRoute: config.applyMiddlewareOnNoRoute || false,
      helpType: config.helpType === null ? null : 'switch',
      helpShortSwitch: config.helpShortSwitch || 'h',
      helpLongSwitch: config.helpLongSwitch || 'help',
      showHelpOnNoRoute: config.showHelpOnNoRoute || true,
    }
  }

  public route(path: string) {
    return new Route(this._tree, path);
  }

  public noroute(callback: Callback) {
    this._norouteCallback = callback;
  }

  public before(callback: Callback) {
    if (this._config.applyMiddlewareOnNoRoute) {
      this._beforeAllCallbacks.push(callback);
    } else {
      this._beforeTargetCallbacks.push(callback);
    }
  }

  public after(callback: Callback) {
    if (this._config.applyMiddlewareOnNoRoute) {
      this._afterAllCallbacks.push(callback);
    } else {
      this._afterTargetCallbacks.push(callback);
    }
  }

  public run(argv?: string[]) {

    let partialContext: CallbackReturnType = {};

    // if argv is undefined, use the arguments passed from shell
    const args = parser(argv).data;
    const root = this._tree.getRoot();

    const commands = args.commands;
    const shortSwitches = args.shortSwitches;
    const longSwitches = args.longSwitches;

    const that = this;
    /**
     * Help Before All Hook
     */
    this._beforeAllCallbacks.push(function (this: PathItem, context) {
      if (that._config.helpType === 'switch') {
        if (context.shortSwitches[that._config.helpShortSwitch] || context.longSwitches[that._config.helpLongSwitch]) {
          if (this) {
            this.showHelp(that._config.applicationName);
          } else {
            root.showHelp(that._config.applicationName);
          }

          return STOP;
        }
      }
    });

    const targetBlockPathItem = matchCommands(commands, root);

    if (!targetBlockPathItem) {
      if ((partialContext = processCallbacks(null, partialContext, args, {}, this._beforeAllCallbacks)) === STOP) return;
      
      if ((partialContext = processCallbacks(null, partialContext, args, {}, [this._norouteCallback])) === STOP) return;

      if (this._config.showHelpOnNoRoute && that._config.helpType !== null) {
        root.showHelp(this._config.applicationName);
      }

      if ((partialContext = processCallbacks(null, partialContext, args, {}, this._afterAllCallbacks)) === STOP) return;

      return;
    }

    const pathParametes = matchCommandsGetPathParameters(commands, root);

    const targetSwitchPathItem = matchSwitches(shortSwitches, longSwitches, targetBlockPathItem);

    const target: PathItem = targetSwitchPathItem || targetBlockPathItem;

    try {
      verifySwitches(target, args.shortSwitches, args.longSwitches, this._config);
    } catch(error) {
      console.error(error.message);
      return;
    }

    if ((partialContext = processCallbacks(target, partialContext, args, pathParametes, this._beforeAllCallbacks)) === STOP) return;

    const targetCallbacks = target.getCallbacks();
    if (targetCallbacks.length > 0) {
      if ((partialContext = processCallbacks(target, partialContext, args, pathParametes, this._beforeTargetCallbacks)) === STOP) return;

      if ((partialContext = processCallbacks(target, partialContext, args, pathParametes, targetCallbacks)) === STOP) return;

      if ((partialContext = processCallbacks(target, partialContext, args, pathParametes, this._afterTargetCallbacks)) === STOP) return;
    } else {
      if ((partialContext = processCallbacks(target, partialContext, args, {}, [this._norouteCallback])) === STOP) return;

      if (this._config.showHelpOnNoRoute && that._config.helpType !== null) {
        target.showHelp(this._config.applicationName);
      }
    }

    if ((partialContext = processCallbacks(target, partialContext, args, pathParametes, this._afterAllCallbacks)) === STOP) return;
  }

  public debug() {
    this._tree.printPathItems();
  }

}
