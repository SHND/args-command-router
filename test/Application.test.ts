import { expect } from 'chai'
import Application from '../src/Application';

describe('Application', () => {
  it('appName method', () => {
    const app = new Application({
      applicationName: 'Application Name'
    });

    expect(app.appName()).equal('Application Name');
  });
});
