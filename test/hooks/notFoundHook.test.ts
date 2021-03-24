import { expect } from 'chai';
import { PathTree } from '../../src/PathTree/PathTree';
import { PathItem } from '../../src/PathTree/PathItem';
import { CallbackInput, Config } from '../../src/types';
import { notFoundHook } from '../../src/hooks/notFoundHook';
import { StaticPathItem } from '../../src/PathTree/StaticPathItem';


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
      helpType: null,
      helpShortSwitch: 'x',
      helpLongSwitch: 'xelp',
      helpOnNoTarget: true,
      helpOnNoCallback: true,
      helpOnVerifySwitchFailure: true,
      helpOnAskedForHelp: true,
    }
    const tree = new PathTree();
    tree.getRoot().addStaticPathItem(pathItem);

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
      helpType: 'switch',
      helpShortSwitch: 'x',
      helpLongSwitch: 'xelp',
      helpOnNoTarget: true,
      helpOnNoCallback: true,
      helpOnVerifySwitchFailure: true,
      helpOnAskedForHelp: true,
    }
    const tree = new PathTree();
    tree.getRoot().addStaticPathItem(pathItem);

    notFoundHook.call(pathItem, inputs, config, tree);
    expect(consolelogMessage).contains('<App> static1');

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
      helpType: 'switch',
      helpShortSwitch: 'x',
      helpLongSwitch: 'xelp',
      helpOnNoTarget: true,
      helpOnNoCallback: true,
      helpOnVerifySwitchFailure: true,
      helpOnAskedForHelp: true,
    }
    const tree = new PathTree();

    notFoundHook.call(pathItem, inputs, config, tree);
    expect(consolelogMessage).contains('<App>')

    console.log = consolelog;
  });
});
