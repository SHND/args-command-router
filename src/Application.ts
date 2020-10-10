import { PathTree } from './PathTree/PathTree'
import { Route } from './Route';
import { parser } from 'args-command-parser';
import { matchCommands, matchSwitches, matchCommandsGetPathParameters, noop } from './utility';
import { PathItem } from './PathTree/PathItem';

export default class Application {

  private _config: { [key: string]: any }
  private _tree = new PathTree();
  private _norouteCallback: Function = noop;
  private _beforeCallbacks: Function[] = [];
  private _afterCallbacks: Function[] = [];

  constructor(config = {}) {
    this._config = config
  }

  public route(path: string) {
    return new Route(this._tree, path);
  }

  public noroute(callback: Function) {
    this._norouteCallback = callback;
  }

  public before(callback: Function) {
    this._beforeCallbacks.push(callback);
  }

  public after(callback: Function) {
    this._afterCallbacks.push(callback);
  }

  public run(argv?: string[]) {

    // if argv is undefined, use the arguments passed from shell
    const args = parser(argv).data;
    const root = this._tree.getRoot();

    const commands = args.commands;
    const shortSwitches = args.shortSwitches;
    const longSwitches = args.longSwitches;

    const targetBlockPathItem = matchCommands(commands, root);

    if (!targetBlockPathItem) {
      this._norouteCallback.call(null, {
        commands: args.commands,
        pathParams: {},
        shortSwitches: args.shortSwitches,
        longSwitches: args.longSwitches,
        switches: { ...args.shortSwitches, ...args.longSwitches }
      });
      
      return;
    }

    const pathParametes = matchCommandsGetPathParameters(commands, root);

    const targetSwitchPathItem = matchSwitches(shortSwitches, longSwitches, targetBlockPathItem);

    const target: PathItem = targetSwitchPathItem || targetBlockPathItem;

    const processMiddleware = ((callback: Function) => {
      let goNext = false; 
      
      const next = () => goNext = true;

      callback.call(target, {
        commands: args.commands,
        pathParams: pathParametes,
        shortSwitches: args.shortSwitches,
        longSwitches: args.longSwitches,
        switches: { ...args.shortSwitches, ...args.longSwitches }
      }, next);

      if (!goNext) {
        process.exit(0);
      }
    });

    const targetCallbacks = target.getCallbacks();
    if (targetCallbacks.length > 0) {
      this._beforeCallbacks.forEach(processMiddleware);

      targetCallbacks.forEach(callback => {
        callback.call(target, {
          commands: args.commands,
          pathParams: pathParametes,
          shortSwitches: args.shortSwitches,
          longSwitches: args.longSwitches,
          switches: { ...args.shortSwitches, ...args.longSwitches }
        })
      });
      
      this._afterCallbacks.forEach(processMiddleware);
    } else {
      this._norouteCallback.call(null, {
        commands: args.commands,
        pathParams: {},
        shortSwitches: args.shortSwitches,
        longSwitches: args.longSwitches,
        switches: { ...args.shortSwitches, ...args.longSwitches }
      });
    }

  }

  public debug() {
    this._tree.printPathItems();
  }

}
