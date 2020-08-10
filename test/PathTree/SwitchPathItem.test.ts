import { expect } from 'chai'
import { SwitchPathItem } from '../../src/PathTree/SwitchPathItem';

describe('SwitchPathItem', () => {

  describe('getUniqueName()', () => {

    it('getUniqueName() for ""', () => {
      const switchExprString = '';

      const switchPathItem = new SwitchPathItem(switchExprString, null);

      expect(switchPathItem.getUniqueName()).equal('');
    });

    it('getUniqueName() for " "', () => {
      const switchExprString = ' ';

      const switchPathItem = new SwitchPathItem(switchExprString, null);

      expect(switchPathItem.getUniqueName()).equal('');
    });

    it('getUniqueName() for "[]" throws Error', () => {
      const switchExprString = '[]';

      expect(() => {
        new SwitchPathItem(switchExprString, null);
      }).throws();
    });

    it('getUniqueName() for "[a]"', () => {
      const switchExprString = '[a]';

      const switchPathItem = new SwitchPathItem(switchExprString, null);

      expect(switchPathItem.getUniqueName()).equal('[a]');
    });

    it('getUniqueName() for " [ a ] "', () => {
      const switchExprString = ' [ a ] ';

      const switchPathItem = new SwitchPathItem(switchExprString, null);

      expect(switchPathItem.getUniqueName()).equal('[a]');
    });

    it('getUniqueName() for "[a][b]"', () => {
      const switchExprString = '[a][b]';

      const switchPathItem = new SwitchPathItem(switchExprString, null);

      expect(switchPathItem.getUniqueName()).equal('[a][b]');
    });

    it('getUniqueName() for "[a][b=1]"', () => {
      const switchExprString = '[a][b=1]';

      const switchPathItem = new SwitchPathItem(switchExprString, null);

      expect(switchPathItem.getUniqueName()).equal('[a][b=1]');
    });

    it(`getUniqueName() for "[a][b='1']"`, () => {
      const switchExprString = `[a][b='1']`;

      const switchPathItem = new SwitchPathItem(switchExprString, null);

      expect(switchPathItem.getUniqueName()).equal('[a][b=1]');
    });

    it(`getUniqueName() for "[a][b="1"]"`, () => {
      const switchExprString = `[a][b="1"]`;

      const switchPathItem = new SwitchPathItem(switchExprString, null);

      expect(switchPathItem.getUniqueName()).equal('[a][b=1]');
    });


    it(`getUniqueName() for "[a][b==]"`, () => {
      const switchExprString = `[a][b==]`;

      const switchPathItem = new SwitchPathItem(switchExprString, null);

      expect(switchPathItem.getUniqueName()).equal(`[a][b='=']`);
    });

    it(`getUniqueName() for "[a][b='=']"`, () => {
      const switchExprString = `[a][b='=']`;

      const switchPathItem = new SwitchPathItem(switchExprString, null);

      expect(switchPathItem.getUniqueName()).equal(`[a][b='=']`);
    });

    it(`getUniqueName() for "[a][b="="]"`, () => {
      const switchExprString = `[a][b="="]`;

      const switchPathItem = new SwitchPathItem(switchExprString, null);

      expect(switchPathItem.getUniqueName()).equal(`[a][b='=']`);
    });


    it(`getUniqueName() for "[a][b=[]"`, () => {
      const switchExprString = `[a][b=[]`;

      const switchPathItem = new SwitchPathItem(switchExprString, null);

      expect(switchPathItem.getUniqueName()).equal(`[a][b='[']`);
    });

    it(`getUniqueName() for "[a][b='[']"`, () => {
      const switchExprString = `[a][b='[']`;

      const switchPathItem = new SwitchPathItem(switchExprString, null);

      expect(switchPathItem.getUniqueName()).equal(`[a][b='[']`);
    });

    it(`getUniqueName() for "[a][b="["]"`, () => {
      const switchExprString = `[a][b="["]`;

      const switchPathItem = new SwitchPathItem(switchExprString, null);

      expect(switchPathItem.getUniqueName()).equal(`[a][b='[']`);
    });


    it(`getUniqueName() for "[a][b=]]" throws Error`, () => {
      const switchExprString = `[a][b=]]`;

      expect(() => {
        new SwitchPathItem(switchExprString, null);
      }).throws();
    });

    it(`getUniqueName() for "[a][b=']']"`, () => {
      const switchExprString = `[a][b=']']`;

      const switchPathItem = new SwitchPathItem(switchExprString, null);

      expect(switchPathItem.getUniqueName()).equal(`[a][b=']']`);
    });

    it(`getUniqueName() for "[a][b="]"]"`, () => {
      const switchExprString = `[a][b="]"]`;

      const switchPathItem = new SwitchPathItem(switchExprString, null);

      expect(switchPathItem.getUniqueName()).equal(`[a][b=']']`);
    });

    
    it(`getUniqueName() for "[a][b='"']"`, () => {
      const switchExprString = `[a][b='"']`;

      const switchPathItem = new SwitchPathItem(switchExprString, null);

      expect(switchPathItem.getUniqueName()).equal(`[a][b='"']`);
    });


    it(`getUniqueName() for "[a][b="'"]"`, () => {
      const switchExprString = `[a][b="'"]`;

      const switchPathItem = new SwitchPathItem(switchExprString, null);

      expect(switchPathItem.getUniqueName()).equal(`[a][b="'"]`);
    });


    it('getUniqueName() for "<TAB><NEWLINE> [<TAB><NEWLINE> a<TAB><NEWLINE> ]<TAB><NEWLINE> [<TAB><NEWLINE> b<TAB><NEWLINE> =<TAB><NEWLINE> 1<TAB><NEWLINE> ]<TAB><NEWLINE> "', () => {
      const switchExprString = '\t\n [\t\n a\t\n ]\t\n [\t\n b\t\n =\t\n 1\t\n ]\t\n ';

      const switchPathItem = new SwitchPathItem(switchExprString, null);

      expect(switchPathItem.getUniqueName()).equal('[a][b=1]');
    });

  });

  describe('parse()', () => {

    it('parse() for ""', () => {
      const switchExprString = '';

      const switchPathItem = new SwitchPathItem(switchExprString, null);

      const expressions = switchPathItem.getSwitchExpressions();

      expect(expressions).have.lengthOf(0);
    });

    it('parse() for " "', () => {
      const switchExprString = '';

      const switchPathItem = new SwitchPathItem(switchExprString, null);

      const expressions = switchPathItem.getSwitchExpressions();

      expect(expressions).have.lengthOf(0);
    });

    it('parse() for "[]" throws Error', () => {
      const switchExprString = '[]';

      expect(() => {
        new SwitchPathItem(switchExprString, null);
      }).throws();
    });

    it('parse() for "[ ]" throws Error', () => {
      const switchExprString = '[ ]';

      expect(() => {
        new SwitchPathItem(switchExprString, null);
      }).throws();
    });

    it('parse() for "[a]"', () => {
      const switchExprString = '[a]';

      const switchPathItem = new SwitchPathItem(switchExprString, null);

      const expressions = switchPathItem.getSwitchExpressions();

      expect(expressions).have.lengthOf(1);

      expect(expressions[0].getSwitchId()).equals('a');
      expect(expressions[0].isValuedSwitch()).equals(false);
      expect(expressions[0].getSwitchValue()).equals(null);
    });

    it('parse() for " [ a ] "', () => {
      const switchExprString = ' [ a ] ';

      const switchPathItem = new SwitchPathItem(switchExprString, null);

      const expressions = switchPathItem.getSwitchExpressions();

      expect(expressions).have.lengthOf(1);

      expect(expressions[0].getSwitchId()).equals('a');
      expect(expressions[0].isValuedSwitch()).to.be.false;
      expect(expressions[0].getSwitchValue()).equals(null);
    });

    it('parse() for "[a][b]"', () => {
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

    it('parse() for "[a][b=1]"', () => {
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

    it('parse() for "<TAB><NEWLINE> [<TAB><NEWLINE> a<TAB><NEWLINE> ]<TAB><NEWLINE> [<TAB><NEWLINE> b<TAB><NEWLINE> =<TAB><NEWLINE> 1<TAB><NEWLINE> ]<TAB><NEWLINE> "', () => {
      const switchExprString = '\t\n [\t\n a\t\n ]\t\n [\t\n b\t\n =\t\n 1\t\n ]\t\n ';

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


});
