import { expect } from 'chai'
import Application from '../src/Application';

describe('Application', () => {
  it('appName method', () => {
    const app = new Application({
      applicationName: 'Application Name'
    });

    expect(app.appName()).equal('Application Name');
  });

  it('plugin method', () => {
    const app = new Application({
      applicationName: 'Application Name'
    });

    const _plugin = function(_app: Application) {
      expect(_app).equal(app);
    }

    app.plugin(_plugin);
  });

  it('appName', () => {
    const app = new Application({
      applicationName: 'Application Name'
    });

    expect(app.appName()).equals('Application Name');
  });

  it('beforeAll', () => {
    const app = new Application();
    const hook = () => {};

    expect(app['_beforeAll']).lengthOf(0);
    app.beforeAll(hook);
    expect(app['_beforeAll']).eql([hook]);
  });

  it('afterTargetFound', () => {
    const app = new Application();
    const hook = () => {};

    expect(app['_afterTargetFound']).lengthOf(0);
    app.afterTargetFound(hook);
    expect(app['_afterTargetFound']).eql([hook]);
  });

  it('afterCallbackFound', () => {
    const app = new Application();
    const hook = () => {};

    expect(app['_afterCallbackFound']).lengthOf(0);
    app.afterCallbackFound(hook);
    expect(app['_afterCallbackFound']).eql([hook]);
  });

  it('beforeCallback', () => {
    const app = new Application();
    const hook = () => {};

    expect(app['_beforeCallback']).lengthOf(0);
    app.beforeCallback(hook);
    expect(app['_beforeCallback']).eql([hook]);
  });

  it('afterCallback', () => {
    const app = new Application();
    const hook = () => {};

    expect(app['_afterCallback']).lengthOf(0);
    app.afterCallback(hook);
    expect(app['_afterCallback']).eql([hook]);
  });

  it('afterAll', () => {
    const app = new Application();
    const hook = () => {};

    expect(app['_afterAll']).lengthOf(0);
    app.afterAll(hook);
    expect(app['_afterAll']).eql([hook]);
  });

  it('noTarget', () => {
    const app = new Application();
    const hook = () => {};

    expect(app['_noTarget']).lengthOf(0);
    app.noTarget(hook);
    expect(app['_noTarget']).eql([hook]);
  });

  it('noCallback', () => {
    const app = new Application();
    const hook = () => {};

    expect(app['_noCallback']).lengthOf(0);
    app.noCallback(hook);
    expect(app['_noCallback']).eql([hook]);
  });

  it('onVerifySwitchFailure', () => {
    const app = new Application();
    const hook = () => {};

    expect(app['_onVerifySwitchFailure']).lengthOf(0);
    app.onVerifySwitchFailure(hook);
    expect(app['_onVerifySwitchFailure']).eql([hook]);
  });
  
});
