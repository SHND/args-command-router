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

  it('shortname property, getShortname, setShortname methods', () => {
    const swich = new Switch('a');

    expect(swich.getShortname()).to.equal('a');

    swich.setShortname('b');
    expect(swich.getShortname()).to.equal('b');
  });

  it('longname property, getLongname, setLongname methods', () => {
    const swich = new Switch(null, 'aa');

    expect(swich.getLongname()).to.equal('aa');

    swich.setLongname('bb');
    expect(swich.getLongname()).to.equal('bb');
  });

  it('description property, getDescription, setDescription methods', () => {
    const swich = new Switch('a', 'aa', 'description1');

    expect(swich.getDescription()).to.equal('description1');

    swich.setDescription('description2');
    expect(swich.getDescription()).to.equal('description2');
  });

  it('parameters property, getParameters, setParameters methods', () => {
    const params1 = [{name: 'a'}, {name: 'b'}];
    const params2 = [{name: 'c'}, {name: 'd'}];
    const swich = new Switch('a', 'aa', 'description1', params1);

    expect(swich.getParameters()).to.equal(params1);

    swich.setParameters(params2);
    expect(swich.getParameters()).to.equal(params2);
  });

});
