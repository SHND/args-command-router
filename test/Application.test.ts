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

});
