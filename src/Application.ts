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
  }

  public route(path: string) {
    return new Route(this._tree, path);
  }

  public run(argv?: string[]) {

    let partialContext: CallbackReturnType = {};

    // if argv is undefined, use the arguments passed from shell
    const args = parser(argv).data;
    const root = this._tree.getRoot();

    const commands = args.commands;
    const shortSwitches = args.shortSwitches;
    const longSwitches = args.longSwitches;

    const app = this;
    
    if ((partialContext = processCallbacks(null, partialContext, args, {}, this._beforeAll)) === STOP) return;
    
    const targetBlockPathItem = matchCommands(commands, root);

    if (targetBlockPathItem) {

      const pathParametes = matchCommandsGetPathParameters(commands, root);
      const targetSwitchPathItem = matchSwitches(shortSwitches, longSwitches, targetBlockPathItem);
      const target: PathItem = targetSwitchPathItem || targetBlockPathItem;

      if ((partialContext = processCallbacks(target, partialContext, args, {}, this._afterTargetFound)) === STOP) return;

      const targetCallbacks = target.getCallbacks();
      if (targetCallbacks.length > 0) {
        if ((partialContext = processCallbacks(target, partialContext, args, {}, this._afterCallbackFound)) === STOP) return;

        if (app._config.verifySwitches) {
          try {
            verifySwitches(target, args.shortSwitches, args.longSwitches, this._config);
          } catch(error) {
            if ((partialContext = processCallbacks(target, partialContext, args, {}, this._onVerifySwitchFailure)) === STOP) return;
            if ((partialContext = processCallbacks(target, partialContext, args, {}, this._afterAll)) === STOP) return;
            return;
          }
        }

        if ((partialContext = processCallbacks(target, partialContext, args, {}, this._beforeCallback)) === STOP) return;

        if ((partialContext = processCallbacks(target, partialContext, args, pathParametes, targetCallbacks)) === STOP) return;

        if ((partialContext = processCallbacks(target, partialContext, args, {}, this._afterCallback)) === STOP) return;
      } else {
        if ((partialContext = processCallbacks(target, partialContext, args, {}, this._noCallback)) === STOP) return;
      }
    } else {
      if ((partialContext = processCallbacks(null, partialContext, args, {}, this._noTarget)) === STOP) return;
    }

    if ((partialContext = processCallbacks(null, partialContext, args, {}, this._afterAll)) === STOP) return;
    
    // /**
    //  * Help Before All Hook
    //  */
    // this._beforeAllCallbacks.push(function (this: PathItem, context) {
    //   if (that._config.helpType === 'switch') {
    //     if (context.shortSwitches[that._config.helpShortSwitch] || context.longSwitches[that._config.helpLongSwitch]) {
    //       if (this) {
    //         this.showHelp(that._config.applicationName);
    //       } else {
    //         root.showHelp(that._config.applicationName);
    //       }

    //       return STOP;
    //     }
    //   }
    // });

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
