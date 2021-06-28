import { expect } from 'chai';
import { SKIP_matchRuntimeAndDefinedSwitches } from '../../../src/constants';
import { PathTree } from '../../../src/PathTree/PathTree';
import { StaticPathItem } from '../../../src/PathTree/StaticPathItem';
import { createSkipStrictSwitchMatchingIfAskedForHelpHook } from '../../../src/plugins/help/createSkipStrictSwitchMatchingIfAskedForHelpHook';
import { Options } from '../../../src/plugins/help/Options';
import { CallbackInput, Config } from '../../../src/types';

describe('createSkipStrictSwitchMatchingIfAskedForHelpHook', () => {

  it('when switchType is not value "switch"', () => {
    const helpOptions: Options = { };
    const pathItem = new StaticPathItem('static1', null);
    const context = {};
    const inputs: CallbackInput = { commands: ['static1'], 
      pathParams: {}, 
      shortSwitches: {}, 
      longSwitches: {}, 
      switches: {}, 
      context 
    };
    const config: Config = {
      applicationName: '<App>',
      checkForSwitchConflicts: true,
      strictSwitchMatching: true,
    }
    const tree = new PathTree();
    tree.getRoot().addStaticPathItem(pathItem);

    const skipStrictSwitchMatchingIfAskedForHelpHook = createSkipStrictSwitchMatchingIfAskedForHelpHook(helpOptions);
    skipStrictSwitchMatchingIfAskedForHelpHook.call(pathItem, inputs, config, tree);

    expect(context).not.ownProperty(SKIP_matchRuntimeAndDefinedSwitches);
  });

  it('when helpShortSwitch and helpLongSwitch are not passed', () => {
    const helpOptions: Options = { helpType: 'switch' };
    const pathItem = new StaticPathItem('static1', null);
    const context = {};
    const inputs: CallbackInput = { commands: ['static1'], 
      pathParams: {}, 
      shortSwitches: {}, 
      longSwitches: {}, 
      switches: {}, 
      context 
    };
    const config: Config = {
      applicationName: '<App>',
      checkForSwitchConflicts: true,
      strictSwitchMatching: true,
    }
    const tree = new PathTree();
    tree.getRoot().addStaticPathItem(pathItem);

    const skipStrictSwitchMatchingIfAskedForHelpHook = createSkipStrictSwitchMatchingIfAskedForHelpHook(helpOptions);
    skipStrictSwitchMatchingIfAskedForHelpHook.call(pathItem, inputs, config, tree);

    expect(context).not.ownProperty(SKIP_matchRuntimeAndDefinedSwitches);
  });

  it('when helpShortSwitch is passed', () => {
    const helpOptions: Options = { helpType: 'switch', helpShortSwitch: 'h' }
    const pathItem = new StaticPathItem('static1', null);
    const context = {};
    const inputs: CallbackInput = { commands: ['static1'], 
      pathParams: {}, 
      shortSwitches: { h: [] }, 
      longSwitches: {}, 
      switches: { h: [] }, 
      context 
    };
    const config: Config = {
      applicationName: '<App>',
      checkForSwitchConflicts: true,
      strictSwitchMatching: true,
    }
    const tree = new PathTree();
    tree.getRoot().addStaticPathItem(pathItem);

    const skipStrictSwitchMatchingIfAskedForHelpHook = createSkipStrictSwitchMatchingIfAskedForHelpHook(helpOptions);
    skipStrictSwitchMatchingIfAskedForHelpHook.call(pathItem, inputs, config, tree);

    expect(context).ownProperty(SKIP_matchRuntimeAndDefinedSwitches, true);
  });

  it('when helpLongSwitch is passed', () => {
    const helpOptions: Options = { helpType: 'switch', helpLongSwitch: 'help' };
    const pathItem = new StaticPathItem('static1', null);
    const context = {};
    const inputs: CallbackInput = { 
      commands: ['static1'], 
      pathParams: {}, 
      shortSwitches: {}, 
      longSwitches: { help: [] }, 
      switches: { help: [] }, 
      context 
    };
    const config: Config = {
      applicationName: '<App>',
      checkForSwitchConflicts: true,
      strictSwitchMatching: true,
    }
    const tree = new PathTree();
    tree.getRoot().addStaticPathItem(pathItem);

    const skipStrictSwitchMatchingIfAskedForHelpHook = createSkipStrictSwitchMatchingIfAskedForHelpHook(helpOptions);
    skipStrictSwitchMatchingIfAskedForHelpHook.call(pathItem, inputs, config, tree);

    expect(context).ownProperty(SKIP_matchRuntimeAndDefinedSwitches, true);
  });

})