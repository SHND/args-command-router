import { expect } from 'chai'
import { SwitchPathItem } from '../../src/PathTree/SwitchPathItem';

describe('SwitchPathItem', () => {

  it('parse for ""', () => {
    const switchExprString = '';

    const switchPathItem = new SwitchPathItem(switchExprString, null);

    const expressions = switchPathItem.getSwitchExpressions();

    expect(expressions).have.lengthOf(0);
  });

  it('parse for " "', () => {
    const switchExprString = '';

    const switchPathItem = new SwitchPathItem(switchExprString, null);

    const expressions = switchPathItem.getSwitchExpressions();

    expect(expressions).have.lengthOf(0);
  });

  it('parse for "[]" throws Error', () => {
    const switchExprString = '[]';

    expect(() => {
      new SwitchPathItem(switchExprString, null);
    }).throws();
  });

  it('parse for "[ ]" throws Error', () => {
    const switchExprString = '[ ]';

    expect(() => {
      new SwitchPathItem(switchExprString, null);
    }).throws();
  });

  it('parse for "[a]"', () => {
    const switchExprString = '[a]';

    const switchPathItem = new SwitchPathItem(switchExprString, null);

    const expressions = switchPathItem.getSwitchExpressions();

    expect(expressions).have.lengthOf(1);

    expect(expressions[0].getSwitchId()).equals('a');
    expect(expressions[0].isValuedSwitch()).equals(false);
    expect(expressions[0].getSwitchValue()).equals(null);
  });

  it('parse for " [ a ] "', () => {
    const switchExprString = ' [ a ] ';

    const switchPathItem = new SwitchPathItem(switchExprString, null);

    const expressions = switchPathItem.getSwitchExpressions();

    expect(expressions).have.lengthOf(1);

    expect(expressions[0].getSwitchId()).equals('a');
    expect(expressions[0].isValuedSwitch()).to.be.false;
    expect(expressions[0].getSwitchValue()).equals(null);
  });

  it('parse for "[a][b]"', () => {
    const switchExprString = '[a][b]';

    const switchPathItem = new SwitchPathItem(switchExprString, null);

    const expressions = switchPathItem.getSwitchExpressions();

    expect(expressions).have.lengthOf(2);

    expect(expressions[0].getSwitchId()).equals('a');
    expect(expressions[0].isValuedSwitch()).to.be.false;
    expect(expressions[0].getSwitchValue()).equals(null);

    expect(expressions[1].getSwitchId()).equals('b');
    expect(expressions[1].isValuedSwitch()).to.be.false;
    expect(expressions[1].getSwitchValue()).equals(null);
  });

  it('parse for "[a][b=1]"', () => {
    const switchExprString = '[a][b=1]';

    const switchPathItem = new SwitchPathItem(switchExprString, null);

    const expressions = switchPathItem.getSwitchExpressions();

    expect(expressions).have.lengthOf(2);

    expect(expressions[0].getSwitchId()).equals('a');
    expect(expressions[0].isValuedSwitch()).to.be.false;
    expect(expressions[0].getSwitchValue()).equals(null);

    expect(expressions[1].getSwitchId()).equals('b');
    expect(expressions[1].isValuedSwitch()).to.be.true;
    expect(expressions[1].getSwitchValue()).equals('1');
  });

  it('parse for " [ a ] [ b = 1 ] "', () => {
    const switchExprString = ' [ a ] [ b = 1 ] ';

    const switchPathItem = new SwitchPathItem(switchExprString, null);

    const expressions = switchPathItem.getSwitchExpressions();

    expect(expressions).have.lengthOf(2);

    expect(expressions[0].getSwitchId()).equals('a');
    expect(expressions[0].isValuedSwitch()).to.be.false;
    expect(expressions[0].getSwitchValue()).equals(null);

    expect(expressions[1].getSwitchId()).equals('b');
    expect(expressions[1].isValuedSwitch()).to.be.true;
    expect(expressions[1].getSwitchValue()).equals('1');
  });

});
