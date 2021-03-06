import { expect } from 'chai';
import { PathItem } from '../../../src/PathTree/PathItem';
import { createAskForHelpHook } from '../../../src/plugins/help/createAskForHelpHook';
import { StaticPathItem } from '../../../src/PathTree/StaticPathItem';
import { CallbackInput, Config } from '../../../src/types';
import { PathTree } from '../../../src/PathTree/PathTree';


describe('askForHelpHook', () => {
  it('askForHelpHook when helpType is not "switch"', () => {
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

    const askForHelpHook = createAskForHelpHook({
      helpType: null,
      helpShortSwitch: 'x',
      helpLongSwitch: 'xelp',
      helpOnNoTarget: true,
      helpOnNoCallback: true,
      helpOnVerifySwitchFailure: true,
      helpOnAskedForHelp: true,
    });

    askForHelpHook.call(pathItem, inputs, config, tree);
    expect(consolelogMessage).be.null;

    console.log = consolelog;
  });

  it('askForHelpHook when helpType is "switch" but help switch did not passed', () => {
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

    const askForHelpHook = createAskForHelpHook({
      helpType: 'switch',
      helpShortSwitch: 'x',
      helpLongSwitch: 'xelp',
      helpOnNoTarget: true,
      helpOnNoCallback: true,
      helpOnVerifySwitchFailure: true,
      helpOnAskedForHelp: true,
    });

    askForHelpHook.call(pathItem, inputs, config, tree);
    expect(consolelogMessage).be.null;

    console.log = consolelog;
  });

  it('askForHelpHook when helpType is "switch" and helpShortSwitch passed', () => {
    let consolelog = console.log;
    let consolelogMessage = null;
    console.log = function(text: any) { consolelogMessage = text };

    const pathItem = new StaticPathItem('static1', null);
    const inputs: CallbackInput = { commands: ['static1'], pathParams: {}, shortSwitches: { x: [] }, longSwitches: {}, switches: {}, context: {} };
    const config: Config = {
      applicationName: '<App>',
      checkForSwitchConflicts: true,
      strictSwitchMatching: true,
    }
    const tree = new PathTree();
    tree.getRoot().addStaticPathItem(pathItem);

    const askForHelpHook = createAskForHelpHook({
      helpType: 'switch',
      helpShortSwitch: 'x',
      helpLongSwitch: 'xelp',
      helpOnNoTarget: true,
      helpOnNoCallback: true,
      helpOnVerifySwitchFailure: true,
      helpOnAskedForHelp: true,
    });

    askForHelpHook.call(pathItem, inputs, config, tree);
    expect(consolelogMessage).contains('<App>')
    expect(consolelogMessage).contains('static1')

    console.log = consolelog;
  });

  it('askForHelpHook when helpType is "switch" and helpLongSwitch passed', () => {
    let consolelog = console.log;
    let consolelogMessage = null;
    console.log = function(text: any) { consolelogMessage = text };

    const pathItem = new StaticPathItem('static1', null);
    const inputs: CallbackInput = { commands: ['static1'], pathParams: {}, shortSwitches: {}, longSwitches: { xelp: [] }, switches: {}, context: {} };
    const config: Config = {
      applicationName: '<App>',
      checkForSwitchConflicts: true,
      strictSwitchMatching: true,
    }
    const tree = new PathTree();
    tree.getRoot().addStaticPathItem(pathItem);

    const askForHelpHook = createAskForHelpHook({
      helpType: 'switch',
      helpShortSwitch: 'x',
      helpLongSwitch: 'xelp',
      helpOnNoTarget: true,
      helpOnNoCallback: true,
      helpOnVerifySwitchFailure: true,
      helpOnAskedForHelp: true,
    });

    askForHelpHook.call(pathItem, inputs, config, tree);
    expect(consolelogMessage).contains('<App>')
    expect(consolelogMessage).contains('static1')

    console.log = consolelog;
  });

  it('askForHelpHook when helpType is "switch" and helpLongSwitch passed and pathItem is null', () => {
    let consolelog = console.log;
    let consolelogMessage = null;
    console.log = function(text: any) { consolelogMessage = text };

    const pathItem: PathItem = null
    const inputs: CallbackInput = { commands: ['static1'], pathParams: {}, shortSwitches: {}, longSwitches: { xelp: [] }, switches: {}, context: {} };
    const config: Config = {
      applicationName: '<App>',
      checkForSwitchConflicts: true,
      strictSwitchMatching: true,
    }
    const tree = new PathTree();

    const askForHelpHook = createAskForHelpHook({
      helpType: 'switch',
      helpShortSwitch: 'x',
      helpLongSwitch: 'xelp',
      helpOnNoTarget: true,
      helpOnNoCallback: true,
      helpOnVerifySwitchFailure: true,
      helpOnAskedForHelp: true,
    });

    askForHelpHook.call(pathItem, inputs, config, tree);
    expect(consolelogMessage).contains('<App>')
    expect(consolelogMessage).not.contains('static1')

    console.log = consolelog;
  });
});
