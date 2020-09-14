import { PathTree } from './PathTree/PathTree'
import { Route } from './Route';
import { parser } from 'args-command-parser';
import { matchCommands, matchSwitches, matchCommandsGetPathParameters } from './utility';
import { PathItem } from './PathTree/PathItem';

export default class Application {

  private _config: { [key: string]: any }
  private _tree = new PathTree();

  constructor(config = {}) {
    this._config = config
  }

  public route(path: string) {
    return new Route(this._tree, path);
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
      //FIXME: no route
      console.log('no route');
      process.exit(0);
    }

    const pathParametes = matchCommandsGetPathParameters(commands, root);

    const targetSwitchPathItem = matchSwitches(shortSwitches, longSwitches, targetBlockPathItem);

    const target: PathItem = targetSwitchPathItem || targetBlockPathItem;

    target.getCallbacks().forEach(callback => {
      callback.call(target, {
        commands: args.commands,
        pathParams: pathParametes,
        shortSwitches: args.shortSwitches,
        longSwitches: args.longSwitches,
        switches: { ...args.shortSwitches, ...args.longSwitches },
        all: { ...pathParametes, ...shortSwitches, ...longSwitches }
      })
    });
  }

  public debug() {
    this._tree.printPathItems();
  }

}
