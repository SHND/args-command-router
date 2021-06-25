import { expect } from 'chai';
import { PathTree } from '../../../src/PathTree/PathTree';
import { PathItem } from '../../../src/PathTree/PathItem';
import { CallbackInput, Config } from '../../../src/types';
import { createNotFoundHook } from '../../../src/plugins/help/createNotFoundHook';
import { StaticPathItem } from '../../../src/PathTree/StaticPathItem';


describe('notFoundHook', () => {
  it('notFoundHook when helpType is not "switch"', () => {
    let consolelog = console.log;
    let consolelogMessage = null;
    console.log = function(text: any) { consolelogMessage = text };

    const pathItem = new StaticPathItem('static1', null);
    const inputs: CallbackInput = { commands: ['static1'], pathParams: {}, shortSwitches: {}, longSwitches: {}, switches: {}, context: {} };
    const config: Config = {
      applicationName: '<App>',
      checkForSwitchConflicts: true,
      strictSwitchMatching: true,
    }
    const tree = new PathTree();
    tree.getRoot().addStaticPathItem(pathItem);

    const notFoundHook = createNotFoundHook({
      helpShortSwitch: 'x',
      helpLongSwitch: 'xelp',
      helpOnNoTarget: true,
      helpOnNoCallback: true,
      helpOnVerifySwitchFailure: true,
      helpOnAskedForHelp: true,
    });

    notFoundHook.call(pathItem, inputs, config, tree);
    expect(consolelogMessage).be.null;

    console.log = consolelog;
  });

  it('notFoundHook when helpType is "switch" and pathItem exist', () => {
    let consolelog = console.log;
    let consolelogMessage = null;
    console.log = function(text: any) { consolelogMessage = text };

    const pathItem = new StaticPathItem('static1', null);
    const inputs: CallbackInput = { commands: ['static1'], pathParams: {}, shortSwitches: {}, longSwitches: {}, switches: {}, context: {} };
    const config: Config = {
      applicationName: '<App>',
      checkForSwitchConflicts: true,
      strictSwitchMatching: true,
    }
    const tree = new PathTree();
    tree.getRoot().addStaticPathItem(pathItem);

    const notFoundHook = createNotFoundHook({
      helpType: 'switch',
      helpShortSwitch: 'x',
      helpLongSwitch: 'xelp',
      helpOnNoTarget: true,
      helpOnNoCallback: true,
      helpOnVerifySwitchFailure: true,
      helpOnAskedForHelp: true,
    });

    notFoundHook.call(pathItem, inputs, config, tree);
    expect(consolelogMessage).contains('<App>');
    expect(consolelogMessage).contains('static1');

    console.log = consolelog;
  });

  it('notFoundHook when helpType is "switch" and pathItem is null', () => {
    let consolelog = console.log;
    let consolelogMessage = null;
    console.log = function(text: any) { consolelogMessage = text };

    const pathItem: PathItem = null
    const inputs: CallbackInput = { commands: ['static1'], pathParams: {}, shortSwitches: {}, longSwitches: {}, switches: {}, context: {} };
    const config: Config = {
      applicationName: '<App>',
      checkForSwitchConflicts: true,
      strictSwitchMatching: true,
    }
    const tree = new PathTree();

    const notFoundHook = createNotFoundHook({
      helpType: 'switch',
      helpShortSwitch: 'x',
      helpLongSwitch: 'xelp',
      helpOnNoTarget: true,
      helpOnNoCallback: true,
      helpOnVerifySwitchFailure: true,
      helpOnAskedForHelp: true,
    });

    notFoundHook.call(pathItem, inputs, config, tree);
    expect(consolelogMessage).contains('<App>')

    console.log = consolelog;
  });
});
