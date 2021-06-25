import { expect } from 'chai';
import { STOP } from '../../src/constants';
import { exampleHook } from '../../src/hooks/example';

describe('example tests', () => {

  let consolelog: any = null;

  beforeEach(() => {
    consolelog = console.log;
  });

  afterEach(() => {
    console.log = consolelog;
  });

  it('example test', () => {
    let output: any = null;
    console.log = function(x: any) {
      output = x;
    }

    expect(exampleHook.call(null, null, null, null)).equal(STOP);
    expect(output).equal('exampleHook is called');
  });
});
