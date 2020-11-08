import { expect } from 'chai'
import { SwitchExpression } from '../../src/PathTree/SwitchExpression';

describe('SwitchExpression', () => {

  describe('getSwitchId()', () => {
    it('getSwitchId() for ""', () => {
      const switchString = '';
  
      const switchExpr = new SwitchExpression(switchString);
  
      expect(switchExpr.getSwitchId()).equals('');
    });
  
    it('getSwitchId() for "="', () => {
      const switchString = '=';
  
      const switchExpr = new SwitchExpression(switchString);
  
      expect(switchExpr.getSwitchId()).equals('');
    });
  
    it('getSwitchId() for "=12"', () => {
      const switchString = '=12';
  
      const switchExpr = new SwitchExpression(switchString);
  
      expect(switchExpr.getSwitchId()).equals('');
    });
  
    it('getSwitchId() for "ab="', () => {
      const switchString = 'ab=';
  
      const switchExpr = new SwitchExpression(switchString);
  
      expect(switchExpr.getSwitchId()).equals('ab');
    });
  
    it('getSwitchId() for "ab"', () => {
      const switchString = 'ab';
  
      const switchExpr = new SwitchExpression(switchString);
  
      expect(switchExpr.getSwitchId()).equals('ab');
    });
  });

  describe('getSwitchValue()', () => {

    it('getSwitchValue() for ""', () => {
      const switchString = '';
  
      const switchExpr = new SwitchExpression(switchString);
  
      expect(switchExpr.getSwitchValue()).equals(null);
    });
  
    it('getSwitchValue() for "="', () => {
      const switchString = '=';
  
      const switchExpr = new SwitchExpression(switchString);
  
      expect(switchExpr.getSwitchValue()).equals('');
    });
  
    it('getSwitchValue() for "=12"', () => {
      const switchString = '=12';
  
      const switchExpr = new SwitchExpression(switchString);
  
      expect(switchExpr.getSwitchValue()).equals('12');
    });
  
    it('getSwitchValue() for "ab="', () => {
      const switchString = 'ab=';
  
      const switchExpr = new SwitchExpression(switchString);
  
      expect(switchExpr.getSwitchValue()).equals('');
    });
  
    it('getSwitchValue() for "ab"', () => {
      const switchString = 'ab';
  
      const switchExpr = new SwitchExpression(switchString);
  
      expect(switchExpr.getSwitchValue()).equals(null);
    });
  
    it('getSwitchValue() for "ab=12"', () => {
      const switchString = 'ab=12';
  
      const switchExpr = new SwitchExpression(switchString);
  
      expect(switchExpr.getSwitchValue()).equals('12');
    });

  });

  describe('isValuedSwitch()', () => {

    it('isValuedSwitch() for ""', () => {
      const switchString = '';
  
      const switchExpr = new SwitchExpression(switchString);
  
      expect(switchExpr.isValuedSwitch()).to.be.false;
    });
  
    it('isValuedSwitch() for "="', () => {
      const switchString = '=';
  
      const switchExpr = new SwitchExpression(switchString);
  
      expect(switchExpr.isValuedSwitch()).to.be.true;
    });
  
    it('isValuedSwitch() for "=12"', () => {
      const switchString = '=12';
  
      const switchExpr = new SwitchExpression(switchString);
  
      expect(switchExpr.isValuedSwitch()).to.be.true;;
    });
  
    it('isValuedSwitch() for "ab="', () => {
      const switchString = 'ab=';
  
      const switchExpr = new SwitchExpression(switchString);
  
      expect(switchExpr.isValuedSwitch()).to.be.true;
    });
  
    it('isValuedSwitch() for "ab"', () => {
      const switchString = 'ab';
  
      const switchExpr = new SwitchExpression(switchString);
  
      expect(switchExpr.isValuedSwitch()).to.be.false;;
    });
  
    it('isValuedSwitch() for "ab=12"', () => {
      const switchString = 'ab=12';
  
      const switchExpr = new SwitchExpression(switchString);
  
      expect(switchExpr.isValuedSwitch()).to.be.true;;
    });

  });

  describe('toString()', () => {

    it('toString() for "a"', () => {
      const switchString = 'a';

      const switchExpr = new SwitchExpression(switchString);

      expect(switchExpr.toString()).equal('a');
    });

    it('toString() for "ab"', () => {
      const switchString = 'ab';

      const switchExpr = new SwitchExpression(switchString);

      expect(switchExpr.toString()).equal('ab');
    });

    it('toString() for "a b" throws Error', () => {
      const switchString = 'a b';

      expect(() => {
        new SwitchExpression(switchString);
      }).throws();
    });

    it('toString() for "a=1"', () => {
      const switchString = 'a=1';

      const switchExpr = new SwitchExpression(switchString);

      expect(switchExpr.toString()).equal('a=1');
    });

    it(`toString() for "a='1'"`, () => {
      const switchString = `a='1'`;

      const switchExpr = new SwitchExpression(switchString);

      expect(switchExpr.toString()).equal('a=1');
    });

    it(`toString() for 'a="1"'`, () => {
      const switchString = `a="1"`;

      const switchExpr = new SwitchExpression(switchString);

      expect(switchExpr.toString()).equal('a=1');
    });

    it('toString() for "a=1 2"', () => {
      const switchString = 'a=1 2';

      const switchExpr = new SwitchExpression(switchString);

      expect(switchExpr.toString()).equal(`a='1 2'`);
    });

    it(`toString() for "a='"'"`, () => {
      const switchString = `a='"'`;

      const switchExpr = new SwitchExpression(switchString);

      expect(switchExpr.toString()).equal(`a='"'`);
    });

    it(`toString() for "a="'""`, () => {
      const switchString = `a="'"`;

      const switchExpr = new SwitchExpression(switchString);

      expect(switchExpr.toString()).equal(`a="'"`);
    });

  })

  describe('parse()', () => {

    it('parse() for ""', () => {
      const switchString = '';
  
      const parsed = SwitchExpression.parse(switchString);
  
      expect(parsed).deep.equal({
        variable: '',
        value: null
      });
    });
  
    it('parse() for "a"', () => {
      const switchString = 'a';
  
      const parsed = SwitchExpression.parse(switchString);
  
      expect(parsed).deep.equal({
        variable: 'a',
        value: null
      });
    });
  
    it('parse() for "ab"', () => {
      const switchString = 'ab';
  
      const parsed = SwitchExpression.parse(switchString);
  
      expect(parsed).deep.equal({
        variable: 'ab',
        value: null
      });
    });
  
    it('parse() for " a "', () => {
      const switchString = ' a ';
  
      const parsed = SwitchExpression.parse(switchString);
  
      expect(parsed).deep.equal({
        variable: 'a',
        value: null
      });
    });
  
    it('parse() for "a a" throws Error', () => {
      const switchString = 'a a';
  
      expect(() => {
        SwitchExpression.parse(switchString);
      }).throws();
    });
  
    it('parse() for "ab="', () => {
      const switchString = 'ab=';
  
      const parsed = SwitchExpression.parse(switchString);
  
      expect(parsed).deep.equal({
        variable: 'ab',
        value: ''
      });
    });
  
    it('parse() for "ab=="', () => {
      const switchString = 'ab==';
  
      const parsed = SwitchExpression.parse(switchString);
  
      expect(parsed).deep.equal({
        variable: 'ab',
        value: '='
      });
    });
  
    it('parse() for "ab=1"', () => {
      const switchString = 'ab=1';
  
      const parsed = SwitchExpression.parse(switchString);
  
      expect(parsed).deep.equal({
        variable: 'ab',
        value: '1'
      });
    });
  
    it('parse() for "ab=12"', () => {
      const switchString = 'ab=12';
  
      const parsed = SwitchExpression.parse(switchString);
  
      expect(parsed).deep.equal({
        variable: 'ab',
        value: '12'
      });
    });
  
    it('parse() for " ab = 12 "', () => {
      const switchString = ' ab = 12 ';
  
      const parsed = SwitchExpression.parse(switchString);
  
      expect(parsed).deep.equal({
        variable: 'ab',
        value: '12'
      });
    });
  
    it('parse() for "ab=1 2"', () => {
      const switchString = 'ab=1 2';
  
      const parsed = SwitchExpression.parse(switchString);
  
      expect(parsed).deep.equal({
        variable: 'ab',
        value: '1 2'
      });
    });
  
    it('parse() for "ab="12""', () => {
      const switchString = 'ab="12"';
  
      const parsed = SwitchExpression.parse(switchString);
  
      expect(parsed).deep.equal({
        variable: 'ab',
        value: '12'
      });
    });
  
    it(`parse() for \`ab="'1'2[3]4=5/6\\"\``, () => {
      const switchString = `ab="'1'2[3]4=5/6\\"`;
  
      const parsed = SwitchExpression.parse(switchString);
  
      expect(parsed).deep.equal({
        variable: 'ab',
        value: `'1'2[3]4=5/6\\`
      });
    });
  
    it(`parse() for "ab='12'"`, () => {
      const switchString = `ab='12'`;
  
      const parsed = SwitchExpression.parse(switchString);
  
      expect(parsed).deep.equal({
        variable: 'ab',
        value: '12'
      });
    });
  
    it(`parse() for "ab='"1"2[3]4=5/6\\'"`, () => {
      const switchString = `ab='"1"2[3]4=5/6\\'`;
  
      const parsed = SwitchExpression.parse(switchString);
  
      expect(parsed).deep.equal({
        variable: 'ab',
        value: `"1"2[3]4=5/6\\`
      });
    });

  });

});
