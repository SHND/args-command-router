import { expect } from 'chai';
import Application from "../../../src/Application";
import { help } from "../../../src/plugins/help";

describe('help plugin', () => {
  
  it('when default option values', () => {
    const app = new Application();
    const helpPlugin = help();
    
    helpPlugin(app);
    
    expect(app['_beforeAll']).lengthOf(1);
    expect(app['_afterTargetFound']).lengthOf(1);
    expect(app['_noCallback']).lengthOf(1);
    expect(app['_noTarget']).lengthOf(1);
    expect(app['_onVerifySwitchFailure']).lengthOf(1);
  });
  
  it('when helpType is set to value null with default values', () => {
    const app = new Application();
    const helpPlugin = help({
      helpType: null
    });
    
    helpPlugin(app);
    
    expect(app['_beforeAll']).lengthOf(1);
    expect(app['_afterTargetFound']).lengthOf(1);
    expect(app['_noCallback']).lengthOf(1);
    expect(app['_noTarget']).lengthOf(1);
    expect(app['_onVerifySwitchFailure']).lengthOf(1);
  });

  it('when helpOnAskedForHelp is false', () => {
    const app = new Application();
    const helpPlugin = help({
      helpOnAskedForHelp: false
    });

    helpPlugin(app);

    expect(app['_beforeAll']).lengthOf(1);
    expect(app['_afterTargetFound']).lengthOf(0);
    expect(app['_noCallback']).lengthOf(1);
    expect(app['_noTarget']).lengthOf(1);
    expect(app['_onVerifySwitchFailure']).lengthOf(1);
  });

  it('when helpOnNoCallback is false', () => {
    const app = new Application();
    const helpPlugin = help({
      helpOnNoCallback: false
    });

    helpPlugin(app);

    expect(app['_beforeAll']).lengthOf(1);
    expect(app['_afterTargetFound']).lengthOf(1);
    expect(app['_noCallback']).lengthOf(0);
    expect(app['_noTarget']).lengthOf(1);
    expect(app['_onVerifySwitchFailure']).lengthOf(1);
  });

  it('when helpOnNoTarget is false', () => {
    const app = new Application();
    const helpPlugin = help({
      helpOnNoTarget: false
    });

    helpPlugin(app);

    expect(app['_beforeAll']).lengthOf(1);
    expect(app['_afterTargetFound']).lengthOf(1);
    expect(app['_noCallback']).lengthOf(1);
    expect(app['_noTarget']).lengthOf(0);
    expect(app['_onVerifySwitchFailure']).lengthOf(1);
  });

  it('when helpOnVerifySwitchFailure is false', () => {
    const app = new Application();
    const helpPlugin = help({
      helpOnVerifySwitchFailure: false
    });

    helpPlugin(app);

    expect(app['_beforeAll']).lengthOf(1);
    expect(app['_afterTargetFound']).lengthOf(1);
    expect(app['_noCallback']).lengthOf(1);
    expect(app['_noTarget']).lengthOf(1);
    expect(app['_onVerifySwitchFailure']).lengthOf(0);
  });
  
});
