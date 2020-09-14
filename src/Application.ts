import { PathTree } from './PathTree/PathTree'
import { Route } from './Route';
import { parser } from 'args-command-parser';
import { matchCommands, matchSwitches, matchCommandsGetPathParameters, noop } from './utility';
import { PathItem } from './PathTree/PathItem';

export default class Application {

  private _config: { [key: string]: any }
  private _tree = new PathTree();
  private _noroute_callback: Function = noop;

  constructor(config = {}) {
    this._config = config
  }

  public route(path: string) {
    return new Route(this._tree, path);
  }

  public noroute(callback: Function) {
    this._noroute_callback = callback;
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
      this._noroute_callback.call(null, {
        commands: args.commands,
        pathParams: {},
        shortSwitches: args.shortSwitches,
        longSwitches: args.longSwitches,
        switches: { ...args.shortSwitches, ...args.longSwitches },
        all: { ...shortSwitches, ...longSwitches }
      });
      
      return;
    }

    const pathParametes = matchCommandsGetPathParameters(commands, root);

    const targetSwitchPathItem = matchSwitches(shortSwitches, longSwitches, targetBlockPathItem);

    const target: PathItem = targetSwitchPathItem || targetBlockPathItem;

    const targetCallbacks = target.getCallbacks();

    if (targetCallbacks.length > 0) {
      targetCallbacks.forEach(callback => {
        callback.call(target, {
          commands: args.commands,
          pathParams: pathParametes,
          shortSwitches: args.shortSwitches,
          longSwitches: args.longSwitches,
          switches: { ...args.shortSwitches, ...args.longSwitches },
          all: { ...pathParametes, ...shortSwitches, ...longSwitches }
        })
      });  
    } else {
      this._noroute_callback.call(null, {
        commands: args.commands,
        pathParams: {},
        shortSwitches: args.shortSwitches,
        longSwitches: args.longSwitches,
        switches: { ...args.shortSwitches, ...args.longSwitches },
        all: { ...shortSwitches, ...longSwitches }
      });
    }

  }

  public debug() {
    this._tree.printPathItems();
  }

}
