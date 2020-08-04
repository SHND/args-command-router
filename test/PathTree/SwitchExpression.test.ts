import { expect } from 'chai'
import { StaticPathItem } from '../../src/PathTree/StaticPathItem';
import { SwitchExpression } from '../../src/PathTree/SwitchExpression';

describe('SwitchExpression', () => {

  it('parse for ""', () => {
    const switchString = '';

    const parsed = SwitchExpression.parse(switchString);

    expect(parsed).deep.equal({
      variable: '',
      value: null
    });
  });

  it('parse for "a"', () => {
    const switchString = 'a';

    const parsed = SwitchExpression.parse(switchString);

    expect(parsed).deep.equal({
      variable: 'a',
      value: null
    });
  });

  it('parse for "ab"', () => {
    const switchString = 'ab';

    const parsed = SwitchExpression.parse(switchString);

    expect(parsed).deep.equal({
      variable: 'ab',
      value: null
    });
  });

  it('parse for " a "', () => {
    const switchString = ' a ';

    const parsed = SwitchExpression.parse(switchString);

    expect(parsed).deep.equal({
      variable: 'a',
      value: null
    });
  });

  it('parse for "a a" throws Error', () => {
    const switchString = 'a a';

    expect(() => {
      SwitchExpression.parse(switchString);
    }).throws();
  });

  it('parse for "ab="', () => {
    const switchString = 'ab=';

    const parsed = SwitchExpression.parse(switchString);

    expect(parsed).deep.equal({
      variable: 'ab',
      value: ''
    });
  });

  it('parse for "ab=="', () => {
    const switchString = 'ab==';

    const parsed = SwitchExpression.parse(switchString);

    expect(parsed).deep.equal({
      variable: 'ab',
      value: '='
    });
  });

  it('parse for "ab=1"', () => {
    const switchString = 'ab=1';

    const parsed = SwitchExpression.parse(switchString);

    expect(parsed).deep.equal({
      variable: 'ab',
      value: '1'
    });
  });

  it('parse for "ab=12"', () => {
    const switchString = 'ab=12';

    const parsed = SwitchExpression.parse(switchString);

    expect(parsed).deep.equal({
      variable: 'ab',
      value: '12'
    });
  });

  it('parse for " ab = 12 "', () => {
    const switchString = ' ab = 12 ';

    const parsed = SwitchExpression.parse(switchString);

    expect(parsed).deep.equal({
      variable: 'ab',
      value: '12'
    });
  });

  it('parse for "ab=1 2"', () => {
    const switchString = 'ab=1 2';

    const parsed = SwitchExpression.parse(switchString);

    expect(parsed).deep.equal({
      variable: 'ab',
      value: '1 2'
    });
  });

  it('parse for "ab="12""', () => {
    const switchString = 'ab="12"';

    const parsed = SwitchExpression.parse(switchString);

    expect(parsed).deep.equal({
      variable: 'ab',
      value: '12'
    });
  });

  it(`parse for \`ab="'1'2[3]4=5/6\\"\``, () => {
    const switchString = `ab="'1'2[3]4=5/6\\"`;

    const parsed = SwitchExpression.parse(switchString);

    expect(parsed).deep.equal({
      variable: 'ab',
      value: `'1'2[3]4=5/6\\`
    });
  });

  it(`parse for "ab='12'"`, () => {
    const switchString = `ab='12'`;

    const parsed = SwitchExpression.parse(switchString);

    expect(parsed).deep.equal({
      variable: 'ab',
      value: '12'
    });
  });

  it(`parse for "ab='"1"2[3]4=5/6\\'"`, () => {
    const switchString = `ab='"1"2[3]4=5/6\\'`;

    const parsed = SwitchExpression.parse(switchString);

    expect(parsed).deep.equal({
      variable: 'ab',
      value: `"1"2[3]4=5/6\\`
    });
  });

});
