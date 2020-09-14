import { expect } from 'chai'
import { Switch } from '../src/Switch';

describe('Switch', () => {

  it('Switch both shortname and longname cannot be empty at the same time.', () => {
    expect(() => {
      new Switch();
    }).throws();

    expect(() => {
      new Switch('');
    }).throws();

    expect(() => {
      new Switch(null);
    }).throws();

    expect(() => {
      new Switch(undefined);
    }).throws();

    expect(() => {
      new Switch('', '');
    }).throws();

    expect(() => {
      new Switch('', null);
    }).throws();

    expect(() => {
      new Switch('', undefined);
    }).throws();

    expect(() => {
      new Switch(null, '');
    }).throws();

    expect(() => {
      new Switch(null, null);
    }).throws();
    
    expect(() => {
      new Switch(null, undefined);
    }).throws();

    expect(() => {
      new Switch(undefined, '');
    }).throws();

    expect(() => {
      new Switch(undefined, null);
    }).throws();

    expect(() => {
      new Switch(undefined, undefined);
    }).throws();
  });

  it('Switch shortname cannot be longer than 1 character', () => {
    expect(() => {
      new Switch('aa');
    }).throws();
  });

  it('Switch longname cannot be shorter than 2 character', () => {
    expect(() => {
      new Switch(null, 'a');
    }).throws();
  });

});
