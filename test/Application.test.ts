import { expect } from 'chai'
import Application from '../src/Application';

describe('Application', () => {

  describe('noroute()', () => {
    it('route not exist but no noroute callbacks are set', () => {
      const app = new Application();

      expect(() => {
        app.run(['cmd1']);
      }).not.throws();
    });

    it('route not exist and noroute callback is set', () => {
      let called = false;
      const app = new Application();

      app.noroute(() => {
        called = true;
      })

      app.run(['cmd1']);
      expect(called).be.true;
    });

    it('route exist but no callbacks exist', () => {
      let called = false;
      const app = new Application();
      app.route('/cmd1/cmd2')
        .callback(() => {})

      app.noroute(() => {
        called = true;
      })

      app.run(['cmd1']);
      expect(called).be.true;
    });

    it('route with some callbacks exist', () => {
      let called = false;
      const app = new Application();
      app.route('/cmd1')
        .callback(() => {})

      app.noroute(() => {
        called = true;
      })

      app.run(['cmd1']);
      expect(called).be.false;
    });
  });

});
